import React from 'react';
import { Eye, Phone, MapPin, Video, ExternalLink, Calendar } from 'lucide-react';

const AppointmentsTab = ({
  doctorAppointments,
  appointmentsLoading,
  appointmentsError,
  fetchDoctorAppointments,
  handleAppointmentActionForAppointments,
  handleGenerateVideoCall
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Appointments</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Total: {doctorAppointments.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Pending: {doctorAppointments.filter(a => a.status === 'pending').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Confirmed: {doctorAppointments.filter(a => a.status === 'confirmed').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Approved: {doctorAppointments.filter(a => a.status === 'approved').length}</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={fetchDoctorAppointments}
          disabled={appointmentsLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium whitespace-nowrap"
        >
          {appointmentsLoading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <Eye size={16} />
          )}
          {appointmentsLoading ? 'Loading...' : 'Refresh Appointments'}
        </button>
      </div>
      
      {appointmentsLoading ? (
        <div className="text-center py-12">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading appointments...</p>
        </div>
      ) : appointmentsError ? (
        <div className="text-center py-12 text-red-600">
          <p>{appointmentsError}</p>
          <button 
            onClick={fetchDoctorAppointments}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
          >
            Retry
          </button>
        </div>
      ) : doctorAppointments.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-4 px-6 font-semibold text-gray-700 rounded-l-xl">PATIENT</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">CONTACT</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">DETAILS</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">APPOINTMENT</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">STATUS</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700">VIDEO CALL</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-700 rounded-r-xl">ACTIONS</th>
            </tr>
            </thead>
            <tbody>
              {doctorAppointments.map((appointment) => (
                <tr key={appointment._id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 text-white font-bold shadow-md">
                        {appointment.patientName?.split(' ').map(n => n[0]).join('') || 'N/A'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {appointment.patientName || 'N/A'}
                        </div>
                        {/* <div className="text-sm text-gray-500">
                          {appointment.patientAge} years
                        </div> */}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone size={12} className="mr-2 text-green-500" />
                        {appointment.patientPhone || 'N/A'}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={12} className="mr-2 text-red-500" />
                        {appointment.patientLocation || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600">
                    <div className="text-sm">
                      <div>Age: {appointment.patientAge}</div>
                      <div className="text-gray-500 truncate max-w-32">
                        {appointment.patientLocation || 'Location not specified'}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">{appointment.date}</div>
                      <div className="text-gray-500">{appointment.time}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      appointment.status === 'approved' 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : appointment.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : appointment.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {appointment.videoCallGenerated && appointment.videoCallLink ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs text-green-600 font-medium">Available</span>
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {appointment.videoCallId}
                        </div>
                        <button
                          onClick={() => window.open(appointment.videoCallLink, '_blank')}
                          className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                        >
                          <Video size={12} />
                          <span>Join</span>
                          <ExternalLink size={10} />
                        </button>
                      </div>
                    ) : appointment.status === 'approved' ? (
                      <span className="text-xs text-yellow-600">Generating...</span>
                    ) : appointment.status === 'confirmed' && !appointment.videoCallGenerated ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                          <span className="text-xs text-yellow-600 font-medium">Confirmed</span>
                        </div>
                        <button
                          onClick={() => handleGenerateVideoCall(appointment._id)}
                          className="flex items-center space-x-1 px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
                        >
                          <Video size={12} />
                          <span>Generate Link</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">Not available</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    {appointment.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleAppointmentActionForAppointments(appointment._id, 'approve')}
                          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                        >
                          <span className="mr-1">✓</span>
                          Approve
                        </button>
                        <button 
                          onClick={() => handleAppointmentActionForAppointments(appointment._id, 'decline')}
                          className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
                        >
                          <span className="mr-1">✗</span>
                          Decline
                        </button>
                      </div>
                    ) : appointment.status === 'confirmed' ? (
                      <span className="flex items-center text-sm font-medium text-blue-600">
                        <span className="mr-1">✓</span>
                        Confirmed
                      </span>
                    ) : (
                      <span className={`flex items-center text-sm font-medium ${
                        appointment.status === 'approved' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span className="mr-1">{appointment.status === 'approved' ? '✓' : '✗'}</span>
                        {appointment.status === 'approved' ? 'Approved' : 'Declined'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments scheduled</h3>
          <p className="text-gray-600">Appointments will appear here once patients book sessions with you.</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTab;

