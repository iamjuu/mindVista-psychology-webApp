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
import { API_HOST, API_BASE_URL } from '../../config/api'

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
  const [connectionStatus, setConnectionStatus] = useState('Initializing...')
  const [connectionStep, setConnectionStep] = useState('loading') // loading, camera, connecting, waiting, connected
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

  const fetchAppointmentDetails = async () => {
    console.log('🔍 Fetching appointment details for videoCallId:', videoCallId, 'role:', userRole)
    try {
      setLoading(true)
      setError(null)
      setConnectionStep('loading')
      setConnectionStatus('Loading appointment details...')
      
      const roleQuery = `?role=${userRole}`
      const response = await apiInstance.get(`/video-call/${videoCallId}/details${roleQuery}`)
      console.log('Appointment details response:', response.data)

      if (response.data.success) {
        setAppointmentDetails(response.data.data)
        setConnectionStep('camera')
        setConnectionStatus('Requesting camera access...')
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
  }

  useEffect(() => {
    fetchAppointmentDetails()
    
    // Cleanup on page close/refresh
    const handleBeforeUnload = () => {
      if (peerRef.current?.id) {
        navigator.sendBeacon(
          `${API_BASE_URL}/video-call/${videoCallId}/leave`,
          JSON.stringify({ role: userRole, peerId: peerRef.current.id })
        )
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoCallId, userRole])

  const pollForOtherPeers = async (peerId) => {
    try {
      const response = await apiInstance.post(`/video-call/${videoCallId}/join`, {
        role: userRole,
        peerId
      })

      let responseData = null
      if (response.data.data) {
        responseData = response.data.data
      } else if (response.data.otherPeerIds !== undefined) {
        responseData = response.data
      } else {
        responseData = { otherPeerIds: [], shouldCall: false }
      }
      
      const otherPeerIds = responseData.otherPeerIds || []
      const shouldCall = responseData.shouldCall || false
      
      if (shouldCall && otherPeerIds && otherPeerIds.length > 0) {
        console.log('🔔 Polling found peers:', otherPeerIds)
        otherPeerIds.forEach(otherPeerId => {
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
      console.log('🎥 Requesting camera and microphone access...')
      console.log('Current URL:', window.location.href)
      console.log('Protocol:', window.location.protocol)
      
      // Check if page is secure (HTTPS or localhost)
      const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost'
      if (!isSecure) {
        console.warn('⚠️ Page is not secure (HTTPS). Camera may not work!')
      }
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser')
      }
      
      console.log('Browser:', navigator.userAgent)
      
      // Check camera permission status
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const cameraPermission = await navigator.permissions.query({ name: 'camera' })
          const micPermission = await navigator.permissions.query({ name: 'microphone' })
          console.log('Camera permission:', cameraPermission.state)
          console.log('Microphone permission:', micPermission.state)
        } catch (e) {
          console.log('Could not check permissions:', e)
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 }, 
          height: { ideal: 720 },
          facingMode: 'user'
        }, 
        audio: { 
          echoCancellation: true, 
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      
      console.log('✅ Media stream obtained:', {
        videoTracks: stream.getVideoTracks().length,
        audioTracks: stream.getAudioTracks().length,
        videoEnabled: stream.getVideoTracks()[0]?.enabled,
        audioEnabled: stream.getAudioTracks()[0]?.enabled,
        videoLabel: stream.getVideoTracks()[0]?.label,
        audioLabel: stream.getAudioTracks()[0]?.label
      })
      
      setConnectionStep('connecting')
      setConnectionStatus('Connecting to call...')
      localStreamRef.current = stream
      
      // Make stream available globally for LocalVideoTile component
      window.localStreamForVideo = stream

      const peerId = `${videoCallId}-${userRole}-${Date.now()}`
      const peer = new Peer(peerId, {
        host: '0.peerjs.com',
        port: 443,
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
        setConnectionStatus('Joining room...')

        try {
          const response = await apiInstance.post(`/video-call/${videoCallId}/join`, {
            role: userRole,
            peerId
          })

          console.log('📡 Join response FULL:', JSON.stringify(response, null, 2))
          console.log('📡 response.data:', response.data)
          console.log('📡 response.data.data:', response.data.data)
          console.log('📡 response.data.success:', response.data.success)
          
          // Try multiple extraction paths
          let responseData = null
          if (response.data.data) {
            responseData = response.data.data
            console.log('✅ Using response.data.data')
          } else if (response.data.otherPeerIds !== undefined) {
            responseData = response.data
            console.log('✅ Using response.data directly')
          } else {
            console.error('❌ Cannot find otherPeerIds in response!')
            responseData = { otherPeerIds: [], shouldCall: false }
          }
          
          const otherPeerIds = responseData.otherPeerIds || []
          const shouldCall = responseData.shouldCall || false
          
          console.log('✅ Extracted otherPeerIds:', JSON.stringify(otherPeerIds))
          console.log('✅ Extracted shouldCall:', shouldCall)
          console.log('✅ Array length:', otherPeerIds.length)

          if (shouldCall && otherPeerIds && otherPeerIds.length > 0) {
            console.log('🔥 Calling other peers immediately:', otherPeerIds)
            setConnectionStep('connecting')
            setConnectionStatus(`Connecting to ${otherPeerIds.length} participant(s)...`)
            otherPeerIds.forEach(otherPeerId => {
              console.log('Attempting to call peer:', otherPeerId)
              const call = peer.call(otherPeerId, stream)
              if (call) {
                console.log('✅ Call initiated to', otherPeerId)
                mediaConnRef.current[otherPeerId] = call
                call.on('stream', (remoteStream) => {
                  console.log('📹 Received stream from', otherPeerId)
                  addRemoteUser(otherPeerId, remoteStream)
                })
                call.on('close', () => {
                  console.log('Call closed with', otherPeerId)
                  handleRemoteLeft(otherPeerId)
                })
                call.on('error', (err) => {
                  console.error('❌ Call error with', otherPeerId, ':', err)
                })
              } else {
                console.error('❌ Failed to initiate call to', otherPeerId)
              }
              
              console.log('Establishing data connection to', otherPeerId)
              const conn = peer.connect(otherPeerId)
              if (conn) {
                setupDataConnection(conn)
              } else {
                console.error('❌ Failed to establish data connection to', otherPeerId)
              }
            })
          } else {
            console.log('Waiting for other participants, polling every 3 seconds...')
            setConnectionStep('waiting')
            setConnectionStatus('Waiting for participants to join...')
          }
          
          // Reduce polling interval to 2 seconds for faster connection
          pollIntervalRef.current = setInterval(() => {
            pollForOtherPeers(peerId)
          }, 2000)
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
          console.log('📹 Answering call, received stream from', call.peer)
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
          console.log('⚠️ Peer unavailable (might be disconnected):', err.message)
          // The peer might have disconnected - polling will find active peers
        } else if (err.type === 'network') {
          setError('Network error. Please check your internet connection.')
        } else if (err.type === 'unavailable-id') {
          console.error('❌ Peer ID already in use')
          setError('Connection error: ID conflict. Please refresh.')
        } else {
          setConnectionStatus('Connection error: ' + err.type)
        }
      })

      peer.on('disconnected', () => {
        console.log('Peer disconnected, attempting reconnect...')
        setConnectionStatus('Reconnecting...')
        peer.reconnect()
      })
    } catch (err) {
      console.error('❌ Media/PeerJS error:', err)
      
      // Detailed error messages
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Camera/microphone access denied. Please allow permissions and refresh.')
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError('No camera or microphone found. Please connect a device.')
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setError('Camera is in use by another application. Please close other apps and refresh.')
      } else if (err.name === 'OverconstrainedError') {
        setError('Camera does not meet requirements. Trying with lower settings...')
        // Retry with lower constraints
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
          })
          localStreamRef.current = stream
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream
            localVideoRef.current.play().catch(e => console.error('Play error:', e))
          }
          setError(null)
          console.log('✅ Camera initialized with basic settings')
        } catch (retryErr) {
          console.error('Retry failed:', retryErr)
          setError('Cannot access camera/microphone. Please check permissions.')
        }
      } else {
        setError(`Camera error: ${err.message || 'Cannot access camera/microphone'}`)
      }
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
    console.log('📹 Adding remote user:', userId)
    console.log('Stream details:', {
      id: stream.id,
      active: stream.active,
      videoTracks: stream.getVideoTracks().length,
      audioTracks: stream.getAudioTracks().length
    })
    
    setConnectionStep('connected')
    setConnectionStatus('Connected')
    setRemoteUsers(prev => {
      const exists = prev.find(u => u.userId === userId)
      if (exists) {
        console.log('User already exists, updating stream')
        const updated = prev.map(u => u.userId === userId ? { ...u, stream } : u)
        console.log('Updated remoteUsers:', updated.map(u => u.userId))
        return updated
      }
      console.log('Adding new user to remoteUsers')
      const newUsers = [...prev, { userId, stream }]
      console.log('New remoteUsers array:', newUsers.map(u => u.userId))
      return newUsers
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

  const cleanup = useCallback(async () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current)
    }
    
    // Notify backend to remove this peer from the room
    if (peerRef.current?.id) {
      try {
        await apiInstance.post(`/video-call/${videoCallId}/leave`, {
          role: userRole,
          peerId: peerRef.current.id
        })
        console.log('✅ Left room, peer ID removed from backend')
      } catch (err) {
        console.error('Failed to leave room:', err)
      }
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
  }, [videoCallId, userRole])

  const handleCallEnd = () => {
    cleanup()
    navigate('/')
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

  const clearRoom = async () => {
    try {
      await apiInstance.delete(`/video-call/${videoCallId}/room`)
      console.log('✅ Room cleared, refreshing...')
      window.location.reload()
    } catch (err) {
      console.error('Failed to clear room:', err)
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
        navigate('/')
      }
    } catch (e) {
      console.error('Failed to end session:', e)
    } finally {
      setIsEndingSession(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1d21] via-[#202124] to-[#2d3034] flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-t-blue-500 border-r-blue-400 border-b-blue-300 border-l-transparent mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Video size={32} className="text-blue-400" />
            </div>
          </div>
          <p className="text-white text-xl font-semibold mb-2">Joining meeting...</p>
          <p className="text-gray-400 text-sm">Please wait while we connect you</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1d21] via-[#202124] to-[#2d3034] flex items-center justify-center text-white">
        <div className="text-center max-w-2xl mx-auto p-8">
          <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-5xl">⚠️</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Unable to Join</h2>
          <p className="text-lg text-red-400 mb-8 font-medium">{error}</p>
          <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 mb-8 text-left border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">💡</span>
              Troubleshooting Steps:
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold">1.</span>
                <span>Check backend server is running ({API_HOST})</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold">2.</span>
                <span>Verify video call link is correct</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold">3.</span>
                <span>Ensure role parameter is set (?role=patient or ?role=doctor)</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-blue-400 font-bold">4.</span>
                <span>Allow camera/microphone permissions in browser</span>
              </li>
            </ul>
          </div>
          <div className="flex space-x-4 justify-center">
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-[#1a73e8] to-[#1557b0] hover:from-[#1557b0] hover:to-[#0d47a1] px-8 py-3 rounded-xl font-semibold shadow-lg"
            >
              🔄 Retry
            </Button>
            <Button 
              onClick={() => navigate(-1)} 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md px-8 py-3 rounded-xl font-semibold border border-white/20"
            >
              ← Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const totalParticipants = 1 + remoteUsers.length
  const patientUsers = remoteUsers.filter(u => u.userId.includes('patient'))
  const doctorUser = remoteUsers.find(u => u.userId.includes('doctor'))
  
  // Debug logging
  useEffect(() => {
    console.log('🔍 Remote users updated:', remoteUsers.map(u => u.userId))
    console.log('🔍 Doctor user found:', doctorUser?.userId || 'NONE')
    console.log('🔍 Patient users found:', patientUsers.map(u => u.userId))
  }, [remoteUsers, doctorUser, patientUsers])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1d21] via-[#202124] to-[#2d3034] flex flex-col relative">
      {/* Top Bar - Enhanced Design */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/40 to-transparent backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="text-white">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#1a73e8] to-[#0d47a1] rounded-full flex items-center justify-center shadow-lg">
                  <Video size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-lg">
                    {appointmentDetails ? (isDoctor ? appointmentDetails.name : appointmentDetails.doctorName) : 'Video Call'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ID: {videoCallId.substring(0, 10)}...
                  </p>
                </div>
              </div>
            </div>
          </div>
        
        {/* Share Links - Only visible to doctor */}
        {isDoctor && (
          <div className="flex items-center space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-2.5 rounded-xl text-white transition-all shadow-lg border border-white/10"
              >
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
              </button>
              
              {showShareMenu && (
                <div className="absolute right-0 top-14 bg-white rounded-2xl shadow-2xl p-6 w-[420px] z-50 border border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 text-lg">Share Meeting Link</h3>
                    <button 
                      onClick={() => setShowShareMenu(false)} 
                      className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {/* Patient Link */}
                  <div className="mb-5">
                    <label className="text-xs text-gray-600 font-semibold mb-2 block uppercase tracking-wide">Patient Link</label>
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
                      <input
                        type="text"
                        value={patientLink}
                        readOnly
                        className="flex-1 bg-transparent text-sm text-gray-800 outline-none font-mono"
                      />
                      <button
                        onClick={() => copyLink(patientLink, 'patient')}
                        className="shrink-0 p-2.5 hover:bg-blue-200 rounded-lg transition-all"
                        title="Copy patient link"
                      >
                        {linkCopied === 'patient' ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-blue-600" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 flex items-center">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                      Share this link with patients to join the session
                    </p>
                  </div>
                  
                  {/* Doctor Link */}
                  <div>
                    <label className="text-xs text-gray-600 font-semibold mb-2 block uppercase tracking-wide">Doctor Link</label>
                    <div className="flex items-center space-x-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 border border-green-200">
                      <input
                        type="text"
                        value={doctorLink}
                        readOnly
                        className="flex-1 bg-transparent text-sm text-gray-800 outline-none font-mono"
                      />
                      <button
                        onClick={() => copyLink(doctorLink, 'doctor')}
                        className="shrink-0 p-2.5 hover:bg-green-200 rounded-lg transition-all"
                        title="Copy doctor link"
                      >
                        {linkCopied === 'doctor' ? <Check size={18} className="text-green-600" /> : <Copy size={18} className="text-green-600" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2 flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                      For doctor/admin access only
                    </p>
                  </div>
                  
                  {/* Clear Room Button (for testing/debugging) */}
                  <div className="mt-5 pt-5 border-t border-gray-200">
                    <button
                      onClick={clearRoom}
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-red-50 to-orange-50 hover:from-red-100 hover:to-orange-100 text-red-600 rounded-xl text-sm font-semibold transition-all border border-red-200"
                    >
                      🔄 Clear Room
                    </button>
                    <p className="text-xs text-gray-500 mt-2 text-center">Remove stale connections if issues occur</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className={`px-4 py-2.5 rounded-xl text-white text-sm font-medium flex items-center space-x-2 shadow-lg backdrop-blur-md border transition-all ${
              connectionStep === 'connected' 
                ? 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/30' 
                : 'bg-white/10 border-white/20 animate-pulse'
            }`}>
              {connectionStep === 'connected' ? (
                <>
                  <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                  <span>{connectionStatus}</span>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Status for non-doctors */}
        {!isDoctor && (
          <div className={`px-4 py-2.5 rounded-xl text-white text-sm font-medium flex items-center space-x-2 shadow-lg backdrop-blur-md border transition-all ${
            connectionStep === 'connected' 
              ? 'bg-gradient-to-r from-green-500/90 to-emerald-500/90 border-green-400/30' 
              : 'bg-white/10 border-white/20 animate-pulse'
          }`}>
            {connectionStep === 'connected' ? (
              <>
                <div className="w-2 h-2 bg-white rounded-full shadow-lg"></div>
                <span>Connected</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                <span>{connectionStatus}</span>
              </>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Video Layout: Enhanced Responsive Design */}
      <div className="flex-1 relative pt-24 pb-28">
        <div className="h-full flex flex-col md:flex-row gap-3 px-4 md:px-6">
          {/* Doctor Section - Mobile: Top, Desktop: Left 50% */}
          <div className="flex-1 md:w-1/2 h-1/2 md:h-full">
            {isDoctor ? (
              <LocalVideoTile videoRef={localVideoRef} username={username} isVideoOn={isVideoOn} />
            ) : doctorUser ? (
              <RemoteVideo stream={doctorUser.stream} userId={doctorUser.userId} />
            ) : (
              <div className="h-full bg-gradient-to-br from-[#2d3034] to-[#3c4043] rounded-2xl flex items-center justify-center shadow-2xl border border-white/5">
                <div className="text-center text-white p-8">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 bg-gradient-to-br from-[#4a5058] to-[#5f6368] rounded-full flex items-center justify-center mx-auto shadow-xl">
                      <Users size={56} className="text-gray-300" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-yellow-500 px-3 py-1 rounded-full text-xs font-semibold text-black">
                        Waiting
                      </div>
                    </div>
                  </div>
                  <p className="text-xl font-semibold mb-2">Waiting for doctor...</p>
                  <p className="text-sm text-gray-400">The doctor will join shortly</p>
                </div>
              </div>
            )}
          </div>

          {/* Patients Section - Mobile: Bottom, Desktop: Right 50% - FULL HEIGHT */}
          <div className="flex-1 md:w-1/2 h-1/2 md:h-full flex flex-col gap-3">
            {!isDoctor && (
              <div className="flex-1 min-h-0">
                <LocalVideoTile videoRef={localVideoRef} username={username} isVideoOn={isVideoOn} />
              </div>
            )}
            
            {patientUsers.map((user) => (
              <div key={user.userId} className="flex-1 min-h-0">
                <RemoteVideo stream={user.stream} userId={user.userId} />
              </div>
            ))}
            
            {/* Waiting state for patients side - FULL HEIGHT */}
            {patientUsers.length === 0 && isDoctor && (
              <div className="flex-1 min-h-0 bg-gradient-to-br from-[#2d3034] to-[#3c4043] rounded-2xl flex items-center justify-center shadow-2xl border border-white/5">
                <div className="text-center text-white p-8">
                  <div className="relative mb-6">
                    <div className="w-28 h-28 bg-gradient-to-br from-[#4a5058] to-[#5f6368] rounded-full flex items-center justify-center mx-auto shadow-xl">
                      <Users size={56} className="text-gray-300" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div className="bg-blue-500 px-3 py-1 rounded-full text-xs font-semibold text-white animate-pulse">
                        Waiting
                      </div>
                    </div>
                  </div>
                  <p className="text-xl font-semibold mb-2">Waiting for patients...</p>
                  <p className="text-sm text-gray-400 mb-6">Share the patient link to start</p>
                  <button
                    onClick={() => setShowShareMenu(true)}
                    className="bg-gradient-to-r from-[#1a73e8] to-[#1557b0] hover:from-[#1557b0] hover:to-[#0d47a1] px-6 py-3 rounded-xl font-semibold transition-all inline-flex items-center space-x-2 shadow-lg"
                  >
                    <Share2 size={20} />
                    <span>Share Link</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls - Enhanced Design */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pb-6 bg-gradient-to-t from-black/50 to-transparent backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6">
          {/* Left - Meeting Info */}
          <div className="flex items-center space-x-3 text-white bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl border border-white/10">
            <div className="text-sm">
              <p className="font-semibold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p className="text-xs text-gray-300 flex items-center">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
                {totalParticipants} {totalParticipants === 1 ? 'participant' : 'participants'}
              </p>
            </div>
          </div>

          {/* Center - Main Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleAudio}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl backdrop-blur-md border-2 ${
                isAudioOn 
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30' 
                  : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-400/50'
              }`}
              title={isAudioOn ? 'Mute' : 'Unmute'}
            >
              {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
            </button>

            <button
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl backdrop-blur-md border-2 ${
                isVideoOn 
                  ? 'bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/30' 
                  : 'bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-400/50'
              }`}
              title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
            </button>

            <button
              onClick={handleCallEnd}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 flex items-center justify-center text-white transition-all shadow-2xl mx-2 border-2 border-red-400/50 hover:scale-105"
              title="Leave call"
            >
              <PhoneOff size={28} />
            </button>

            {isDoctor && (
              <button
                onClick={handleEndSession}
                disabled={isEndingSession}
                className="px-6 h-14 rounded-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed border-2 border-red-400/30"
              >
                {isEndingSession ? 'Ending...' : 'End Session'}
              </button>
            )}
          </div>

          {/* Right - More Options */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowChat(!showChat)}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-lg relative border border-white/10"
              title="Chat"
            >
              <MessageCircle size={20} />
              {messages.length > 0 && !showChat && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-red-500 to-red-600 rounded-full text-xs flex items-center justify-center font-bold shadow-lg border-2 border-white">
                  {messages.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowParticipants(!showParticipants)}
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-lg border border-white/10"
              title="Participants"
            >
              <Users size={20} />
            </button>

            <button
              className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all shadow-lg border border-white/10"
              title="More options"
            >
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Sidebar - Enhanced Design */}
      {showChat && (
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-30 flex flex-col animate-slide-in-right">
          <div className="p-5 bg-gradient-to-r from-[#1a73e8] to-[#1557b0] flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">In-call Messages</h3>
                <p className="text-xs text-blue-100">Private to this call</p>
              </div>
            </div>
            <button 
              onClick={() => setShowChat(false)} 
              className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center mt-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MessageCircle size={28} className="text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm font-medium">No messages yet</p>
                <p className="text-gray-400 text-xs mt-1">Start a conversation</p>
              </div>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${
                    msg.isMe 
                      ? 'bg-gradient-to-br from-[#1a73e8] to-[#1557b0] text-white' 
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}>
                    <p className={`text-xs font-bold mb-1 ${msg.isMe ? 'text-blue-100' : 'text-gray-600'}`}>
                      {msg.sender}
                    </p>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-5 border-t border-gray-200 bg-white">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-2xl outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-100 text-sm transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1a73e8] to-[#1557b0] hover:from-[#1557b0] hover:to-[#0d47a1] disabled:from-gray-300 disabled:to-gray-400 flex items-center justify-center text-white transition-all shadow-lg disabled:cursor-not-allowed"
              >
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Participants Sidebar - Enhanced Design */}
      {showParticipants && (
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-white shadow-2xl z-30 flex flex-col animate-slide-in-right">
          <div className="p-5 bg-gradient-to-r from-purple-500 to-indigo-600 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                <Users size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Participants</h3>
                <p className="text-xs text-purple-100">{totalParticipants} {totalParticipants === 1 ? 'person' : 'people'} in call</p>
              </div>
            </div>
            <button 
              onClick={() => setShowParticipants(false)} 
              className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition-all"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-gray-50">
            {/* Current User */}
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1a73e8] to-[#1557b0] rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                {username.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{username}</p>
                <p className="text-xs text-gray-600 font-medium uppercase tracking-wide">{userRole} • You</p>
              </div>
              <div className="flex flex-col space-y-1">
                {isAudioOn ? (
                  <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-lg">
                    <Mic size={14} className="text-green-600" />
                    <span className="text-xs font-semibold text-green-700">On</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 bg-red-100 px-2 py-1 rounded-lg">
                    <MicOff size={14} className="text-red-600" />
                    <span className="text-xs font-semibold text-red-700">Off</span>
                  </div>
                )}
                {isVideoOn ? (
                  <div className="flex items-center space-x-1 bg-green-100 px-2 py-1 rounded-lg">
                    <Video size={14} className="text-green-600" />
                    <span className="text-xs font-semibold text-green-700">On</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 bg-red-100 px-2 py-1 rounded-lg">
                    <VideoOff size={14} className="text-red-600" />
                    <span className="text-xs font-semibold text-red-700">Off</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Remote Users */}
            {remoteUsers.map((user) => {
              const isRemoteDoctor = user.userId.includes('doctor')
              return (
                <div key={user.userId} className="flex items-center space-x-3 p-4 rounded-2xl bg-white hover:bg-gray-50 transition-all border border-gray-200 shadow-sm">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg ${
                    isRemoteDoctor 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                      : 'bg-gradient-to-br from-blue-500 to-indigo-600'
                  }`}>
                    {isRemoteDoctor ? 'D' : 'P'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{isRemoteDoctor ? 'Doctor' : 'Patient'}</p>
                    <p className="text-xs text-gray-600 flex items-center">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                      In call
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

const LocalVideoTile = ({ videoRef, username, isVideoOn }) => {
  const [videoLoaded, setVideoLoaded] = useState(false)
  const localStreamRef = useRef(null)
  
  useEffect(() => {
    // Get the stream from the parent's localStreamRef
    const checkForStream = () => {
      if (videoRef.current && window.localStreamForVideo) {
        const video = videoRef.current
        const stream = window.localStreamForVideo
        
        console.log('📹 LocalVideoTile: Setting up video with stream')
        video.srcObject = stream
        localStreamRef.current = stream
        
        const handleLoadedMetadata = () => {
          console.log('✅ Local video metadata loaded')
          setVideoLoaded(true)
          video.play()
            .then(() => console.log('✅ Video autoplay started'))
            .catch(err => console.error('❌ Autoplay failed:', err))
        }
        
        const handleLoadedData = () => {
          console.log('✅ Local video data loaded')
          setVideoLoaded(true)
        }
        
        const handleCanPlay = () => {
          console.log('✅ Video can play')
          setVideoLoaded(true)
        }
        
        const handlePlaying = () => {
          console.log('✅ Video is playing')
          setVideoLoaded(true)
        }
        
        video.addEventListener('loadedmetadata', handleLoadedMetadata)
        video.addEventListener('loadeddata', handleLoadedData)
        video.addEventListener('canplay', handleCanPlay)
        video.addEventListener('playing', handlePlaying)
        
        // Try to play immediately
        if (video.readyState >= 1) {
          console.log('Video has metadata, marking as loaded')
          setVideoLoaded(true)
          video.play().catch(err => console.error('Play error:', err))
        }
        
        // Aggressive fallback: Force show video after 2 seconds
        const fallbackTimeoutId = setTimeout(() => {
          console.log('⏰ Fallback timeout: forcing video to show')
          setVideoLoaded(true)
          video.play().catch(err => console.error('Fallback play error:', err))
        }, 2000)
        
        return () => {
          clearTimeout(fallbackTimeoutId)
          video.removeEventListener('loadedmetadata', handleLoadedMetadata)
          video.removeEventListener('loadeddata', handleLoadedData)
          video.removeEventListener('canplay', handleCanPlay)
          video.removeEventListener('playing', handlePlaying)
        }
      }
    }
    
    // Try immediately and retry every 100ms for up to 3 seconds
    const cleanup = checkForStream()
    if (cleanup) return cleanup
    
    let attempts = 0
    const maxAttempts = 30
    const intervalId = setInterval(() => {
      attempts++
      const cleanup = checkForStream()
      if (cleanup || attempts >= maxAttempts) {
        clearInterval(intervalId)
        if (cleanup) return cleanup
      }
    }, 100)
    
    return () => clearInterval(intervalId)
  }, [videoRef])

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden h-full shadow-2xl border-2 border-white/10 group">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
      />
      {!videoLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d3034] to-[#3c4043] flex items-center justify-center z-10">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-blue-500 border-r-blue-400 border-b-blue-300 border-l-transparent mb-4 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Video size={24} className="text-blue-400" />
              </div>
            </div>
            <p className="text-white text-sm font-medium">Loading camera...</p>
          </div>
        </div>
      )}
      {!isVideoOn && videoLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d3034] to-[#3c4043] flex items-center justify-center z-10">
          <div className="text-center">
            <div className="w-28 h-28 bg-gradient-to-br from-[#1a73e8] to-[#0d47a1] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <span className="text-5xl text-white font-bold">{username.charAt(0)}</span>
            </div>
            <p className="text-white text-sm font-medium">Camera is off</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl text-white text-sm font-semibold z-20 border border-white/10 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>{username} (You)</span>
        </div>
      </div>
      {/* Hover overlay for better UX */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  )
}

const RemoteVideo = ({ stream, userId }) => {
  const videoRef = useRef(null)
  const [hasVideo, setHasVideo] = useState(true)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => {
    if (videoRef.current && stream) {
      console.log('📹 Setting remote video srcObject for', userId)
      const video = videoRef.current
      video.srcObject = stream
      
      // Add event listeners for video ready state
      const handleCanPlay = () => {
        console.log('✅ Remote video can play for', userId)
        setVideoReady(true)
        video.play().catch(err => console.error('Remote video play error:', err))
      }
      
      const handlePlaying = () => {
        console.log('✅ Remote video is playing for', userId)
        setVideoReady(true)
      }
      
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('playing', handlePlaying)
      
      // Force play immediately
      video.play()
        .then(() => {
          console.log('✅ Remote video play started for', userId)
          setVideoReady(true)
        })
        .catch(err => console.error('Remote video play error:', err))
      
      // Fallback: show video after 2 seconds regardless
      const fallbackTimeout = setTimeout(() => {
        console.log('⏰ Fallback: showing remote video for', userId)
        setVideoReady(true)
        video.play().catch(err => console.error('Fallback play error:', err))
      }, 2000)
      
      const videoTrack = stream.getVideoTracks()[0]
      if (videoTrack) {
        console.log('Remote video track:', videoTrack.label, 'enabled:', videoTrack.enabled)
        setHasVideo(videoTrack.enabled)
        videoTrack.onended = () => setHasVideo(false)
        videoTrack.onmute = () => setHasVideo(false)
        videoTrack.onunmute = () => setHasVideo(true)
      }
      
      return () => {
        clearTimeout(fallbackTimeout)
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('playing', handlePlaying)
      }
    }
  }, [stream, userId])

  const displayName = userId.includes('doctor') ? 'Doctor' : 'Patient'
  const isDoctor = userId.includes('doctor')

  return (
    <div className="relative bg-black rounded-2xl overflow-hidden h-full shadow-2xl border-2 border-white/10 group">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-cover"
      />
      {!videoReady && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d3034] to-[#3c4043] flex items-center justify-center z-10">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-green-500 border-r-green-400 border-b-green-300 border-l-transparent mb-4 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Video size={24} className="text-green-400" />
              </div>
            </div>
            <p className="text-white text-sm font-medium">Connecting video...</p>
          </div>
        </div>
      )}
      {!hasVideo && videoReady && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#2d3034] to-[#3c4043] flex items-center justify-center z-10">
          <div className="text-center">
            <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl ${
              isDoctor 
                ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
                : 'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}>
              <span className="text-5xl text-white font-bold">{displayName.charAt(0)}</span>
            </div>
            <p className="text-white text-sm font-medium">Camera is off</p>
          </div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl text-white text-sm font-semibold z-20 border border-white/10 shadow-lg">
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isDoctor ? 'bg-green-400' : 'bg-blue-400'}`}></div>
          <span>{displayName}</span>
        </div>
      </div>
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
    </div>
  )
}

LocalVideoTile.propTypes = { 
  videoRef: PropTypes.object.isRequired, 
  username: PropTypes.string.isRequired,
  isVideoOn: PropTypes.bool.isRequired
}
RemoteVideo.propTypes = { stream: PropTypes.object, userId: PropTypes.string.isRequired }

export default VideoCallRoom
