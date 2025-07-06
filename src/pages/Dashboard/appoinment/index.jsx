import { useEffect, useState } from 'react'
import apiInstance from '../../../instance'

const Index = () => {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        console.log('Appointment component mounted, fetching appointments...')
        fetchAppointments()
    }, [])

    const fetchAppointments = async () => {
        try {
            console.log('Starting to fetch appointments from API...')
            setLoading(true)
            const response = await apiInstance.get('/appoiment')
            console.log('Appointments fetched successfully:', response.data)
            
            // Ensure appointments is always an array
            const appointmentsData = Array.isArray(response.data) ? response.data : []
            console.log('Processed appointments data:', appointmentsData)
            setAppointments(appointmentsData)
        } catch (err) {
            console.error('Error fetching appointments:', err)
            setError('Failed to fetch appointments')
            setAppointments([]) // Set empty array on error
        } finally {
            console.log('Finished fetching appointments, loading state set to false')
            setLoading(false)
        }
    }

    const handleApprove = async (appointmentId) => {
        try {
            console.log(`Approving appointment with ID: ${appointmentId}`)
            await apiInstance.put(`/appoiment/${appointmentId}/approve`)
            console.log(`Appointment ${appointmentId} approved successfully`)
            setAppointments(prev => 
                prev.map(appointment => 
                    appointment.id === appointmentId 
                        ? { ...appointment, status: 'approved' }
                        : appointment
                )
            )
        } catch (err) {
            console.error('Error approving appointment:', err)
        }
    }

    const handleDecline = async (appointmentId) => {
        try {
            console.log(`Declining appointment with ID: ${appointmentId}`)
            await apiInstance.put(`/appoiment/${appointmentId}/decline`)
            console.log(`Appointment ${appointmentId} declined successfully`)
            setAppointments(prev => 
                prev.map(appointment => 
                    appointment.id === appointmentId 
                        ? { ...appointment, status: 'declined' }
                        : appointment
                )
            )
        } catch (err) {
            console.error('Error declining appointment:', err)
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
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointments</h1>
                <p className="text-gray-600">Manage patient appointments</p>
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
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {!Array.isArray(appointments) || appointments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12">
                                        <div className="flex justify-center items-center">
                                            <h2 className="text-xl font-semibold text-black bg-blue-300 bg-opacity-30 px-6 py-3 rounded-lg">
                                                No Data
                                            </h2>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                appointments.map((appointment, index) => (
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