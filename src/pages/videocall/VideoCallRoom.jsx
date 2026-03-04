import { useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/shadcn/button/button'
import { Video, VideoOff, Mic, MicOff, PhoneOff, MessageCircle, Copy } from 'lucide-react'
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
  const [dataConnectionReady, setDataConnectionReady] = useState(false)

  const localVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const peerRef = useRef(null)
  const dataConnRef = useRef(null)
  const mediaConnRef = useRef(null)

  // URL: /video-call/:videoCallId?role=doctor
  const roleFromUrl = searchParams.get('role')
  const roleFromStorage = localStorage.getItem('isDoctorLoggedIn') === 'true' ? 'doctor' : 'patient'
  const userRole = roleFromUrl || roleFromStorage
  const isDoctor = userRole === 'doctor'

  const localUserId = useRef(`${userRole}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`).current
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

  const initializePeerJS = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }

      // Unique peer ID for this session (PeerJS free server)
      const peerId = `${videoCallId}-${userRole}-${Date.now()}`
      const peer = new Peer(peerId, {
        host: '0.peerjs.com',
        path: '/',
        secure: true,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        }
      })
      peerRef.current = peer

      peer.on('open', async () => {
        console.log('✅ PeerJS connected, ID:', peerId)
        setConnectionStatus('Connected')

        // Register with backend and get other peer's ID if they're waiting
        try {
          const { data } = await apiInstance.post(`/video-call/${videoCallId}/join`, {
            role: userRole,
            peerId
          })

          if (data.shouldCall && data.otherPeerId) {
            // Other person is waiting - we call them
            console.log('Calling other peer:', data.otherPeerId)
            const call = peer.call(data.otherPeerId, stream)
            if (call) {
              mediaConnRef.current = call
              call.on('stream', (remoteStream) => {
                addRemoteUser(data.otherPeerId, remoteStream)
              })
              call.on('close', () => handleRemoteLeft(data.otherPeerId))
              call.on('error', (err) => console.error('Call error:', err))
            }
            // Open data connection for chat
            const conn = peer.connect(data.otherPeerId)
            if (conn) {
              setupDataConnection(conn)
            }
          } else {
            // We're first - wait for incoming call
            console.log('Waiting for other participant...')
          }
        } catch (err) {
          console.error('Join room error:', err)
          setError('Failed to join video call room')
        }
      })

      peer.on('call', (call) => {
        console.log('📞 Incoming call from:', call.peer)
        mediaConnRef.current = call
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
          setConnectionStatus('Waiting for other participant...')
        } else {
          setConnectionStatus('Connection error')
        }
      })

      peer.on('disconnected', () => {
        setConnectionStatus('Disconnected')
      })
    } catch (err) {
      console.error('Media/PeerJS error:', err)
      setError('Cannot access camera/microphone. Please grant permissions.')
    }
  }

  const setupDataConnection = (conn) => {
    if (dataConnRef.current) return
    dataConnRef.current = conn

    conn.on('open', () => {
      console.log('Data connection open for chat')
      setDataConnectionReady(true)
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
      dataConnRef.current = null
      setDataConnectionReady(false)
    })
  }

  const addRemoteUser = (userId, stream) => {
    setRemoteUsers(prev => {
      if (prev.find(u => u.userId === userId)) return prev
      return [...prev, { userId, stream }]
    })
  }

  const handleRemoteLeft = (userId) => {
    setRemoteUsers(prev => prev.filter(u => u.userId !== userId))
    if (dataConnRef.current?.peer === userId) {
      dataConnRef.current?.close()
      dataConnRef.current = null
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
    if (dataConnRef.current && dataConnectionReady) {
      dataConnRef.current.send(payload)
    }
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: newMessage,
      sender: username,
      isMe: true
    }])
    setNewMessage('')
  }

  const cleanup = () => {
    if (mediaConnRef.current) {
      mediaConnRef.current.close()
      mediaConnRef.current = null
    }
    if (dataConnRef.current) {
      dataConnRef.current.close()
      dataConnRef.current = null
    }
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

  const shareLink = `${window.location.origin}/video-call/${videoCallId}?role=${isDoctor ? 'patient' : 'doctor'}`
  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setLinkCopied(true)
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <p className="text-xl">Loading video call...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="text-center max-w-2xl mx-auto p-8">
          <div className="mb-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold mb-4">Unable to Connect</h2>
            <p className="text-xl text-red-400 mb-4">{error}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 mb-6 text-left">
            <h3 className="text-lg font-semibold mb-3">Troubleshooting Steps:</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✓ Check if the backend server is running ({API_HOST})</li>
              <li>✓ Verify the video call link is correct</li>
              <li>✓ Make sure you have the correct role parameter (?role=patient or ?role=doctor)</li>
              <li>✓ Check if the appointment exists and is approved</li>
              <li>✓ Ensure your browser allows camera/microphone access</li>
            </ul>
          </div>
          <div className="flex space-x-4 justify-center">
            <Button onClick={() => window.location.reload()} className="bg-blue-600 hover:bg-blue-700">Retry Connection</Button>
            <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 px-4 py-2 rounded-lg text-white">
          <p className="text-sm font-semibold">{connectionStatus}</p>
          <p className="text-xs mt-1">You are: <span className={isDoctor ? 'text-blue-400' : 'text-green-400'}>{username}</span></p>
          <p className="text-xs">Remote users: {remoteUsers.length}</p>
          {appointmentDetails && (
            <p className="text-xs mt-1">Meeting with: {isDoctor ? appointmentDetails.name : appointmentDetails.doctorName}</p>
          )}
        </div>

        <div className="w-full h-full flex items-center justify-center p-4">
          <div className="w-full h-full grid gap-4" style={{ gridTemplateColumns: (remoteUsers.length + 1) === 1 ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))' }}>
            <LocalVideoTile videoRef={localVideoRef} userId={localUserId} />
            {remoteUsers.length === 0 ? (
              <div className="col-span-full text-center text-white self-center">
                <div className="mb-4">
                  <div className="animate-pulse text-6xl mb-4">⏳</div>
                  <p className="text-xl">Waiting for other participant...</p>
                  <p className="text-sm text-gray-400 mt-2">Share this link with {isDoctor ? 'the patient' : 'your doctor'}:</p>
                  <div className="mt-3 p-3 bg-gray-800 rounded-lg flex items-center gap-2">
                    <p className="text-xs text-blue-400 break-all flex-1">{shareLink}</p>
                    <Button onClick={copyShareLink} size="sm" className="shrink-0 bg-gray-700 hover:bg-gray-600">
                      <Copy size={16} className="mr-1" />
                      {linkCopied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              remoteUsers.map((user) => <RemoteVideo key={user.userId} stream={user.stream} userId={user.userId} />)
            )}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
          <Button onClick={toggleAudio} className={`p-4 rounded-full ${isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}>
            {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
          </Button>
          <Button onClick={toggleVideo} className={`p-4 rounded-full ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}>
            {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </Button>
          {isDoctor && (
            <Button onClick={handleEndSession} disabled={isEndingSession} className={`p-4 rounded-full ${isEndingSession ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}>
              <span className="text-sm font-semibold">{isEndingSession ? 'Ending…' : 'End Session'}</span>
            </Button>
          )}
          <Button onClick={handleCallEnd} className="p-4 rounded-full bg-red-600 hover:bg-red-700">
            <PhoneOff size={24} />
          </Button>
        </div>
      </div>

      <div className="bg-gray-800 border-t border-gray-700">
        <div className="h-32 overflow-y-auto p-3 space-y-2">
          {messages.length === 0 ? (
            <p className="text-gray-400 text-sm text-center">No messages yet</p>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`text-sm ${msg.isMe ? 'text-blue-400' : 'text-gray-300'}`}>
                <strong>{msg.sender}:</strong> {msg.text}
              </div>
            ))
          )}
        </div>
        <div className="p-3 flex space-x-2 border-t border-gray-700">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white border-none focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <Button onClick={sendMessage} className="px-6 py-2 bg-blue-600 hover:bg-blue-700">
            <MessageCircle size={20} />
          </Button>
        </div>
      </div>
    </div>
  )
}

const RemoteVideo = ({ stream, userId }) => {
  const videoRef = useRef(null)
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream, userId])
  const displayName = userId.includes('doctor') ? 'Doctor' : 'Patient'
  return (
    <div className="relative bg-black rounded-lg overflow-hidden border-4 border-green-500 w-full h-full">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
      <div className="absolute top-4 left-4 text-white text-lg font-bold bg-green-600 bg-opacity-90 px-4 py-2 rounded-lg shadow-lg">{displayName}</div>
    </div>
  )
}

const LocalVideoTile = ({ videoRef, userId }) => {
  const displayName = userId.startsWith('doctor') ? 'Doctor (You)' : 'Patient (You)'
  return (
    <div className="relative bg-black rounded-lg overflow-hidden border-4 border-blue-500 w-full h-full">
      <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" style={{ transform: 'scaleX(-1)' }} />
      <div className="absolute top-4 left-4 text-white text-lg font-bold bg-blue-600 bg-opacity-90 px-4 py-2 rounded-lg shadow-lg">{displayName}</div>
    </div>
  )
}

RemoteVideo.propTypes = { stream: PropTypes.object, userId: PropTypes.string.isRequired }
LocalVideoTile.propTypes = { videoRef: PropTypes.object.isRequired, userId: PropTypes.string.isRequired }

export default VideoCallRoom
