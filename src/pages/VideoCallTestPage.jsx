import { useState } from 'react'
import { Button } from '../components/shadcn/button/button'
import { Video, Users, Copy, Check } from 'lucide-react'
import VideoCallLinkGenerator from '../components/VideoCallLinkGenerator'

const VideoCallTestPage = () => {
    const [testLink, setTestLink] = useState('')
    const [linkCopied, setLinkCopied] = useState(false)

    const generateTestLink = () => {
        const uniqueId = Math.random().toString(36).substring(2, 15)
        const link = `${window.location.origin}/video-call/${uniqueId}`
        setTestLink(link)
    }

    const copyTestLink = async () => {
        try {
            await navigator.clipboard.writeText(testLink)
            setLinkCopied(true)
            setTimeout(() => setLinkCopied(false), 2000)
        } catch (error) {
            console.error('Failed to copy link:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Video Call System Test
                    </h1>
                    <p className="text-gray-600">
                        Test the video call functionality with unique links
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Link Generator */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Generate Video Call Link
                        </h2>
                        <VideoCallLinkGenerator />
                    </div>

                    {/* Quick Test */}
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Quick Test
                        </h2>
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    Test Video Call
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Generate a test link instantly
                                </p>
                            </div>

                            <div className="space-y-4">
                                <Button
                                    onClick={generateTestLink}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    <Video className="w-4 h-4 mr-2" />
                                    Generate Test Link
                                </Button>

                                {testLink && (
                                    <div className="space-y-3">
                                        <div className="p-3 bg-gray-100 rounded-lg">
                                            <p className="text-sm text-gray-600 mb-2">Test Link:</p>
                                            <p className="text-sm font-mono text-gray-800 break-all">
                                                {testLink}
                                            </p>
                                        </div>

                                        <div className="flex space-x-2">
                                            <Button
                                                onClick={copyTestLink}
                                                variant="outline"
                                                size="sm"
                                                className="flex-1"
                                            >
                                                {linkCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                                {linkCopied ? 'Copied!' : 'Copy'}
                                            </Button>
                                            
                                            <Button
                                                onClick={() => window.open(testLink, '_blank')}
                                                size="sm"
                                                className="flex-1 bg-blue-600 hover:bg-blue-700"
                                            >
                                                <Video className="w-4 h-4 mr-2" />
                                                Open Call
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <div className="text-xs text-gray-500 space-y-1">
                                    <p>• Open the link in two different browser tabs</p>
                                    <p>• Use ?role=doctor in one tab</p>
                                    <p>• Use ?role=patient in the other tab</p>
                                    <p>• Test the video call functionality</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">
                        How to Test Video Calls
                    </h3>
                    <div className="space-y-2 text-sm text-blue-800">
                        <p><strong>Step 1:</strong> Generate a video call link using either method above</p>
                        <p><strong>Step 2:</strong> Copy the link and open it in two different browser tabs/windows</p>
                        <p><strong>Step 3:</strong> Add <code className="bg-blue-100 px-1 rounded">?role=doctor</code> to one tab's URL</p>
                        <p><strong>Step 4:</strong> Add <code className="bg-blue-100 px-1 rounded">?role=patient</code> to the other tab's URL</p>
                        <p><strong>Step 5:</strong> Allow camera/microphone permissions when prompted</p>
                        <p><strong>Step 6:</strong> The doctor can start the call, and both users will connect</p>
                    </div>
                </div>

                {/* Features */}
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Video className="w-6 h-6 text-blue-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">WebRTC Video</h4>
                        <p className="text-sm text-gray-600">Real-time peer-to-peer video communication</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Users className="w-6 h-6 text-green-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Unique Links</h4>
                        <p className="text-sm text-gray-600">Each call gets a unique, secure link</p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6 text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Copy className="w-6 h-6 text-purple-600" />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">Easy Sharing</h4>
                        <p className="text-sm text-gray-600">Copy and share links with one click</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCallTestPage
