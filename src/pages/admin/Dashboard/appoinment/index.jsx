import { useEffect, useState } from 'react'
import { Button } from '../../../../components/shadcn/button/button'
import { Input } from '../../../../components/shadcn/input/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/shadcn/select'
import { Search, Filter, X, ArrowUpDown } from 'lucide-react'
import apiInstance from '../../../../instance'

const Index = () => {
    const [appointments, setAppointments] = useState([])
    const [filteredAppointments, setFilteredAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [statusFilter, setStatusFilter] = useState('all')
    const [nameFilter, setNameFilter] = useState('')
    const [doctorFilter, setDoctorFilter] = useState('all')
    const [timeFilter, setTimeFilter] = useState('all')
    const [selectedDoctorCard, setSelectedDoctorCard] = useState(null)
    const [doctors, setDoctors] = useState([])
    const [sortBy, setSortBy] = useState('none') // none, doctor-asc, doctor-desc, date-asc, date-desc



    useEffect(() => {
        console.log('Appointment component mounted, initiating API calls...')
        fetchAppointments()
        fetchDoctors()
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    // Helper function to get time category
    const getTimeCategory = (timeString) => {
        console.log(`Processing time category for: ${timeString}`)
        const hour = parseInt(timeString.split(':')[0])
        const ampm = timeString.split(' ')[1]
        let hour24 = hour
        
        if (ampm === 'PM' && hour !== 12) {
            hour24 += 12
        } else if (ampm === 'AM' && hour === 12) {
            hour24 = 0
        }
        
        if (hour24 >= 8 && hour24 < 12) return 'morning'
        if (hour24 >= 12 && hour24 < 17) return 'afternoon'
        if (hour24 >= 17 && hour24 < 20) return 'evening'
        return 'other'
    }

    // Filter and sort appointments when filters or sorting changes
    useEffect(() => {
        console.log('Filtering and sorting appointments with current filters:', {
            statusFilter,
            nameFilter,
            doctorFilter,
            timeFilter,
            sortBy
        })
        
        let filtered = appointments.filter(appointment => {
            const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
            const matchesName = nameFilter === '' || 
                appointment.name.toLowerCase().includes(nameFilter.toLowerCase())
            const matchesDoctor = doctorFilter === 'all' || 
                appointment.doctorName === doctorFilter
            const matchesTime = timeFilter === 'all' || getTimeCategory(appointment.time) === timeFilter
            
            return matchesStatus && matchesName && matchesDoctor && matchesTime
        })
        
        // Apply sorting
        if (sortBy !== 'none') {
            filtered = [...filtered].sort((a, b) => {
                switch (sortBy) {
                    case 'doctor-asc': {
                        const doctorA = (a.doctorName || 'Unknown Doctor').toLowerCase()
                        const doctorB = (b.doctorName || 'Unknown Doctor').toLowerCase()
                        return doctorA.localeCompare(doctorB)
                    }
                    case 'doctor-desc': {
                        const doctorA2 = (a.doctorName || 'Unknown Doctor').toLowerCase()
                        const doctorB2 = (b.doctorName || 'Unknown Doctor').toLowerCase()
                        return doctorB2.localeCompare(doctorA2)
                    }
                    case 'date-asc':
                        return new Date(a.date) - new Date(b.date)
                    case 'date-desc':
                        return new Date(b.date) - new Date(a.date)
                    case 'name-asc':
                        return a.name.toLowerCase().localeCompare(b.name.toLowerCase())
                    case 'name-desc':
                        return b.name.toLowerCase().localeCompare(a.name.toLowerCase())
                    default:
                        return 0
                }
            })
        }
        
        console.log(`Filtered and sorted appointments: ${filtered.length} out of ${appointments.length}`)
        setFilteredAppointments(filtered)
    }, [appointments, statusFilter, nameFilter, doctorFilter, timeFilter, sortBy])

    const fetchAppointments = async () => {
        try {
            console.log('Starting API call to fetch appointments from /appointment endpoint...')
            setLoading(true)
            setError(null)
            
            const response = await apiInstance.get('/appointment')
            console.log('API Response received:', response.status, response.statusText)
            console.log('Appointments data from API:', response.data)
            
            // Ensure appointments is always an array - handle the API response structure
            const appointmentsData = Array.isArray(response.data) ? response.data : 
                                   Array.isArray(response.data.data) ? response.data.data : 
                                   Array.isArray(response.data.appointments) ? response.data.appointments : []
            
            console.log('Processed appointments data:', appointmentsData)
            console.log(`Total appointments fetched: ${appointmentsData.length}`)
            
            setAppointments(appointmentsData)
            setFilteredAppointments(appointmentsData)
            
        } catch (err) {
            console.error('Error fetching appointments from API:', err)
            console.error('Error details:', {
                message: err.message,
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data
            })
            
            // Fallback to mock data if API fails
            console.log('API call failed, falling back to mock data...')
            setError('Failed to fetch appointments from server. Using demo data.')
     
            
        } finally {
            console.log('Appointment fetching process completed, setting loading to false')
            setLoading(false)
        }
    }

    const fetchDoctors = async () => {
        try {
            console.log('Starting API call to fetch doctors from /doctors endpoint...')
            
            const response = await apiInstance.get('/doctors')
            console.log('Doctors API Response received:', response.status, response.statusText)
            console.log('Doctors data from API:', response.data)
            
            // Handle the API response structure
            const doctorsData = Array.isArray(response.data) ? response.data : 
                               Array.isArray(response.data.doctors) ? response.data.doctors : 
                               Array.isArray(response.data.data) ? response.data.data : []
            
            console.log('Processed doctors data:', doctorsData)
            console.log(`Total doctors fetched: ${doctorsData.length}`)
            
            setDoctors(doctorsData)
            
        } catch (err) {
            console.error('Error fetching doctors from API:', err)
            console.error('Doctors error details:', {
                message: err.message,
                status: err.response?.status,
                statusText: err.response?.statusText,
                data: err.response?.data
            })
            
            // Keep doctors array empty if API fails
            console.log('Doctors API call failed, keeping empty array')
            setDoctors([])
        }
    }

    // Read-only page - approval/decline is handled by doctors
    // These functions are disabled as appointments should be approved by doctors
    const handleApprove = async (appointmentId) => {
        console.log(`Admin page is read-only. Appointment approval should be done by doctors. Appointment ID: ${appointmentId}`)
        alert('Appointment approval is handled by doctors. Please ask the doctor to approve this appointment from their dashboard.')
    }

    const handleDecline = async (appointmentId) => {
        console.log(`Admin page is read-only. Appointment decline should be done by doctors. Appointment ID: ${appointmentId}`)
        alert('Appointment decline is handled by doctors. Please ask the doctor to decline this appointment from their dashboard.')
    }

    const handleDoctorCardClick = (doctorName) => {
        console.log(`Doctor card clicked: ${doctorName}`)
        console.log('Filtering appointments by doctor:', doctorName)
        
        if (selectedDoctorCard === doctorName) {
            // If same doctor is clicked, clear the filter
            console.log('Same doctor clicked, clearing filter')
            setDoctorFilter('all')
            setSelectedDoctorCard(null)
        } else {
            // Filter by selected doctor
            console.log('New doctor selected, applying filter')
            setDoctorFilter(doctorName)
            setSelectedDoctorCard(doctorName)
        }
    }

    const clearFilters = () => {
        console.log('Clearing all appointment filters and sorting')
        setStatusFilter('all')
        setNameFilter('')
        setDoctorFilter('all')
        setTimeFilter('all')
        setSortBy('none')
        setSelectedDoctorCard(null)
    }

    // Get unique doctors for filter dropdown from appointments
    const uniqueDoctors = [...new Set(appointments.map(app => app.doctorName).filter(Boolean))]

    // Calculate doctor statistics
    const getDoctorStats = (doctorName) => {
        const doctorAppointments = appointments.filter(app => 
            app.doctorName === doctorName
        )
        const totalAppointments = doctorAppointments.length
        const approvedAppointments = doctorAppointments.filter(app => app.status === 'approved').length
        const pendingAppointments = doctorAppointments.filter(app => app.status === 'pending').length
        
        console.log(`Doctor stats for ${doctorName}:`, {
            total: totalAppointments,
            approved: approvedAppointments,
            pending: pendingAppointments
        })
        
        return {
            total: totalAppointments,
            approved: approvedAppointments,
            pending: pendingAppointments
        }
    }

    // Get doctor info from doctors array
    const getDoctorInfo = (doctorName) => {
        return doctors.find(doc => doc.name === doctorName) || null
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading appointments...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">
                    Try Again
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
         

            {/* Filters */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-1">
                        <div className="relative flex-1">
                            <Input
                                type="text"
                                placeholder="Search by name..."
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>
                        <div className="flex gap-2 items-center">
                            <Filter size={20} className="text-gray-400" />
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px] bg-white border-gray-300 hover:bg-gray-50">
                                    <SelectValue placeholder="All Status" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="approved">Approved</SelectItem>
                                    <SelectItem value="declined">Declined</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex gap-2 items-center">
                            <ArrowUpDown size={20} className="text-gray-400" />
                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-[200px] bg-white border-gray-300 hover:bg-gray-50">
                                    <SelectValue placeholder="Sort by..." />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-lg">
                                    <SelectItem value="none">No Sorting</SelectItem>
                                    <SelectItem value="doctor-asc">Doctor (A-Z)</SelectItem>
                                    <SelectItem value="doctor-desc">Doctor (Z-A)</SelectItem>
                                    <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                                    <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                                    <SelectItem value="name-asc">Patient Name (A-Z)</SelectItem>
                                    <SelectItem value="name-desc">Patient Name (Z-A)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {(nameFilter || statusFilter !== 'all' || doctorFilter !== 'all' || timeFilter !== 'all' || sortBy !== 'none') && (
                        <Button 
                            onClick={clearFilters}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <X size={16} />
                            Clear Filters
                        </Button>
                    )}
                </div>

                {/* Doctor Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {uniqueDoctors.map(doctorName => {
                        const stats = getDoctorStats(doctorName)
                        const doctorInfo = getDoctorInfo(doctorName)
                        return (
                            <div
                                key={doctorName}
                                onClick={() => handleDoctorCardClick(doctorName)}
                                className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                                    selectedDoctorCard === doctorName
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                }`}
                            >
                                <h3 className="font-medium text-gray-900">{doctorName}</h3>
                                {doctorInfo && (
                                    <p className="text-sm text-gray-600 mt-1">{doctorInfo.specialization}</p>
                                )}
                                {!doctorInfo && (
                                    <p className="text-sm text-gray-600 mt-1">Specialist</p>
                                )}
                                <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                                    <div>
                                        <p className="text-gray-500">Total</p>
                                        <p className="font-medium text-gray-900">{stats.total}</p>
                                    </div>
                                    <div>
                                        <p className="text-green-500">Approved</p>
                                        <p className="font-medium text-gray-900">{stats.approved}</p>
                                    </div>
                                    <div>
                                        <p className="text-yellow-500">Pending</p>
                                        <p className="font-medium text-gray-900">{stats.pending}</p>
                                    </div>
                                </div>
                                {doctorInfo && (
                                    <div className="mt-2 text-xs text-gray-500">
                                        <p>Experience: {doctorInfo.experience} years</p>
                                        <p>Rating: {doctorInfo.rating || 'N/A'}</p>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Appointments Table */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 font-medium text-gray-900">
                                    <div className="flex items-center gap-1">
                                        Patient
                                        {(sortBy === 'name-asc' || sortBy === 'name-desc') && (
                                            <ArrowUpDown size={14} className="text-blue-500" />
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 font-medium text-gray-900">
                                    <div className="flex items-center gap-1">
                                        Doctor
                                        {(sortBy === 'doctor-asc' || sortBy === 'doctor-desc') && (
                                            <ArrowUpDown size={14} className="text-blue-500" />
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 font-medium text-gray-900">
                                    <div className="flex items-center gap-1">
                                        Date & Time
                                        {(sortBy === 'date-asc' || sortBy === 'date-desc') && (
                                            <ArrowUpDown size={14} className="text-blue-500" />
                                        )}
                                    </div>
                                </th>
                                <th className="px-4 py-3 font-medium text-gray-900">Status</th>
                                <th className="px-4 py-3 font-medium text-gray-900">Video Call</th>
                                <th className="px-4 py-3 font-medium text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredAppointments.map((appointment) => (
                                <tr key={appointment.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-gray-900">{appointment.name}</p>
                                            <p className="text-gray-500">{appointment.phone}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900">{appointment.doctorName || 'Unknown Doctor'}</p>
                                        {appointment.doctorSpecialization && (
                                            <p className="text-sm text-gray-500">{appointment.doctorSpecialization}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-gray-900">{appointment.date}</p>
                                        <p className="text-gray-500">{appointment.time}</p>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            appointment.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : appointment.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}>
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {appointment.videoCallGenerated && appointment.videoCallLink ? (
                                            <div className="space-y-1">
                                                <div className="flex items-center space-x-1">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="text-xs text-green-600 font-medium">Available</span>
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono">
                                                    ID: {appointment.videoCallId}
                                                </div>
                                                <Button
                                                    onClick={() => {
                                                        const link = appointment.videoCallLink?.includes('?') 
                                                            ? `${appointment.videoCallLink}&role=admin` 
                                                            : `${appointment.videoCallLink}?role=admin`;
                                                        window.open(link, '_blank');
                                                    }}
                                                    size="sm"
                                                    className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1"
                                                >
                                                    Open Call
                                                </Button>
                                            </div>
                                        ) : appointment.status === 'approved' ? (
                                            <span className="text-xs text-yellow-600">Generating...</span>
                                        ) : (
                                            <span className="text-xs text-gray-400">Not available</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {appointment.status === 'pending' && (
                                                <>
                                                    <Button
                                                        onClick={() => handleApprove(appointment.id)}
                                                        disabled={true}
                                                        className="bg-gray-300 text-gray-500 cursor-not-allowed"
                                                        size="sm"
                                                        title="Approval is handled by doctors"
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDecline(appointment.id)}
                                                        disabled={true}
                                                        variant="outline"
                                                        className="border-gray-300 text-gray-500 cursor-not-allowed"
                                                        size="sm"
                                                        title="Decline is handled by doctors"
                                                    >
                                                        Decline
                                                    </Button>
                                                </>
                                            )}
                                            {appointment.status === 'approved' && (
                                                <span className="text-sm text-green-600 font-medium">
                                                    ✓ Approved by Doctor
                                                </span>
                                            )}
                                            {appointment.status === 'declined' && (
                                                <span className="text-sm text-red-600 font-medium">
                                                    ✗ Declined by Doctor
                                                </span>
                                            )}
                                        </div>
                                        {appointment.status === 'pending' && (
                                            <div className="text-xs text-gray-500 mt-1 italic">
                                                Actions handled by doctors
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredAppointments.length === 0 && (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No appointments found</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Index
