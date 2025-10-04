import { useState } from 'react'
import { Button } from '../components/shadcn/button/button'
import { Video, Users, Settings, Copy, Check, Trash2, UserPlus, UserMinus } from 'lucide-react'

const VideoCallAdminPanel = ({ videoCallId, participants = [], onManageParticipants }) => {
    const [linkCopied, setLinkCopied] = useState(false)
    const [showSettings, setShowSettings] = useState(false)

    const copyAdminLink = async () => {
        try {
            const link = `${window.location.origin}/video-call/${videoCallId}?role=doctor`
            await navigator.clipboard.writeText(link)
            setLinkCopied(true)
            setTimeout(() => setLinkCopied(false), 2000)
        } catch (error) {
            console.error('Failed to copy link:', error)
        }
    }

    const copyParticipantLink = async () => {
        try {
            const link = `${window.location.origin}/video-call/${videoCallId}?role=patient`
            await navigator.clipboard.writeText(link)
            setLinkCopied(true)
            setTimeout(() => setLinkCopied(false), 2000)
        } catch (error) {
            console.error('Failed to copy link:', error)
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Video className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Admin Panel</h3>
                        <p className="text-sm text-gray-500">Manage video call session</p>
                    </div>
                </div>
                <Button
                    onClick={() => setShowSettings(!showSettings)}
                    variant="outline"
                    size="sm"
                >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                </Button>
            </div>

            {/* Call Links */}
            <div className="space-y-4 mb-6">
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Call Links</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Admin Link</p>
                                    <p className="text-xs text-blue-600">Full control access</p>
                                </div>
                                <Button
                                    onClick={copyAdminLink}
                                    size="sm"
                                    variant="outline"
                                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                                >
                                    {linkCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </Button>
                            </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Participant Link</p>
                                    <p className="text-xs text-gray-600">Join & chat only</p>
                                </div>
                                <Button
                                    onClick={copyParticipantLink}
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                    {linkCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Participants */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Participants</h4>
                    <span className="text-xs text-gray-500">{participants.length} connected</span>
                </div>
                
                <div className="space-y-2">
                    {participants.length > 0 ? (
                        participants.map((participant, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                        <Users className="w-4 h-4 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {participant.role === 'doctor' ? 'Admin' : 'Participant'}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {participant.role === 'doctor' ? 'Full access' : 'Limited access'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className={`w-2 h-2 rounded-full ${
                                        participant.connected ? 'bg-green-500' : 'bg-red-500'
                                    }`}></div>
                                    <Button
                                        onClick={() => onManageParticipants?.('remove', participant.id)}
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                    >
                                        <UserMinus className="w-3 h-3" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 text-gray-500">
                            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No participants yet</p>
                            <p className="text-xs">Share the participant link to invite others</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Admin Actions */}
            {showSettings && (
                <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Admin Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 border-green-300 hover:bg-green-50"
                        >
                            <UserPlus className="w-3 h-3 mr-1" />
                            Admit All
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove All
                        </Button>
                    </div>
                </div>
            )}

            {/* Call Status */}
            <div className="border-t pt-4 mt-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Call Active</span>
                    </div>
                    <div className="text-xs text-gray-500">
                        Session ID: {videoCallId.substring(0, 8)}...
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VideoCallAdminPanel
