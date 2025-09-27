import { useEffect, useState } from 'react'
import { Button } from '../../../../components/shadcn/button/button'
import { Input } from '../../../../components/shadcn/input/input'
import { Search, Calendar, Clock, Video, User, Phone, MapPin, ExternalLink } from 'lucide-react'
import apiInstance from '../../../../instance'
import { useTheme } from '../../../../contexts/ThemeContext'

const TodayAppointments = () => {
    const { themeClasses } = useTheme();
    const [appointments, setAppointments] = useState([])
    const [filteredAppointments, setFilteredAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchFilter, setSearchFilter] = useState('')
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        console.log('Today Appointments component mounted, fetching appointments...')
        fetchTodayAppointments()
        
        // Update current time every minute
        const timeInterval = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)

        return () => clearInterval(timeInterval)
    }, [])

    useEffect(() => {
        // Filter appointments based on search
        const filtered = appointments.filter(appointment => 
            appointment.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
            appointment.doctorName.toLowerCase().includes(searchFilter.toLowerCase()) ||
            appointment.phone.includes(searchFilter)
        )
        setFilteredAppointments(filtered)
    }, [appointments, searchFilter])

    const fetchTodayAppointments = async () => {
        try {
            console.log('Fetching today\'s appointments from API...')
            setLoading(true)
            setError(null)
            
            const response = await apiInstance.get('/appointments/today')
            console.log('Today appointments API response:', response.data)
            
            const appointmentsData = response.data.data || []
            console.log(`Fetched ${appointmentsData.length} appointments for today`)
            
            setAppointments(appointmentsData)
            setFilteredAppointments(appointmentsData)
            
        } catch (err) {
            console.error('Error fetching today\'s appointments:', err)
            setError('Failed to fetch today\'s appointments. Please try again.')
            setAppointments([])
            setFilteredAppointments([])
        } finally {
            setLoading(false)
        }
    }

    const handleVideoCall = (videoCallLink) => {
        if (videoCallLink) {
            console.log('Opening video call:', videoCallLink)
            window.open(videoCallLink, '_blank')
        } else {
            alert('Video call link not available')
        }
    }

    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const getCurrentTime = () => {
        return currentTime.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    }

    const isAppointmentNow = (appointmentTime) => {
        try {
            const now = new Date()
            const currentHour = now.getHours()
            const currentMinute = now.getMinutes()
            
            // Parse appointment time (e.g., "10:30 AM")
            const timeParts = appointmentTime.match(/(\d+):(\d+)\s*(AM|PM)/i)
            if (!timeParts) return false
            
            let appointmentHour = parseInt(timeParts[1])
            const appointmentMinute = parseInt(timeParts[2])
            const period = timeParts[3].toUpperCase()
            
            // Convert to 24-hour format
            if (period === 'PM' && appointmentHour !== 12) {
                appointmentHour += 12
            } else if (period === 'AM' && appointmentHour === 12) {
                appointmentHour = 0
            }
            
            // Check if current time is within 15 minutes of appointment time
            const appointmentMinutes = appointmentHour * 60 + appointmentMinute
            const currentMinutes = currentHour * 60 + currentMinute
            const timeDiff = Math.abs(currentMinutes - appointmentMinutes)
            
            return timeDiff <= 15 // Within 15 minutes
        } catch (error) {
            console.error('Error checking appointment time:', error)
            return false
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-black">Loading today&apos;s appointments...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-black mb-4">{error}</p>
                <Button onClick={fetchTodayAppointments} className="bg-blue-600 hover:bg-blue-700">
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6 ">
            {/* Header */}
            <div className="bg-[#1d4ed8] text-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-[16px] font-bold mb-2">Today&apos;s Appointments</h1>
                        <div className="flex items-center text-[14px] space-x-4 text-white">
                            <div className="flex items-center space-x-2">
                                <Calendar size={16} />
                                <span>{getCurrentDate()}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Clock size={16} />
                                <span>{getCurrentTime()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right text-[14px]">
                        <div className="">{filteredAppointments.length}</div>
                        <div className="text-white">Appointments</div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Search by patient name, doctor, or phone..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={20} />
                </div>
            </div>

            {/* Appointments Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAppointments.map((appointment) => {
                    const isNow = isAppointmentNow(appointment.time)
                    
                    return (
                        <div
                            key={appointment.id}
                            className={`bg-white rounded-lg shadow-lg border-l-4 overflow-hidden transition-all duration-200 hover:shadow-xl ${
                                isNow 
                                    ? 'border-l-green-500 ring-2 ring-green-200 bg-green-50' 
                                    : 'border-l-blue-500 hover:border-l-blue-600'
                            }`}
                        >
                            {/* Appointment Time Header */}
                            <div className={`px-6 py-4 ${isNow ? 'bg-green-500' : 'bg-blue-500'} text-white`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <Clock size={18} />
                                        <span className="font-semibold text-lg">{appointment.time}</span>
                                    </div>
                                    {isNow && (
                                        <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full">
                                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                            <span className="text-sm font-medium">NOW</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Appointment Details */}
                            <div className="p-6 space-y-4">
                                {/* Patient Info */}
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                        <User size={16} className="text-black" />
                                        <span className="font-semibold text-black">{appointment.name}</span>
                                        <span className="text-sm text-black">({appointment.age} years)</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Phone size={16} className="text-black" />
                                        <span className="text-black">{appointment.phone}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <MapPin size={16} className="text-black" />
                                        <span className="text-black">{appointment.location}</span>
                                    </div>
                                </div>

                                {/* Doctor Info */}
                                <div className="border-t pt-4">
                                    <div className="text-sm text-black mb-1">Doctor</div>
                                    <div className="font-medium text-black">{appointment.doctorName}</div>
                                    <div className="text-sm text-black">{appointment.doctorSpecialization}</div>
                                </div>

                                {/* Video Call Section */}
                                <div className="border-t pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <Video size={16} className="text-green-500" />
                                            <span className="text-sm font-medium text-black">Video Call Ready</span>
                                        </div>
                                        <Button
                                            onClick={() => handleVideoCall(appointment.videoCallLink)}
                                            className={`flex items-center space-x-2 ${
                                                isNow 
                                                    ? 'bg-green-600 hover:bg-green-700 animate-pulse' 
                                                    : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                            size="sm"
                                        >
                                            <Video size={14} />
                                            <span>Join Call</span>
                                            <ExternalLink size={12} />
                                        </Button>
                                    </div>
                                    
                                    {appointment.videoCallId && (
                                        <div className="mt-2">
                                            <div className="text-xs text-black mb-1">Call ID</div>
                                            <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                                {appointment.videoCallId}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* No Appointments Message */}
            {filteredAppointments.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Calendar size={32} className="text-black" />
                    </div>
                    <h3 className="text-xl font-medium text-black mb-2">No Appointments Today</h3>
                    <p className="text-black mb-4">
                        {searchFilter 
                            ? 'No appointments match your search criteria.' 
                            : 'There are no scheduled appointments for today.'
                        }
                    </p>
                    {searchFilter && (
                        <Button 
                            onClick={() => setSearchFilter('')}
                            variant="outline"
                            className="mr-2"
                        >
                            Clear Search
                        </Button>
                    )}
                    <Button onClick={fetchTodayAppointments} className="bg-blue-600 hover:bg-blue-700">
                        Refresh
                    </Button>
                </div>
            )}
        </div>
    )
}

export default TodayAppointments





