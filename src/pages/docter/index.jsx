import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogOut, Menu, X, Bell, Download, TrendingUp, Clock } from 'lucide-react';
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
  UpcomingAppointments,
  Sidebar
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

  // Debug: Log state changes
  useEffect(() => {
    console.log('selectedUser state changed:', selectedUser);
  }, [selectedUser]);

  useEffect(() => {
    console.log('isUserModalOpen state changed:', isUserModalOpen);
  }, [isUserModalOpen]);

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
            email: request.email, // Add missing email field
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
    console.log('Current selectedUser before update:', selectedUser); // Debug log
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
        setPatientsList([]); // Initialize with empty array instead of fake data
        
        console.log('Doctor data loaded successfully:', doctorData);
        console.log('Income data loaded successfully:', defaultIncomeData);
        
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
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className="flex h-full">
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
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          doctorData={doctorData}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          handleNavigate={handleNavigate}
          profileRefreshing={profileRefreshing}
          fetchDoctorProfile={fetchDoctorProfile}
          handleLogout={handleLogout}
        />

        {/* Main Content */}
        <div className="flex-1 lg:ml-80 w-full overflow-y-auto">
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