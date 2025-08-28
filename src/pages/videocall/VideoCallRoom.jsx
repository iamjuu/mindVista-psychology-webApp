import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '../../components/shadcn/button/button'
import { 
    Video, 
    VideoOff, 
    Mic, 
    MicOff, 
    PhoneOff, 
    Settings, 
    Users, 
    MessageCircle,
    ScreenShare,
    ScreenShareOff,
    Volume2,
    VolumeX
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
    
    // Appointment details
    const [appointmentDetails, setAppointmentDetails] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    
    // Chat state
    const [showChat, setShowChat] = useState(false)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    
    // Refs for video elements
    const localVideoRef = useRef(null)
    const remoteVideoRef = useRef(null)
    const localStreamRef = useRef(null)
    const chatInputRef = useRef(null)

    useEffect(() => {
        console.log('VideoCallRoom mounted with ID:', videoCallId)
        fetchAppointmentDetails()
        initializeVideoCall()
        
        return () => {
            // Cleanup
            if (localStreamRef.current) {
                localStreamRef.current.getTracks().forEach(track => track.stop())
            }
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
            console.log('Fetching appointment details for video call:', videoCallId)
            setLoading(true)
            setError(null)
            
            const response = await apiInstance.get(`/video-call/${videoCallId}/details`)
            console.log('Appointment details response:', response.data)
            
            if (response.data.success) {
                setAppointmentDetails(response.data.data)
            } else {
                setError(response.data.message || 'Failed to load appointment details')
            }
        } catch (err) {
            console.error('Error fetching appointment details:', err)
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

    const initializeVideoCall = async () => {
        try {
            console.log('Initializing video call...')
            
            // Get user media
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            })
            
            localStreamRef.current = stream
            if (localVideoRef.current) {
                localVideoRef.current.srcObject = stream
            }
            
            console.log('Local video stream initialized')
            
        } catch (error) {
            console.error('Error accessing camera/microphone:', error)
            alert('Unable to access camera or microphone. Please check your permissions.')
        }
    }

    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0]
            if (videoTrack) {
                videoTrack.enabled = !isVideoOn
                setIsVideoOn(!isVideoOn)
            }
        }
    }

    const toggleAudio = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0]
            if (audioTrack) {
                audioTrack.enabled = !isAudioOn
                setIsAudioOn(!isAudioOn)
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
    }

    const endCall = () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop())
        }
        console.log('Video call ended')
        navigate('/admin/dashboard') // Redirect back to admin dashboard
    }

    const sendMessage = () => {
        if (newMessage.trim()) {
            const message = {
                id: Date.now(),
                text: newMessage,
                sender: 'You',
                timestamp: new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                })
            }
            setMessages(prev => [...prev, message])
            setNewMessage('')
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
                    <Button
                        onClick={() => setShowChat(!showChat)}
                        variant="outline"
                        size="sm"
                        className="text-white border-gray-600 hover:bg-gray-700"
                    >
                        <MessageCircle size={16} />
                    </Button>
                    <Button
                        onClick={endCall}
                        className="bg-red-600 hover:bg-red-700"
                        size="sm"
                    >
                        <PhoneOff size={16} />
                        End Call
                    </Button>
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
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users size={32} className="text-gray-400" />
                                </div>
                                <p className="text-gray-300">Waiting for {appointmentDetails?.doctorName} to join...</p>
                            </div>
                        </div>
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
                            {!callStarted && (
                                <Button
                                    onClick={startCall}
                                    className="bg-green-600 hover:bg-green-700 px-6"
                                >
                                    <Video size={20} className="mr-2" />
                                    Start Call
                                </Button>
                            )}
                            
                            {callStarted && (
                                <>
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
                                <div key={message.id} className="bg-gray-100 rounded-lg p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-sm text-gray-900">
                                            {message.sender}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {message.timestamp}
                                        </span>
                                    </div>
                                    <p className="text-gray-700">{message.text}</p>
                                </div>
                            ))}
                            
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 py-8">
                                    <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                                    <p>No messages yet</p>
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
                                    placeholder="Type a message..."
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Button
                                    onClick={sendMessage}
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
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
