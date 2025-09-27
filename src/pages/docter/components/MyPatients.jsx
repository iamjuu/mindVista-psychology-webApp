import React from 'react';
import { Users, Calendar, MapPin, Phone, Mail } from 'lucide-react';
import { PageHeader } from '../../../components/core/cardHeader';

// Patient Card Component
const PatientCard = ({ patient }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 text-white font-bold shadow-md">
          {patient.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{patient.name}</h3>
          <p className="text-sm text-gray-500">{patient.age} years old</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        patient.status === 'active' 
          ? 'bg-green-100 text-green-800 border border-green-200' 
          : 'bg-gray-100 text-gray-800 border border-gray-200'
      }`}>
        {patient.status}
      </span>
    </div>
    
    <div className="space-y-3">
      <div className="flex items-center text-sm text-gray-600">
        <Mail size={14} className="mr-2 text-blue-500" />
        <span className="truncate">{patient.email}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Phone size={14} className="mr-2 text-green-500" />
        <span>{patient.phone}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <MapPin size={14} className="mr-2 text-red-500" />
        <span className="truncate">{patient.location}</span>
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Calendar size={14} className="mr-2 text-purple-500" />
        <span>Joined: {new Date(patient.joinDate).toLocaleDateString()}</span>
      </div>
    </div>
    
    <div className="mt-4 pt-4 border-t border-gray-100">
      <div className="flex justify-between text-sm">
        <div>
          <p className="text-gray-500">Total Sessions</p>
          <p className="font-semibold text-gray-900">{patient.totalSessions}</p>
        </div>
        <div>
          <p className="text-gray-500">Total Paid</p>
          <p className="font-semibold text-gray-900">₹{patient.totalPaid.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Next Appointment</p>
          <p className="font-semibold text-gray-900">
            {patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString() : 'Not scheduled'}
          </p>
        </div>
      </div>
    </div>
  </div>
);

const MyPatients = ({ patientsList }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6  gap-4">
        <div>
          {/* <h1 className="text-[22px] font-medium text-gray-800">My Patients</h1> */}
          <PageHeader
          title='My patients'
          />
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Total: {patientsList.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Active: {patientsList.filter(p => p.status === 'active').length}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {patientsList.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))}
      </div>
      
      {patientsList.length === 0 && (
        <div className="text-center py-12">  
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients yet</h3>
          <p className="text-gray-600">Your patient list will appear here as you start treating patients.</p>
        </div>
      )}
    </div>
  );
};

export default MyPatients;

