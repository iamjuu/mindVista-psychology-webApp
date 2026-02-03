import { useEffect, useState } from 'react'
import { Button } from '../../../../components/shadcn/button/button'
import { Input } from '../../../../components/shadcn/input/input'
import { Search, Calendar, Clock, Video, User, Phone, MapPin, ExternalLink, LayoutGrid, List } from 'lucide-react'
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
  const [viewMode, setViewMode] = useState('grid') // 🔥 new state: grid or list

  useEffect(() => {
    fetchTodayAppointments()
    const timeInterval = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timeInterval)
  }, [])

  useEffect(() => {
    const filtered = appointments.filter(appointment =>
      appointment.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      appointment.phone.includes(searchFilter)
    )
    setFilteredAppointments(filtered)
  }, [appointments, searchFilter])

  const fetchTodayAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await apiInstance.get('/appointments/today')
      const appointmentsData = response.data.data || []
      setAppointments(appointmentsData)
      setFilteredAppointments(appointmentsData)
    } catch (err) {
      setError('Failed to fetch today\'s appointments. Please try again.')
      setAppointments([])
      setFilteredAppointments([])
    } finally {
      setLoading(false)
    }
  }

  const handleVideoCall = (videoCallLink) => {
    if (videoCallLink) {
      const link = videoCallLink.includes('?')
        ? `${videoCallLink}&role=admin`
        : `${videoCallLink}?role=admin`;
      window.open(link, '_blank')
    } else {
      alert('Video call link not available')
    }
  }

  const getCurrentDate = () =>
    new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })

  const getCurrentTime = () =>
    currentTime.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true
    })

  const isAppointmentNow = (appointmentTime) => {
    try {
      const now = new Date()
      const [time, period] = appointmentTime.split(' ')
      const [hours, minutes] = time.split(':').map(Number)
      let appointmentHour = period === 'PM' && hours !== 12 ? hours + 12 : hours === 12 && period === 'AM' ? 0 : hours
      const appointmentMinutes = appointmentHour * 60 + minutes
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      return Math.abs(currentMinutes - appointmentMinutes) <= 15
    } catch {
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
    <div className="space-y-6">
      {/* Header */}
      <div className="border border-1  p-6 rounded-lg  flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold mb-2">Today&apos;s Appointments</h1>
          <div className="flex items-center text-sm space-x-4">
            <div className="flex items-center space-x-1">
              <Calendar size={16} />
              <span>{getCurrentDate()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{getCurrentTime()}</span>
            </div>
          </div>
        </div>

        {/* 🔁 View toggle buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('grid')}
            className={`${viewMode === 'grid' ? ' text-blue-600' : 'text-black '}`}
          >
            <LayoutGrid size={18} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode('list')}
            className={`${viewMode === 'list' ? ' text-blue-600' : 'text-black '}`}
          >
            <List size={18} />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="max-w-md w-full p-4 rounded-lg ">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search by patient name, doctor, or phone..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
        </div>
      </div>

      {/* Appointment List */}
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
        }
      >
        {filteredAppointments.map((appointment) => {
          const isNow = isAppointmentNow(appointment.time)
          return (
            <div
              key={appointment.id}
              className={`bg-white rounded-lg shadow-md border-l-4 transition-all hover:shadow-lg ${
                isNow
                  ? 'border-l-green-500 ring-1 ring-green-300 bg-green-50'
                  : 'border-l-blue-500 hover:border-l-blue-600'
              } ${viewMode === 'list' ? 'flex items-center justify-between p-4' : ''}`}
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Time Header */}
                  <div
                    className={`px-6 py-3 ${
                      isNow ? 'bg-green-500' : 'bg-blue-500'
                    } text-white flex justify-between items-center`}
                  >
                    <div className="flex items-center gap-2">
                      <Clock size={18} />
                      <span className="font-semibold text-lg">{appointment.time}</span>
                    </div>
                    {isNow && (
                      <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span className="text-sm">NOW</span>
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-black">
                      <User size={16} />
                      <span className="font-semibold">{appointment.name}</span>
                      <span className="text-sm text-gray-600">({appointment.age} yrs)</span>
                    </div>
                    <div className="text-sm text-gray-600 flex gap-2 items-center">
                      <Phone size={14} /> {appointment.phone}
                    </div>
                    <div className="text-sm text-gray-600 flex gap-2 items-center">
                      <MapPin size={14} /> {appointment.location}
                    </div>

                    <div className="border-t pt-3">
                      <div className="text-xs text-gray-500">Doctor</div>
                      <div className="font-medium text-black">{appointment.doctorName}</div>
                      <div className="text-sm text-gray-600">{appointment.doctorSpecialization}</div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Video size={16} className="text-green-500" />
                          <span className="text-sm text-gray-700">Video Call Ready</span>
                        </div>
                        <Button
                          onClick={() => handleVideoCall(appointment.videoCallLink)}
                          className={`flex items-center gap-1 text-sm ${
                            isNow
                              ? 'bg-green-600 hover:bg-green-700 animate-pulse'
                              : 'bg-blue-600 hover:bg-blue-700'
                          }`}
                          size="sm"
                        >
                          <Video size={14} /> Join <ExternalLink size={12} />
                        </Button>
                      </div>
                      {appointment.videoCallId && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-500">Call ID</div>
                          <div className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {appointment.videoCallId}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                // 🔥 List view layout
                <>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className={`${isNow ? 'text-green-600' : 'text-blue-600'}`} />
                      <span className="font-semibold">{appointment.time}</span>
                      {isNow && <span className="text-xs text-green-600 font-medium">NOW</span>}
                    </div>
                    <div className="flex items-center gap-2 text-black">
                      <User size={14} />
                      <span className="font-semibold">{appointment.name}</span>
                      <span className="text-sm text-gray-600">({appointment.age} yrs)</span>
                    </div>
                    <div className="text-sm text-gray-600">{appointment.doctorName}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handleVideoCall(appointment.videoCallLink)}
                      className={`flex items-center gap-1 text-sm ${
                        isNow
                          ? 'bg-green-600 hover:bg-green-700 animate-pulse'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      size="sm"
                    >
                      <Video size={14} /> Join
                    </Button>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      {/* No appointments */}
      {filteredAppointments.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar size={32} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No Appointments Today</h3>
          <p className="text-gray-500 mb-4">
            {searchFilter
              ? 'No appointments match your search criteria.'
              : 'There are no scheduled appointments for today.'}
          </p>
          {searchFilter && (
            <Button
              onClick={() => setSearchFilter('')}
              variant="outline"
              className="mr-2 border-gray-300"
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
