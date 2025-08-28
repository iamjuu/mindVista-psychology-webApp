import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Search, Filter, ChevronLeft, ChevronRight, User, Mail, Phone, MapPin, Clock, Calendar, DollarSign, Users, Award } from 'lucide-react';
import { Button } from '../../../../components/shadcn/button/button';
import { Input } from '../../../../components/shadcn/input/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../components/shadcn/select';
import apiInstance from '../../../../instance';

const DoctorList = () => {
  const [activeTab, setActiveTab] = useState('doctors');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approvalFilter, setApprovalFilter] = useState('all');
  const [doctorData, setDoctorData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Items per page
  const itemsPerPage = 5;



 
  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch doctors data
        const doctorsResponse = await apiInstance.get('/doctors/admin/all');
        console.log('Doctors data loaded:', doctorsResponse.data);
        
        // Transform doctors data to match frontend expectations
        const transformedDoctors = (doctorsResponse.data?.doctors || []).map(doctor => ({
          id: doctor._id,
          name: doctor.name,
          email: doctor.email || 'N/A',
          phone: doctor.phone,
          specialization: doctor.specialization,
          experience: `${doctor.experience} years`,
          totalIncome: doctor.consultationFee ? doctor.consultationFee * (doctor.patients || 0) : 0,
          monthlyIncome: doctor.consultationFee ? Math.floor((doctor.consultationFee * (doctor.patients || 0)) / 12) : 0,
          totalPatients: doctor.patients || 0,
          status: doctor.available ? 'active' : 'inactive',
          isActive: doctor.isActive,
          joinDate: new Date(doctor.createdAt).toISOString().split('T')[0]
        }));
        console.log('Transformed doctors:', transformedDoctors);
        setDoctorData(transformedDoctors);
        
        // Fetch appointments/users data
        const appointmentsResponse = await apiInstance.get('/appointment');
        console.log('Appointments data loaded:', appointmentsResponse.data);
        
        // Transform appointments data to match frontend expectations
        const transformedAppointments = (appointmentsResponse.data?.data || []).map(appointment => ({
          id: appointment.id || appointment._id,
          name: appointment.name,
          email: 'N/A', // Appointments don't have email
          number: appointment.phone,
          location: appointment.location,
          age: appointment.age?.toString() || 'N/A',
          slot: appointment.time?.includes('09') ? 'morning' : 
                appointment.time?.includes('14') ? 'afternoon' : 'evening',
          time: appointment.time,
          date: appointment.date,
          status: appointment.status || 'pending'
        }));
        console.log('Transformed appointments:', transformedAppointments);
        setUserData(transformedAppointments);
        
        console.log('Data loading completed successfully');
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data. Please try again later.');
        
        // Fallback to mock data if API fails
        console.log('Falling back to mock data...');
        setDoctorData(mockDoctorData);
        setUserData(mockUserData);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter doctors based on search term, status, and approval
  const filteredDoctors = doctorData.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.experience.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doctor.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesApproval = approvalFilter === 'all' || 
                           (approvalFilter === 'approved' && doctor.isActive) || 
                           (approvalFilter === 'pending' && !doctor.isActive);
    
    console.log(`Filtering doctors: search="${searchTerm}", status="${statusFilter}", approval="${approvalFilter}", matches=${matchesSearch && matchesStatus && matchesApproval}`);
    return matchesSearch && matchesStatus && matchesApproval;
  });

  // Filter users based on search term and status
  const filteredUsers = userData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.age.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.slot.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter.toLowerCase();
    
    console.log(`Filtering users: search="${searchTerm}", status="${statusFilter}", matches=${matchesSearch && matchesStatus}`);
    return matchesSearch && matchesStatus;
  });
  
  // Get current data based on active tab
  const currentData = activeTab === 'doctors' ? filteredDoctors : filteredUsers;
  
  // Calculate pagination
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = currentData.slice(startIndex, startIndex + itemsPerPage);

  // Handle doctor approval
  const handleApproveDoctor = async (doctorId) => {
    try {
      const response = await apiInstance.put(`/doctors/approve/${doctorId}`);
      if (response.data.success) {
        // Update the local state
        setDoctorData(prevData => 
          prevData.map(doctor => 
            doctor.id === doctorId 
              ? { ...doctor, isActive: true }
              : doctor
          )
        );
        alert('Doctor approved successfully!');
      }
    } catch (error) {
      console.error('Error approving doctor:', error);
      alert('Failed to approve doctor. Please try again.');
    }
  };
  
  // Handle page change
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    console.log(`Navigating to page ${page}`);
    setCurrentPage(page);
  };

  // Mobile Card Component for Doctors
  const DoctorCard = ({ doctor }) => (
    <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{doctor.name}</h3>
            <p className="text-sm text-gray-500">#{doctor.id}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          doctor.status?.toLowerCase() === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {doctor.status || 'Unknown'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <Mail className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600 truncate">{doctor.email}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{doctor.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Award className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{doctor.specialization}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{doctor.experience}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-green-500" />
          <div>
            <p className="text-xs text-gray-500">Total Income</p>
            <p className="text-sm font-semibold text-green-600">₹{doctor.totalIncome.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">Monthly</p>
            <p className="text-sm font-semibold text-blue-600">₹{doctor.monthlyIncome.toLocaleString()}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-purple-500" />
          <div>
            <p className="text-xs text-gray-500">Patients</p>
            <p className="text-sm font-semibold text-purple-600">{doctor.totalPatients}</p>
          </div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </div>
  );

  DoctorCard.propTypes = {
    doctor: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      specialization: PropTypes.string.isRequired,
      experience: PropTypes.string.isRequired,
      totalIncome: PropTypes.number.isRequired,
      monthlyIncome: PropTypes.number.isRequired,
      totalPatients: PropTypes.number.isRequired,
      status: PropTypes.string
    }).isRequired
  };

  // Mobile Card Component for Users
  const UserCard = ({ user }) => (
    <div className="bg-white border rounded-lg p-4 mb-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{user.name}</h3>
            <p className="text-sm text-gray-500">#{user.id}</p>
          </div>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          user.status?.toLowerCase() === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {user.status || 'Unknown'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">

        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{user.number}</span>
        </div>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{user.location}</span>
        </div>
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">Age: {user.age}</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            user.slot === 'morning' 
              ? 'bg-yellow-100 text-yellow-800' 
              : user.slot === 'afternoon' 
                ? 'bg-orange-100 text-orange-800' 
                : 'bg-purple-100 text-purple-800'
          }`}>
            {user.slot}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{user.time}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{user.date}</span>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-blue-600 border-blue-600 hover:bg-blue-50"
        >
          Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>
    </div>
  );

  UserCard.propTypes = {
    user: PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      number: PropTypes.string.isRequired,
      location: PropTypes.string.isRequired,
      age: PropTypes.string.isRequired,
      slot: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      status: PropTypes.string
    }).isRequired
  };
  
  return (
    <div className="bg-white rounded-lg shadow min-h-screen">
      {/* Header with Tabs */}
      <div className="p-4 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full sm:w-fit">
            <Button
              onClick={() => {
                console.log('Switching to doctors tab');
                setActiveTab('doctors');
                setCurrentPage(1);
              }}
              variant="ghost"
              size="sm"
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'doctors'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Doctors ({filteredDoctors.length})
            </Button>
            <Button
              onClick={() => {
                console.log('Switching to users tab');
                setActiveTab('users');
                setCurrentPage(1);
              }}
              variant="ghost"
              size="sm"
              className={`flex-1 sm:flex-none px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'users'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Users ({filteredUsers.length})
            </Button>
          </div>
    
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="p-4 space-y-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <Input
            type="text"
            placeholder={`Search ${activeTab === 'doctors' ? 'doctors by name, email, phone, specialization, or experience' : 'users by name, phone, location, age, or slot'}...`}
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              console.log('Search term changed:', e.target.value);
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Filter size={18} className="text-gray-400" />
            </div>
                         <Select value={statusFilter} onValueChange={(value) => {
               console.log('Status filter changed:', value);
               setStatusFilter(value);
               setCurrentPage(1); // Reset to first page on filter change
             }}>
               <SelectTrigger className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                 <SelectValue placeholder="All Status" />
               </SelectTrigger>
                             <SelectContent className="bg-white border border-gray-200 shadow-lg">
                 <SelectItem value="all">All Status</SelectItem>
                 <SelectItem value="active">Active</SelectItem>
                 <SelectItem value="inactive">Inactive</SelectItem>
                 <SelectItem value="pending">Pending</SelectItem>
               </SelectContent>
            </Select>
          </div>
          
          {activeTab === 'doctors' && (
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Filter size={18} className="text-gray-400" />
              </div>
                             <Select value={approvalFilter} onValueChange={(value) => {
                 console.log('Approval filter changed:', value);
                 setApprovalFilter(value);
                 setCurrentPage(1); // Reset to first page on filter change
               }}>
                 <SelectTrigger className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                   <SelectValue placeholder="All Approval" />
                 </SelectTrigger>
                                 <SelectContent className="bg-white border border-gray-200 shadow-lg">
                   <SelectItem value="all">All Approval</SelectItem>
                   <SelectItem value="approved">Approved</SelectItem>
                   <SelectItem value="pending">Pending Approval</SelectItem>
                 </SelectContent>
              </Select>
            </div>
          )}
          
          <Button
            onClick={() => {
              console.log('Refreshing data...');
              setCurrentPage(1);
              setSearchTerm('');
              setStatusFilter('all');
              setApprovalFilter('all');
              // Trigger a re-fetch of data
              const fetchData = async () => {
                setLoading(true);
                setError(null);
                try {
                  const doctorsResponse = await apiInstance.get('/doctors/admin/all');
                  const transformedDoctors = (doctorsResponse.data?.doctors || []).map(doctor => ({
                    id: doctor._id,
                    name: doctor.name,
                    email: doctor.email || 'N/A',
                    phone: doctor.phone,
                    specialization: doctor.specialization,
                    experience: `${doctor.experience} years`,
                    totalIncome: doctor.consultationFee ? doctor.consultationFee * (doctor.patients || 0) : 0,
                    monthlyIncome: doctor.consultationFee ? Math.floor((doctor.consultationFee * (doctor.patients || 0)) / 12) : 0,
                    totalPatients: doctor.patients || 0,
                    status: doctor.available ? 'active' : 'inactive',
                    joinDate: new Date(doctor.createdAt).toISOString().split('T')[0]
                  }));
                  setDoctorData(transformedDoctors);
                  
                  const appointmentsResponse = await apiInstance.get('/appointment');
                  const transformedAppointments = (appointmentsResponse.data?.data || []).map(appointment => ({
                    id: appointment.id || appointment._id,
                    name: appointment.name,
                    email: 'N/A',
                    number: appointment.phone,
                    location: appointment.location,
                    age: appointment.age?.toString() || 'N/A',
                    slot: appointment.time?.includes('09') ? 'morning' : 
                          appointment.time?.includes('14') ? 'afternoon' : 'evening',
                    time: appointment.time,
                    date: appointment.date,
                    status: appointment.status || 'pending'
                  }));
                  setUserData(transformedAppointments);
                } catch (error) {
                  console.error('Error refreshing data:', error);
                  setError('Failed to refresh data. Please try again later.');
                } finally {
                  setLoading(false);
                }
              };
              fetchData();
            }}
            variant="outline"
            size="sm"
            className="px-4 py-2 border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Refresh Data
          </Button>
          
          <div className="text-sm text-gray-500 flex items-center justify-center sm:justify-start py-2">
            Showing {currentData.length} {activeTab === 'doctors' ? 'doctors' : 'users'}
          </div>
        </div>
      </div>
      
      {/* Loading and error states */}
      {loading && (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading {activeTab}...</p>
        </div>
      )}
      
      {error && (
        <div className="p-8 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md mx-auto">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}
      
      {/* Data display */}
      {!loading && !error && (
        <>
          {/* Show message when no data is available */}
          {currentData.length === 0 && (
            <div className="p-8 text-center">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-gray-600 mb-2">No {activeTab} available</p>
                <p className="text-sm text-gray-500">
                  {activeTab === 'doctors' 
                    ? 'No doctors have been added to the system yet.' 
                    : 'No appointments have been scheduled yet.'}
                </p>
              </div>
            </div>
          )}
          
          {/* Table View - Fixed first columns with scrollable data */}
          {currentData.length > 0 && (
            <div className="max-w-6xl">
              <div className="max-w-7xl mx-auto">
                <div className="relative">
                  {activeTab === 'doctors' ? (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1000px] table-auto">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[60px] sticky left-0 bg-gray-50 z-10">ID</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[150px] sticky left-[60px] bg-gray-50 z-10">Doctor Name</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[180px]">Email</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[120px]">Phone</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[150px]">Specialization</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[100px]">Experience</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[100px]">Total Income</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[100px]">Monthly Income</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[100px]">Total Patients</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[100px]">Status</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[100px]">Approval</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[120px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                                                     {paginatedData.length > 0 ? (
                             paginatedData.map(doctor => (
                               <tr key={doctor.id} className="border-t hover:bg-gray-50 hover:transform hover:translate-x-2 transition-all duration-200">
                                <td className="p-3 text-gray-500 whitespace-nowrap sticky left-0 bg-white z-10 border-r">#{typeof doctor.id === 'number' ? doctor.id : doctor.id.slice(-4)}</td>
                                <td className="p-3 font-medium whitespace-nowrap sticky left-[60px] bg-white z-10 border-r">{doctor.name}</td>
                                <td className="p-3 text-gray-500 whitespace-nowrap">{doctor.email}</td>
                                <td className="p-3 text-gray-500 whitespace-nowrap">{doctor.phone}</td>
                                <td className="p-3 text-gray-500 whitespace-nowrap">{doctor.specialization}</td>
                                <td className="p-3 text-gray-500 whitespace-nowrap">{doctor.experience}</td>
                                <td className="p-3 text-gray-500 whitespace-nowrap">
                                  <span className="text-green-600 font-semibold">₹{doctor.totalIncome.toLocaleString()}</span>
                                </td>
                                <td className="p-3 text-gray-500 whitespace-nowrap">
                                  <span className="text-blue-600 font-semibold">₹{doctor.monthlyIncome.toLocaleString()}</span>
                                </td>
                                <td className="p-3 text-gray-500 whitespace-nowrap">
                                  <span className="text-blue-600 font-semibold">{doctor.totalPatients} patients</span>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    doctor.status === 'active' 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {doctor.status}
                                  </span>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    doctor.isActive 
                                      ? 'bg-green-100 text-green-800' 
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {doctor.isActive ? 'Approved' : 'Pending'}
                                  </span>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <div className="flex space-x-2">
                                    {!doctor.isActive && (
                                      <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        onClick={() => handleApproveDoctor(doctor.id)}
                                        className="text-green-500 hover:text-green-700 underline hover:no-underline"
                                      >
                                        Approve
                                      </Button>
                                    )}
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-blue-500 hover:text-blue-700 underline hover:no-underline"
                                    >
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-700 underline hover:no-underline"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="12" className="p-4 text-center text-gray-500">
                                {doctorData.length > 0 
                                  ? 'No doctors found matching your criteria' 
                                  : 'No doctors available'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1100px] table-auto">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[60px] sticky left-0 bg-gray-50 z-10">ID</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[150px] sticky left-[60px] bg-gray-50 z-10">Name</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[120px]">Phone</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[120px]">Location</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[80px]">Age</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[100px]">Slot</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[100px]">Time</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[100px]">Date</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[100px]">Status</th>
                            <th className="p-3 text-left font-semibold text-gray-600 whitespace-nowrap min-w-[120px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                                                     {paginatedData.length > 0 ? (
                             paginatedData.map(user => (
                               <tr key={user.id} className="border-t hover:bg-gray-50 hover:transform hover:translate-x-2 transition-all duration-200">
                                <td className="p-3 text-gray-500 whitespace-nowrap sticky left-0 bg-white z-10 border-r">#{typeof user.id === 'number' ? user.id : user.id.slice(-4)}</td>
                                <td className="p-3 font-medium whitespace-nowrap sticky left-[60px] bg-white z-10 border-r">{user.name}</td>
                                <td className="p-3 text-gray-500 whitespace-nowrap">{user.number}</td>
                                <td className="p-3 text-gray-500 whitespace-nowrap">{user.location}</td>
                                <td className="p-3 text-gray-500 whitespace-nowrap">{user.age}</td>
                                <td className="p-3 text-gray-500 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    user.slot === 'morning' 
                                      ? 'bg-yellow-100 text-yellow-800' 
                                      : user.slot === 'afternoon' 
                                        ? 'bg-orange-100 text-orange-800' 
                                        : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {user.slot}
                                  </span>
                                </td>
                                <td className="p-3 text-gray-500 whitespace-nowrap">{user.time}</td>
                                <td className="p-3 text-gray-500 whitespace-nowrap">{user.date}</td>
                                <td className="p-3 whitespace-nowrap">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    user.status === 'active' 
                                      ? 'bg-green-100 text-green-800' 
                                      : user.status === 'pending' 
                                        ? 'bg-yellow-100 text-yellow-800' 
                                        : 'bg-red-100 text-red-800'
                                  }`}>
                                    {user.status}
                                  </span>
                                </td>
                                <td className="p-3 whitespace-nowrap">
                                  <div className="flex space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-blue-500 hover:text-blue-700 underline hover:no-underline"
                                    >
                                      Edit
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-700 underline hover:no-underline"
                                    >
                                      Delete
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="10" className="p-4 text-center text-gray-500">
                                {userData.length > 0 
                                  ? 'No users found matching your criteria' 
                                  : 'No users available'}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
              <div className="text-sm text-gray-500 order-2 sm:order-1">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, currentData.length)} of {currentData.length} {activeTab}
              </div>
              
              <div className="flex items-center space-x-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`p-2 ${
                    currentPage === 1 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ChevronLeft size={16} />
                </Button>
                
                {/* Page numbers */}
                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "ghost"}
                      size="sm"
                      onClick={() => goToPage(page)}
                      className={`w-8 h-8 ${
                        currentPage === page
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`p-2 ${
                    currentPage === totalPages 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <ChevronRight size={16} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Mobile Card View - Alternative view for better mobile experience */}
      <div className="lg:hidden mt-4 border-t">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Card View</h3>
            <p className="text-sm text-gray-500">Swipe table above to scroll →</p>
          </div>
          
          {paginatedData.length > 0 ? (
            <div className="space-y-4">
              {paginatedData.map(item => (
                activeTab === 'doctors' ? 
                  <DoctorCard key={item.id} doctor={item} /> : 
                  <UserCard key={item.id} user={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg mb-2">
                {currentData.length > 0 
                  ? `No ${activeTab} found matching your criteria` 
                  : `No ${activeTab} available`}
              </p>
              <p className="text-gray-400 text-sm">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorList;