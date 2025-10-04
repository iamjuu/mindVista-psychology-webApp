import { useState } from 'react'
import { Button } from '../../components/shadcn/button/button'
import { Copy, Check, Video, Link } from 'lucide-react'
import apiInstance from '../../instance'

const VideoCallLinkGenerator = () => {
    const [generatedLink, setGeneratedLink] = useState('')
    const [linkCopied, setLinkCopied] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const generateSimpleLink = async () => {
        try {
            setLoading(true)
            setError('')
            
            const response = await apiInstance.post('/generate-simple-link')
            
            if (response.data.success) {
                setGeneratedLink(response.data.data.videoCallLink)
            } else {
                setError(response.data.message || 'Failed to generate link')
            }
        } catch (err) {
            console.error('Error generating link:', err)
            setError('Failed to generate video call link')
        } finally {
            setLoading(false)
        }
    }

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(generatedLink)
            setLinkCopied(true)
            setTimeout(() => setLinkCopied(false), 2000)
        } catch (error) {
            console.error('Failed to copy link:', error)
        }
    }

    const openLink = () => {
        if (generatedLink) {
            window.open(generatedLink, '_blank')
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Video Call Link Generator
                </h2>
                <p className="text-gray-600 text-sm">
                    Generate a unique link for video calls
                </p>
            </div>

            <div className="space-y-4">
                <Button
                    onClick={generateSimpleLink}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                >
                    {loading ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <Link className="w-4 h-4 mr-2" />
                            Generate Link
                        </div>
                    )}
                </Button>

                {error && (
                    <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {generatedLink && (
                    <div className="space-y-3">
                        <div className="p-3 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600 mb-2">Generated Link:</p>
                            <p className="text-sm font-mono text-gray-800 break-all">
                                {generatedLink}
                            </p>
                        </div>

                        <div className="flex space-x-2">
                            <Button
                                onClick={copyLink}
                                variant="outline"
                                size="sm"
                                className="flex-1"
                            >
                                {linkCopied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                                {linkCopied ? 'Copied!' : 'Copy'}
                            </Button>
                            
                            <Button
                                onClick={openLink}
                                size="sm"
                                className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                                <Video className="w-4 h-4 mr-2" />
                                Open Call
                            </Button>
                        </div>

                        <div className="text-xs text-gray-500 text-center">
                            <p>• Share this link with the other participant</p>
                            <p>• Both users will connect automatically</p>
                            <p>• Doctor can start the call when ready</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VideoCallLinkGenerator
