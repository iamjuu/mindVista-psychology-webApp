import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Calendar, TrendingUp, TrendingDown, Mail, Phone, MapPin, Clock, Award, Star, LogOut } from 'lucide-react';
import apiInstance from '../../instance';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState({});
  const [incomeData, setIncomeData] = useState({});
  const [patientsList, setPatientsList] = useState([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('monthly');
  const [patientRequests, setPatientRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [profileRefreshing, setProfileRefreshing] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isDoctorLoggedIn');
    const doctorDataFromStorage = localStorage.getItem('doctorData');
    
    if (!isLoggedIn || !doctorDataFromStorage) {
      navigate('/docter/login');
      return;
    }
    
    try {
      const parsedDoctorData = JSON.parse(doctorDataFromStorage);
      setDoctorData(parsedDoctorData);
    } catch (error) {
      console.error('Error parsing doctor data:', error);
      navigate('/docter/login');
    }
    
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('isDoctorLoggedIn');
    localStorage.removeItem('doctorData');
    navigate('/docter/login');
  };

  // Default income data structure
  const defaultIncomeData = {
    daily: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
    dailyGrowth: 0,
    weeklyGrowth: 0,
    monthlyGrowth: 0,
    yearlyGrowth: 0,
    monthlyChart: [
      { name: 'Jan', income: 0 },
      { name: 'Feb', income: 0 },
      { name: 'Mar', income: 0 },
      { name: 'Apr', income: 0 },
      { name: 'May', income: 0 },
      { name: 'Jun', income: 0 },
    ],
    weeklyChart: [
      { name: 'Mon', income: 0 },
      { name: 'Tue', income: 0 },
      { name: 'Wed', income: 0 },
      { name: 'Thu', income: 0 },
      { name: 'Fri', income: 0 },
      { name: 'Sat', income: 0 },
      { name: 'Sun', income: 0 },
    ]
  };

  // Default patients data structure
  const defaultPatientsList = [];

  // Default appointments data structure
  const defaultAppointmentsList = [];

  // Function to fetch patient requests from API
  const fetchPatientRequests = async () => {
    setRequestsLoading(true);
    try {
      const response = await apiInstance.get('/request-pateint');
      console.log('Patient requests fetched:', response.data);
      
      if (response.data.success) {
        setPatientRequests(response.data.data || []);
      } else {
        console.error('Failed to fetch patient requests:', response.data.message);
        setPatientRequests([]);
      }
    } catch (error) {
      console.error('Error fetching patient requests:', error);
      setPatientRequests([]);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Function to fetch doctor profile data from API
  const fetchDoctorProfile = async () => {
    setProfileRefreshing(true);
    try {
      const doctorId = doctorData._id;
      if (!doctorId) {
        console.log('No doctor ID available, using stored data');
        return;
      }

      const response = await apiInstance.get(`/doctors/${doctorId}`);
      console.log('Doctor profile fetched:', response.data);
      
      if (response.data.success) {
        const updatedDoctorData = response.data.doctor;
        setDoctorData(updatedDoctorData);
        // Update localStorage with fresh data
        localStorage.setItem('doctorData', JSON.stringify(updatedDoctorData));
      } else {
        console.error('Failed to fetch doctor profile:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    } finally {
      setProfileRefreshing(false);
    }
  };

  // Function to handle appointment approval
  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      const endpoint = action === 'approve' ? `/appointment/${appointmentId}/approve` : `/appointment/${appointmentId}/decline`;
      const method = 'PUT';
      
      const response = await apiInstance[method.toLowerCase()](endpoint);
      
      if (response.data.success) {
        console.log(`Appointment ${action}d successfully:`, response.data);
        // Refresh the patient requests after action
        await fetchPatientRequests();
      } else {
        console.error(`Failed to ${action} appointment:`, response.data.message);
      }
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
    }
  };

  useEffect(() => {
    const loadDoctorData = async () => {
      console.log('Loading doctor dashboard data...');
      setLoading(true);
      
      try {
        // Fetch fresh doctor profile data
        await fetchDoctorProfile();
        
        // Comment out this call temporarily to prevent errors
        // await fetchPatientRequests();
        
        // Set default data structures
        setIncomeData(defaultIncomeData);
        setPatientsList(defaultPatientsList);
        
        console.log('Doctor data loaded successfully:', doctorData);
        console.log('Income data loaded successfully:', defaultIncomeData);
        console.log('Patients list loaded successfully:', defaultPatientsList.length, 'patients');
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading doctor data:', error);
        setLoading(false);
      }
    };

    // Only run when component mounts, not on every doctorData change
    if (doctorData && Object.keys(doctorData).length > 0 && loading) {
      loadDoctorData();
    }
  }, []); // Empty dependency array to run only once

  // Income Cards Component
  const IncomeCard = ({ title, amount = 0, growth = 0, icon, bgColor, timeFrame }) => (
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
    amount: PropTypes.number,
    growth: PropTypes.number,
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
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchDoctorProfile}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                disabled={profileRefreshing}
              >
                {profileRefreshing ? (
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
                {profileRefreshing ? 'Refreshing Profile' : 'Refresh Profile'}
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
              {doctorData.profilePicture ? (
                <img 
                  src={doctorData.profilePicture} 
                  alt={doctorData.name} 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold text-blue-600">
                  {doctorData.name?.split(' ').map(n => n[0]).join('') || 'D'}
                </span>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{doctorData.name || 'Doctor Name'}</h1>
                <div className="flex items-center">
                  <Star className="text-yellow-400 fill-current" size={20} />
                  <span className="ml-1 text-lg font-semibold text-gray-700">{doctorData.rating || 0}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center text-gray-600">
                  <Mail size={18} className="mr-3 text-blue-500" />
                  <span>{doctorData.email || 'Email not available'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone size={18} className="mr-3 text-green-500" />
                  <span>{doctorData.phone || 'Phone not available'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin size={18} className="mr-3 text-red-500" />
                  <span>{doctorData.address || 'Address not available'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Award size={18} className="mr-3 text-purple-500" />
                  <span>{doctorData.specialization || 'Specialization not available'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock size={18} className="mr-3 text-orange-500" />
                  <span>{doctorData.experience ? `${doctorData.experience} years experience` : 'Experience not available'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users size={18} className="mr-3 text-indigo-500" />
                  <span>{doctorData.patients || 0} patients</span>
                </div>
              </div>
              
              {/* Additional doctor information */}
              {(doctorData.consultationFee || doctorData.availableSlots || doctorData.age || doctorData.gender) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {doctorData.consultationFee && (
                    <div className="flex items-center text-gray-600">
                      <DollarSign size={18} className="mr-3 text-green-500" />
                      <span>Consultation Fee: ₹{doctorData.consultationFee}</span>
                    </div>
                  )}
                  {doctorData.availableSlots && doctorData.availableSlots.length > 0 && (
                    <div className="flex items-center text-gray-600">
                      <Calendar size={18} className="mr-3 text-blue-500" />
                      <span>Available Slots: {doctorData.availableSlots.length} time slots</span>
                    </div>
                  )}
                  {doctorData.age && (
                    <div className="flex items-center text-gray-600">
                      <Users size={18} className="mr-3 text-indigo-500" />
                      <span>Age: {doctorData.age} years</span>
                    </div>
                  )}
                  {doctorData.gender && (
                    <div className="flex items-center text-gray-600">
                      <Users size={18} className="mr-3 text-pink-500" />
                      <span>Gender: {doctorData.gender}</span>
                    </div>
                  )}
                </div>
              )}
              
              <p className="text-gray-600 mb-4">{doctorData.bio || 'No bio available'}</p>
              
              <div className="flex flex-wrap gap-2">
                {doctorData.qualification ? (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {doctorData.qualification}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm">
                    Qualifications not available
                  </span>
                )}
                {doctorData.designation && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm">
                    {doctorData.designation}
                  </span>
                )}
                {doctorData.department && (
                  <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                    {doctorData.department}
                  </span>
                )}
              </div>
              
              {/* Available Time Slots */}
              {doctorData.availableSlots && doctorData.availableSlots.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Available Time Slots:</h4>
                  <div className="flex flex-wrap gap-2">
                    {doctorData.availableSlots.map((slot, index) => (
                      <span key={index} className="px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full text-sm">
                        {slot.day}: {slot.startTime} - {slot.endTime}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Join Date */}
              {doctorData.createdAt && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Member Since:</h4>
                  <span className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm">
                    {new Date(doctorData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              )}
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

        {/* Patient Requests Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Patient Requests</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Total: {patientRequests.length} requests
              </span>
              <span className="text-sm text-gray-600">
                Pending: {patientRequests.filter(r => r.status === 'pending').length}
              </span>
              <button 
                onClick={fetchPatientRequests}
                disabled={requestsLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {requestsLoading ? 'Refreshing...' : 'Load Patient Requests'}
              </button>
            </div>
          </div>
          
          {requestsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading patient requests...</p>
            </div>
          ) : patientRequests.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">PATIENT NAME</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">PHONE</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">AGE</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">LOCATION</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">SELECTED DOCTOR</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">DATE & TIME</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">STATUS</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patientRequests.map((request) => (
                      <tr key={request.id || request._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-blue-600 font-semibold text-sm">
                                {request.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">{request.name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{request.phone || request.number || 'N/A'}</td>
                        <td className="py-4 px-4 text-gray-600">{request.age || 'N/A'}</td>
                        <td className="py-4 px-4 text-gray-600">{request.location || 'N/A'}</td>
                        <td className="py-4 px-4 text-gray-600">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {request.doctorName || 'N/A'}
                            </div>
                            <div className="text-gray-500">
                              {request.doctorSpecialization || 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          <div>
                            <div className="font-medium">{request.date || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{request.time || 'N/A'}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            request.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : request.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'declined'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {request.status || 'pending'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          {request.status === 'pending' ? (
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => handleAppointmentAction(request.id || request._id, 'approve')}
                                className="flex items-center px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                              >
                                <span className="mr-1">✓</span>
                                Approve
                              </button>
                              <button 
                                onClick={() => handleAppointmentAction(request.id || request._id, 'decline')}
                                className="flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                              >
                                <span className="mr-1">✗</span>
                                Decline
                              </button>
                            </div>
                          ) : (
                            <span className="flex items-center text-green-600 text-sm">
                              <span className="mr-1">✓</span>
                              {request.status === 'approved' ? 'Approved' : 'Declined'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No patient requests loaded. Click &quot;Load Patient Requests&quot; to fetch data.</p>
            </div>
          )}
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">All Appointments</h2>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Total: {defaultAppointmentsList.length} appointments
              </span>
              <span className="text-sm text-gray-600">
                Pending: {defaultAppointmentsList.filter(a => a.status === 'pending').length}
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
                {defaultAppointmentsList.map((appointment) => (
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
          
          {defaultAppointmentsList.length === 0 && (
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