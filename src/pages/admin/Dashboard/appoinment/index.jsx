import { useEffect, useState } from 'react'
import { Button } from '../../../../components/shadcn/button/button'
import { Input } from '../../../../components/shadcn/input/input'
import { Search, Filter, X } from 'lucide-react'
// import apiInstance from '../../../../instance' // Commented out - using static data

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

    // Mock data for demonstration (keeping as fallback)
    const mockAppointments = [
        {
            id: 1,
            name: 'John Smith',
            phone: '+1-555-0123',
            age: 35,
            location: 'New York, NY',
            doctor: 'Dr. Sarah Johnson',
            status: 'pending',
            time: '09:00 AM',
            date: '2024-01-15'
        },
        {
            id: 2,
            name: 'Emily Davis',
            phone: '+1-555-0456',
            age: 28,
            location: 'Los Angeles, CA',
            doctor: 'Dr. Michael Brown',
            status: 'approved',
            time: '10:30 AM',
            date: '2024-01-15'
        },
        {
            id: 3,
            name: 'Robert Wilson',
            phone: '+1-555-0789',
            age: 42,
            location: 'Chicago, IL',
            doctor: 'Dr. Sarah Johnson',
            status: 'declined',
            time: '02:00 PM',
            date: '2024-01-16'
        },
        {
            id: 4,
            name: 'Maria Garcia',
            phone: '+1-555-0321',
            age: 31,
            location: 'Houston, TX',
            doctor: 'Dr. David Lee',
            status: 'pending',
            time: '11:15 AM',
            date: '2024-01-16'
        },
        {
            id: 5,
            name: 'James Anderson',
            phone: '+1-555-0654',
            age: 39,
            location: 'Phoenix, AZ',
            doctor: 'Dr. Michael Brown',
            status: 'approved',
            time: '03:45 PM',
            date: '2024-01-17'
        },
        {
            id: 6,
            name: 'Lisa Thompson',
            phone: '+1-555-0987',
            age: 26,
            location: 'Miami, FL',
            doctor: 'Dr. Sarah Johnson',
            status: 'approved',
            time: '01:30 PM',
            date: '2024-01-17'
        },
        {
            id: 7,
            name: 'Michael Davis',
            phone: '+1-555-0234',
            age: 33,
            location: 'Seattle, WA',
            doctor: 'Dr. David Lee',
            status: 'pending',
            time: '10:00 AM',
            date: '2024-01-18'
        },
        {
            id: 8,
            name: 'Jennifer Wilson',
            phone: '+1-555-0567',
            age: 29,
            location: 'Boston, MA',
            doctor: 'Dr. Michael Brown',
            status: 'approved',
            time: '04:15 PM',
            date: '2024-01-18'
        }
    ]

    // Doctor data for cards
    const doctorCards = [
        {
            id: 1,
            name: 'Dr. Sarah Johnson',
            specialty: 'Clinical Psychology',
            totalIncome: '₹145,000',
            color: 'bg-blue-500',
            textColor: 'text-white'
        },
        {
            id: 2,
            name: 'Dr. Michael Brown',
            specialty: 'Cognitive Behavioral Therapy',
            totalIncome: '₹120,000',
            color: 'bg-green-500',
            textColor: 'text-white'
        },
        {
            id: 3,
            name: 'Dr. David Lee',
            specialty: 'Marriage & Family Therapy',
            totalIncome: '₹95,000',
            color: 'bg-orange-500',
            textColor: 'text-white'
        }
    ]

    useEffect(() => {
        console.log('Appointment component mounted, initiating API call to fetch appointments...')
        fetchAppointments()
    }, [])

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

    // Filter appointments when filters change
    useEffect(() => {
        console.log('Filtering appointments with current filters:', {
            statusFilter,
            nameFilter,
            doctorFilter,
            timeFilter
        })
        
        let filtered = appointments.filter(appointment => {
            const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter
            const matchesName = nameFilter === '' || 
                appointment.name.toLowerCase().includes(nameFilter.toLowerCase())
            const matchesDoctor = doctorFilter === 'all' || appointment.doctor === doctorFilter
            const matchesTime = timeFilter === 'all' || getTimeCategory(appointment.time) === timeFilter
            
            return matchesStatus && matchesName && matchesDoctor && matchesTime
        })
        
        console.log(`Filtered appointments: ${filtered.length} out of ${appointments.length}`)
        setFilteredAppointments(filtered)
    }, [appointments, statusFilter, nameFilter, doctorFilter, timeFilter])

    const fetchAppointments = async () => {
        console.log('Loading appointments from static data...')
        setLoading(true)
        setError(null)
        
        // Simulate API delay for better user experience
        setTimeout(() => {
            console.log('Using static appointment data')
            console.log('Static appointments data:', mockAppointments)
            console.log(`Total appointments loaded: ${mockAppointments.length}`)
            
            setAppointments(mockAppointments)
            setFilteredAppointments(mockAppointments)
            setLoading(false)
            console.log('Appointment loading process completed')
        }, 1000)
        
        // Commented out API call - using static data instead
        /*
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
            setAppointments(mockAppointments)
            setFilteredAppointments(mockAppointments)
            
        } finally {
            console.log('Appointment fetching process completed, setting loading to false')
            setLoading(false)
        }
        */
    }

    const handleApprove = async (appointmentId) => {
        console.log(`Starting approval process for appointment ID: ${appointmentId}`)
        
        // Update UI with static data
        const updateAppointments = (prev) => 
            prev.map(appointment => 
                appointment.id === appointmentId 
                    ? { ...appointment, status: 'approved' }
                    : appointment
            )
        
        setAppointments(updateAppointments)
        setFilteredAppointments(updateAppointments)
        console.log(`Appointment ${appointmentId} approved successfully in static data`)
        
        // Commented out API call - using static data instead
        /*
        try {
            console.log(`Starting approval process for appointment ID: ${appointmentId}`)
            
            // Update UI optimistically
            const updateAppointments = (prev) => 
                prev.map(appointment => 
                    appointment.id === appointmentId 
                        ? { ...appointment, status: 'approved' }
                        : appointment
                )
            
            setAppointments(updateAppointments)
            
            // Make API call to approve appointment
            const response = await apiInstance.put(`/appointment/${appointmentId}/approve`)
            console.log(`Appointment ${appointmentId} approved successfully via API:`, response.data)
            
        } catch (err) {
            console.error('Error approving appointment via API:', err)
            console.error('Approval error details:', {
                appointmentId,
                message: err.message,
                status: err.response?.status,
                data: err.response?.data
            })
            
            // Revert optimistic update on error
            fetchAppointments()
        }
        */
    }

    const handleDecline = async (appointmentId) => {
        try {
            console.log(`Starting decline process for appointment ID: ${appointmentId}`)
            
            // Update UI optimistically
            const updateAppointments = (prev) => 
                prev.map(appointment => 
                    appointment.id === appointmentId 
                        ? { ...appointment, status: 'declined' }
                        : appointment
                )
            
            setAppointments(updateAppointments)
            setFilteredAppointments(updateAppointments)
            
            // Make API call to decline appointment
            const response = await apiInstance.put(`/appointment/${appointmentId}/decline`)
            console.log(`Appointment ${appointmentId} declined successfully via API:`, response.data)
            
        } catch (err) {
            console.error('Error declining appointment via API:', err)
            console.error('Decline error details:', {
                appointmentId,
                message: err.message,
                status: err.response?.status,
                data: err.response?.data
            })
            
            // Revert optimistic update on error
            fetchAppointments()
        }
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
        console.log('Clearing all appointment filters')
        setStatusFilter('all')
        setNameFilter('')
        setDoctorFilter('all')
        setTimeFilter('all')
        setSelectedDoctorCard(null)
    }

    // Get unique doctors for filter dropdown
    const uniqueDoctors = [...new Set(appointments.map(app => app.doctor))]

    // Calculate doctor statistics
    const getDoctorStats = (doctorName) => {
        const doctorAppointments = appointments.filter(app => app.doctor === doctorName)
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
            {/* Header */}
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold text-gray-800">Appointment Management</h2>
                <p className="text-gray-600 mt-2">Manage and track all patient appointments</p>
            </div>

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
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="declined">Declined</option>
                            </select>
                        </div>
                    </div>
                    {(nameFilter || statusFilter !== 'all' || doctorFilter !== 'all' || timeFilter !== 'all') && (
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
                                <th className="px-4 py-3 font-medium text-gray-900">Patient</th>
                                <th className="px-4 py-3 font-medium text-gray-900">Doctor</th>
                                <th className="px-4 py-3 font-medium text-gray-900">Date & Time</th>
                                <th className="px-4 py-3 font-medium text-gray-900">Status</th>
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
                                        <p className="font-medium text-gray-900">{appointment.doctor}</p>
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
                                        <div className="flex gap-2">
                                            {appointment.status === 'pending' && (
                                                <>
                                                    <Button
                                                        onClick={() => handleApprove(appointment.id)}
                                                        className="bg-green-500 hover:bg-green-600 text-white"
                                                        size="sm"
                                                    >
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        onClick={() => handleDecline(appointment.id)}
                                                        variant="outline"
                                                        className="border-red-500 text-red-500 hover:bg-red-50"
                                                        size="sm"
                                                    >
                                                        Decline
                                                    </Button>
                                                </>
                                            )}
                                        </div>
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
