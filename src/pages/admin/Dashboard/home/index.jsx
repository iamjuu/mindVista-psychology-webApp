import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Import components
import Sidebar from '../../../../components/DashBoardcomponents/slideBar';
import UserList from '../dashboarduserlist';
import DoctorList from '../docterlist';
import Appoiment from '../appoinment';
import Finance from '../finance';

const Dashboard = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedDoctorId, setSelectedDoctorId] = useState(1);
  
  // Doctor data with individual information
  const doctorsData = [
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      specialization: 'Clinical Psychology',
      totalIncome: 145000,
      totalPatients: 156,
      bgColor: 'bg-blue-500',
      monthlyIncome: [
        { name: 'Jan', income: 18000 },
        { name: 'Feb', income: 20000 },
        { name: 'Mar', income: 22000 },
        { name: 'Apr', income: 19000 },
        { name: 'May', income: 25000 },
        { name: 'Jun', income: 28000 },
      ],
      patientGrowth: [
        { name: 'Jan', patients: 20 },
        { name: 'Feb', patients: 25 },
        { name: 'Mar', patients: 30 },
        { name: 'Apr', patients: 35 },
        { name: 'May', patients: 40 },
        { name: 'Jun', patients: 45 },
      ]
    },
    {
      id: 2,
      name: 'Dr. Priya Sharma',
      specialization: 'Cognitive Behavioral Therapy',
      totalIncome: 120000,
      totalPatients: 134,
      bgColor: 'bg-green-500',
      monthlyIncome: [
        { name: 'Jan', income: 15000 },
        { name: 'Feb', income: 17000 },
        { name: 'Mar', income: 19000 },
        { name: 'Apr', income: 16000 },
        { name: 'May', income: 21000 },
        { name: 'Jun', income: 24000 },
      ],
      patientGrowth: [
        { name: 'Jan', patients: 18 },
        { name: 'Feb', patients: 22 },
        { name: 'Mar', patients: 26 },
        { name: 'Apr', patients: 30 },
        { name: 'May', patients: 35 },
        { name: 'Jun', patients: 38 },
      ]
    },
    {
      id: 3,
      name: 'Dr. Amit Verma',
      specialization: 'Child Psychology',
      totalIncome: 180000,
      totalPatients: 198,
      bgColor: 'bg-purple-500',
      monthlyIncome: [
        { name: 'Jan', income: 22000 },
        { name: 'Feb', income: 24000 },
        { name: 'Mar', income: 26000 },
        { name: 'Apr', income: 28000 },
        { name: 'May', income: 30000 },
        { name: 'Jun', income: 32000 },
      ],
      patientGrowth: [
        { name: 'Jan', patients: 25 },
        { name: 'Feb', patients: 30 },
        { name: 'Mar', patients: 35 },
        { name: 'Apr', patients: 40 },
        { name: 'May', patients: 45 },
        { name: 'Jun', patients: 50 },
      ]
    },
    {
      id: 4,
      name: 'Dr. Neha Patel',
      specialization: 'Marriage & Family Therapy',
      totalIncome: 95000,
      totalPatients: 89,
      bgColor: 'bg-orange-500',
      monthlyIncome: [
        { name: 'Jan', income: 12000 },
        { name: 'Feb', income: 14000 },
        { name: 'Mar', income: 15000 },
        { name: 'Apr', income: 16000 },
        { name: 'May', income: 18000 },
        { name: 'Jun', income: 20000 },
      ],
      patientGrowth: [
        { name: 'Jan', patients: 12 },
        { name: 'Feb', patients: 15 },
        { name: 'Mar', patients: 18 },
        { name: 'Apr', patients: 22 },
        { name: 'May', patients: 25 },
        { name: 'Jun', patients: 28 },
      ]
    },
    {
      id: 5,
      name: 'Dr. Arjun Singh',
      specialization: 'Addiction Therapy',
      totalIncome: 210000,
      totalPatients: 245,
      bgColor: 'bg-indigo-500',
      monthlyIncome: [
        { name: 'Jan', income: 25000 },
        { name: 'Feb', income: 27000 },
        { name: 'Mar', income: 29000 },
        { name: 'Apr', income: 31000 },
        { name: 'May', income: 33000 },
        { name: 'Jun', income: 35000 },
      ],
      patientGrowth: [
        { name: 'Jan', patients: 30 },
        { name: 'Feb', patients: 35 },
        { name: 'Mar', patients: 40 },
        { name: 'Apr', patients: 45 },
        { name: 'May', patients: 50 },
        { name: 'Jun', patients: 55 },
      ]
    }
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  
  // Get selected doctor data
  const selectedDoctor = doctorsData.find(doctor => doctor.id === selectedDoctorId) || doctorsData[0];
  
  // Doctor Card Component
  const DoctorCard = ({ doctor, isSelected, onClick }) => (
    <div 
      className={`p-4 rounded-lg shadow cursor-pointer transition-all duration-200 transform hover:scale-105 ${
        doctor.bgColor
      } ${isSelected ? 'ring-4 ring-white ring-opacity-50' : ''} text-white`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{doctor.name}</p>  
          <p className="text-lg font-bold">{doctor.specialization}</p>
          <p className="text-xs opacity-70 mt-1">{doctor.totalPatients} patients</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-80">Total Income</p>
          <p className="text-xl font-bold">₹{doctor.totalIncome.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
  
  // Dashboard Overview Content
  const renderDashboardContent = () => (
    <div className="space-y-6">
      {/* Doctor Cards */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Doctor Performance Dashboard</h3>
        <p className="text-gray-600 mb-4">Click on any doctor card to view their detailed analytics</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {doctorsData.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              isSelected={selectedDoctorId === doctor.id}
              onClick={() => setSelectedDoctorId(doctor.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Selected Doctor Info */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-2">
          {selectedDoctor.name} - Analytics Dashboard
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Specialization</p>
            <p className="text-lg font-semibold">{selectedDoctor.specialization}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Patients</p>
            <p className="text-lg font-semibold text-blue-600">{selectedDoctor.totalPatients}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Income</p>
            <p className="text-lg font-semibold text-green-600">₹{selectedDoctor.totalIncome.toLocaleString()}</p>
          </div>
        </div>
      </div>
      
      {/* Charts for Selected Doctor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Monthly Income - {selectedDoctor.name}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={selectedDoctor.monthlyIncome}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Income']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Patient Growth - {selectedDoctor.name}
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={selectedDoctor.patientGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => [value, 'Patients']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Bar 
                dataKey="patients" 
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Summary Statistics */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              ₹{selectedDoctor.monthlyIncome[selectedDoctor.monthlyIncome.length - 1].income.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Latest Monthly Income</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {selectedDoctor.patientGrowth[selectedDoctor.patientGrowth.length - 1].patients}
            </p>
            <p className="text-sm text-gray-600">Monthly New Patients</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              ₹{Math.round(selectedDoctor.totalIncome / selectedDoctor.totalPatients).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Average Income per Patient</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {Math.round(selectedDoctor.monthlyIncome.reduce((acc, curr) => acc + curr.income, 0) / selectedDoctor.monthlyIncome.length).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Avg Monthly Income</p>
          </div>
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
      case 'appointments':
        return <Appoiment/>;
      case 'finance':
        return <Finance />;
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
              {activePage === 'appointments' && 'Appointment Management'}
              {activePage === 'finance' && 'Finance Overview'}
              {!['dashboard', 'users', 'doctors', 'appointments', 'finance'].includes(activePage) && ''}
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