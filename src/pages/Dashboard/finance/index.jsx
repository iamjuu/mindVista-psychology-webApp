import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, TrendingUp, TrendingDown, CreditCard, PieChart, Stethoscope } from 'lucide-react';

const Finance = () => {
  const [financeData, setFinanceData] = useState({
    totalUsers: 0,
    totalIncome: 0,
    monthlyGrowth: 0,
    totalAppointments: 0,
    averageRevenuePerUser: 0,
    totalDoctors: 0,
    availableDoctors: 0
  });

  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [filteredData, setFilteredData] = useState({
    users: [],
    totalAmount: 0,
    appointmentCount: 0
  });

  // Mock data for demonstration
  const mockUserData = [
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', phone: '9876543210', appointmentFee: 500, joinDate: '2024-01-10' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', phone: '9876543211', appointmentFee: 750, joinDate: '2024-01-11' },
    { id: '3', name: 'Mike Johnson', email: 'mike.johnson@example.com', phone: '9876543212', appointmentFee: 600, joinDate: '2024-01-12' },
    { id: '4', name: 'Sarah Wilson', email: 'sarah.wilson@example.com', phone: '9876543213', appointmentFee: 800, joinDate: '2024-01-13' },
    { id: '5', name: 'David Brown', email: 'david.brown@example.com', phone: '9876543214', appointmentFee: 450, joinDate: '2024-01-14' },
    { id: '6', name: 'Emily Davis', email: 'emily.davis@example.com', phone: '9876543215', appointmentFee: 650, joinDate: '2024-01-15' },
    { id: '7', name: 'Robert Miller', email: 'robert.miller@example.com', phone: '9876543216', appointmentFee: 700, joinDate: '2024-01-16' },
    { id: '8', name: 'Lisa Anderson', email: 'lisa.anderson@example.com', phone: '9876543217', appointmentFee: 550, joinDate: '2024-01-17' }
  ];

  // Mock doctor data
  const mockDoctorData = [
    { id: 1, name: 'Dr. Alex Martinez', specialization: 'Cardiology', patients: 45, rating: 4.8, available: true, experience: '8 years', phone: '+1 (555) 123-4567' },
    { id: 2, name: 'Dr. Sarah Johnson', specialization: 'Pediatrics', patients: 38, rating: 4.7, available: true, experience: '10 years', phone: '+1 (555) 234-5678' },
    { id: 3, name: 'Dr. William Chen', specialization: 'Neurology', patients: 42, rating: 4.9, available: false, experience: '15 years', phone: '+1 (555) 345-6789' },
    { id: 4, name: 'Dr. Maria Rodriguez', specialization: 'Dermatology', patients: 36, rating: 4.6, available: true, experience: '7 years', phone: '+1 (555) 456-7890' },
    { id: 5, name: 'Dr. James Wilson', specialization: 'Orthopedics', patients: 40, rating: 4.5, available: true, experience: '12 years', phone: '+1 (555) 567-8901' },
    { id: 6, name: 'Dr. Emily Taylor', specialization: 'Gynecology', patients: 32, rating: 4.8, available: false, experience: '9 years', phone: '+1 (555) 678-9012' },
    { id: 7, name: 'Dr. Michael Brown', specialization: 'Ophthalmology', patients: 38, rating: 4.7, available: true, experience: '11 years', phone: '+1 (555) 789-0123' },
    { id: 8, name: 'Dr. Lisa Anderson', specialization: 'Psychiatry', patients: 35, rating: 4.9, available: true, experience: '14 years', phone: '+1 (555) 890-1234' },
    { id: 9, name: 'Dr. Robert Garcia', specialization: 'Urology', patients: 30, rating: 4.6, available: false, experience: '8 years', phone: '+1 (555) 901-2345' },
    { id: 10, name: 'Dr. Jennifer Lee', specialization: 'Endocrinology', patients: 28, rating: 4.7, available: true, experience: '10 years', phone: '+1 (555) 012-3456' },
  ];

  const mockAppointments = [
    { id: 1, status: 'approved', fee: 500, date: '2024-01-15', doctorId: 1, doctorName: 'Dr. Alex Martinez', patientName: 'John Doe', patientId: '1' },
    { id: 2, status: 'approved', fee: 750, date: '2024-01-15', doctorId: 2, doctorName: 'Dr. Sarah Johnson', patientName: 'Jane Smith', patientId: '2' },
    { id: 3, status: 'declined', fee: 600, date: '2024-01-16', doctorId: 3, doctorName: 'Dr. William Chen', patientName: 'Mike Johnson', patientId: '3' },
    { id: 4, status: 'approved', fee: 800, date: '2024-01-16', doctorId: 4, doctorName: 'Dr. Maria Rodriguez', patientName: 'Sarah Wilson', patientId: '4' },
    { id: 5, status: 'approved', fee: 450, date: '2024-01-17', doctorId: 1, doctorName: 'Dr. Alex Martinez', patientName: 'David Brown', patientId: '5' },
    { id: 6, status: 'pending', fee: 650, date: '2024-01-17', doctorId: 5, doctorName: 'Dr. James Wilson', patientName: 'Emily Davis', patientId: '6' },
    { id: 7, status: 'approved', fee: 700, date: '2024-01-18', doctorId: 2, doctorName: 'Dr. Sarah Johnson', patientName: 'Robert Miller', patientId: '7' },
    { id: 8, status: 'approved', fee: 550, date: '2024-01-18', doctorId: 6, doctorName: 'Dr. Emily Taylor', patientName: 'Lisa Anderson', patientId: '8' }
  ];

  // Monthly revenue data
  const monthlyRevenue = [
    { month: 'Jan', revenue: 15000, appointments: 25 },
    { month: 'Feb', revenue: 18000, appointments: 30 },
    { month: 'Mar', revenue: 22000, appointments: 35 },
    { month: 'Apr', revenue: 25000, appointments: 40 },
    { month: 'May', revenue: 28000, appointments: 45 },
    { month: 'Jun', revenue: 32000, appointments: 50 },
  ];

  // User growth data
  const userGrowthData = [
    { month: 'Jan', users: 50, newUsers: 10 },
    { month: 'Feb', users: 75, newUsers: 25 },
    { month: 'Mar', users: 120, newUsers: 45 },
    { month: 'Apr', users: 180, newUsers: 60 },
    { month: 'May', users: 250, newUsers: 70 },
    { month: 'Jun', users: 350, newUsers: 100 },
  ];

  useEffect(() => {
    // Simulate API call to fetch finance data
    const fetchFinanceData = () => {
      setLoading(true);
      
      setTimeout(() => {
        // Calculate total users
        const totalUsers = mockUserData.length;
        
        // Calculate total income from approved appointments
        const approvedAppointments = mockAppointments.filter(app => app.status === 'approved');
        const totalIncome = approvedAppointments.reduce((sum, app) => sum + app.fee, 0);
        
        // Calculate monthly growth
        const currentMonth = monthlyRevenue[monthlyRevenue.length - 1].revenue;
        const previousMonth = monthlyRevenue[monthlyRevenue.length - 2].revenue;
        const monthlyGrowth = ((currentMonth - previousMonth) / previousMonth * 100).toFixed(1);
        
        // Calculate total appointments
        const totalAppointments = mockAppointments.length;
        
        // Calculate average revenue per user
        const averageRevenuePerUser = totalUsers > 0 ? (totalIncome / totalUsers).toFixed(0) : 0;
        
        // Calculate doctor statistics
        const totalDoctors = mockDoctorData.length;
        const availableDoctors = mockDoctorData.filter(doctor => doctor.available).length;
        
        setFinanceData({
          totalUsers,
          totalIncome,
          monthlyGrowth,
          totalAppointments,
          averageRevenuePerUser,
          totalDoctors,
          availableDoctors
        });
        
        setLoading(false);
      }, 1000);
    };
    
    fetchFinanceData();
  }, []);

  // Filter data based on selected doctor
  useEffect(() => {
    if (selectedDoctor === 'all') {
      setFilteredData({
        users: [],
        totalAmount: 0,
        appointmentCount: 0
      });
    } else {
      const doctorAppointments = mockAppointments.filter(
        appointment => appointment.doctorId === parseInt(selectedDoctor)
      );
      
      const approvedAppointments = doctorAppointments.filter(
        appointment => appointment.status === 'approved'
      );
      
      const totalAmount = approvedAppointments.reduce((sum, app) => sum + app.fee, 0);
      
      const users = approvedAppointments.map(appointment => {
        const userData = mockUserData.find(user => user.id === appointment.patientId);
        return {
          ...userData,
          appointmentFee: appointment.fee,
          appointmentDate: appointment.date,
          appointmentStatus: appointment.status
        };
      });
      
      setFilteredData({
        users,
        totalAmount,
        appointmentCount: doctorAppointments.length
      });
    }
  }, [selectedDoctor]);

  // Stats Card Component
  const StatsCard = ({ icon, title, value, subtext, trend, bgColor }) => (
    <div className={`p-6 rounded-lg shadow-lg ${bgColor} text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {subtext && <p className="text-sm opacity-80">{subtext}</p>}
        </div>
        <div className="p-3 bg-white bg-opacity-20 rounded-full">
          {icon}
        </div>
      </div>
      {trend && (
        <div className="mt-4 flex items-center">
          {trend > 0 ? (
            <TrendingUp size={16} className="text-green-300" />
          ) : (
            <TrendingDown size={16} className="text-red-300" />
          )}
          <span className="ml-2 text-sm">
            {trend > 0 ? '+' : ''}{trend}% from last month
          </span>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading finance data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800">Finance Overview</h2>
        <p className="text-gray-600 mt-2">Monitor your platform's financial performance and user metrics</p>
      </div>

      {/* Doctor Selection Navbar */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Doctor Analytics</h3>
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Select Doctor:</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Doctors</option>
              {mockDoctorData.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} ({doctor.specialization})
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Doctor-specific stats */}
        {selectedDoctor !== 'all' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800">Total Patients</h4>
              <p className="text-2xl font-bold text-blue-600">{filteredData.users.length}</p>
              <p className="text-sm text-blue-600">Paid patients</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800">Total Revenue</h4>
              <p className="text-2xl font-bold text-green-600">₹{filteredData.totalAmount.toLocaleString()}</p>
              <p className="text-sm text-green-600">From approved appointments</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h4 className="font-medium text-purple-800">Total Appointments</h4>
              <p className="text-2xl font-bold text-purple-600">{filteredData.appointmentCount}</p>
              <p className="text-sm text-purple-600">All appointments</p>
            </div>
          </div>
                 )}
       </div>

      {/* Doctor-specific User List */}
      {selectedDoctor !== 'all' && filteredData.users.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Patient List - {mockDoctorData.find(d => d.id === parseInt(selectedDoctor))?.name}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-900">Patient Name</th>
                  <th className="px-4 py-3 font-medium text-gray-900">Email</th>
                  <th className="px-4 py-3 font-medium text-gray-900">Phone</th>
                  <th className="px-4 py-3 font-medium text-gray-900">Appointment Date</th>
                  <th className="px-4 py-3 font-medium text-gray-900">Amount Paid</th>
                  <th className="px-4 py-3 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                    <td className="px-4 py-3 text-gray-600">{user.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{user.appointmentDate}</td>
                    <td className="px-4 py-3 font-medium text-green-600">₹{user.appointmentFee}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {user.appointmentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Summary for selected doctor */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-800">
                Summary for {mockDoctorData.find(d => d.id === parseInt(selectedDoctor))?.name}
              </span>
              <div className="flex space-x-6">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-blue-600">{filteredData.users.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-600">₹{filteredData.totalAmount.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Average per Patient</p>
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{filteredData.users.length > 0 ? (filteredData.totalAmount / filteredData.users.length).toFixed(0) : 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Message when no data for selected doctor */}
      {selectedDoctor !== 'all' && filteredData.users.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Stethoscope size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Paid Appointments Found
            </h3>
            <p className="text-gray-500">
              {mockDoctorData.find(d => d.id === parseInt(selectedDoctor))?.name} has no approved appointments with payments yet.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards - Only show on overview (All Doctors) */}
      {selectedDoctor === 'all' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatsCard 
            icon={<Users size={24} />} 
            title="Total Users" 
            value={financeData.totalUsers}
            subtext="Registered users"
            bgColor="bg-blue-500"
          />
          <StatsCard 
            icon={<DollarSign size={24} />} 
            title="Total Income" 
            value={`₹${financeData.totalIncome.toLocaleString()}`}
            subtext="From approved appointments"
            trend={parseFloat(financeData.monthlyGrowth)}
            bgColor="bg-green-500"
          />
          <StatsCard 
            icon={<CreditCard size={24} />} 
            title="Avg Revenue/User" 
            value={`₹${financeData.averageRevenuePerUser}`}
            subtext="Per user revenue"
            bgColor="bg-purple-500"
          />
          <StatsCard 
            icon={<PieChart size={24} />} 
            title="Total Appointments" 
            value={financeData.totalAppointments}
            subtext="All appointments"
            bgColor="bg-orange-500"
          />
          <StatsCard 
            icon={<Stethoscope size={24} />} 
            title="Total Doctors" 
            value={financeData.totalDoctors}
            subtext={`${financeData.availableDoctors} available`}
            bgColor="bg-indigo-500"
          />
        </div>
      )}

      {/* Charts Section - Only show on overview (All Doctors) */}
      {selectedDoctor === 'all' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Monthly Revenue</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* User Growth Chart */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">User Growth</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#3B82F6" name="Total Users" />
                <Bar dataKey="newUsers" fill="#8B5CF6" name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Doctor Overview - Only show on overview (All Doctors) */}
      {selectedDoctor === 'all' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Doctor Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doctor List */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">All Doctors ({financeData.totalDoctors})</h4>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {mockDoctorData.map((doctor) => (
                  <div key={doctor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${doctor.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <div>
                        <p className="font-medium text-gray-900">{doctor.name}</p>
                        <p className="text-sm text-gray-600">{doctor.specialization}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{doctor.patients} patients</p>
                      <p className="text-xs text-gray-500">{doctor.experience}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Specialization Breakdown */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Specialization Breakdown</h4>
              <div className="space-y-3">
                {Array.from(new Set(mockDoctorData.map(d => d.specialization))).map((specialization) => {
                  const count = mockDoctorData.filter(d => d.specialization === specialization).length;
                  const totalPatients = mockDoctorData.filter(d => d.specialization === specialization).reduce((sum, d) => sum + d.patients, 0);
                  const avgRating = (mockDoctorData.filter(d => d.specialization === specialization).reduce((sum, d) => sum + d.rating, 0) / count).toFixed(1);
                  
                  return (
                    <div key={specialization} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{specialization}</p>
                          <p className="text-sm text-gray-600">{count} doctor{count > 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{totalPatients} patients</p>
                          <p className="text-xs text-gray-500">★ {avgRating} rating</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Breakdown - Only show on overview (All Doctors) */}
      {selectedDoctor === 'all' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Revenue Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-medium text-green-800">Approved Appointments</h4>
              <p className="text-2xl font-bold text-green-600">
                {mockAppointments.filter(app => app.status === 'approved').length}
              </p>
              <p className="text-sm text-green-600">
                Revenue: ₹{mockAppointments.filter(app => app.status === 'approved').reduce((sum, app) => sum + app.fee, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h4 className="font-medium text-yellow-800">Pending Appointments</h4>
              <p className="text-2xl font-bold text-yellow-600">
                {mockAppointments.filter(app => app.status === 'pending').length}
              </p>
              <p className="text-sm text-yellow-600">
                Potential: ₹{mockAppointments.filter(app => app.status === 'pending').reduce((sum, app) => sum + app.fee, 0).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-800">Declined Appointments</h4>
              <p className="text-2xl font-bold text-red-600">
                {mockAppointments.filter(app => app.status === 'declined').length}
              </p>
              <p className="text-sm text-red-600">
                Lost: ₹{mockAppointments.filter(app => app.status === 'declined').reduce((sum, app) => sum + app.fee, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions - Only show on overview (All Doctors) */}
      {selectedDoctor === 'all' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-900">Appointment ID</th>
                  <th className="px-4 py-3 font-medium text-gray-900">Status</th>
                  <th className="px-4 py-3 font-medium text-gray-900">Amount</th>
                  <th className="px-4 py-3 font-medium text-gray-900">Date</th>
                </tr>
              </thead>
              <tbody>
                {mockAppointments.slice(0, 5).map((appointment) => (
                  <tr key={appointment.id} className="border-b border-gray-200">
                    <td className="px-4 py-3">#{appointment.id}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        appointment.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : appointment.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium">₹{appointment.fee}</td>
                    <td className="px-4 py-3 text-gray-600">{appointment.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Finance; 