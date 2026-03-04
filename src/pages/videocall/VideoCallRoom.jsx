import { useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/shadcn/button/button'
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, MessageCircle, 
  Copy, Users, MoreVertical, Share2, Check
} from 'lucide-react'
import Peer from 'peerjs'
import apiInstance from '../../instance'
import { API_HOST } from '../../config/api'

const VideoCallRoom = () => {
  const { videoCallId } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [appointmentDetails, setAppointmentDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('Connecting...')
  const [remoteUsers, setRemoteUsers] = useState([])
  const [isEndingSession, setIsEndingSession] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [showShareMenu, setShowShareMenu] = useState(false)

  const localVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const peerRef = useRef(null)
  const mediaConnRef = useRef({})
  const pollIntervalRef = useRef(null)
  const dataConnsRef = useRef({})

  const roleFromUrl = searchParams.get('role')
  const roleFromStorage = localStorage.getItem('isDoctorLoggedIn') === 'true' ? 'doctor' : 'patient'
  const userRole = roleFromUrl || roleFromStorage
  const isDoctor = userRole === 'doctor'

  const username = isDoctor ? 'Dr. Smith' : 'Patient'

  const fetchAppointmentDetails = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const roleQuery = `?role=${userRole}`
      const response = await apiInstance.get(`/video-call/${videoCallId}/details${roleQuery}`)

      if (response.data.success) {
        setAppointmentDetails(response.data.data)
        await initializePeerJS()
      } else {
        setError(response.data.message || 'Failed to load appointment details')
      }
    } catch (err) {
      console.error('Error fetching details:', err)
      if (err.response) {
        setError(err.response.data?.message || err.response.statusText)
      } else if (err.request) {
        setError('Cannot connect to server. Please check if the backend is running.')
      } else {
        setError(`Connection error: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, videoCallId])

  useEffect(() => {
    fetchAppointmentDetails()
    return () => cleanup()
  }, [videoCallId, fetchAppointmentDetails])

  const pollForOtherPeers = async (peerId) => {
    try {
      const { data } = await apiInstance.post(`/video-call/${videoCallId}/join`, {
        role: userRole,
        peerId
      })

      if (data.shouldCall && data.otherPeerIds && data.otherPeerIds.length > 0) {
        // Call any new peers we haven't connected to yet
        data.otherPeerIds.forEach(otherPeerId => {
          if (!mediaConnRef.current[otherPeerId]) {
            console.log('🔔 Found new peer, calling:', otherPeerId)
            
            const call = peerRef.current.call(otherPeerId, localStreamRef.current)
            if (call) {
              mediaConnRef.current[otherPeerId] = call
              call.on('stream', (remoteStream) => {
                console.log('📹 Received remote stream from', otherPeerId)
                addRemoteUser(otherPeerId, remoteStream)
              })
              call.on('close', () => handleRemoteLeft(otherPeerId))
              call.on('error', (err) => {
                console.error('Call error:', err)
                if (retryCount < 3) {
                  setTimeout(() => {
                    setRetryCount(prev => prev + 1)
                    pollForOtherPeers(peerId)
                  }, 2000)
                }
              })
            }
            
            const conn = peerRef.current.connect(otherPeerId)
            if (conn) {
              setupDataConnection(conn)
            }
          }
        })
      }
    } catch (err) {
      console.error('Poll error:', err)
    }
  }

  const initializePeerJS = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: { ideal: 1280 }, height: { ideal: 720 } }, 
        audio: { echoCancellation: true, noiseSuppression: true }
      })
      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      const peerId = `${videoCallId}-${userRole}-${Date.now()}`
      const peer = new Peer(peerId, {
        host: '0.peerjs.com',
        path: '/',
        secure: true,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' }
          ]
        }
      })
      peerRef.current = peer

      peer.on('open', async () => {
        console.log('✅ PeerJS connected, ID:', peerId)
        setConnectionStatus('Ready')

        try {
          const { data } = await apiInstance.post(`/video-call/${videoCallId}/join`, {
            role: userRole,
            peerId
          })

          if (data.shouldCall && data.otherPeerIds && data.otherPeerIds.length > 0) {
            console.log('Calling other peers immediately:', data.otherPeerIds)
            // Call all existing peers
            data.otherPeerIds.forEach(otherPeerId => {
              const call = peer.call(otherPeerId, stream)
              if (call) {
                mediaConnRef.current[otherPeerId] = call
                call.on('stream', (remoteStream) => {
                  addRemoteUser(otherPeerId, remoteStream)
                })
                call.on('close', () => handleRemoteLeft(otherPeerId))
                call.on('error', (err) => console.error('Call error:', err))
              }
              const conn = peer.connect(otherPeerId)
              if (conn) {
                setupDataConnection(conn)
              }
            })
          } else {
            console.log('Waiting for other participants, polling every 3 seconds...')
            setConnectionStatus('Waiting for participants...')
          }
          
          // Always poll for new participants joining
          pollIntervalRef.current = setInterval(() => {
            pollForOtherPeers(peerId)
          }, 3000)
        } catch (err) {
          console.error('Join room error:', err)
          setError('Failed to join video call room')
        }
      })

      peer.on('call', (call) => {
        console.log('📞 Incoming call from:', call.peer)
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current)
        }
        mediaConnRef.current[call.peer] = call
        call.answer(stream)
        call.on('stream', (remoteStream) => {
          addRemoteUser(call.peer, remoteStream)
        })
        call.on('close', () => handleRemoteLeft(call.peer))
        call.on('error', (err) => console.error('Call error:', err))
      })

      peer.on('connection', (conn) => {
        console.log('📨 Incoming data connection from:', conn.peer)
        setupDataConnection(conn)
      })

      peer.on('error', (err) => {
        console.error('PeerJS error:', err)
        if (err.type === 'peer-unavailable') {
          console.log('Peer unavailable, will retry...')
        } else {
          setConnectionStatus('Connection error')
        }
      })

      peer.on('disconnected', () => {
        console.log('Peer disconnected, attempting reconnect...')
        peer.reconnect()
      })
    } catch (err) {
      console.error('Media/PeerJS error:', err)
      setError('Cannot access camera/microphone. Please grant permissions.')
    }
  }

  const setupDataConnection = (conn) => {
    if (dataConnsRef.current[conn.peer]) return
    dataConnsRef.current[conn.peer] = conn

    conn.on('open', () => {
      console.log('✅ Data connection open for chat with', conn.peer)
    })

    conn.on('data', (data) => {
      if (typeof data === 'object' && data.type === 'chat') {
        setMessages(prev => [...prev, {
          id: data.timestamp || Date.now(),
          text: data.message,
          sender: data.username || 'Remote',
          isMe: false
        }])
      }
    })

    conn.on('close', () => {
      delete dataConnsRef.current[conn.peer]
    })
  }

  const addRemoteUser = (userId, stream) => {
    console.log('Adding remote user:', userId)
    setConnectionStatus('Connected')
    setRemoteUsers(prev => {
      if (prev.find(u => u.userId === userId)) return prev
      return [...prev, { userId, stream }]
    })
  }

  const handleRemoteLeft = (userId) => {
    console.log('Remote user left:', userId)
    setRemoteUsers(prev => prev.filter(u => u.userId !== userId))
    if (mediaConnRef.current[userId]) {
      delete mediaConnRef.current[userId]
    }
    if (dataConnsRef.current[userId]) {
      dataConnsRef.current[userId]?.close()
      delete dataConnsRef.current[userId]
    }
    if (remoteUsers.length <= 1) {
      setConnectionStatus('Participant left')
    }
  }

  const toggleVideo = () => {
    if (!localStreamRef.current) return
    const videoTrack = localStreamRef.current.getVideoTracks()[0]
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled
      setIsVideoOn(videoTrack.enabled)
    }
  }

  const toggleAudio = () => {
    if (!localStreamRef.current) return
    const audioTrack = localStreamRef.current.getAudioTracks()[0]
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled
      setIsAudioOn(audioTrack.enabled)
    }
  }

  const sendMessage = () => {
    if (!newMessage.trim()) return
    const payload = { type: 'chat', message: newMessage, username, timestamp: Date.now() }
    // Send to all connected peers
    Object.values(dataConnsRef.current).forEach(conn => {
      if (conn.open) {
        conn.send(payload)
      }
    })
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: newMessage,
      sender: username,
      isMe: true
    }])
    setNewMessage('')
  }

  const cleanup = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }
    Object.values(mediaConnRef.current).forEach(call => call?.close())
    mediaConnRef.current = {}
    Object.values(dataConnsRef.current).forEach(conn => conn?.close())
    dataConnsRef.current = {}
    if (peerRef.current) {
      peerRef.current.destroy()
      peerRef.current = null
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      localStreamRef.current = null
    }
    setRemoteUsers([])
  }

  const handleCallEnd = () => {
    cleanup()
    navigate(isDoctor ? '/doctor' : '/profile')
  }

  const patientLink = `${window.location.origin}/video-call/${videoCallId}?role=patient`
  const doctorLink = `${window.location.origin}/video-call/${videoCallId}?role=doctor`
  
  const copyLink = async (link, type) => {
    try {
      await navigator.clipboard.writeText(link)
      setLinkCopied(type)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  const handleEndSession = async () => {
    if (!isDoctor || isEndingSession) return
    try {
      setIsEndingSession(true)
      const response = await apiInstance.post('/end-session', { videoCallId })
      if (response.data.success === true) {
        alert('Session ended successfully')
        cleanup()
        navigate('/doctor')
      }
    } catch (e) {
      console.error('Failed to end session:', e)
    } finally {
      setIsEndingSession(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#202124] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#1a73e8] mx-auto mb-4"></div>
          <p className="text-white text-lg">Joining meeting...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#202124] flex items-center justify-center text-white">
        <div className="text-center max-w-2xl mx-auto p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4">Unable to Join</h2>
          <p className="text-xl text-red-400 mb-6">{error}</p>
          <div className="bg-[#3c4043] rounded-lg p-6 mb-6 text-left">
            <h3 className="text-lg font-semibold mb-3">Troubleshooting:</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✓ Check backend server ({API_HOST})</li>
              <li>✓ Verify video call link</li>
              <li>✓ Check role parameter (?role=patient or ?role=doctor)</li>
              <li>✓ Allow camera/microphone permissions</li>
            </ul>
          </div>
          <div className="flex space-x-4 justify-center">
            <Button onClick={() => window.location.reload()} className="bg-[#1a73e8] hover:bg-[#1557b0] px-6 py-3">
              Retry
            </Button>
            <Button onClick={() => navigate(-1)} className="bg-[#3c4043] hover:bg-[#5f6368] px-6 py-3">
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const totalParticipants = 1 + remoteUsers.length

  return (
    <div className="min-h-screen bg-[#202124] flex flex-col relative">
      {/* Top Bar - Google Meet Style */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="text-white">
            <p className="text-sm text-gray-400">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} | {videoCallId.substring(0, 12)}...</p>
            <p className="font-medium text-base">
              {appointmentDetails ? (isDoctor ? appointmentDetails.name : appointmentDetails.doctorName) : 'Video Call'}
            </p>
          </div>
        </div>
        
        {/* Share Links - Top Right */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="flex items-center space-x-2 bg-[#3c4043] hover:bg-[#5f6368] px-4 py-2 rounded-lg text-white transition-all"
            >
              <Share2 size={18} />
              <span className="text-sm font-medium">Share</span>
            </button>
            
            {showShareMenu && (
              <div className="absolute right-0 top-12 bg-white rounded-lg shadow-2xl p-4 w-96 z-50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Share meeting link</h3>
                  <button onClick={() => setShowShareMenu(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                
                {/* Patient Link */}
                <div className="mb-4">
                  <label className="text-xs text-gray-600 font-medium mb-1 block">Patient/Observer Link</label>
                  <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
                    <input
                      type="text"
                      value={patientLink}
                      readOnly
                      className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                    />
                    <button
                      onClick={() => copyLink(patientLink, 'patient')}
                      className="shrink-0 p-2 hover:bg-gray-200 rounded transition-all"
                      title="Copy patient link"
                    >
                      {linkCopied === 'patient' ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-600" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Anyone with this link can join as a participant</p>
                </div>
                
                {/* Doctor Link */}
                {isDoctor && (
                  <div>
                    <label className="text-xs text-gray-600 font-medium mb-1 block">Doctor Link</label>
                    <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
                      <input
                        type="text"
                        value={doctorLink}
                        readOnly
                        className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                      />
                      <button
                        onClick={() => copyLink(doctorLink, 'doctor')}
                        className="shrink-0 p-2 hover:bg-gray-200 rounded transition-all"
                        title="Copy doctor link"
                      >
                        {linkCopied === 'doctor' ? <Check size={16} className="text-green-600" /> : <Copy size={16} className="text-gray-600" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">For doctor/admin access</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="bg-[#1a73e8] px-3 py-2 rounded-lg text-white text-sm flex items-center space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span>{connectionStatus}</span>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 relative p-4 pt-20">
        <div className={`h-full grid gap-2 ${
          totalParticipants === 1 ? 'grid-cols-1' :
          totalParticipants === 2 ? 'grid-cols-2' :
          totalParticipants <= 4 ? 'grid-cols-2 grid-rows-2' :
          'grid-cols-3 grid-rows-2'
        }`}>
          {/* Local Video */}
          <div className="relative bg-black rounded-xl overflow-hidden group shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-sm font-medium">
              {username} (You)
            </div>
            {!isVideoOn && (
              <div className="absolute inset-0 bg-[#3c4043] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-[#5f6368] rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-4xl text-white font-semibold">{username.charAt(0)}</span>
                  </div>
                  <p className="text-white text-sm">Camera is off</p>
                </div>
              </div>
            )}
          </div>

          {/* Remote Videos */}
          {remoteUsers.map((user) => (
            <RemoteVideo key={user.userId} stream={user.stream} userId={user.userId} />
          ))}

          {/* Waiting State */}
          {remoteUsers.length === 0 && (
            <div className="relative bg-[#3c4043] rounded-xl overflow-hidden flex items-center justify-center shadow-lg">
              <div className="text-center text-white p-8">
                <div className="w-24 h-24 bg-[#5f6368] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={48} className="text-gray-400" />
                </div>
                <p className="text-xl font-medium mb-2">Waiting for others to join...</p>
                <p className="text-sm text-gray-400 mb-6">Share the meeting link</p>
                <button
                  onClick={() => setShowShareMenu(true)}
                  className="bg-[#1a73e8] hover:bg-[#1557b0] px-6 py-3 rounded-lg font-medium transition-all inline-flex items-center space-x-2"
                >
                  <Share2 size={18} />
                  <span>Share Link</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Controls - Exact Google Meet Style */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6">
          {/* Left - Meeting Info */}
          <div className="flex items-center space-x-3 text-white">
            <div className="text-sm">
              <p className="font-medium">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-xs text-gray-400">{totalParticipants} in call</p>
            </div>
          </div>

          {/* Center - Main Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleAudio}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isAudioOn 
                  ? 'bg-[#3c4043] hover:bg-[#5f6368] text-white' 
                  : 'bg-[#ea4335] hover:bg-[#d33426] text-white'
              }`}
              title={isAudioOn ? 'Mute' : 'Unmute'}
            >
              {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            <button
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                isVideoOn 
                  ? 'bg-[#3c4043] hover:bg-[#5f6368] text-white' 
                  : 'bg-[#ea4335] hover:bg-[#d33426] text-white'
              }`}
              title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
            </button>

            <button
              onClick={handleCallEnd}
              className="w-16 h-16 rounded-full bg-[#ea4335] hover:bg-[#d33426] flex items-center justify-center text-white transition-all shadow-lg mx-2"
              title="Leave call"
            >
              <PhoneOff size={28} />
            </button>

            {isDoctor && (
              <button
                onClick={handleEndSession}
                disabled={isEndingSession}
                className="px-6 h-14 rounded-full bg-[#ea4335] hover:bg-[#d33426] text-white font-medium transition-all shadow-lg disabled:opacity-50"
              >
                {isEndingSession ? 'Ending...' : 'End Session'}
              </button>
            )}
          </div>

          {/* Right - More Options */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowChat(!showChat)}
              className="w-12 h-12 rounded-full bg-[#3c4043] hover:bg-[#5f6368] flex items-center justify-center text-white transition-all shadow-lg relative"
              title="Chat"
            >
              <MessageCircle size={20} />
              {messages.length > 0 && !showChat && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#ea4335] rounded-full text-xs flex items-center justify-center font-semibold">
                  {messages.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="w-12 h-12 rounded-full bg-[#3c4043] hover:bg-[#5f6368] flex items-center justify-center text-white transition-all shadow-lg"
              title="Participants"
            >
              <Users size={20} />
            </button>

            <button
              className="w-12 h-12 rounded-full bg-[#3c4043] hover:bg-[#5f6368] flex items-center justify-center text-white transition-all shadow-lg"
              title="More options"
            >
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Sidebar */}
      {showChat && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-30 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-lg">In-call messages</h3>
            <button onClick={() => setShowChat(false)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-sm text-center mt-8">Messages can only be seen by people in the call</p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                    msg.isMe ? 'bg-[#1a73e8] text-white' : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-xs font-semibold mb-1 opacity-75">{msg.sender}</p>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Send a message to everyone"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full outline-none focus:border-[#1a73e8] text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="w-10 h-10 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] disabled:bg-gray-300 flex items-center justify-center text-white transition-all"
              >
                <MessageCircle size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participants Sidebar */}
      {showParticipants && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-30 flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-lg">People ({totalParticipants})</h3>
            <button onClick={() => setShowParticipants(false)} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
              <div className="w-10 h-10 bg-[#1a73e8] rounded-full flex items-center justify-center text-white font-semibold">
                {username.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium">{username} (You)</p>
                <p className="text-sm text-gray-500">{userRole}</p>
              </div>
              <div className="flex space-x-1">
                {isAudioOn ? <Mic size={16} className="text-green-600" /> : <MicOff size={16} className="text-red-600" />}
                {isVideoOn ? <Video size={16} className="text-green-600" /> : <VideoOff size={16} className="text-red-600" />}
              </div>
            </div>
            {remoteUsers.map((user) => (
              <div key={user.userId} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.userId.includes('doctor') ? 'D' : 'P'}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{user.userId.includes('doctor') ? 'Doctor' : 'Patient'}</p>
                  <p className="text-sm text-gray-500">In call</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const RemoteVideo = ({ stream, userId }) => {
  const videoRef = useRef(null)
  const [hasVideo, setHasVideo] = useState(true)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        setHasVideo(videoTrack.enabled)
        videoTrack.onended = () => setHasVideo(false)
      }
    }
  }, [stream, userId])

  const displayName = userId.includes('doctor') ? 'Doctor' : 'Patient'

  return (
    <div className="relative bg-black rounded-xl overflow-hidden group shadow-lg">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-lg text-white text-sm font-medium">
        {displayName}
      </div>
      {!hasVideo && (
        <div className="absolute inset-0 bg-[#3c4043] flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-[#5f6368] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-4xl text-white font-semibold">{displayName.charAt(0)}</span>
            </div>
            <p className="text-white text-sm">Camera is off</p>
          </div>
        </div>
      )}
    </div>
  )
}

RemoteVideo.propTypes = { stream: PropTypes.object, userId: PropTypes.string.isRequired }

export default VideoCallRoom
