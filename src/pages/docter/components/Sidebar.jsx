import { Users, LogOut, X, Star, Clock, TrendingUp, Calendar, Settings, CalendarDays } from 'lucide-react';
import { Button } from '../../../components/shadcn/button/button';
import {MindvistaLogo } from "../../../assets"
import { PageHeader } from '../../../components/core/cardHeader';

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  doctorData,
  selectedTab,
  setSelectedTab,
  handleNavigate,
  profileRefreshing,
  fetchDoctorProfile,
  handleLogout
}) => {
  console.log(doctorData.profilePicture,'full data')
  return (
    <div className={`fixed lg:fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
      sidebarOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Sidebar Header */}
        <div className=" border-b border-gray-200 bg-[#1d4ed8] text-white flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex  items-center">
                <img  className='w-20' src={MindvistaLogo} alt="" />
              {/* <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center mr-3">
                <Users size={24} />
              </div> */}
              <div className=''>
                <h2 className="text-lg font-semibold">Mindvista</h2>
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
        <div className="p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
              {/* {doctorData.name?.split(' ').map(n => n[0]).join('') || 'D'}   */}

              <img src={doctorData.profilePicture} alt="" />
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
                <PageHeader
                title={doctorData.patients || 0}
                description='Patients'
                />
            </div>
            <div className="bg-green-50 p-3 rounded-lg text-center">

                <PageHeader
                title={`${doctorData.experience || 0}y`}
                description="experience"
                />
    
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto">
          <ul className="flex flex-col gap-2 w-full px-3">
            <li>
              <button 
                onClick={() => setSelectedTab('overview')}
                className={`flex items-center text-sm gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
                  selectedTab === 'overview' 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedTab === 'overview' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <TrendingUp size={16} />
                </div>
                <span className="font-medium">Overview</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedTab('patients')}
                className={`flex items-center text-sm gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
                  selectedTab === 'patients' 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedTab === 'patients' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Users size={16} />
                </div>
                <span className="font-medium">Patients</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedTab('appointments')}
                className={`flex items-center text-sm gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
                  selectedTab === 'appointments' 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedTab === 'appointments' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Calendar size={16} />
                </div>
                <span className="font-medium">Appointments</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedTab('availableSlots')}
                className={`flex items-center text-sm gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
                  selectedTab === 'availableSlots' 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedTab === 'availableSlots' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <CalendarDays size={16} />
                </div>
                <span className="font-medium">Available Slots</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigate('todaySessions')}
                className={`flex items-center text-sm gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
                  selectedTab === 'todaySessions' 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedTab === 'todaySessions' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Clock size={16} />
                </div>
                <span className="font-medium">Today&apos;s Sessions</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavigate('upcoming')}
                className={`flex items-center text-sm gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
                  selectedTab === 'upcoming' 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedTab === 'upcoming' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <TrendingUp size={16} />
                </div>
                <span className="font-medium">Upcoming</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => setSelectedTab('settings')}
                className={`flex items-center text-sm gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
                  selectedTab === 'settings' 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  selectedTab === 'settings' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Settings size={16} />
                </div>
                <span className="font-medium">Settings</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 flex-shrink-0">
          <Button
            onClick={fetchDoctorProfile}
            className="w-full text-sm flex items-center justify-center gap-2"
            disabled={profileRefreshing}
          >
            {profileRefreshing ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh Profile</span>
              </>
            )}
          </Button>
          
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full mt-2 text-sm bg-red-50 text-red-600 border-red-200 hover:bg-red-100 flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
