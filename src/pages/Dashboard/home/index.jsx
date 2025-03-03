import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, HelpCircle, Activity } from 'lucide-react';

// Import components
import Sidebar from '../../../components/DashBoardcomponents/slideBar';
import UserList from '../dashboarduserlist';
import DoctorList from '../docterlist';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  
  // Monthly data for charts
  const monthlyUserData = [
    { name: 'Jan', users: 40 },
    { name: 'Feb', users: 55 },
    { name: 'Mar', users: 70 },
    { name: 'Apr', users: 85 },
    { name: 'May', users: 100 },
    { name: 'Jun', users: 115 },
  ];
  
  const profitData = [
    { name: 'Jan', profit: 12000 },
    { name: 'Feb', profit: 15000 },
    { name: 'Mar', profit: 18000 },
    { name: 'Apr', profit: 22000 },
    { name: 'May', profit: 25000 },
    { name: 'Jun', profit: 30000 },
  ];
  
  const enquiryData = [
    { name: 'Jan', enquiries: 85 },
    { name: 'Feb', enquiries: 95 },
    { name: 'Mar', enquiries: 120 },
    { name: 'Apr', enquiries: 110 },
    { name: 'May', enquiries: 130 },
    { name: 'Jun', enquiries: 150 },
  ];
  
  const specialtyDistribution = [
    { name: 'Cardiology', value: 12 },
    { name: 'Pediatrics', value: 9 },
    { name: 'Neurology', value: 8 },
    { name: 'Dermatology', value: 7 },
    { name: 'Orthopedics', value: 10 },
    { name: 'Other', value: 14 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Stats Card Component
  const StatsCard = ({ icon, title, value, bgColor }) => (
    <div className={`p-4 rounded-lg shadow ${bgColor} text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 bg-white bg-opacity-30 rounded-full">
          {icon}
        </div>
      </div>
    </div>
  );
  
  // Dashboard Overview Content
  const renderDashboardContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          icon={<Users size={24} className="text-blue-600" />} 
          title="Total Users" 
          value="350" 
          bgColor="bg-blue-500"
        />
        <StatsCard 
          icon={<DollarSign size={24} className="text-green-600" />} 
          title="Total Profit" 
          value="$122,000" 
          bgColor="bg-green-500"
        />
        <StatsCard 
          icon={<HelpCircle size={24} className="text-yellow-600" />} 
          title="Total Enquiries" 
          value="690" 
          bgColor="bg-yellow-500"
        />
        <StatsCard 
          icon={<Activity size={24} className="text-purple-600" />} 
          title="Total Doctors" 
          value="60" 
          bgColor="bg-purple-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyUserData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="users" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Profit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={profitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="profit" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Monthly Enquiries</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={enquiryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="enquiries" stroke="#FF8042" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Doctor Specialties</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={specialtyDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {specialtyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
  
  // Render different content based on active page
  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return renderDashboardContent();
      case 'users':
        return <UserList />;
      case 'doctors':
        return <DoctorList />;
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold">Page Under Construction</h3>
            <p className="text-gray-500 mt-2">This section is currently being developed</p>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Component */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      {/* Main content */}
      <div className="flex-1 p-6 pb-20 md:pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">
              {activePage === 'dashboard' && 'Dashboard Overview'}
              {activePage === 'users' && 'User Management'}
              {activePage === 'doctors' && 'Doctor Management'}
              {!['dashboard', 'users', 'doctors'].includes(activePage) && 'Healthcare Platform'}
            </h1>
            <p className="text-gray-500">Welcome back, Admin</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              A
            </div>
          </div>
        </div>
        
        {/* Dynamic Content based on active page */}
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;