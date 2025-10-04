import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Users, LogOut, Menu, X, Bell, Settings, Star, Clock, Download, TrendingUp, Calendar } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiInstance from '../../instance';
import { Button } from '../../components/shadcn/button/button';
import { 
  OverviewTab, 
  PatientsTab, 
  AppointmentsTab, 
  SettingsTab, 
  MyPatients, 
  PatientModal,
  TodaySessions,
  UpcomingAppointments
} from './components';

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
      navigate('/doctor/login');
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
    navigate('/doctor/login');
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

  // Function to handle navigation between tabs
  const handleNavigate = (tabName) => {
    setSelectedTab(tabName);
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
          <Button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            variant="ghost"
            size="icon"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
            </Button>
            <Button 
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="text-red-600"
            >
              <LogOut size={20} />
            </Button>
          </div>
        </div>
        {/* Sidebar - Enhanced */}
        <div className={`fixed lg:relative inset-y-0 left-0 z-40 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 bg-[#1d4ed8] text-white">
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
                <Button 
                  onClick={() => setSidebarOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="lg:hidden hover:bg-white hover:bg-opacity-10"
                >
                  <X size={20} />
                </Button>
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
            <nav className="flex">
              <ul className="flex flex-col gap-2 w-full px-2 py-2">
                <li>
                  <Button 
                    onClick={() => setSelectedTab('overview')}
                    variant="secondary"
                    className={`w-full justify-start ${
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
                  </Button>
                </li>
                <li>
                  <Button 
                    onClick={() => setSelectedTab('patients')}
                    variant="secondary"
                    className={`w-full justify-start ${
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
                  </Button>
                </li>
                <li>
                  <Button 
                    onClick={() => setSelectedTab('appointments')}
                    variant="secondary"
                    className={`w-full justify-start ${
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
                  </Button>
                  </li>
                  <li>
                  <Button 
                    onClick={() => handleNavigate('todaySessions')}
                    variant="secondary"
                    className={`w-full justify-start ${
                      selectedTab === 'todaySessions' 
                        ? 'bg-green-50 text-green-700 font-medium' 
                        : 'hover:bg-green-50 text-green-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      selectedTab === 'todaySessions' ? 'bg-green-100' : 'bg-green-100'
                    }`}>
                      <Clock size={16} />
                    </div>
                    Today&apos;s Sessions
                  </Button>
                  </li>
                  <li>
                  <Button 
                    onClick={() => handleNavigate('upcoming')}
                    variant="secondary"
                    className={`w-full justify-start ${
                      selectedTab === 'upcoming' 
                        ? 'bg-purple-50 text-purple-700 font-medium' 
                        : 'hover:bg-purple-50 text-purple-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                      selectedTab === 'upcoming' ? 'bg-purple-100' : 'bg-purple-100'
                    }`}>
                      <TrendingUp size={16} />
                    </div>
                    Upcoming
                  </Button>
                  </li>
               
                <li>
                  <Button 
                    onClick={() => setSelectedTab('settings')}
                    variant="secondary"
                    className={`w-full justify-start ${
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
                  </Button>
                </li>
              </ul>
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={fetchDoctorProfile}
                className="w-full"
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
              </Button>
              
              <Button
                onClick={handleLogout}
                variant="outline"
                className="w-full mt-2 bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0 w-full">
          {/* Add top padding for mobile to account for fixed header */}
          <div className="pt-20 lg:pt-0 p-4 lg:p-8 max-w-7xl mx-auto">
            {/* Main Header - Desktop Only */}
            <div className="hidden lg:flex items-center justify-between mb-8">
              <div className="flex py-2 flex-col">
                <h1 className="text-[22px] font-medium text-gray-800">Welcome back, Dr. {doctorData.name?.split(' ')[1] || 'Doctor'}!</h1>
                <p className="text-gray-500  text-[16px] mt-1">Here&apos;s what&apos;s happening with your practice today.</p>
              </div>
              <div className="flex items-center gap-4">
                <Button 

                variant='outline'
                  onClick={() => handleNavigate('todaySessions')}
                  className=""
                >
                  <Clock size={16} />
                  Today&apos;s Sessions
                </Button>
                <Button 
                
                variant='outline'
                  onClick={() => handleNavigate('upcoming')}
                
                >
                  <TrendingUp size={16} />
                  Upcoming
                </Button>
                <Button variant="outline" size="icon" className="relative">
                  <Bell size={20} className="text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">3</span>
                </Button>
                <Button variant="outline" size="icon">
                  <Download size={20} className="text-gray-600" />
                </Button>
              </div>
            </div>

            {/* Overview Tab Content */}
            {selectedTab === 'overview' && (
              <OverviewTab
                selectedTimeFrame={selectedTimeFrame}
                setSelectedTimeFrame={setSelectedTimeFrame}
                incomeData={incomeData}
                doctorAppointments={doctorAppointments}
                appointmentsLoading={appointmentsLoading}
                fetchDoctorAppointments={fetchDoctorAppointments}
              />
            )}

            {/* Patients Tab Content */}
            {selectedTab === 'patients' && (
              <PatientsTab
                patientRequests={patientRequests}
                requestsLoading={requestsLoading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                fetchPatientRequests={fetchPatientRequests}
                handleUserRowClick={handleUserRowClick}
                handleAppointmentAction={handleAppointmentAction}
                handleGenerateVideoCall={handleGenerateVideoCall}
                doctorData={doctorData}
                filteredRequests={filteredRequests}
              />
            )}

            {/* Appointments Tab Content */}
            {selectedTab === 'appointments' && (
              <AppointmentsTab
                doctorAppointments={doctorAppointments}
                appointmentsLoading={appointmentsLoading}
                appointmentsError={appointmentsError}
                fetchDoctorAppointments={fetchDoctorAppointments}
                handleAppointmentActionForAppointments={handleAppointmentActionForAppointments}
                handleGenerateVideoCall={handleGenerateVideoCall}
              />
            )}

            {/* My Patients Section - Show in both Overview and Patients tabs */}
            {(selectedTab === 'overview' || selectedTab === 'patients') && (
              <MyPatients patientsList={patientsList} />
            )}

            {/* Today's Sessions Tab Content */}
            {selectedTab === 'todaySessions' && (
              <TodaySessions 
                doctorData={doctorData} 
                email={email} 
                onNavigate={handleNavigate}
              />
            )}

            {/* Upcoming Appointments Tab Content */}
            {selectedTab === 'upcoming' && (
              <UpcomingAppointments 
                doctorData={doctorData} 
                email={email} 
                onNavigate={handleNavigate}
              />
            )}

            {/* Settings Tab Content */}
            {selectedTab === 'settings' && (
              <SettingsTab doctorData={doctorData} />
            )}
          </div>
        </div>
      </div>


      {/* Patient Details Modal */}
      <PatientModal
        isUserModalOpen={isUserModalOpen}
        closeUserModal={closeUserModal}
        selectedUser={selectedUser}
        doctorData={doctorData}
        handleAppointmentAction={handleAppointmentAction}
      />

      <ToastContainer />
    </div>
  );
};

export default DoctorDashboard;