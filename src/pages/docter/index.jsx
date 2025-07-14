import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Calendar, TrendingUp, TrendingDown, Mail, Phone, MapPin, Clock, Award, Star } from 'lucide-react';

const DoctorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState({});
  const [incomeData, setIncomeData] = useState({});
  const [patientsList, setPatientsList] = useState([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('monthly');

  // Mock doctor data - replace with API call
  const mockDoctorData = {
    id: 1,
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@mindvista.com',
    phone: '+1 (555) 123-4567',
    specialization: 'Clinical Psychology',
    experience: '8 years',
    location: 'New York, NY',
    rating: 4.8,
    totalPatients: 156,
    joinDate: '2020-01-15',
    profileImage: '/api/placeholder/150/150',
    bio: 'Specialized in cognitive behavioral therapy and anxiety disorders. Helping patients achieve better mental health for over 8 years.',
    qualifications: ['PhD in Clinical Psychology', 'Licensed Clinical Psychologist', 'CBT Certified Therapist']
  };

  // Mock income data
  const mockIncomeData = {
    daily: 850,
    weekly: 5950,
    monthly: 23800,
    yearly: 285600,
    dailyGrowth: 5.2,
    weeklyGrowth: 12.3,
    monthlyGrowth: 8.7,
    yearlyGrowth: 15.4,
    monthlyChart: [
      { name: 'Jan', income: 18000 },
      { name: 'Feb', income: 20000 },
      { name: 'Mar', income: 22000 },
      { name: 'Apr', income: 19000 },
      { name: 'May', income: 25000 },
      { name: 'Jun', income: 23800 },
    ],
    weeklyChart: [
      { name: 'Mon', income: 850 },
      { name: 'Tue', income: 920 },
      { name: 'Wed', income: 760 },
      { name: 'Thu', income: 1100 },
      { name: 'Fri', income: 980 },
      { name: 'Sat', income: 1200 },
      { name: 'Sun', income: 1140 },
    ]
  };

  // Mock patients data
  const mockPatientsList = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 234-5678',
      age: 34,
      location: 'Brooklyn, NY',
      joinDate: '2024-01-15',
      lastAppointment: '2024-01-20',
      totalSessions: 8,
      status: 'active',
      nextAppointment: '2024-01-27',
      totalPaid: 1200
    },
    {
      id: 2,
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1 (555) 345-6789',
      age: 28,
      location: 'Manhattan, NY',
      joinDate: '2024-01-10',
      lastAppointment: '2024-01-18',
      totalSessions: 12,
      status: 'active',
      nextAppointment: '2024-01-25',
      totalPaid: 1800
    },
    {
      id: 3,
      name: 'Michael Johnson',
      email: 'michael.johnson@email.com',
      phone: '+1 (555) 456-7890',
      age: 42,
      location: 'Queens, NY',
      joinDate: '2024-01-05',
      lastAppointment: '2024-01-22',
      totalSessions: 15,
      status: 'completed',
      nextAppointment: null,
      totalPaid: 2250
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+1 (555) 567-8901',
      age: 31,
      location: 'Bronx, NY',
      joinDate: '2024-01-12',
      lastAppointment: '2024-01-19',
      totalSessions: 6,
      status: 'active',
      nextAppointment: '2024-01-26',
      totalPaid: 900
    },
    {
      id: 5,
      name: 'David Brown',
      email: 'david.brown@email.com',
      phone: '+1 (555) 678-9012',
      age: 39,
      location: 'Staten Island, NY',
      joinDate: '2024-01-08',
      lastAppointment: '2024-01-21',
      totalSessions: 10,
      status: 'active',
      nextAppointment: '2024-01-28',
      totalPaid: 1500
    }
  ];

  // Mock appointments data
  const mockAppointmentsList = [
    {
      id: 1,
      name: 'John Smith',
      phone: '+1 (555) 234-5678',
      age: 34,
      location: 'Brooklyn, NY',
      date: '2024-01-27',
      time: '09:00 AM',
      status: 'pending'
    },
    {
      id: 2,
      name: 'Emily Davis',
      phone: '+1 (555) 345-6789',
      age: 28,
      location: 'Manhattan, NY',
      date: '2024-01-25',
      time: '10:30 AM',
      status: 'approved'
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      phone: '+1 (555) 567-8901',
      age: 31,
      location: 'Bronx, NY',
      date: '2024-01-26',
      time: '02:00 PM',
      status: 'pending'
    },
    {
      id: 4,
      name: 'David Brown',
      phone: '+1 (555) 678-9012',
      age: 39,
      location: 'Staten Island, NY',
      date: '2024-01-28',
      time: '11:15 AM',
      status: 'approved'
    },
    {
      id: 5,
      name: 'Lisa Anderson',
      phone: '+1 (555) 789-0123',
      age: 26,
      location: 'Queens, NY',
      date: '2024-01-29',
      time: '03:30 PM',
      status: 'pending'
    }
  ];

  useEffect(() => {
    const loadDoctorData = async () => {
      console.log('Loading doctor dashboard data...');
      setLoading(true);
      
      try {
        // Simulate API call
        setTimeout(() => {
          console.log('Doctor data loaded successfully:', mockDoctorData);
          console.log('Income data loaded successfully:', mockIncomeData);
          console.log('Patients list loaded successfully:', mockPatientsList.length, 'patients');
          
          setDoctorData(mockDoctorData);
          setIncomeData(mockIncomeData);
          setPatientsList(mockPatientsList);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading doctor data:', error);
        setLoading(false);
      }
    };

    loadDoctorData();
  }, []);

  // Income Cards Component
  const IncomeCard = ({ title, amount, growth, icon, bgColor, timeFrame }) => (
    <div className={`p-6 rounded-xl shadow-lg ${bgColor} text-white relative overflow-hidden`}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-lg">
            {icon}
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80">{title}</p>
            <p className="text-2xl font-bold">₹{amount.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {growth > 0 ? (
              <TrendingUp size={16} className="text-green-300" />
            ) : (
              <TrendingDown size={16} className="text-red-300" />
            )}
            <span className="ml-2 text-sm">
              {growth > 0 ? '+' : ''}{growth}%
            </span>
          </div>
          <span className="text-xs opacity-70">vs last {timeFrame}</span>
        </div>
      </div>
    </div>
  );

  IncomeCard.propTypes = {
    title: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    growth: PropTypes.number.isRequired,
    icon: PropTypes.element.isRequired,
    bgColor: PropTypes.string.isRequired,
    timeFrame: PropTypes.string.isRequired
  };

  // Patient Card Component
  const PatientCard = ({ patient }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{patient.name}</h3>
            <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
              patient.status === 'active' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {patient.status}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Mail size={14} className="mr-2" />
                {patient.email}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Phone size={14} className="mr-2" />
                {patient.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={14} className="mr-2" />
                {patient.location}
              </div>
            </div>
            
            <div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Users size={14} className="mr-2" />
                Age: {patient.age}
              </div>
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Calendar size={14} className="mr-2" />
                Sessions: {patient.totalSessions}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <DollarSign size={14} className="mr-2" />
                Total: ₹{patient.totalPaid.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="text-gray-600">
              <span className="font-medium">Last Session:</span> {patient.lastAppointment}
            </div>
            {patient.nextAppointment && (
              <div className="text-blue-600 font-medium">
                Next: {patient.nextAppointment}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  PatientCard.propTypes = {
    patient: PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      age: PropTypes.number.isRequired,
      location: PropTypes.string.isRequired,
      joinDate: PropTypes.string.isRequired,
      lastAppointment: PropTypes.string.isRequired,
      totalSessions: PropTypes.number.isRequired,
      status: PropTypes.string.isRequired,
      nextAppointment: PropTypes.string,
      totalPaid: PropTypes.number.isRequired
    }).isRequired
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading doctor dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-4xl font-bold text-blue-600">
                {doctorData.name?.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{doctorData.name}</h1>
                <div className="flex items-center">
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <span className="ml-1 text-lg font-semibold text-gray-700">{doctorData.rating}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <Mail size={18} className="mr-3 text-blue-500" />
                  <span>{doctorData.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone size={18} className="mr-3 text-green-500" />
                  <span>{doctorData.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-3 text-red-500" />
                  <span>{doctorData.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Award size={18} className="mr-3 text-purple-500" />
                  <span>{doctorData.specialization}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock size={18} className="mr-3 text-orange-500" />
                  <span>{doctorData.experience} experience</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users size={18} className="mr-3 text-indigo-500" />
                  <span>{doctorData.totalPatients} patients</span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">{doctorData.bio}</p>
              
              <div className="flex flex-wrap gap-2">
                {doctorData.qualifications?.map((qual, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {qual}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Income Statistics Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Income Statistics</h2>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">View:</label>
              <select 
                value={selectedTimeFrame} 
                onChange={(e) => setSelectedTimeFrame(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <IncomeCard
              title="Daily Income"
              amount={incomeData.daily}
              growth={incomeData.dailyGrowth}
              icon={<DollarSign size={24} />}
              bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
              timeFrame="day"
            />
            <IncomeCard
              title="Weekly Income"
              amount={incomeData.weekly}
              growth={incomeData.weeklyGrowth}
              icon={<TrendingUp size={24} />}
              bgColor="bg-gradient-to-r from-green-500 to-green-600"
              timeFrame="week"
            />
            <IncomeCard
              title="Monthly Income"
              amount={incomeData.monthly}
              growth={incomeData.monthlyGrowth}
              icon={<Calendar size={24} />}
              bgColor="bg-gradient-to-r from-purple-500 to-purple-600"
              timeFrame="month"
            />
            <IncomeCard
              title="Yearly Income"
              amount={incomeData.yearly}
              growth={incomeData.yearlyGrowth}
              icon={<Award size={24} />}
              bgColor="bg-gradient-to-r from-orange-500 to-orange-600"
              timeFrame="year"
            />
          </div>
        </div>

        {/* Income Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedTimeFrame === 'daily' ? 'Daily' : 
             selectedTimeFrame === 'weekly' ? 'Weekly' : 
             selectedTimeFrame === 'monthly' ? 'Monthly' : 'Yearly'} Income Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={selectedTimeFrame === 'weekly' ? incomeData.weeklyChart : incomeData.monthlyChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Income']}
                labelFormatter={(label) => `${selectedTimeFrame === 'weekly' ? 'Day' : 'Month'}: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Appointments</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Total: {mockAppointmentsList.length} appointments
              </span>
              <span className="text-sm text-gray-600">
                Pending: {mockAppointmentsList.filter(a => a.status === 'pending').length}
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">PATIENT NAME</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">PHONE</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">AGE</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">LOCATION</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">DATE & TIME</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">STATUS</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {mockAppointmentsList.map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-blue-600 font-semibold text-sm">
                            {appointment.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{appointment.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{appointment.phone}</td>
                    <td className="py-4 px-4 text-gray-600">{appointment.age}</td>
                    <td className="py-4 px-4 text-gray-600">{appointment.location}</td>
                    <td className="py-4 px-4 text-gray-600">
                      <div>
                        <div className="font-medium">{appointment.date}</div>
                        <div className="text-sm text-gray-500">{appointment.time}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : appointment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {appointment.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button className="flex items-center px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                            <span className="mr-1">✓</span>
                            Approve
                          </button>
                          <button className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm">
                            <span className="mr-1">✗</span>
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="flex items-center text-green-600 text-sm">
                          <span className="mr-1">✓</span>
                          {appointment.status === 'approved' ? 'Approved' : 'Declined'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {mockAppointmentsList.length === 0 && (
            <div className="text-center py-8">
              <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No appointments scheduled</p>
            </div>
          )}
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">My Patients</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Total: {patientsList.length} patients
              </span>
              <span className="text-sm text-gray-600">
                Active: {patientsList.filter(p => p.status === 'active').length}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            {patientsList.map((patient) => (
              <PatientCard key={patient.id} patient={patient} />
            ))}
          </div>
          
          {patientsList.length === 0 && (
            <div className="text-center py-8">
              <Users size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No patients found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;