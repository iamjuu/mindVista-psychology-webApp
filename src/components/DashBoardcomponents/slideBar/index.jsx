import PropTypes from 'prop-types';
import { Home, Users, Activity, Calendar, DollarSign, HelpCircle, Settings, Video, MessageSquare } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

// Constants for icon sizes
const ICON_SIZE = 20;

const Sidebar = ({ activePage, setActivePage }) => {
  const { themeClasses } = useTheme();
  console.log('Rendering Sidebar with active page:', activePage);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={ICON_SIZE} /> },
    { id: 'users', label: 'Users', icon: <Users size={ICON_SIZE} /> },
    { id: 'doctors', label: 'Doctors', icon: <Activity size={ICON_SIZE} /> },
    { id: 'appointments', label: 'Appointments', icon: <Calendar size={ICON_SIZE} /> },
    { id: 'today-appointments', label: 'Today\'s Sessions', icon: <Video size={ICON_SIZE} /> },
    { id: 'rewiew', label: 'Reviews', icon: <MessageSquare size={ICON_SIZE} /> },
    { id: 'finance', label: 'Finance', icon: <DollarSign size={ICON_SIZE} /> },
    { id: 'help', label: 'Help Center', icon: <HelpCircle size={ICON_SIZE} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={ICON_SIZE} /> }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-64 ${themeClasses.bg} ${themeClasses.text} p-4 hidden md:flex flex-col transition-all duration-300 ease-in-out z-20`}>
        <div className="mb-8">
          <h1 className={`text-xl text-center font-bold ${themeClasses.text}`}>MindVista </h1>
        </div>
        <nav className=" flex flex-col gap-1">
          {menuItems.map(item => (
            <button 
              key={item.id}
              onClick={() => {
                console.log('Clicked menu item:', item.label);
                setActivePage(item.id);
              }} 
              className={`flex items-center text-[14px] gap-4 w-full p-4 rounded-lg transition-all duration-200 ${
                activePage === item.id 
                  ? `bg-blue-600 text-white transform scale-[1.02] shadow-lg` 
                  : `${themeClasses.bgSecondary} ${themeClasses.text} ${themeClasses.bgHover}`
              }`}
            >
              <span className={`transition-transform duration-200 ${activePage === item.id ? 'transform scale-110' : ''}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 ${themeClasses.bg} ${themeClasses.text} z-20 shadow-lg border-t ${themeClasses.border}`}>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex justify-between items-center p-2 px-4">
            {menuItems.map(item => (
              <button 
                key={item.id}
                onClick={() => {
                  console.log('Clicked mobile menu item:', item.label);
                  setActivePage(item.id);
                }} 
                className={`flex flex-col text-[12px] items-center justify-center p-2 rounded-lg transition-all duration-200 min-w-[60px] ${
                  activePage === item.id 
                    ? 'bg-blue-600 text-white transform scale-105 shadow-lg' 
                    : `${themeClasses.bgSecondary} ${themeClasses.text} ${themeClasses.bgHover}`
                }`}
              >
                <div className={`mb-1 transition-transform duration-200 ${activePage === item.id ? 'transform scale-110' : ''}`}>
                  {item.icon}
                </div>
                <span className="text-[10px] font-medium text-center leading-tight whitespace-nowrap">
                  {item.label === 'Help Center' ? 'Help' : 
                   item.label === 'Appointments' ? 'Appts' : 
                   item.label === 'Today\'s Sessions' ? 'Today' :
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