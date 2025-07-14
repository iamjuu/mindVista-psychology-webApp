import React from 'react';
import PropTypes from 'prop-types';
import { Home, Users, Activity, Calendar, DollarSign, HelpCircle, Settings } from 'lucide-react';

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'doctors', label: 'Doctors', icon: <Activity size={20} /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} /> },
    { id: 'finance', label: 'Finance', icon: <DollarSign size={20} /> },
    { id: 'help', label: 'Help Center', icon: <HelpCircle size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="w-64 min-w-64 max-w-64 bg-gray-800 text-white min-h-screen p-4 hidden md:block flex-shrink-0">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Health Dashboard</h1>
        </div>
        <nav className="space-y-2">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActivePage(item.id)} 
              className={`flex items-center space-x-3 w-full p-3 rounded-lg transition ${
                activePage === item.id ? 'bg-blue-600' : 'hover:bg-gray-700'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 text-white z-10">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-7 gap-0.5 p-1 min-w-max">
            {menuItems.map(item => (
              <button 
                key={item.id}
                onClick={() => setActivePage(item.id)} 
                className={`flex flex-col items-center justify-center p-1.5 rounded-lg transition-colors min-w-[50px] ${
                  activePage === item.id ? 'text-blue-400 bg-gray-700' : 'hover:bg-gray-700'
                }`}
              >
                <div className="mb-0.5">
                  {React.cloneElement(item.icon, { size: 14 })}
                </div>
                <span className="text-[10px] text-center leading-tight whitespace-nowrap">
                  {item.label === 'Help Center' ? 'Help' : 
                   item.label === 'Appointments' ? 'Appts' : 
                   item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

// PropTypes validation
Sidebar.propTypes = {
  activePage: PropTypes.string.isRequired,
  setActivePage: PropTypes.func.isRequired,
};

export default Sidebar;