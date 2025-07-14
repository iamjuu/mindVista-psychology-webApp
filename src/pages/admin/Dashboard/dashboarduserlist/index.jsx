import { useEffect, useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
// import apiInstance from '../../../instance';

const DoctorList = () => {
  const [activeTab, setActiveTab] = useState('doctors');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [doctorData, setDoctorData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Items per page
  const itemsPerPage = 5;

  // Mock doctor data array - replace this with actual API call
  const mockDoctorData = [
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@mindvista.com',
      phone: '9876543210',
      specialization: 'Clinical Psychology',
      experience: '8 years',
      totalIncome: 145000,
      monthlyIncome: 18000,
      totalPatients: 156,
      joinDate: '2020-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@mindvista.com',
      phone: '9876543211',
      specialization: 'Cognitive Behavioral Therapy',
      experience: '6 years',
      totalIncome: 120000,
      monthlyIncome: 15000,
      totalPatients: 134,
      joinDate: '2021-03-22',
      status: 'active'
    },
    {
      id: '3',
      name: 'Dr. Amit Verma',
      email: 'amit.verma@mindvista.com',
      phone: '9876543212',
      specialization: 'Child Psychology',
      experience: '10 years',
      totalIncome: 180000,
      monthlyIncome: 22000,
      totalPatients: 198,
      joinDate: '2019-07-10',
      status: 'active'
    },
    {
      id: '4',
      name: 'Dr. Neha Patel',
      email: 'neha.patel@mindvista.com',
      phone: '9876543213',
      specialization: 'Marriage & Family Therapy',
      experience: '5 years',
      totalIncome: 95000,
      monthlyIncome: 12000,
      totalPatients: 89,
      joinDate: '2022-02-18',
      status: 'active'
    },
    {
      id: '5',
      name: 'Dr. Arjun Singh',
      email: 'arjun.singh@mindvista.com',
      phone: '9876543214',
      specialization: 'Addiction Therapy',
      experience: '12 years',
      totalIncome: 210000,
      monthlyIncome: 25000,
      totalPatients: 245,
      joinDate: '2018-09-05',
      status: 'active'
    },
    {
      id: '6',
      name: 'Dr. Kavitha Reddy',
      email: 'kavitha.reddy@mindvista.com',
      phone: '9876543215',
      specialization: 'Trauma Therapy',
      experience: '7 years',
      totalIncome: 132000,
      monthlyIncome: 16000,
      totalPatients: 142,
      joinDate: '2021-01-12',
      status: 'inactive'
    },
    {
      id: '7',
      name: 'Dr. Sanjay Gupta',
      email: 'sanjay.gupta@mindvista.com',
      phone: '9876543216',
      specialization: 'Anxiety & Depression',
      experience: '9 years',
      totalIncome: 165000,
      monthlyIncome: 20000,
      totalPatients: 178,
      joinDate: '2020-06-30',
      status: 'active'
    },
    {
      id: '8',
      name: 'Dr. Meera Joshi',
      email: 'meera.joshi@mindvista.com',
      phone: '9876543217',
      specialization: 'Stress Management',
      experience: '4 years',
      totalIncome: 85000,
      monthlyIncome: 11000,
      totalPatients: 76,
      joinDate: '2022-11-20',
      status: 'active'
    }
  ];

  // Mock user data array based on registration form
  const mockUserData = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@gmail.com',
      number: '9876543210',
      location: 'Mumbai',
      age: '32',
      slot: 'morning',
      time: '09:00-10:00',
      date: '2024-01-15',
      status: 'active'
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@gmail.com',
      number: '9876543211',
      location: 'Delhi',
      age: '28',
      slot: 'afternoon',
      time: '14:00-15:00',
      date: '2024-01-16',
      status: 'active'
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike.davis@gmail.com',
      number: '9876543212',
      location: 'Bangalore',
      age: '35',
      slot: 'evening',
      time: '18:00-19:00',
      date: '2024-01-17',
      status: 'active'
    },
    {
      id: '4',
      name: 'Emma Wilson',
      email: 'emma.wilson@gmail.com',
      number: '9876543213',
      location: 'Chennai',
      age: '29',
      slot: 'morning',
      time: '10:00-11:00',
      date: '2024-01-18',
      status: 'inactive'
    },
    {
      id: '5',
      name: 'David Brown',
      email: 'david.brown@gmail.com',
      number: '9876543214',
      location: 'Hyderabad',
      age: '42',
      slot: 'afternoon',
      time: '15:00-16:00',
      date: '2024-01-19',
      status: 'active'
    },
    {
      id: '6',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@gmail.com',
      number: '9876543215',
      location: 'Pune',
      age: '31',
      slot: 'evening',
      time: '19:00-20:00',
      date: '2024-01-20',
      status: 'active'
    }
  ]
  
  // Fetch data from API (commented out for demo)
  useEffect(() => {
    const loadMockData = () => {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        try {
          console.log('Mock doctor data loaded:', mockDoctorData);
          console.log('Mock user data loaded:', mockUserData);
          setDoctorData(mockDoctorData);
          setUserData(mockUserData);
        } catch (error) {
          console.error('Error loading mock data:', error);
          setError('Failed to load data. Please try again later.');
        } finally {
          setLoading(false);
        }
      }, 1000);
    };
    
    loadMockData();

  
  }, []);
  
  // Filter doctors based on search term and status
  const filteredDoctors = doctorData.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.experience.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doctor.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });

  // Filter users based on search term and status
  const filteredUsers = userData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.age.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.slot.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearch && matchesStatus;
  });
  
  // Get current data based on active tab
  const currentData = activeTab === 'doctors' ? filteredDoctors : filteredUsers;
  
  // Calculate pagination
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = currentData.slice(startIndex, startIndex + itemsPerPage);
  
  // Handle page change
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with Tabs */}
      <div className="p-4 border-b">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => {
              console.log('Switching to doctors tab');
              setActiveTab('doctors');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'doctors'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Doctors
          </button>
          <button
            onClick={() => {
              console.log('Switching to users tab');
              setActiveTab('users');
              setCurrentPage(1);
            }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Users
          </button>
        </div>
      </div>
      
      {/* Filters and search */}
      <div className="p-4 flex flex-col md:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search doctors by name, email, phone, specialization, or experience..."
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter size={18} className="text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Add User
          </button>
        </div>
      </div>
      
      {/* Loading and error states */}
      {loading && (
        <div className="p-8 text-center">
          <p className="text-gray-500">Loading doctors...</p>
        </div>
      )}
      
      {error && (
        <div className="p-8 text-center">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
      {/* Data table */}
      {!loading && !error && (
        <div className="overflow-x-auto">
          {activeTab === 'doctors' ? (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left font-semibold text-gray-600">ID</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Doctor Name</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Email</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Phone</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Specialization</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Experience</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Total Income</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Monthly Income</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Total Patients</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map(doctor => (
                    <tr key={doctor.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-gray-500">#{typeof doctor.id === 'number' ? doctor.id : doctor.id.slice(-4)}</td>
                      <td className="p-3 font-medium">{doctor.name}</td>
                      <td className="p-3 text-gray-500">{doctor.email}</td>
                      <td className="p-3 text-gray-500">{doctor.phone}</td>
                      <td className="p-3 text-gray-500">{doctor.specialization}</td>
                      <td className="p-3 text-gray-500">{doctor.experience}</td>
                      <td className="p-3 text-gray-500 font-semibold text-green-600">
                        ₹{doctor.totalIncome.toLocaleString()}
                      </td>
                      <td className="p-3 text-gray-500">
                        ₹{doctor.monthlyIncome.toLocaleString()}
                      </td>
                      <td className="p-3 text-gray-500">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                          {doctor.totalPatients} patients
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          doctor.status?.toLowerCase() === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {doctor.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:underline">Edit</button>
                          <button className="text-red-500 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="p-4 text-center text-gray-500">
                      {doctorData.length > 0 
                        ? 'No doctors found matching your criteria' 
                        : 'No doctors available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="p-3 text-left font-semibold text-gray-600">ID</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Name</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Email</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Phone</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Location</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Age</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Slot</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Time</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Date</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="p-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length > 0 ? (
                  paginatedData.map(user => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-gray-500">#{typeof user.id === 'number' ? user.id : user.id.slice(-4)}</td>
                      <td className="p-3 font-medium">{user.name}</td>
                      <td className="p-3 text-gray-500">{user.email}</td>
                      <td className="p-3 text-gray-500">{user.number}</td>
                      <td className="p-3 text-gray-500">{user.location}</td>
                      <td className="p-3 text-gray-500">{user.age}</td>
                      <td className="p-3 text-gray-500">
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
                      <td className="p-3 text-gray-500">{user.time}</td>
                      <td className="p-3 text-gray-500">{user.date}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.status?.toLowerCase() === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <button className="text-blue-500 hover:underline">Edit</button>
                          <button className="text-red-500 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="11" className="p-4 text-center text-gray-500">
                      {userData.length > 0 
                        ? 'No users found matching your criteria' 
                        : 'No users available'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
      
      {/* Pagination */}
      {!loading && !error && filteredDoctors.length > 0 && (
        <div className="p-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDoctors.length)} of {filteredDoctors.length} doctors
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border ${
                currentPage === 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              // Show current page, first, last, and adjacent pages
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-8 h-8 rounded-lg ${
                      currentPage === pageNumber
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                (pageNumber === 2 && currentPage > 3) ||
                (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
              ) {
                return <span key={pageNumber} className="px-1">...</span>;
              } else {
                return null;
              }
            })}
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border ${
                currentPage === totalPages 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorList;