import { useState, useEffect } from 'react'
import { Button } from '../components/shadcn/button/button'
import { CheckCircle, XCircle, AlertCircle, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import apiInstance from '../instance'

const VideoCallTroubleshooting = () => {
    const [healthStatus, setHealthStatus] = useState(null)
    const [loading, setLoading] = useState(false)
    const [lastChecked, setLastChecked] = useState(null)

    const checkSystemHealth = async () => {
        setLoading(true)
        try {
            const response = await apiInstance.get('/video-call-health')
            setHealthStatus(response.data)
            setLastChecked(new Date())
        } catch (error) {
            console.error('Health check failed:', error)
            setHealthStatus({
                success: false,
                message: 'Failed to check system health',
                error: error.message
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkSystemHealth()
    }, [])

    const getStatusIcon = (status) => {
        switch (status) {
            case 'running':
            case 'healthy':
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case 'not running':
            case 'error':
            case 'timeout':
                return <XCircle className="w-4 h-4 text-red-500" />
            default:
                return <AlertCircle className="w-4 h-4 text-yellow-500" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'running':
            case 'healthy':
                return 'text-green-600'
            case 'not running':
            case 'error':
            case 'timeout':
                return 'text-red-600'
            default:
                return 'text-yellow-600'
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <Wifi className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Video Call System Status</h2>
                        <p className="text-sm text-gray-500">Check system health and troubleshoot issues</p>
                    </div>
                </div>
                <Button
                    onClick={checkSystemHealth}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                >
                    {loading ? (
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Refresh
                </Button>
            </div>

            {lastChecked && (
                <div className="mb-4 text-sm text-gray-500">
                    Last checked: {lastChecked.toLocaleTimeString()}
                </div>
            )}

            {healthStatus && (
                <div className="space-y-6">
                    {/* Overall Status */}
                    <div className={`p-4 rounded-lg border ${
                        healthStatus.success 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                    }`}>
                        <div className="flex items-center space-x-2">
                            {getStatusIcon(healthStatus.success ? 'healthy' : 'error')}
                            <h3 className={`font-semibold ${getStatusColor(healthStatus.success ? 'healthy' : 'error')}`}>
                                {healthStatus.success ? 'System Healthy' : 'System Issues Detected'}
                            </h3>
                        </div>
                        <p className={`mt-2 text-sm ${getStatusColor(healthStatus.success ? 'healthy' : 'error')}`}>
                            {healthStatus.message}
                        </p>
                    </div>

                    {/* Service Status */}
                    {healthStatus.data && (
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    {getStatusIcon(healthStatus.data.services?.backend)}
                                    <h4 className="font-medium text-gray-900">Backend Server</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Port: {healthStatus.data.ports?.backend}
                                </p>
                                <p className={`text-xs mt-1 ${getStatusColor(healthStatus.data.services?.backend)}`}>
                                    {healthStatus.data.services?.backend || 'Unknown'}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    {getStatusIcon(healthStatus.data.services?.signalingServer)}
                                    <h4 className="font-medium text-gray-900">Signaling Server</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Port: {healthStatus.data.ports?.signaling}
                                </p>
                                <p className={`text-xs mt-1 ${getStatusColor(healthStatus.data.services?.signalingServer)}`}>
                                    {healthStatus.data.services?.signalingServer || 'Unknown'}
                                </p>
                            </div>

                            <div className="p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2 mb-2">
                                    {getStatusIcon(healthStatus.data.services?.frontend)}
                                    <h4 className="font-medium text-gray-900">Frontend</h4>
                                </div>
                                <p className="text-sm text-gray-600">
                                    URL: {healthStatus.data.ports?.frontend}
                                </p>
                                <p className={`text-xs mt-1 ${getStatusColor(healthStatus.data.services?.frontend)}`}>
                                    {healthStatus.data.services?.frontend || 'Unknown'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Troubleshooting Steps */}
                    {!healthStatus.success && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-800 mb-3">Troubleshooting Steps</h4>
                            <div className="space-y-2 text-sm text-yellow-700">
                                <p><strong>1. Start the Signaling Server:</strong></p>
                                <div className="bg-yellow-100 p-2 rounded font-mono text-xs">
                                    cd mindVista-Backend<br/>
                                    node signaling-server.js
                                </div>
                                
                                <p><strong>2. Check Backend Server:</strong></p>
                                <div className="bg-yellow-100 p-2 rounded font-mono text-xs">
                                    cd mindVista-Backend<br/>
                                    npm start
                                </div>
                                
                                <p><strong>3. Start Frontend:</strong></p>
                                <div className="bg-yellow-100 p-2 rounded font-mono text-xs">
                                    cd mindVista-psychology-webApp<br/>
                                    npm run dev
                                </div>
                                
                                <p><strong>4. Check Ports:</strong></p>
                                <ul className="list-disc list-inside ml-4">
                                    <li>Backend: Port 3000</li>
                                    <li>Signaling: Port 8080</li>
                                    <li>Frontend: Port 5173</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <Button
                                onClick={() => window.open('http://localhost:3000', '_blank')}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-300 hover:bg-blue-50"
                            >
                                Backend
                            </Button>
                            <Button
                                onClick={() => window.open('ws://localhost:8080/signaling', '_blank')}
                                variant="outline"
                                size="sm"
                                className="text-green-600 border-green-300 hover:bg-green-50"
                            >
                                Signaling
                            </Button>
                            <Button
                                onClick={() => window.open('http://localhost:5173', '_blank')}
                                variant="outline"
                                size="sm"
                                className="text-purple-600 border-purple-300 hover:bg-purple-50"
                            >
                                Frontend
                            </Button>
                            <Button
                                onClick={() => window.open('/video-call-test', '_blank')}
                                variant="outline"
                                size="sm"
                                className="text-orange-600 border-orange-300 hover:bg-orange-50"
                            >
                                Test Page
                            </Button>
                        </div>
                    </div>

                    {/* Error Details */}
                    {healthStatus.error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-800 mb-2">Error Details</h4>
                            <p className="text-sm text-red-700 font-mono">
                                {healthStatus.error}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default VideoCallTroubleshooting

