import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, ExternalLink, CheckCircle, X, Users, Eye, RefreshCw } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiInstance from '../../../instance';
import { Button } from '../../../components/shadcn/button/button';
import { PageHeader } from '../../../components/core/cardHeader';

const TodaySessions = ({ doctorData, email, onNavigate }) => {
  const [loading, setLoading] = useState(true);
  const [todaySessions, setTodaySessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    if (!email || !doctorData._id) {
      console.log('No email or doctor data provided');
      return;
    }
    
    fetchTodaySessions(doctorData._id);
  }, [email, doctorData._id]);

  // Function to fetch today's sessions
  const fetchTodaySessions = async (doctorId) => {
    if (!doctorId) return;

    setRefreshing(true);
    try {
      const response = await apiInstance.get(`/doctor/${doctorId}/appointments`);
      console.log('All appointments fetched:', response.data);
      
      if (response.data.success) {
        const allAppointments = response.data.data;
        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        
        // Filter appointments for today
        const todayAppts = allAppointments.filter(appointment => {
          return appointment.date === today;
        });

        // Transform the data to match the expected format
        const transformedSessions = todayAppts.map(appointment => ({
          ...appointment,
          patientName: appointment.name,
          patientAge: appointment.age,
          patientPhone: appointment.phone || appointment.number,
          patientLocation: appointment.location
        }));

        console.log('Today\'s sessions:', transformedSessions);
        setTodaySessions(transformedSessions);
      } else {
        console.error('Failed to fetch appointments:', response.data.message);
        toast.error('Failed to fetch today\'s sessions');
      }
    } catch (error) {
      console.error('Error fetching today\'s sessions:', error);
      toast.error('Error fetching today\'s sessions');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  // Function to handle appointment actions
  const handleAppointmentAction = async (appointmentId, action) => {
    try {
      const endpoint = action === 'approve' ? `/appointment/${appointmentId}/approve` : `/appointment/${appointmentId}/decline`;
      const method = 'PUT';
      
      const response = await apiInstance[method.toLowerCase()](endpoint);
      
      if (response.data.success) {
        console.log(`Appointment ${action}d successfully:`, response.data);
        
        if (action === 'approve') {
          const appointmentData = response.data.data;
          if (appointmentData.videoCallLink) {
            toast.success(`Appointment approved! Video call link has been generated and sent to the patient via email.`, {
              duration: 5000
            });
          } else {
            toast.success(`Appointment approved successfully!`);
          }
        } else {
          toast.success(`Appointment declined. Email notification sent to the patient.`);
        }
        
        // Refresh today's sessions
        await fetchTodaySessions(doctorData._id);
      } else {
        console.error(`Failed to ${action} appointment:`, response.data.message);
        toast.error(`Failed to ${action} appointment: ${response.data.message}`);
      }
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      toast.error(`Error ${action}ing appointment. Please try again.`);
    }
  };

  // Filter functions
  const filteredSessions = todaySessions.filter(session => {
    const matchesSearch = session.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         session.patientPhone?.includes(searchTerm);
    const matchesFilter = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Get current time for comparison
  const getCurrentTime = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes(); // Convert to minutes for easy comparison
  };

  // Function to check if session time has passed
  const isSessionTimePassed = (timeStr) => {
    if (!timeStr) return false;
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    const sessionTime = hours * 60 + minutes;
    const currentTime = getCurrentTime();
    
    return sessionTime < currentTime;
  };

  // Function to get time status
  const getTimeStatus = (timeStr) => {
    if (!timeStr) return 'unknown';
    
    const [hours, minutes] = timeStr.split(':').map(Number);
    const sessionTime = hours * 60 + minutes;
    const currentTime = getCurrentTime();
    const diff = sessionTime - currentTime;
    
    if (diff < 0) return 'passed';
    if (diff <= 30) return 'upcoming';
    return 'later';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading today's sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <PageHeader
            title="Today's Sessions"
            description={`Manage your appointments for ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`}
            />
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={() => fetchTodaySessions(doctorData._id)}
              disabled={refreshing}
              variant='outline'
            >
              {refreshing ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Eye size={16} />
              )}
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            
            <Button
              onClick={() => onNavigate('upcoming')}
              variant='outline'
            >
              <Calendar size={16} />
              Upcoming
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-xl font-bold text-gray-900">{todaySessions.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar size={20} className="text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl  border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-xl font-bold text-yellow-600">
                {todaySessions.filter(s => s.status === 'pending').length}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-xl">
              <Clock size={20} className="text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl  border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-xl font-bold text-green-600">
                {todaySessions.filter(s => s.status === 'approved').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <CheckCircle size={20} className="text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl  border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-xl font-bold text-gray-600">
                {todaySessions.filter(s => s.status === 'completed').length}
              </p>
            </div>
            <div className="p-3 bg-gray-100 rounded-xl">
              <Users size={20} className="text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-sm  border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Today's Sessions</h3>
              <p className="text-gray-600">Manage and track your daily appointments</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 w-full sm:w-64"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
        
        {filteredSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">PATIENT</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">TIME</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">STATUS</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">VIDEO CALL</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-700">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredSessions.map((session) => {
                  const timeStatus = getTimeStatus(session.time);
                  const isPassed = isSessionTimePassed(session.time);
                  
                  return (
                    <tr key={session._id} className={`border-b border-gray-100 hover:bg-blue-50 transition-colors ${
                      isPassed ? 'bg-gray-50' : ''
                    }`}>
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 text-white font-bold shadow-md">
                            {session.patientName?.split(' ').map(n => n[0]).join('') || 'N/A'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">
                              {session.patientName || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500">
                              Age: {session.patientAge || 'N/A'} • {session.patientPhone || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-400 truncate max-w-32">
                              {session.patientLocation || 'Location not specified'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 ${
                            timeStatus === 'passed' ? 'bg-gray-400' :
                            timeStatus === 'upcoming' ? 'bg-orange-400' :
                            'bg-green-400'
                          }`}></div>
                          <div>
                            <div className={`font-medium ${
                              isPassed ? 'text-gray-500 line-through' : 'text-gray-900'
                            }`}>
                              {session.time || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {timeStatus === 'passed' ? 'Time passed' :
                               timeStatus === 'upcoming' ? 'Starting soon' :
                               'Later today'}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          session.status === 'approved' 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : session.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                            : session.status === 'completed'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}>
                          {session.status || 'pending'}
                        </span>
                      </td>
                      
                      <td className="py-4 px-6">
                        {session.videoCallGenerated && session.videoCallLink ? (
                          <div className="space-y-2">
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 font-medium">Available</span>
                            </div>
                            <Button
                              onClick={() => window.open(session.videoCallLink, '_blank')}
                              size="sm"
                              variant='outline'
                            >
                              <Video size={12} />
                              <span>Join</span>
                              <ExternalLink size={10} />
                            </Button>
                          </div>
                        ) : session.status === 'approved' ? (
                          <span className="text-xs text-yellow-600">Generating...</span>
                        ) : (
                          <span className="text-xs text-gray-400">Not available</span>
                        )}
                      </td>
                      
                      <td className="py-4 px-6">
                        {session.status === 'pending' ? (
                          <div className="flex items-center gap-2">
                            <Button 
                              onClick={() => handleAppointmentAction(session._id, 'approve')}
                              size="sm"
                              variant='outline'
                            >
                              <CheckCircle size={16} className="mr-1" />
                              Approve
                            </Button>
                            <Button 
                              onClick={() => handleAppointmentAction(session._id, 'decline')}
                              size="sm"
                              variant='outline'
                            >
                              <X size={16} className="mr-1" />
                              Decline
                            </Button>
                          </div>
                        ) : session.status === 'approved' && !isPassed ? (
                          <Button variant='outline'>
                            <Video size={16} className="mr-1" />
                            Start Session
                          </Button>
                        ) : (
                          <span className={`text-sm font-medium ${
                            session.status === 'approved' ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {session.status === 'approved' ? '✓ Approved' : '✗ Declined'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions today</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.' 
                : 'You have no appointments scheduled for today.'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <Button 
                onClick={() => fetchTodaySessions(doctorData._id)}
                variant='outline'
              >
                <Eye size={16} />
                Refresh Sessions
              </Button>
            )}
          </div>
        )}
      </div>

      <ToastContainer />
    </div>
  );
};

export default TodaySessions;
