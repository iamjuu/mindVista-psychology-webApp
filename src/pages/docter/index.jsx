import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, Users, Calendar, TrendingUp, TrendingDown, Mail, Phone, MapPin, Award, Star, LogOut, Menu, X, Filter, Search, Download, Bell, Settings, Eye, Clock, CheckCircle, Video, ExternalLink } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiInstance from '../../instance';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/shadcn/select';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [doctorData, setDoctorData] = useState({});
  const [incomeData, setIncomeData] = useState({});
  const [patientsList, setPatientsList] = useState([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('monthly');
  const [patientRequests, setPatientRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [profileRefreshing, setProfileRefreshing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTab, setSelectedTab] = useState('overview');
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [appointmentsLoading, setAppointmentsLoading] = useState(false);
  const [appointmentsError, setAppointmentsError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null); // State for selected user data
  const [isUserModalOpen, setIsUserModalOpen] = useState(false); // State for modal visibility

  // Get email from URL parameters
  const email = searchParams.get('email');
  console.log(email,'mail ee');

  // Mock API instance for demo
useEffect(()=>{
  console.log(email,'mail ee');

  const getDocter = async()=>{
    const response = await apiInstance.get(`/doctors/email/${encodeURIComponent(email)}`);
    console.log(response.data,'response');
  }
  getDocter();
},[email])
  // Check authentication on component mount
  useEffect(() => {
    // Check if email is provided, if not redirect to login
    if (!email) {
      console.log('No email provided, redirecting to login');
      navigate('/docter/login');
      return;
    }
    
    // Mock authentication check
    const mockDoctorData = {
      _id: 'doc123',
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@hospital.com',
      phone: '+1 (555) 123-4567',
      address: '123 Medical Center Dr, Healthcare City, HC 12345',
      specialization: 'Cardiology',
      experience: 15,
      patients: 247,
      rating: 4.8,
      bio: 'Experienced cardiologist with over 15 years of practice. Specializing in interventional cardiology and heart disease prevention.',
      qualification: 'MD, FACC',
      designation: 'Senior Cardiologist',
      department: 'Cardiology Department',
      consultationFee: 150,
      age: 42,
      gender: 'Female',
      availableSlots: [
        { day: 'Monday', startTime: '09:00', endTime: '17:00' },
        { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
        { day: 'Wednesday', startTime: '09:00', endTime: '15:00' }
      ],
      createdAt: '2020-01-15T00:00:00.000Z'
    };
    
    setDoctorData(mockDoctorData);
    setLoading(false);
  }, [navigate, email]);

  const handleLogout = () => {
    localStorage.removeItem('isDoctorLoggedIn');
    localStorage.removeItem('doctorData');
    navigate('/docter/login');
  };

  // Default income data structure
  const defaultIncomeData = {
    daily: 1250,
    weekly: 8750,
    monthly: 35000,
    yearly: 420000,
    dailyGrowth: 5.2,
    weeklyGrowth: 12.8,
    monthlyGrowth: 8.5,
    yearlyGrowth: 15.3,
    monthlyChart: [
      { name: 'Jan', income: 25000 },
      { name: 'Feb', income: 28000 },
      { name: 'Mar', income: 32000 },
      { name: 'Apr', income: 30000 },
      { name: 'May', income: 35000 },
      { name: 'Jun', income: 38000 },
    ],
    weeklyChart: [
      { name: 'Mon', income: 1200 },
      { name: 'Tue', income: 1500 },
      { name: 'Wed', income: 1100 },
      { name: 'Thu', income: 1800 },
      { name: 'Fri', income: 1400 },
      { name: 'Sat', income: 900 },
      { name: 'Sun', income: 750 },
    ]
  };

  // Mock patients data
  const defaultPatientsList = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 987-6543',
      age: 45,
      location: 'New York, NY',
      joinDate: '2023-01-15',
      lastAppointment: '2024-08-10',
      totalSessions: 12,
      status: 'active',
      nextAppointment: '2024-08-20',
      totalPaid: 18000
    },
    {
      id: 2,
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '+1 (555) 456-7890',
      age: 38,
      location: 'Los Angeles, CA',
      joinDate: '2023-03-22',
      lastAppointment: '2024-08-12',
      totalSessions: 8,
      status: 'active',
      nextAppointment: '2024-08-25',
      totalPaid: 12000
    }
  ];

  // Function to fetch doctor appointments
  const fetchDoctorAppointments = async () => {
    if (!doctorData._id) {
      console.log('No doctor ID available, cannot fetch appointments');
      return;
    }

    console.log('Fetching appointments for doctor:', doctorData._id);
    setAppointmentsLoading(true);
    setAppointmentsError(null); // Clear previous errors
    try {
      const response = await apiInstance.get(`/doctor/${doctorData._id}/appointments`);
      console.log('Doctor appointments fetched:', response.data);
      
      if (response.data.success) {
        // Transform the data to match the expected format
        const transformedAppointments = response.data.data.map(appointment => ({
          ...appointment,
          patientName: appointment.name,
          patientAge: appointment.age,
          patientPhone: appointment.phone || appointment.number,
          patientLocation: appointment.location
        }));
        console.log('Transformed appointments:', transformedAppointments);
        setDoctorAppointments(transformedAppointments);
      } else {
        console.error('Failed to fetch doctor appointments:', response.data.message);
        setAppointmentsError(response.data.message || 'Failed to fetch appointments');
        setDoctorAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      setAppointmentsError('Failed to connect to server or fetch appointments.');
      setDoctorAppointments([]);
    } finally {
      setAppointmentsLoading(false);
    }
  };

  // Function to fetch patient requests from API
  const fetchPatientRequests = async () => {
    setRequestsLoading(true);
    try {
      // If we have a doctor ID, fetch only appointments for this doctor
      if (doctorData._id) {
        const response = await apiInstance.get(`/doctor/${doctorData._id}/appointments`);
        console.log('Patient requests fetched for doctor:', response.data);
        
        if (response.data.success) {
          // Transform the data to match frontend expectations
          const transformedRequests = response.data.data.map(request => ({
            id: request._id,
            _id: request._id,
            name: request.name,
            phone: request.phone,
            number: request.phone, // Alternative field name
            age: request.age,
            location: request.location,
            doctor: request.doctor,
            doctorName: doctorData.name || 'N/A',
            doctorSpecialization: doctorData.specialization || 'N/A',
            status: request.status || 'pending',
            time: request.time,
            date: request.date,
            createdAt: request.createdAt,
            updatedAt: request.updatedAt
          }));
          setPatientRequests(transformedRequests);
        } else {
          console.error('Failed to fetch patient requests:', response.data.message);
          setPatientRequests([]);
        }
      } else {
        // Fallback to general patient requests if no doctor ID
        const response = await apiInstance.get('/request-pateint');
        console.log('Patient requests fetched:', response.data);
        
        if (response.data.success) {
          setPatientRequests(response.data.data || []);
        } else {
          console.error('Failed to fetch patient requests:', response.data.message);
          setPatientRequests([]);
        }
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
      if (!email) {
        console.log('No email available, using stored data');
        return;
      }

      console.log('Fetching doctor profile for email:', email);
      const response = await apiInstance.get(`/doctors/email/${encodeURIComponent(email)}`);
      console.log('Doctor profile fetched:', response.data);
      
      if (response.data.success) {
        const updatedDoctorData = response.data.doctor;
        console.log('Updated doctor data:', updatedDoctorData);
        console.log('Doctor ID:', updatedDoctorData._id);
        setDoctorData(updatedDoctorData);
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
        
        // Show success message with video call info for approvals
        if (action === 'approve') {
          const appointmentData = response.data.data;
          if (appointmentData.videoCallLink) {
            toast.success(`Appointment approved! Video call link has been generated and sent to the patient via email.`, {
              duration: 5000
            });
            
            // Show video call details
            setTimeout(() => {
              toast.info(`Video Call ID: ${appointmentData.videoCallId}`, {
                duration: 6000
              });
            }, 1000);
          } else {
            toast.success(`Appointment approved successfully!`);
          }
          
          // Show additional message about viewing sessions
          setTimeout(() => {
            toast.info(`Check "Today's Sessions" for today's appointments or "Upcoming" for future appointments.`, {
              duration: 8000
            });
          }, 2000);
        } else {
          toast.success(`Appointment declined. Email notification sent to the patient.`);
        }
        
        await fetchPatientRequests();
        await fetchDoctorAppointments(); // Refresh appointments after approval/decline
      } else {
        console.error(`Failed to ${action} appointment:`, response.data.message);
        toast.error(`Failed to ${action} appointment: ${response.data.message}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      toast.error(`Error ${action}ing appointment. Please try again.`);
    }
  };

  // Function to handle appointment actions for appointments tab
  const handleAppointmentActionForAppointments = async (appointmentId, action) => {
    try {
      const endpoint = action === 'approve' ? `/appointment/${appointmentId}/approve` : `/appointment/${appointmentId}/decline`;
      const method = 'PUT';
      
      const response = await apiInstance[method.toLowerCase()](endpoint);
      
      if (response.data.success) {
        console.log(`Appointment ${action}d successfully:`, response.data);
        
        // Show success message with video call info for approvals
        if (action === 'approve') {
          const appointmentData = response.data.data;
          if (appointmentData.videoCallLink) {
            toast.success(`Appointment approved! Video call link has been generated and sent to the patient via email.`, {
              duration: 5000
            });
            
            // Show video call details
            setTimeout(() => {
              toast.info(`Video Call ID: ${appointmentData.videoCallId}`, {
                duration: 6000
              });
            }, 1000);
          } else {
            toast.success(`Appointment approved successfully!`);
          }
          
          // Show additional message about viewing sessions
          setTimeout(() => {
            toast.info(`Check "Today's Sessions" for today's appointments or "Upcoming" for future appointments.`, {
              duration: 8000
            });
          }, 2000);
        } else {
          toast.success(`Appointment declined. Email notification sent to the patient.`);
        }
        
        await fetchPatientRequests();
        await fetchDoctorAppointments(); // Refresh appointments after approval/decline
      } else {
        console.error(`Failed to ${action} appointment:`, response.data.message);
        toast.error(`Failed to ${action} appointment: ${response.data.message}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      toast.error(`Error ${action}ing appointment. Please try again.`);
    }
  };

  // Function to generate video call link for confirmed appointments
  const handleGenerateVideoCall = async (appointmentId) => {
    try {
      const response = await apiInstance.put(`/appointment/${appointmentId}/generate-video-call`);
      
      if (response.data.success) {
        const appointmentData = response.data.data;
        toast.success(`Video call link generated successfully! Email sent to patient.`, {
          duration: 5000
        });
        
        // Show video call details
        setTimeout(() => {
          toast.info(`Video Call ID: ${appointmentData.videoCallId}`, {
            duration: 6000
          });
        }, 1000);
        
        await fetchDoctorAppointments(); // Refresh appointments
      } else {
        console.error('Failed to generate video call link:', response.data.message);
        toast.error(`Failed to generate video call link: ${response.data.message}`);
      }
    } catch (error) {
      console.error('Error generating video call link:', error);
      toast.error('Error generating video call link. Please try again.');
    }
  };

  // Function to handle user row click and open modal
  const handleUserRowClick = (user) => {
    alert(`Row clicked! Opening modal for: ${user.name}`); // Debug alert
    console.log('Row clicked! User data:', user); // Debug log
    console.log('Setting selectedUser to:', user); // Debug log
    setSelectedUser(user);
    setIsUserModalOpen(true);
    console.log('Modal should now be open. selectedUser:', user, 'isUserModalOpen:', true); // Debug log
  };

  // Function to close user modal
  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    const loadDoctorData = async () => {
      console.log('Loading doctor dashboard data...');
      setLoading(true);
      
      try {
        if (email) {
          await fetchDoctorProfile();
          await fetchDoctorAppointments(); // Fetch appointments when profile loads
        } else {
          // Fallback to stored data if no email
          const storedData = localStorage.getItem('doctorData');
          if (storedData) {
            setDoctorData(JSON.parse(storedData));
          }
        }
        
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

    loadDoctorData();
  }, [email]);

  // Load appointments when appointments tab is selected
  useEffect(() => {
    if (selectedTab === 'appointments' && doctorData._id && doctorAppointments.length === 0) {
      fetchDoctorAppointments();
    }
  }, [selectedTab, doctorData._id]);

  // Auto-refresh appointments when doctor data changes
  useEffect(() => {
    if (doctorData._id) {
      fetchDoctorAppointments();
    }
  }, [doctorData._id]);

  // Filter functions
  const filteredRequests = patientRequests.filter(request => {
    const matchesSearch = request.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         request.phone?.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Enhanced Income Card Component
  const IncomeCard = ({ title, amount = 0, growth = 0, icon, bgColor, timeFrame }) => (
    <div className={`group relative p-6 rounded-2xl shadow-lg ${bgColor} text-white transition-all duration-300 hover:shadow-xl hover:scale-105 overflow-hidden`}>
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16 transition-transform duration-300 group-hover:scale-110"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white bg-opacity-5 rounded-full -ml-12 -mb-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white bg-opacity-20 rounded-xl backdrop-blur-sm">
            {icon}
          </div>
          <div className="text-right">
            <p className="text-sm opacity-80 font-medium">{title}</p>
            <p className="text-3xl font-bold tracking-tight">₹{amount.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-white bg-opacity-10 rounded-lg px-3 py-1">
            {growth > 0 ? (
              <TrendingUp size={16} className="text-green-300" />
            ) : (
              <TrendingDown size={16} className="text-red-300" />
            )}
            <span className="ml-2 text-sm font-medium">
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

  // Enhanced Patient Card Component
  const PatientCard = ({ patient }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 text-white font-bold shadow-md">
              {patient.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {patient.name}
              </h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                patient.status === 'active' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {patient.status}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center mr-3">
                  <Mail size={14} className="text-blue-500" />
                </div>
                <span className="truncate">{patient.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center mr-3">
                  <Phone size={14} className="text-green-500" />
                </div>
                <span>{patient.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center mr-3">
                  <MapPin size={14} className="text-red-500" />
                </div>
                <span className="truncate">{patient.location}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center mr-3">
                  <Users size={14} className="text-purple-500" />
                </div>
                <span>Age: {patient.age}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center mr-3">
                  <Calendar size={14} className="text-indigo-500" />
                </div>
                <span>Sessions: {patient.totalSessions}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center mr-3">
                  <DollarSign size={14} className="text-emerald-500" />
                </div>
                <span>Total: ₹{patient.totalPaid.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-sm bg-gray-50 p-3 rounded-lg">
            <div className="text-gray-600 mb-2 sm:mb-0">
              <span className="font-medium">Last Session:</span> {patient.lastAppointment}
            </div>
            {patient.nextAppointment && (
              <div className="text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-lg">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-600 text-lg font-medium">Loading your dashboard...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className="flex min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm p-4 flex items-center justify-between z-30">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-red-600"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
        {/* Sidebar - Enhanced */}
        <div className={`fixed lg:relative inset-y-0 left-0 z-40 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-3">
                    <Users size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">MediCare</h2>
                    <p className="text-sm opacity-80">Doctor Portal</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Doctor Profile Section */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  {doctorData.name?.split(' ').map(n => n[0]).join('') || 'D'}
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{doctorData.name || 'Doctor Name'}</h3>
                  <p className="text-sm text-gray-600 truncate">{doctorData.specialization || 'Specialist'}</p>
                  <div className="flex items-center mt-1">
                    <Star className="text-yellow-400 fill-current w-4 h-4" />
                    <span className="ml-1 text-sm font-medium text-gray-700">{doctorData.rating || 0}</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-blue-600">{doctorData.patients || 0}</div>
                  <div className="text-xs text-gray-600">Patients</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg text-center">
                  <div className="text-xl font-bold text-green-600">{doctorData.experience || 0}y</div>
                  <div className="text-xs text-gray-600">Experience</div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                <li>
                  <button 
                    onClick={() => setSelectedTab('overview')}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      selectedTab === 'overview' 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      selectedTab === 'overview' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <TrendingUp size={16} />
                    </div>
                    Overview
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setSelectedTab('patients')}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      selectedTab === 'patients' 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      selectedTab === 'patients' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Users size={16} />
                    </div>
                    Patients
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setSelectedTab('appointments')}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      selectedTab === 'appointments' 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      selectedTab === 'appointments' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Calendar size={16} />
                    </div>
                    Appointments
                  </button>
                  <button 
                    onClick={() => navigate(`/docter/todaySessions?email=${email}`)}
                    className="w-full flex items-center p-3 rounded-lg transition-colors hover:bg-green-50 text-green-700"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-green-100">
                      <Clock size={16} />
                    </div>
                    Today&apos;s Sessions
                  </button>
                  <button 
                    onClick={() => navigate(`/docter/upcoming?email=${email}`)}
                    className="w-full flex items-center p-3 rounded-lg transition-colors hover:bg-purple-50 text-purple-700"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mr-3 bg-purple-100">
                      <TrendingUp size={16} />
                    </div>
                    Upcoming
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => setSelectedTab('settings')}
                    className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                      selectedTab === 'settings' 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      selectedTab === 'settings' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Settings size={16} />
                    </div>
                    Settings
                  </button>
                </li>
              </ul>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={fetchDoctorProfile}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
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
                {profileRefreshing ? 'Refreshing...' : 'Refresh Profile'}
              </button>
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors duration-200 font-medium"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0 w-full">
          {/* Add top padding for mobile to account for fixed header */}
          <div className="pt-20 lg:pt-0 p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Main Header - Desktop Only */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Dr. {doctorData.name?.split(' ')[1] || 'Doctor'}!</h1>
                <p className="text-gray-600">Here&apos;s what&apos;s happening with your practice today.</p>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate(`/docter/todaySessions?email=${email}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
                >
                  <Clock size={16} />
                  Today&apos;s Sessions
                </button>
                <button 
                  onClick={() => navigate(`/docter/upcoming?email=${email}`)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
                >
                  <TrendingUp size={16} />
                  Upcoming
                </button>
                <button className="relative p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                </button>
                <button className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <Download size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Overview Tab Content */}
            {selectedTab === 'overview' && (
              <>
                {/* Income Statistics Cards */}
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">Income Statistics</h2>
                    <div className="flex items-center gap-3">
                      <label className="text-sm text-gray-600 font-medium">View:</label>
                      <Select value={selectedTimeFrame} onValueChange={setSelectedTimeFrame}>
                        <SelectTrigger className="w-[180px] bg-white">
                          <SelectValue placeholder="Select time frame" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 shadow-lg">
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
                    <IncomeCard
                      title="Daily Income"
                      amount={incomeData.daily}
                      growth={incomeData.dailyGrowth}
                      icon={<DollarSign size={24} />}
                      bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
                      timeFrame="day"
                    />
                    <IncomeCard
                      title="Weekly Income"
                      amount={incomeData.weekly}
                      growth={incomeData.weeklyGrowth}
                      icon={<TrendingUp size={24} />}
                      bgColor="bg-gradient-to-br from-emerald-500 to-emerald-600"
                      timeFrame="week"
                    />
                    <IncomeCard
                      title="Monthly Income"
                      amount={incomeData.monthly}
                      growth={incomeData.monthlyGrowth}
                      icon={<Calendar size={24} />}
                      bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
                      timeFrame="month"
                    />
                    <IncomeCard
                      title="Yearly Income"
                      amount={incomeData.yearly}
                      growth={incomeData.yearlyGrowth}
                      icon={<Award size={24} />}
                      bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
                      timeFrame="year"
                    />
                  </div>
                </div>

                {/* Income Chart */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                      {selectedTimeFrame === 'daily' ? 'Daily' : 
                       selectedTimeFrame === 'weekly' ? 'Weekly' : 
                       selectedTimeFrame === 'monthly' ? 'Monthly' : 'Yearly'} Income Trend
                    </h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        Income
                      </div>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={selectedTimeFrame === 'weekly' ? incomeData.weeklyChart : incomeData.monthlyChart}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `₹${value.toLocaleString()}`}
                        />
                        <Tooltip 
                          formatter={(value) => [`₹${value.toLocaleString()}`, 'Income']}
                          labelFormatter={(label) => `${selectedTimeFrame === 'weekly' ? 'Day' : 'Month'}: ${label}`}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="income" 
                          stroke="#3B82F6" 
                          strokeWidth={3}
                          dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, fill: '#1D4ED8' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Appointment Statistics Cards */}
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-900">Appointment Overview</h2>
                    <button 
                      onClick={fetchDoctorAppointments}
                      disabled={appointmentsLoading}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                    >
                      {appointmentsLoading ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <Eye size={16} />
                      )}
                      {appointmentsLoading ? 'Refreshing...' : 'Refresh Appointments'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                          <p className="text-3xl font-bold text-gray-900">{doctorAppointments.length}</p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <Calendar size={24} className="text-blue-600" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Pending</p>
                          <p className="text-3xl font-bold text-yellow-600">
                            {doctorAppointments.filter(a => a.status === 'pending').length}
                          </p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-xl">
                          <Clock size={24} className="text-yellow-600" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">Approved</p>
                          <p className="text-3xl font-bold text-green-600">
                            {doctorAppointments.filter(a => a.status === 'approved').length}
                          </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-xl">
                          <CheckCircle size={24} className="text-green-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

                        {/* Patients Tab Content */}
            {selectedTab === 'patients' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Patient Requests</h2>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">Total: {patientRequests.length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-gray-600">Pending: {patientRequests.filter(r => r.status === 'pending').length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-600">Confirmed: {patientRequests.filter(r => r.status === 'confirmed').length}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-gray-600">Approved: {patientRequests.filter(r => r.status === 'approved').length}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    {/* Search and Filter */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search patients..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 w-full sm:w-64"
                        />
                      </div>
                      
                      <div className="relative">
                        <Filter size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="pl-10 pr-8 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 appearance-none w-full sm:w-auto"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="approved">Approved</option>
                          <option value="declined">Declined</option>
                        </select>
                      </div>
                    </div>
                    
                    <button 
                      onClick={fetchPatientRequests}
                      disabled={requestsLoading}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium whitespace-nowrap"
                    >
                      {requestsLoading ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <Eye size={16} />
                      )}
                      {requestsLoading ? 'Loading...' : 'Load Requests'}
                    </button>
                  </div>
                </div>
                
                {/* Test Modal Button - Remove this after testing */}
                <div className="mb-4">
                  <button 
                    onClick={() => {
                      const testUser = {
                        id: 'test123',
                        name: 'Test User',
                        phone: '+1234567890',
                        age: 25,
                        location: 'Test City',
                        status: 'pending',
                        date: '2025-01-15',
                        time: '10:00 AM'
                      };
                      handleUserRowClick(testUser);
                    }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    🧪 Test Modal (Click to open)
                  </button>
                </div>
                
                {requestsLoading ? (
                  <div className="text-center py-12">
                    <div className="relative inline-block">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                    <p className="text-gray-600 font-medium">Loading patient requests...</p>
                  </div>
                ) : filteredRequests.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 rounded-l-xl">PATIENT</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">CONTACT</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">DETAILS</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">DOCTOR</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">APPOINTMENT</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">STATUS</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">VIDEO CALL</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700 rounded-r-xl">ACTIONS</th>
                      </tr>
                      </thead>
                      <tbody>
                        {filteredRequests.map((request, index) => (
                          <tr 
                            key={request.id || request._id || index} 
                            className="border-b border-gray-100 hover:bg-blue-50 transition-colors group cursor-pointer hover:shadow-md"
                            onClick={() => handleUserRowClick(request)}
                            title="Click to view patient details"
                          >
                            <td className="py-4 px-6">
                              <div className="flex items-center">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 text-white font-bold shadow-md">
                                  {request.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {request.name || 'N/A'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {request.age ? `${request.age} years` : 'Age not specified'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="space-y-1">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Phone size={12} className="mr-2 text-green-500" />
                                  {request.phone || request.number || 'N/A'}
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <MapPin size={12} className="mr-2 text-red-500" />
                                  {request.location || 'N/A'}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-gray-600">
                              <div className="text-sm">
                                <div>Age: {request.age || 'N/A'}</div>
                                <div className="text-gray-500 truncate max-w-32">
                                  {request.location || 'Location not specified'}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">
                                  {request.doctorName || doctorData.name || 'N/A'}
                                </div>
                                <div className="text-gray-500">
                                  {request.doctorSpecialization || doctorData.specialization || 'N/A'}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">{request.date || 'N/A'}</div>
                                <div className="text-gray-500">{request.time || 'N/A'}</div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                request.status === 'approved' 
                                  ? 'bg-green-100 text-green-800 border border-green-200' 
                                  : request.status === 'confirmed'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : request.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                  : request.status === 'declined'
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : 'bg-gray-100 text-gray-800 border border-gray-200'
                              }`}>
                                {request.status || 'pending'}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              {request.status === 'pending' ? (
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent row click when clicking button
                                      handleAppointmentAction(request.id || request._id, 'approve');
                                    }}
                                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
                                  >
                                    <span className="mr-1">✓</span>
                                    Approve
                                  </button>
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent row click when clicking button
                                      handleAppointmentAction(request.id || request._id, 'decline');
                                    }}
                                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium shadow-sm"
                                  >
                                    <span className="mr-1">✗</span>
                                    Decline
                                  </button>
                                </div>
                              ) : request.status === 'confirmed' ? (
                                <span className="flex items-center text-sm font-medium text-blue-600">
                                  <span className="mr-1">✓</span>
                                  Confirmed
                                </span>
                              ) : (
                                <span className={`flex items-center text-sm font-medium ${
                                  request.status === 'approved' ? 'text-green-600' : 'text-red-600'
                                }`}>
                                  <span className="mr-1">{request.status === 'approved' ? '✓' : '✗'}</span>
                                  {request.status === 'approved' ? 'Approved' : 'Declined'}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              {request.videoCallGenerated && request.videoCallLink ? (
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-xs text-green-600 font-medium">Available</span>
                                  </div>
                                  <div className="text-xs text-gray-500 font-mono">
                                    {request.videoCallId}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(request.videoCallLink, '_blank');
                                    }}
                                    className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                                  >
                                    <Video size={12} />
                                    <span>Join</span>
                                    <ExternalLink size={10} />
                                  </button>
                                </div>
                              ) : request.status === 'confirmed' && !request.videoCallGenerated ? (
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-1">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    <span className="text-xs text-yellow-600 font-medium">Confirmed</span>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleGenerateVideoCall(request.id || request._id);
                                    }}
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
                    <p className="text-gray-600 mb-6">
                      {searchTerm || filterStatus !== 'all' 
                        ? 'Try adjusting your search or filter criteria.' 
                        : 'Click "Load Requests" to fetch patient requests from the server.'
                      }
                    </p>
                    {!searchTerm && filterStatus === 'all' && (
                      <button 
                        onClick={fetchPatientRequests}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium"
                      >
                        <Eye size={16} />
                        Load Patient Requests
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Appointments Tab Content */}
            {selectedTab === 'appointments' && (
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
            )}

            {/* My Patients Section - Show in both Overview and Patients tabs */}
            {(selectedTab === 'overview' || selectedTab === 'patients') && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">My Patients</h2>
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
            )}

            {/* Settings Tab Content */}
            {selectedTab === 'settings' && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  {/* Profile Settings */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={doctorData.name || ''}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                          type="email"
                          value={doctorData.email || ''}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your email"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={doctorData.phone || ''}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                        <input
                          type="text"
                          value={doctorData.specialization || ''}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your specialization"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        value={doctorData.bio || ''}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  {/* Account Settings */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">Email Notifications</h4>
                          <p className="text-sm text-gray-600">Receive email notifications for new appointments</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">SMS Notifications</h4>
                          <p className="text-sm text-gray-600">Receive SMS notifications for urgent matters</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {(() => {
        console.log('Modal render check - isUserModalOpen:', isUserModalOpen, 'selectedUser:', selectedUser); // Debug log
        return null;
      })()}
      {isUserModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4" style={{zIndex: 9999}}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border-4 border-red-500">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
              <button
                onClick={closeUserModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column - Patient Info */}
                <div className="space-y-6">
                  {/* Patient Profile Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        {selectedUser.name?.split(' ').map(n => n[0]).join('') || 'N/A'}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{selectedUser.name || 'N/A'}</h3>
                        <p className="text-gray-600">Patient ID: {selectedUser.id || selectedUser._id || 'N/A'}</p>
                      </div>
                    </div>
                    
                    {/* Status Badge */}
                    <div className="inline-block">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedUser.status === 'approved' 
                          ? 'bg-green-100 text-green-800 border border-green-200' 
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

                  {/* Personal Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
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
                          <MapPin size={16} className="text-green-500" />
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
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default DoctorDashboard;