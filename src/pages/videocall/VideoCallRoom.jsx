import { useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../components/shadcn/button/button'
import { Video, VideoOff, Mic, MicOff, PhoneOff, MessageCircle } from 'lucide-react'
import apiInstance from '../../instance'

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

  const localVideoRef = useRef(null)
  const localStreamRef = useRef(null)
  const wsRef = useRef(null)
  const heartbeatRef = useRef(null)
  const shouldReconnectRef = useRef(true)
  const pendingMessagesRef = useRef([])
  const peerConnectionsRef = useRef({})
  const remoteStreamsRef = useRef({})

  // FIX: Determine role from URL query parameter OR localStorage
  // URL: /video-call/:videoCallId?role=doctor
  const roleFromUrl = searchParams.get('role')
  const roleFromStorage = localStorage.getItem('isDoctorLoggedIn') === 'true' ? 'doctor' : 'patient'
  const userRole = roleFromUrl || roleFromStorage
  const isDoctor = userRole === 'doctor'
  
  // Generate unique userId with role prefix
  const localUserId = useRef(`${userRole}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`).current
  const username = isDoctor ? 'Dr. Smith' : 'Patient'

  const fetchAppointmentDetails = useCallback(async () => {
    try {
      setLoading(true)
      const roleQuery = isDoctor ? '?role=doctor' : ''
      const response = await apiInstance.get(`/video-call/${videoCallId}/details${roleQuery}`)
      
      if (response.data.success) {
        setAppointmentDetails(response.data.data)
        await initializeWebRTC()
      } else {
        setError(response.data.message || 'Failed to load appointment details')
      }
    } catch (err) {
      console.error('Error fetching details:', err)
      setError('Unable to load video call')
    } finally {
      setLoading(false)
    }
  }, [isDoctor, videoCallId])

  // Run after fetchAppointmentDetails is defined
  useEffect(() => {
    fetchAppointmentDetails()
    return () => cleanup()
  }, [videoCallId, fetchAppointmentDetails])

  const initializeWebRTC = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      localStreamRef.current = stream
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      connectToSignalingServer()
    } catch (err) {
      console.error('Media error:', err)
      setError('Cannot access camera/microphone. Please grant permissions.')
    }
  }

  const connectToSignalingServer = () => {
    const wsUrl = `ws://localhost:3000?videoCallId=${videoCallId}&userId=${localUserId}&username=${username}`
    console.log('Connecting to:', wsUrl)
    console.log('Role:', userRole, '| UserId:', localUserId)
    
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('✅ Connected to signaling server')
      setConnectionStatus('Connected')

      // Flush any pending messages queued while disconnected
      while (pendingMessagesRef.current.length > 0 && wsRef.current?.readyState === WebSocket.OPEN) {
        const msg = pendingMessagesRef.current.shift()
        wsRef.current.send(JSON.stringify(msg))
      }

      // Heartbeat to keep the connection alive
      if (heartbeatRef.current) clearInterval(heartbeatRef.current)
      heartbeatRef.current = setInterval(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'ping', t: Date.now() }))
        }
      }, 20000)
    }

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data)
      console.log('📨 Received:', data.type, data)

      switch (data.type) {
        case 'room-joined':
          console.log('Room joined. Existing participants:', data.participants)
          for (const participant of data.participants) {
            await createPeerConnection(participant.userId, true)
          }
          break

        case 'user-joined':
          console.log('New user joined:', data.userId, data.username)
          if (data.userId !== localUserId) {
            // Existing participants should NOT create an offer to avoid glare.
            // The joining user (who received 'room-joined') will create the offer.
            await createPeerConnection(data.userId, false)
          }
          break

        case 'offer':
          console.log('Received offer from:', data.userId)
          await handleOffer(data.userId, data.offer)
          break

        case 'answer':
          console.log('Received answer from:', data.userId)
          await handleAnswer(data.userId, data.answer)
          break

        case 'ice-candidate':
          console.log('Received ICE candidate from:', data.userId)
          await handleIceCandidate(data.userId, data.candidate)
          break

        case 'chat':
          setMessages(prev => [...prev, {
            id: data.timestamp,
            text: data.message,
            sender: data.username,
            isMe: data.userId === localUserId
          }])
          break

        case 'user-left':
          console.log('User left:', data.userId)
          handleUserLeft(data.userId)
          break
      }
    }

    ws.onclose = () => {
      console.log('❌ Disconnected from signaling server')
      setConnectionStatus('Disconnected')
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current)
        heartbeatRef.current = null
      }
      // Auto-reconnect if user is still on the page
      if (shouldReconnectRef.current) {
        setTimeout(() => {
          if (shouldReconnectRef.current && !wsRef.current) {
            console.log('🔄 Attempting to reconnect to signaling server...')
            connectToSignalingServer()
          }
        }, 2000)
      }
    }

    ws.onerror = (err) => {
      console.error('WebSocket error:', err)
      setConnectionStatus('Connection error')
    }
  }

  const createPeerConnection = async (remoteUserId, isOfferer) => {
    if (peerConnectionsRef.current[remoteUserId]) {
      console.log('Peer connection already exists for:', remoteUserId)
      return
    }

    console.log(`Creating peer connection with ${remoteUserId} (offerer: ${isOfferer})`)

    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    })

    peerConnectionsRef.current[remoteUserId] = pc

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localStreamRef.current)
        console.log('Added local track:', track.kind)
      })
    }

    pc.ontrack = (event) => {
      console.log('🎥 Received remote track from:', remoteUserId, event.track.kind)
      console.log('🎥 Stream:', event.streams[0])
      console.log('🎥 Track state:', event.track.readyState)
      
      if (!remoteStreamsRef.current[remoteUserId]) {
        remoteStreamsRef.current[remoteUserId] = event.streams[0]
        
        setRemoteUsers(prev => {
          console.log('👥 Current remote users:', prev)
          if (prev.find(u => u.userId === remoteUserId)) {
            console.log('⚠️ User already exists, skipping')
            return prev
          }
          console.log('✅ Adding new remote user:', remoteUserId)
          return [...prev, { userId: remoteUserId, stream: event.streams[0] }]
        })
      } else {
        console.log('⚠️ Stream already exists for:', remoteUserId)
      }
    }

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          type: 'ice-candidate',
          target: remoteUserId,
          candidate: event.candidate
        }))
        console.log('Sent ICE candidate to:', remoteUserId)
      }
    }

    pc.onconnectionstatechange = () => {
      console.log(`Connection state with ${remoteUserId}:`, pc.connectionState)
    }

    pc.oniceconnectionstatechange = () => {
      console.log(`ICE connection state with ${remoteUserId}:`, pc.iceConnectionState)
    }

    if (isOfferer) {
      try {
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        
        wsRef.current.send(JSON.stringify({
          type: 'offer',
          target: remoteUserId,
          offer: pc.localDescription
        }))
        console.log('Sent offer to:', remoteUserId)
      } catch (err) {
        console.error('Error creating offer:', err)
      }
    }
  }

  const handleOffer = async (remoteUserId, offer) => {
    try {
      if (!peerConnectionsRef.current[remoteUserId]) {
        await createPeerConnection(remoteUserId, false)
      }

      const pc = peerConnectionsRef.current[remoteUserId]
      await pc.setRemoteDescription(new RTCSessionDescription(offer))
      
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)
      
      wsRef.current.send(JSON.stringify({
        type: 'answer',
        target: remoteUserId,
        answer: pc.localDescription
      }))
      console.log('Sent answer to:', remoteUserId)
    } catch (err) {
      console.error('Error handling offer:', err)
    }
  }

  const handleAnswer = async (remoteUserId, answer) => {
    try {
      const pc = peerConnectionsRef.current[remoteUserId]
      if (pc) {
        await pc.setRemoteDescription(new RTCSessionDescription(answer))
        console.log('Set remote description (answer) for:', remoteUserId)
      }
    } catch (err) {
      console.error('Error handling answer:', err)
    }
  }

  const handleIceCandidate = async (remoteUserId, candidate) => {
    try {
      const pc = peerConnectionsRef.current[remoteUserId]
      if (pc && candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate))
        console.log('Added ICE candidate for:', remoteUserId)
      }
    } catch (err) {
      console.error('Error adding ICE candidate:', err)
    }
  }

  const handleUserLeft = (remoteUserId) => {
    if (peerConnectionsRef.current[remoteUserId]) {
      peerConnectionsRef.current[remoteUserId].close()
      delete peerConnectionsRef.current[remoteUserId]
    }

    delete remoteStreamsRef.current[remoteUserId]
    setRemoteUsers(prev => prev.filter(user => user.userId !== remoteUserId))
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
    if (!newMessage.trim() || !wsRef.current) return
    const payload = { type: 'chat', message: newMessage }
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload))
    } else {
      // Queue message to be sent once reconnected
      pendingMessagesRef.current.push(payload)
      setConnectionStatus('Reconnecting...')
      // Trigger reconnect if not already connected
      if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
        wsRef.current = null
        connectToSignalingServer()
      }
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
    console.log('Cleaning up...')
    shouldReconnectRef.current = false
    
    Object.values(peerConnectionsRef.current).forEach(pc => pc.close())
    peerConnectionsRef.current = {}
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current)
      heartbeatRef.current = null
    }
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop())
      localStreamRef.current = null
    }
  }

  const handleCallEnd = () => {
    cleanup()
    navigate(isDoctor ? '/doctor' : '/profile')
  }

  const handleEndSession = async () => {
    if (!isDoctor || isEndingSession) return;
    try {
      setIsEndingSession(true);
      
      const response = await apiInstance.post('/end-session', { videoCallId });
      
      if (response.data.success === true) {
        alert('Session ended successfully');
        cleanup();
        navigate('/doctor');
      } else {
        console.warn('Session end failed:', response.data.message);
      }
    } catch (e) {
      console.error('Failed to end session:', e);
    } finally {
      setIsEndingSession(false);
    }
  };
  
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
        <div className="text-center">
          <p className="text-xl text-red-400 mb-4">Error: {error}</p>
          <Button onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <div className="flex-1 relative">
        {/* Status bar with role indicator */}
        <div className="absolute top-4 left-4 z-10 bg-black bg-opacity-50 px-4 py-2 rounded-lg text-white">
          <p className="text-sm font-semibold">{connectionStatus}</p>
          <p className="text-xs mt-1">
            You are: <span className={isDoctor ? 'text-blue-400' : 'text-green-400'}>{username}</span>
          </p>
          <p className="text-xs">Your ID: {localUserId.substring(0, 20)}...</p>
          <p className="text-xs">Remote users: {remoteUsers.length}</p>
          {appointmentDetails && (
            <p className="text-xs mt-1">
              Meeting with: {isDoctor ? appointmentDetails.name : appointmentDetails.doctorName}
            </p>
          )}
        </div>

        {/* Combined videos grid (local + remotes) */}
        <div className="w-full h-full flex items-center justify-center p-4">
          <div
            className="w-full h-full grid gap-4"
            style={{
              gridTemplateColumns:
                (remoteUsers.length + 1) === 1
                  ? '1fr'
                  : 'repeat(auto-fit, minmax(400px, 1fr))'
            }}
          >
            {/* Local video as a tile */}
            <LocalVideoTile
              videoRef={localVideoRef}
              userId={localUserId}
            />

            {remoteUsers.length === 0 ? (
              <div className="col-span-full text-center text-white self-center">
                <div className="mb-4">
                  <div className="animate-pulse text-6xl mb-4">⏳</div>
                  <p className="text-xl">Waiting for other participant...</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Share this link with {isDoctor ? 'the patient' : 'your doctor'}:
                  </p>
                  <div className="mt-3 p-3 bg-gray-800 rounded-lg">
                    <p className="text-xs text-blue-400 break-all">
                      {window.location.origin}/video-call/{videoCallId}?role={isDoctor ? 'patient' : 'doctor'}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              remoteUsers.map((user) => (
                <RemoteVideo key={user.userId} stream={user.stream} userId={user.userId} />
              ))
            )}
          </div>
        </div>

        {/* Control buttons */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-10">
          <Button
            onClick={toggleAudio}
            className={`p-4 rounded-full ${isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isAudioOn ? <Mic size={24} /> : <MicOff size={24} />}
          </Button>
          
          <Button
            onClick={toggleVideo}
            className={`p-4 rounded-full ${isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}
          >
            {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
          </Button>
          
          {isDoctor && (
            <Button
              onClick={handleEndSession}
              disabled={isEndingSession}
              className={`p-4 rounded-full ${isEndingSession ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}`}
            >
              <span className="text-sm font-semibold">{isEndingSession ? 'Ending…' : 'End Session'}</span>
            </Button>
          )}

          <Button
            onClick={handleCallEnd}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700"
          >
            <PhoneOff size={24} />
          </Button>
        </div>
      </div>

      {/* Chat section */}
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

// Component to display remote video streams
const RemoteVideo = ({ stream, userId }) => {
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
      console.log('✅ Remote video stream set for:', userId)
    }
  }, [stream, userId])

  const displayName = userId.startsWith('doctor') ? 'Doctor' : 'Patient'

  return (
    <div className="relative bg-black rounded-lg overflow-hidden border-4 border-green-500 w-full h-full">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline
        className="w-full h-full object-cover"
      />
      <div className="absolute top-4 left-4 text-white text-lg font-bold bg-green-600 bg-opacity-90 px-4 py-2 rounded-lg shadow-lg">
        {displayName}
      </div>
      <div className="absolute bottom-4 right-4 text-white text-xs bg-black bg-opacity-70 px-2 py-1 rounded">
        {userId}
      </div>
    </div>
  )
}

// Component to display local video as grid tile
const LocalVideoTile = ({ videoRef, userId }) => {
  const displayName = userId.startsWith('doctor') ? 'Doctor (You)' : 'Patient (You)'

  return (
    <div className="relative bg-black rounded-lg overflow-hidden border-4 border-blue-500 w-full h-full">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover"
        style={{ transform: 'scaleX(-1)' }}
      />
      <div className="absolute top-4 left-4 text-white text-lg font-bold bg-blue-600 bg-opacity-90 px-4 py-2 rounded-lg shadow-lg">
        {displayName}
      </div>
      <div className="absolute bottom-4 right-4 text-white text-xs bg-black bg-opacity-70 px-2 py-1 rounded">
        {userId}
      </div>
    </div>
  )
}

RemoteVideo.propTypes = {
  stream: PropTypes.object,
  userId: PropTypes.string.isRequired,
}

LocalVideoTile.propTypes = {
  videoRef: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
}

export default VideoCallRoom