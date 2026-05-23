import { useState } from 'react';
import PropTypes from 'prop-types';
import { X, Phone, Mail, MapPin, Calendar, CheckCircle, Clock, Award, Star, MessageCircle } from 'lucide-react';
import AppointmentChat from '../../../components/chat/AppointmentChat.jsx';

const PatientModal = ({ 
  isUserModalOpen, 
  closeUserModal, 
  selectedUser, 
  doctorData, 
  handleAppointmentAction 
}) => {


  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'chat'

  // Defer conditional return until after hooks to satisfy Rules of Hooks

  if (!isUserModalOpen || !selectedUser) return null;

  const appointmentId = selectedUser.id || selectedUser._id
    ? String(selectedUser.id || selectedUser._id)
    : null;

  return (
    <>
      {/* Patient Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
            <button 
              onClick={closeUserModal}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 pt-6">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-4 py-2 -mb-px border-b-2 font-medium ${
                  activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('details')}
              >
                Details
              </button>
              <button
                className={`ml-6 px-4 py-2 -mb-px border-b-2 font-medium ${
                  activeTab === 'chat' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setActiveTab('chat')}
              >
                Messages
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Left Column - Patient Info */}
              <div className="space-y-6">
                {/* Patient Header */}
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 text-white font-bold text-xl shadow-md">
                    {selectedUser.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedUser.name || 'N/A'}</h3>
                    <p className="text-gray-600">Patient ID: {selectedUser.id || selectedUser._id || 'N/A'}</p>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                        <Phone size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Phone Number</p>
                        <p className="font-medium text-gray-900">{selectedUser.phone || selectedUser.number || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                        <Mail size={16} className="text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Email Address</p>
                        <p className="font-medium text-wrap text-gray-900">{selectedUser.email || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mr-3">
                        <MapPin size={16} className="text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Location</p>
                        <p className="font-medium text-gray-900">{selectedUser.location || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                        <Calendar size={16} className="text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Age</p>
                        <p className="font-medium text-gray-900">{selectedUser.age ? `${selectedUser.age} years` : 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center mr-3">
                        <CheckCircle size={16} className="text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Current Status</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          selectedUser.status === 'approved' 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : selectedUser.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : selectedUser.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : selectedUser.status === 'declined'
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {selectedUser.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Appointment & Doctor Info */}
              <div className="space-y-6">
                {/* Appointment Details */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center mr-3">
                        <Calendar size={16} className="text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Appointment Date</p>
                        <p className="font-medium text-gray-900">{selectedUser.date || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
                        <Clock size={16} className="text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Appointment Time</p>
                        <p className="font-medium text-gray-900">{selectedUser.time || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center mr-3">
                        <CheckCircle size={16} className="text-teal-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Created On</p>
                        <p className="font-medium text-gray-900">
                          {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Doctor Information */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Doctor Information</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mr-3">
                        <Award size={16} className="text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Doctor Name</p>
                        <p className="font-medium text-gray-900">{selectedUser.doctorName || doctorData.name || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-yellow-50 rounded-lg flex items-center justify-center mr-3">
                        <Star size={16} className="text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Specialization</p>
                        <p className="font-medium text-gray-900">{selectedUser.doctorSpecialization || doctorData.specialization || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedUser.status === 'pending' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Actions</h4>
                    <div className="flex space-x-3">
                      <button 
                        onClick={() => {
                          handleAppointmentAction(selectedUser.id || selectedUser._id, 'approve');
                          closeUserModal();
                        }}
                        className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Approve
                      </button>
                      <button 
                        onClick={() => {
                          handleAppointmentAction(selectedUser.id || selectedUser._id, 'decline');
                          closeUserModal();
                        }}
                        className="flex-1 flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                      >
                        <X size={16} className="mr-2" />
                        Decline
                      </button>
                    </div>
                  </div>
                )}

                {/* Message Button */}
                <button 
                  onClick={() => setActiveTab('chat')}
                  className="w-full mt-4 flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <MessageCircle size={16} className="mr-2" />
                  Message
                </button>

              </div>
              {/* end grid container */}
            </div>
            )}

            {activeTab === 'chat' && (
              <AppointmentChat
                appointmentId={appointmentId}
                currentRole="doctor"
                currentUserId={doctorData?._id || doctorData?.id}
                currentUserName={doctorData?.name || 'Doctor'}
                doctorId={doctorData?._id || doctorData?.id}
                title={selectedUser.name || 'Patient'}
                subtitle={`${selectedUser.date || ''}${selectedUser.time ? ` at ${selectedUser.time}` : ''}`.trim()}
                compact
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientModal;
PatientModal.propTypes = {
  isUserModalOpen: PropTypes.bool.isRequired,
  closeUserModal: PropTypes.func.isRequired,
  selectedUser: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    phone: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    email: PropTypes.string,
    location: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    status: PropTypes.string,
    date: PropTypes.string,
    time: PropTypes.string,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.instanceOf(Date),
    ]),
    doctorName: PropTypes.string,
    doctorSpecialization: PropTypes.string,
  }).isRequired,
  doctorData: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    specialization: PropTypes.string,
  }),
  handleAppointmentAction: PropTypes.func.isRequired,
};
