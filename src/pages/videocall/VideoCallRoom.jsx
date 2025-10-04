import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/shadcn/button/button'
import { 
    Video, 
    VideoOff, 
    Mic, 
    MicOff, 
    PhoneOff, 
    Users, 
    MessageCircle,
    ScreenShare,
    ScreenShareOff,
    Volume2,
    VolumeX,
    Copy,
    Check
} from 'lucide-react'
import apiInstance from '../../instance'

const VideoCallRoom = () => {
    const { videoCallId } = useParams()
    const navigate = useNavigate()
    
    // Video call state
    const [isVideoOn, setIsVideoOn] = useState(true)
    const [isAudioOn, setIsAudioOn] = useState(true)
    const [isScreenSharing, setIsScreenSharing] = useState(false)
    const [isSpeakerOn, setIsSpeakerOn] = useState(true)
    const [callStarted, setCallStarted] = useState(false)
    const [callDuration, setCallDuration] = useState(0)
    const [isConnected, setIsConnected] = useState(false)
    const [connectionStatus, setConnectionStatus] = useState('Connecting...')
    
    // Appointment details
    const [appointmentDetails, setAppointmentDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    // Chat state
    const [showChat, setShowChat] = useState(false)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    
    // WebRTC state
    const [peerConnection, setPeerConnection] = useState(null)
    const [wsConnection, setWsConnection] = useState(null)
    const [remoteUser, setRemoteUser] = useState(null)
    const [linkCopied, setLinkCopied] = useState(false)
    
    // Refs for video elements
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const localStreamRef = useRef(null)
    const chatInputRef = useRef(null)
    const peerConnectionRef = useRef(null)
    const wsConnectionRef = useRef(null)

    // Role detection: prefer URL ?role=doctor|patient, else fallback to localStorage
    const isDoctor = (() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search)
            const roleParam = params.get('role')
            if (roleParam === 'doctor') return true
            if (roleParam === 'patient') return false
            return localStorage.getItem('isDoctorLoggedIn') === 'true'
        }
        return false
    })()

    // Admin permissions - only doctors can control the call
    const isAdmin = isDoctor
    const canControlCall = isDoctor
    const canStartCall = isDoctor
    const canEndCall = isDoctor
    const canScreenShare = isDoctor

    useEffect(() => {
        console.log('VideoCallRoom mounted with ID:', videoCallId)
        fetchAppointmentDetails()
        
        return () => {
            // Cleanup
            cleanup()
        }
    }, [videoCallId])

    useEffect(() => {
        let interval
        if (callStarted) {
            interval = setInterval(() => {
                setCallDuration(prev => prev + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [callStarted])

    const fetchAppointmentDetails = async () => {
        try {
            console.log('🔍 Fetching appointment details for video call ID:', videoCallId)
            console.log('🔍 API endpoint:', `/video-call/${videoCallId}/details`)
            setLoading(true)
            setError(null)
            
            // For doctors, inform backend to relax certain restrictions
            const roleQuery = isDoctor ? '?role=doctor' : ''
            const response = await apiInstance.get(`/video-call/${videoCallId}/details${roleQuery}`)
            console.log('✅ Appointment details response:', response.data)
            
            if (response.data.success) {
                setAppointmentDetails(response.data.data)
                console.log('✅ Appointment details set successfully:', response.data.data)
                // Initialize WebRTC after getting appointment details
                initializeWebRTC()
            } else {
                console.error('❌ API returned success: false:', response.data.message)
                setError(response.data.message || 'Failed to load appointment details')
            }
        } catch (err) {
            console.error('❌ Error fetching appointment details:', err)
            console.error('❌ Error response:', err.response)
            console.error('❌ Error status:', err.response?.status)
            console.error('❌ Error data:', err.response?.data)
            
            if (err.response?.status === 404) {
                setError('Video call session not found or invalid')
            } else if (err.response?.status === 403) {
                setError('Video call is only available on the appointment date')
            } else {
                setError('Failed to load video call details. Please check your connection.')
            }
        } finally {
            setLoading(false)
        }
    }

    // Initialize WebRTC connection
    const initializeWebRTC = async () => {
        try {
            console.log('🚀 Initializing WebRTC connection...')
            setConnectionStatus('Initializing...')
            
            // Get user media
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            
            localStreamRef.current = stream
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream
            }
            
            // Create peer connection
            const peerConnection = new RTCPeerConnection({
                iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' },
                    { urls: 'stun:stun1.l.google.com:19302' }
                ]
            })
            
            peerConnectionRef.current = peerConnection
            
            // Add local stream to peer connection
            stream.getTracks().forEach(track => {
                peerConnection.addTrack(track, stream)
            })
            
            // Handle remote stream
            peerConnection.ontrack = (event) => {
                console.log('📹 Remote stream received')
                const remoteStream = event.streams[0]
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.srcObject = remoteStream
                }
                setIsConnected(true)
                setConnectionStatus('Connected')
            }
            
            // Handle ICE candidates
            peerConnection.onicecandidate = (event) => {
                if (event.candidate && wsConnectionRef.current) {
                    wsConnectionRef.current.send(JSON.stringify({
                        type: 'ice-candidate',
                        candidate: event.candidate
                    }))
                }
            }
            
            // Handle connection state changes
            peerConnection.onconnectionstatechange = () => {
                console.log('🔗 Connection state:', peerConnection.connectionState)
                setConnectionStatus(peerConnection.connectionState)
                if (peerConnection.connectionState === 'connected') {
                    setIsConnected(true)
                } else if (peerConnection.connectionState === 'disconnected' || 
                          peerConnection.connectionState === 'failed') {
                    setIsConnected(false)
                }
            }
            
            // Connect to signaling server
            connectToSignalingServer()
            
        } catch (error) {
            console.error('❌ Error initializing WebRTC:', error)
            setError('Unable to access camera or microphone. Please check your permissions.')
        }
    }

    // Connect to WebSocket signaling server
    const connectToSignalingServer = () => {
        try {
            const signalingUrl = process.env.NODE_ENV === 'production' 
                ? 'wss://your-domain.com/signaling'
                : 'ws://localhost:8080/signaling'
            
            const ws = new WebSocket(`${signalingUrl}?roomId=${videoCallId}&userId=${isDoctor ? 'doctor' : 'patient'}&role=${isDoctor ? 'doctor' : 'patient'}`)
            wsConnectionRef.current = ws
            
            ws.onopen = () => {
                console.log('🔌 Connected to signaling server')
                setConnectionStatus('Connected to server')
            }
            
            ws.onmessage = async (event) => {
                const data = JSON.parse(event.data)
                console.log('📨 Signaling message:', data.type)
                
                switch (data.type) {
                    case 'room-joined':
                        console.log('✅ Joined room:', data.roomId)
                        break
                    case 'user-joined':
                        console.log('👤 User joined:', data.userId)
                        setRemoteUser(data.userId)
                        if (isDoctor) {
                            // Doctor initiates the call
                            await createOffer()
                        }
                        break
                    case 'offer':
                        await handleOffer(data.offer)
                        break
                    case 'answer':
                        await handleAnswer(data.answer)
                        break
                    case 'ice-candidate':
                        await handleIceCandidate(data.candidate)
                        break
                    case 'call-started':
                        setCallStarted(true)
                        break
                    case 'call-ended':
                        handleCallEnd()
                        break
                    case 'video-toggled':
                        // Handle remote video toggle
                        break
                    case 'audio-toggled':
                        // Handle remote audio toggle
                        break
                    case 'chat-message':
                        setMessages(prev => [...prev, data.message])
                        break
                }
            }
            
            ws.onclose = () => {
                console.log('🔌 Disconnected from signaling server')
                setConnectionStatus('Disconnected')
            }
            
            ws.onerror = (error) => {
                console.error('❌ WebSocket error:', error)
                setConnectionStatus('Connection error')
            }
            
        } catch (error) {
            console.error('❌ Error connecting to signaling server:', error)
            setError('Failed to connect to video call server')
        }
    }

    // Create WebRTC offer
    const createOffer = async () => {
        try {
            const offer = await peerConnectionRef.current.createOffer()
            await peerConnectionRef.current.setLocalDescription(offer)
            
            wsConnectionRef.current.send(JSON.stringify({
                type: 'offer',
                offer: offer
            }))
            
            console.log('📤 Offer sent')
        } catch (error) {
            console.error('❌ Error creating offer:', error)
        }
    }

    // Handle incoming offer
    const handleOffer = async (offer) => {
        try {
            await peerConnectionRef.current.setRemoteDescription(offer)
            const answer = await peerConnectionRef.current.createAnswer()
            await peerConnectionRef.current.setLocalDescription(answer)
            
            wsConnectionRef.current.send(JSON.stringify({
                type: 'answer',
                answer: answer
            }))
            
            console.log('📤 Answer sent')
        } catch (error) {
            console.error('❌ Error handling offer:', error)
        }
    }

    // Handle incoming answer
    const handleAnswer = async (answer) => {
        try {
            await peerConnectionRef.current.setRemoteDescription(answer)
            console.log('📥 Answer received')
        } catch (error) {
            console.error('❌ Error handling answer:', error)
        }
    }

    // Handle ICE candidate
    const handleIceCandidate = async (candidate) => {
        try {
            await peerConnectionRef.current.addIceCandidate(candidate)
            console.log('🧊 ICE candidate added')
        } catch (error) {
            console.error('❌ Error handling ICE candidate:', error)
        }
    }

    // Cleanup function
    const cleanup = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop())
        }
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close()
        }
        if (wsConnectionRef.current) {
            wsConnectionRef.current.close()
        }
    }

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0]
            if (videoTrack) {
                videoTrack.enabled = !isVideoOn
                setIsVideoOn(!isVideoOn)
                
                // Notify other participants
                if (wsConnectionRef.current) {
                    wsConnectionRef.current.send(JSON.stringify({
                        type: 'toggle-video',
                        videoEnabled: !isVideoOn
                    }))
                }
            }
        }
    }

    const toggleAudio = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !isAudioOn
                setIsAudioOn(!isAudioOn)
                
                // Notify other participants
                if (wsConnectionRef.current) {
                    wsConnectionRef.current.send(JSON.stringify({
                        type: 'toggle-audio',
                        audioEnabled: !isAudioOn
                    }))
                }
            }
        }
    }

    const toggleScreenShare = async () => {
        try {
            if (!isScreenSharing) {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                })
                
                // Replace video track with screen share
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = screenStream
                }
                
                setIsScreenSharing(true)
                
                // Listen for screen share end
                screenStream.getVideoTracks()[0].addEventListener('ended', () => {
                    setIsScreenSharing(false)
                    // Switch back to camera
                    if (localVideoRef.current && localStreamRef.current) {
                        localVideoRef.current.srcObject = localStreamRef.current
                    }
                })
            } else {
                // Stop screen sharing and switch back to camera
                if (localVideoRef.current && localStreamRef.current) {
                    localVideoRef.current.srcObject = localStreamRef.current
                }
                setIsScreenSharing(false)
            }
        } catch (error) {
            console.error('Error with screen sharing:', error)
            alert('Unable to share screen. Please try again.')
        }
    }

    const startCall = () => {
        setCallStarted(true)
        console.log('Video call started')
        
        // Notify other participants
        if (wsConnectionRef.current) {
            wsConnectionRef.current.send(JSON.stringify({
                type: 'call-start'
            }))
        }
    }

    const endCall = () => {
        cleanup()
        console.log('Video call ended')
        
        // Notify other participants
        if (wsConnectionRef.current) {
            wsConnectionRef.current.send(JSON.stringify({
                type: 'call-end'
            }))
        }
        
        // Redirect based on role
        if (isDoctor) {
            navigate('/admin/today-appointments')
        } else {
            navigate('/profile')
        }
    }

    const handleCallEnd = () => {
        cleanup()
        console.log('Remote user ended the call')
        // Show notification or redirect
        alert('The other participant has ended the call')
        navigate(isDoctor ? '/admin/today-appointments' : '/profile')
    }

    const sendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                id: Date.now(),
                text: newMessage,
                sender: isDoctor ? 'Doctor' : 'Patient',
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }
            setMessages(prev => [...prev, message])
            
            // Send to other participants via WebSocket
            if (wsConnectionRef.current) {
                wsConnectionRef.current.send(JSON.stringify({
                    type: 'chat-message',
                    message: newMessage
                }))
            }
            
            setNewMessage('')
        }
    }

    // Copy video call link
    const copyVideoCallLink = async () => {
        try {
            const link = `${window.location.origin}/video-call/${videoCallId}?role=${isDoctor ? 'doctor' : 'patient'}`
            await navigator.clipboard.writeText(link)
            setLinkCopied(true)
            setTimeout(() => setLinkCopied(false), 2000)
        } catch (error) {
            console.error('Failed to copy link:', error)
        }
    }

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-white">Loading video call...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <VideoOff className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-xl font-semibold text-white mb-2">Video Call Unavailable</h2>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <Button 
                        onClick={() => navigate('/admin/dashboard')}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="text-white">
                        <h1 className="text-lg font-semibold">
                            {appointmentDetails?.name} - {appointmentDetails?.doctorName}
                        </h1>
                        <p className="text-sm text-gray-300">
                            {appointmentDetails?.date} at {appointmentDetails?.time}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            <span className="text-xs text-gray-400">{connectionStatus}</span>
                        </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${isDoctor ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'}`}>
                        {isDoctor ? 'Admin/Doctor' : 'Participant'}
                    </div>
                    {callStarted && (
                        <div className="bg-green-600 px-3 py-1 rounded-full">
                            <span className="text-white text-sm font-medium">
                                {formatDuration(callDuration)}
                            </span>
                        </div>
                    )}
                </div>
                
                <div className="flex items-center space-x-2">
                    {/* Only admin can copy link */}
                    {isAdmin && (
                        <Button
                            onClick={copyVideoCallLink}
                            variant="outline"
                            size="sm"
                            className="text-white border-gray-600 hover:bg-gray-700"
                        >
                            {linkCopied ? <Check size={16} /> : <Copy size={16} />}
                            {linkCopied ? 'Copied!' : 'Copy Link'}
                        </Button>
                    )}
                    
                    {/* Chat is available for everyone */}
                    <Button
                        onClick={() => setShowChat(!showChat)}
                        variant="outline"
                        size="sm"
                        className="text-white border-gray-600 hover:bg-gray-700"
                    >
                        <MessageCircle size={16} />
                    </Button>
                    
                    {/* Only admin can end call */}
                    {canEndCall && (
                        <Button
                            onClick={endCall}
                            className="bg-red-600 hover:bg-red-700"
                            size="sm"
                        >
                            <PhoneOff size={16} />
                            End Call
                        </Button>
                    )}
                    
                    {/* Participants can only leave */}
                    {!isAdmin && (
                        <Button
                            onClick={() => {
                                cleanup()
                                navigate('/profile')
                            }}
                            className="bg-gray-600 hover:bg-gray-700"
                            size="sm"
                        >
                            <PhoneOff size={16} />
                            Leave
                        </Button>
                    )}
                </div>
            </div>

            {/* Main Video Area */}
            <div className="flex-1 flex">
                {/* Video Container */}
                <div className={`flex-1 relative ${showChat ? 'mr-80' : ''}`}>
                    {/* Remote Video (Full Screen) */}
                    <div className="absolute inset-0 bg-gray-800">
                        <video
                            ref={remoteVideoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                        
                        {/* Placeholder for remote video */}
                        {!isConnected && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Users size={32} className="text-gray-400" />
                                    </div>
                                    <p className="text-gray-300">
                                        {isDoctor ? 'Waiting for patient to join...' : 'Waiting for doctor to join...'}
                                    </p>
                                    <p className="text-gray-400 text-sm mt-2">
                                        Share the link with the other participant
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Local Video (Picture in Picture) */}
                    <div className="absolute top-4 right-4 w-64 h-48 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
                        <video
                            ref={localVideoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover"
                        />
                        {!isVideoOn && (
                            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                                <VideoOff className="w-8 h-8 text-gray-400" />
                            </div>
                        )}
                        <div className="absolute bottom-2 left-2 text-white text-sm font-medium">
                            You
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                        <div className="bg-gray-800/90 backdrop-blur-sm rounded-full px-6 py-4 flex items-center space-x-4">
                            {/* Only admin can start call */}
                            {!callStarted && canStartCall && (
                                <Button
                                    onClick={startCall}
                                    className="bg-green-600 hover:bg-green-700 px-6"
                                >
                                    <Video size={20} className="mr-2" />
                                    Start Call
                                </Button>
                            )}
                            
                            {/* Show waiting message for participants */}
                            {!callStarted && !isAdmin && (
                                <div className="text-white text-sm px-4 py-2 bg-gray-700 rounded-full">
                                    Waiting for admin to start the call...
                                </div>
                            )}
                            
                            {callStarted && (
                                <>
                                    {/* Audio control - available for everyone */}
                                    <Button
                                        onClick={toggleAudio}
                                        variant="outline"
                                        size="sm"
                                        className={`rounded-full w-12 h-12 ${
                                            isAudioOn 
                                                ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                                                : 'bg-red-600 hover:bg-red-700 text-white'
                                        }`}
                                    >
                                        {isAudioOn ? <Mic size={20} /> : <MicOff size={20} />}
                                    </Button>
                                    
                                    {/* Video control - available for everyone */}
                                    <Button
                                        onClick={toggleVideo}
                                        variant="outline"
                                        size="sm"
                                        className={`rounded-full w-12 h-12 ${
                                            isVideoOn 
                                                ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                                                : 'bg-red-600 hover:bg-red-700 text-white'
                                        }`}
                                    >
                                        {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
                                    </Button>
                                    
                                    {/* Screen share - only for admin */}
                                    {canScreenShare && (
                                        <Button
                                            onClick={toggleScreenShare}
                                            variant="outline"
                                            size="sm"
                                            className={`rounded-full w-12 h-12 ${
                                                isScreenSharing 
                                                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                                                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                                            }`}
                                        >
                                            {isScreenSharing ? <ScreenShareOff size={20} /> : <ScreenShare size={20} />}
                                        </Button>
                                    )}
                                    
                                    {/* Speaker control - available for everyone */}
                                    <Button
                                        onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                                        variant="outline"
                                        size="sm"
                                        className="rounded-full w-12 h-12 bg-gray-600 hover:bg-gray-700 text-white"
                                    >
                                        {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chat Panel */}
                {showChat && (
                    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">Chat</h3>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`rounded-lg p-3 ${
                                    message.sender === (isDoctor ? 'Doctor' : 'Patient') 
                                        ? 'bg-blue-100 ml-8' 
                                        : 'bg-gray-100 mr-8'
                                }`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`font-medium text-sm ${
                                            message.sender === (isDoctor ? 'Doctor' : 'Patient')
                                                ? 'text-blue-900'
                                                : 'text-gray-900'
                                        }`}>
                                            {message.sender}
                                            {message.sender === 'Doctor' && (
                                                <span className="ml-1 text-xs bg-blue-200 text-blue-800 px-1 rounded">
                                                    Admin
                                                </span>
                                            )}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {message.timestamp}
                                        </span>
                                    </div>
                                    <p className={`${
                                        message.sender === (isDoctor ? 'Doctor' : 'Patient')
                                            ? 'text-blue-800'
                                            : 'text-gray-700'
                                    }`}>
                                        {message.text}
                                    </p>
                                </div>
                            ))}
                            
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 py-8">
                                    <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>No messages yet</p>
                                    <p className="text-xs mt-1">
                                        {isAdmin ? 'Start the conversation' : 'Chat will be available when call starts'}
                                    </p>
                                </div>
                            )}
                        </div>
                        
                        <div className="p-4 border-t border-gray-200">
                            <div className="flex space-x-2">
                                <input
                                    ref={chatInputRef}
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder={callStarted ? "Type a message..." : "Chat will be available when call starts"}
                                    disabled={!callStarted}
                                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        !callStarted ? 'bg-gray-100 cursor-not-allowed' : ''
                                    }`}
                                />
                                <Button
                                    onClick={sendMessage}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                    disabled={!callStarted || !newMessage.trim()}
                                >
                                    Send
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VideoCallRoom



