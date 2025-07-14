import { useEffect, useState } from 'react'
import { Button } from '../../../../components/shadcn/button/button'
import { Input } from '../../../../components/shadcn/input/input'
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
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading appointments...</span>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Error: {error}
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Doctor Cards Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Our Doctors</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {doctorCards.map((doctor) => {
                        const stats = getDoctorStats(doctor.name)
                        const isSelected = selectedDoctorCard === doctor.name
                        
                        return (
                            <div
                                key={doctor.id}
                                onClick={() => handleDoctorCardClick(doctor.name)}
                                className={`${doctor.color} ${doctor.textColor} rounded-lg p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                                    isSelected ? 'ring-4 ring-white ring-opacity-50 shadow-2xl' : ''
                                } ${
                                    selectedDoctorCard && !isSelected ? 'blur-sm' : ''
                                }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-semibold">{doctor.name}</h3>
                                        <p className="text-sm opacity-90">{doctor.specialty}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm opacity-90">Total Income</p>
                                        <p className="text-xl font-bold">{doctor.totalIncome}</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm opacity-90">Total Appointments</span>
                                        <span className="font-semibold">{stats.total}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm opacity-90">Approved</span>
                                        <span className="font-semibold">{stats.approved}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm opacity-90">Pending</span>
                                        <span className="font-semibold">{stats.pending}</span>
                                    </div>
                                </div>
                                {isSelected && (
                                    <div className="mt-4 text-center">
                                        <span className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full">
                                            Click to clear filter
                                        </span>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Total Appointments Summary */}
            <div className="mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Appointment Summary</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-3xl font-bold">{appointments.length}</div>
                            <div className="text-sm opacity-90">Total Appointments</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-green-300">
                                {appointments.filter(app => app.status === 'approved').length}
                            </div>
                            <div className="text-sm opacity-90">Approved</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-yellow-300">
                                {appointments.filter(app => app.status === 'pending').length}
                            </div>
                            <div className="text-sm opacity-90">Pending</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-red-300">
                                {appointments.filter(app => app.status === 'declined').length}
                            </div>
                            <div className="text-sm opacity-90">Declined</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointments</h1>
                <p className="text-gray-600">
                    {selectedDoctorCard ? `Showing appointments for ${selectedDoctorCard}` : 'Manage patient appointments'}
                </p>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Filter Appointments</h2>
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Status Filter */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select 
                                value={statusFilter} 
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="declined">Declined</option>
                            </select>
                        </div>

                        {/* Name Filter */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                            <Input
                                type="text"
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                placeholder="Search by name..."
                                className="w-full"
                            />
                        </div>

                        {/* Doctor Filter */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Doctor</label>
                            <select 
                                value={doctorFilter} 
                                onChange={(e) => setDoctorFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Doctors</option>
                                {uniqueDoctors.map(doctor => (
                                    <option key={doctor} value={doctor}>{doctor}</option>
                                ))}
                            </select>
                        </div>

                        {/* Time Filter */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1">Time</label>
                            <select 
                                value={timeFilter} 
                                onChange={(e) => setTimeFilter(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Times</option>
                                <option value="morning">Morning (8AM - 12PM)</option>
                                <option value="afternoon">Afternoon (12PM - 5PM)</option>
                                <option value="evening">Evening (5PM - 8PM)</option>
                                <option value="other">Other Times</option>
                            </select>
                        </div>

                        {/* Clear Filters Button */}
                        <div className="flex flex-col">
                            <label className="text-sm font-medium text-gray-700 mb-1 opacity-0">Clear</label>
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredAppointments.length} of {appointments.length} appointments
                    {selectedDoctorCard && ` (filtered by ${selectedDoctorCard})`}
                </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Patient Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Phone
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Age
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Doctor
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date & Time
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {!Array.isArray(filteredAppointments) || filteredAppointments.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12">
                                        <div className="flex justify-center items-center">
                                            <h2 className="text-xl font-semibold text-black bg-blue-300 bg-opacity-30 px-6 py-3 rounded-lg">
                                                {appointments.length === 0 ? 'No Data' : 'No appointments match your filters'}
                                            </h2>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAppointments.map((appointment, index) => (
                                    <tr key={appointment.id} className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                        <span className="text-blue-600 font-medium text-sm">
                                                            {appointment.name?.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {appointment.name}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{appointment.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{appointment.age}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{appointment.location}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{appointment.doctor}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                <div className="font-medium">{appointment.date}</div>
                                                <div className="text-gray-500">{appointment.time}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                appointment.status === 'approved' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : appointment.status === 'declined'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {appointment.status || 'pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {appointment.status === 'pending' && (
                                                <div className="flex space-x-2">
                                                    <button 
                                                        onClick={() => handleApprove(appointment.id)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                                                    >
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Approve
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDecline(appointment.id)}
                                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                                    >
                                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Decline
                                                    </button>
                                                </div>
                                            )}
                                            {appointment.status === 'approved' && (
                                                <div className="flex items-center text-green-600">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-sm font-medium">Approved</span>
                                                </div>
                                            )}
                                            {appointment.status === 'declined' && (
                                                <div className="flex items-center text-red-600">
                                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <span className="text-sm font-medium">Declined</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Index
