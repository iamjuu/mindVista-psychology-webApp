import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Import components
import Sidebar from "../../../../components/DashBoardcomponents/slideBar";
import UserList from "../dashboarduserlist";
import DoctorList from "../docterlist";
import Appoiment from "../appoinment";
import TodayAppointments from "../TodayAppointments";
import Finance from "../finance";
import Settings from "../settings";

import ReivewPage from "../rewiew";
import { BadgeImage } from "../../../../assets";
import { Search, Bell, Calendar, SearchCheck, LogOut } from "lucide-react";
import { useTheme } from "../../../../contexts/ThemeContext";
import { IconBtn } from "../../../../components/core/button";
import apiInstance from "../../../../instance";

// DoctorCard PropTypes
const DoctorCardPropTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    specialization: PropTypes.string.isRequired,
    totalPatients: PropTypes.number.isRequired,
    totalIncome: PropTypes.number.isRequired,
    bgColor: PropTypes.string.isRequired,
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

const Dashboard = () => {
  const { themeClasses } = useTheme();
  const filterMenuRef = useRef(null);
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [doctorsData, setDoctorsData] = useState([]);
  const [doctorsProgress, setDoctorsProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorSearchQuery, setDoctorSearchQuery] = useState("");
  const [doctorStatusFilter, setDoctorStatusFilter] = useState("all");
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [timeHistory, setTimeHistory] = useState([]);
  const timerIntervalRef = useRef(null);
  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
    tags: [],
    date: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    }),
  });
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Text Inputs for Design System",
      description: "Search for inspiration to provide a rich content of te...",
      completed: false,
    },
    {
      id: 2,
      title: "Meeting with Arthur Taylor",
      description: "Discuss the MVP version of Apex Mobile and Deskt...",
      completed: false,
    },
    {
      id: 3,
      title: "Check neutral and state colors",
      description: "Button components will be revised and designed ag...",
      completed: false,
    },
  ]);

  // Functions for note management
  const handleAddNote = () => {
    if (newNote.title.trim() && newNote.description.trim()) {
      const note = {
        id: Date.now(),
        title: newNote.title,
        description: newNote.description,
        completed: false,
      };
      setNotes([note, ...notes]);
      setNewNote({
        title: "",
        description: "",
        tags: [],
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        }),
      });
      setShowAddNoteModal(false);
    }
  };

  const toggleNoteCompletion = (noteId) => {
    setNotes(
      notes.map((note) =>
        note.id === noteId ? { ...note, completed: !note.completed } : note
      )
    );
  };

  const deleteNote = (noteId) => {
    setNotes(notes.filter((note) => note.id !== noteId));
  };

  // Filter doctors based on search and status
  const getFilteredDoctors = () => {
    let filtered = [...doctorsProgress];

    // Apply search filter
    if (doctorSearchQuery.trim()) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
          doctor.specialization.toLowerCase().includes(doctorSearchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (doctorStatusFilter !== "all") {
      filtered = filtered.filter(
        (doctor) => doctor.status.toLowerCase().replace(" ", "-") === doctorStatusFilter
      );
    }

    // Limit to 4 doctors if not showing all
    if (!showAllDoctors) {
      filtered = filtered.slice(0, 4);
    }

    return filtered;
  };

  // Handle filter selection
  const handleFilterChange = (status) => {
    setDoctorStatusFilter(status);
    setShowFilterMenu(false);
  };

  // Count active filters
  const getActiveFilterCount = () => {
    return doctorStatusFilter !== "all" ? 1 : 0;
  };

  // Format time display (seconds to HH:MM:SS)
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Start/Stop Timer
  const toggleTimer = () => {
    if (isTracking) {
      // Stop timer
      clearInterval(timerIntervalRef.current);
      if (currentTime > 0) {
        // Save to history
        const newEntry = {
          id: Date.now(),
          date: new Date().toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
          }),
          time: formatTime(currentTime),
          seconds: currentTime,
          timestamp: new Date().toISOString()
        };
        setTimeHistory([newEntry, ...timeHistory]);
        // Save to localStorage
        const updatedHistory = [newEntry, ...timeHistory];
        localStorage.setItem('dashboardTimeHistory', JSON.stringify(updatedHistory));
      }
      setCurrentTime(0);
      setIsTracking(false);
    } else {
      // Start timer
      setIsTracking(true);
      timerIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => prev + 1);
      }, 1000);
    }
  };

  // Load time history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('dashboardTimeHistory');
    if (savedHistory) {
      try {
        setTimeHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading time history:', error);
      }
    }
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch doctors with stats
        const doctorsResponse = await apiInstance.get("/api/dashboard/doctors");

        if (doctorsResponse.data.success) {
          const doctors = doctorsResponse.data.data;

          // Add background colors to doctors
          const bgColors = [
            "bg-blue-500",
            "bg-green-500",
            "bg-purple-500",
            "bg-orange-500",
            "bg-indigo-500",
            "bg-pink-500",
            "bg-yellow-500",
            "bg-red-500",
          ];
          const doctorsWithColors = doctors.map((doctor, index) => ({
            ...doctor,
            bgColor: bgColors[index % bgColors.length],
          }));

          setDoctorsData(doctorsWithColors);

          // Set first doctor as selected if not already set
          if (doctorsWithColors.length > 0) {
            setSelectedDoctorId(doctorsWithColors[0].id);
          }
        }

        // Fetch doctors work progress
        const progressResponse = await apiInstance.get("/api/dashboard/doctors-progress");
        
        if (progressResponse.data.success) {
          setDoctorsProgress(progressResponse.data.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Handle click outside filter menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };

    if (showFilterMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showFilterMenu]);

  // Get selected doctor data
  const selectedDoctor =
    doctorsData.find((doctor) => doctor.id === selectedDoctorId) ||
    doctorsData[0];

  // Doctor Card Component
  const DoctorCard = ({ doctor, isSelected, onClick }) => (
    <div
      className={`p-4 rounded-lg shadow cursor-pointer transition-all duration-200 transform hover:scale-105 ${
        doctor.bgColor
      } ${isSelected ? "ring-4 ring-white ring-opacity-50" : ""} text-white`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{doctor.name}</p>
          <p className="text-[14px] font-bold">{doctor.specialization}</p>
          <p className="text-xs opacity-70 mt-1">
            {doctor.totalPatients} patients
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-80">Total Income</p>
          <p className="text-[14px] font-bold">
            ₹{doctor.totalIncome.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );

  // Add PropTypes to DoctorCard
  DoctorCard.propTypes = DoctorCardPropTypes;

  // Dashboard Overview Content
  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      );
    }

    if (!doctorsData.length) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600">No data available</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-2">
        {/* Doctor Cards */}
        <div>
          {/* <h3 className="text-lg font-semibold mb-4">Doctor Performance Dashboard</h3> */}
          {/* <p className="text-gray-600 mb-4">Click on any doctor card to view their detailed analytics</p> */}
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Daily Work Hours Card */}
          <div className="flex flex-col gap-2 justify-between">
            <div className={`p-4 ${themeClasses.bgCard} rounded-lg border ${themeClasses.border}`}>
              <div className="flex items-center justify-between ">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className={`text-[14px] font-semibold ${themeClasses.text}`}>
                    Daily Work Hours
                  </h3>
                </div>
                <button className={`px-4 py-1 text-sm font-medium ${themeClasses.text} rounded-lg ${themeClasses.bgHover} border ${themeClasses.border} transition-colors`}>
                  Details
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className={`text-[12px] font-bold ${themeClasses.text}`}>
                  12 hours 41 minutes in total
                </span>
                <div className={`w-6 h-6 ${themeClasses.bgSecondary} rounded-lg flex items-center justify-center`}>
                  <svg
                    className={`w-4 h-4 ${themeClasses.textSecondary}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className={`w-full h-2 ${themeClasses.bgSecondary} rounded-full overflow-hidden flex`}>
                  <div
                    className="h-full bg-yellow-400 flex-shrink-0"
                    style={{ width: "33%" }}
                  ></div>
                  <div
                    className="h-full bg-blue-400 flex-shrink-0"
                    style={{ width: "45%" }}
                  ></div>
                  <div
                    className="h-full bg-purple-400 flex-shrink-0"
                    style={{ width: "22%" }}
                  ></div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className={`text-sm ${themeClasses.textSecondary}`}>Pause Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span className={`text-sm ${themeClasses.textSecondary}`}>Active Time</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span className={`text-sm ${themeClasses.textSecondary}`}>Extra Time</span>
                </div>
              </div>
            </div>

            {/* Course Progress Card */}
            <div className={`${themeClasses.bgCard} p-4 rounded-lg border ${themeClasses.border}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className={`text-[14px] font-semibold ${themeClasses.text}`}>
                    Course Progress
                  </h3>
                </div>
                <button className={`px-3 py-1 text-xs font-medium ${themeClasses.textSecondary} border ${themeClasses.border} rounded-lg ${themeClasses.bgHover} transition-colors`}>
                  See All
                </button>
              </div>

              <div className="flex items-center gap-4">
                {/* Circular Progress */}
                <div className="relative w-16 h-16">
                  <svg
                    className="w-16 h-16 transform -rotate-90"
                    viewBox="0 0 36 36"
                  >
                    {/* Background circle */}
                    <path
                      className={`${themeClasses.border === 'border-gray-700' ? 'stroke-gray-700' : 'stroke-gray-200'}`}
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Progress circle */}
                    <path
                      className="stroke-purple-500"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="25, 100"
                      d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  {/* Percentage text */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`text-sm font-semibold ${themeClasses.text}`}>
                      25%
                    </span>
                  </div>
                </div>

                {/* Course Info */}
                <div className="flex-1">
                  <h4 className={`text-sm font-semibold ${themeClasses.text} mb-1`}>
                    Team Diversity Training
                  </h4>
                  <p className={`text-xs ${themeClasses.textMuted} mb-3`}>
                    Designed to foster inclusivity and leverage diverse
                    perspectives.
                  </p>
                  <a
                    href="#"
                    className="text-xs text-purple-600 underline hover:text-purple-700 transition-colors"
                  >
                    Resume Course
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Card */}
          <div className={`${themeClasses.bgCard} p-4 rounded-lg border ${themeClasses.border}`}>
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 ${themeClasses.bgSecondary} rounded-lg flex items-center justify-center`}>
                  <svg
                    className={`w-5 h-5 ${themeClasses.textSecondary}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className={`text-[14px] font-semibold ${themeClasses.text}`}>
                  Notes
                </h3>
              </div>
              <button
                onClick={() => setShowAddNoteModal(true)}
                className={`px-3 py-1 text-xs font-medium ${themeClasses.textSecondary} ${themeClasses.bgSecondary} border ${themeClasses.border} rounded-lg ${themeClasses.bgHover} transition-colors`}
              >
                + Add Note
              </button>
            </div>

            {/* Notes List */}
            <div className="flex  flex-col gap-2 px-3 py-2 max-h-60 overflow-y-auto">
              {notes.map((note) => (
                <div key={note.id} className="flex gap-4 items-start">
                  <input
                    type="checkbox"
                    checked={note.completed}
                    onChange={() => toggleNoteCompletion(note.id)}
                    className={`mt-1 w-4 h-4 text-blue-600 ${themeClasses.border} rounded focus:ring-blue-500`}
                  />
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex flex-col w-full">
                      <h4
                        className={`text-sm font-medium ${
                          note.completed
                            ? `${themeClasses.textMuted} line-through`
                            : themeClasses.text
                        }`}
                      >
                        {note.title}
                      </h4>
                      <p
                        className={`text-xs ${
                          note.completed ? themeClasses.textMuted : themeClasses.textSecondary
                        }`}
                      >
                        {note.description}
                      </p>
                    </div>
                  </div>
                  {note.completed && (
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="mt-1 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-colors"
                      title="Delete note"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Note Modal */}
          {showAddNoteModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className={`${themeClasses.bgCard} p-6 rounded-lg shadow-lg w-full max-w-md mx-4`}>
                <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Add New Note</h3>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>
                      Title
                    </label>
                    <input
                      type="text"
                      value={newNote.title}
                      onChange={(e) =>
                        setNewNote({ ...newNote, title: e.target.value })
                      }
                      className={`w-full px-3 py-2 border ${themeClasses.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="Enter note title..."
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium ${themeClasses.text} mb-1`}>
                      Description
                    </label>
                    <textarea
                      value={newNote.description}
                      onChange={(e) =>
                        setNewNote({ ...newNote, description: e.target.value })
                      }
                      className={`w-full px-3 py-2 border ${themeClasses.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      rows="3"
                      placeholder="Enter note description..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleAddNote}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Note
                  </button>
                  <button
                    onClick={() => setShowAddNoteModal(false)}
                    className={`flex-1 px-4 py-2 ${themeClasses.bgSecondary} ${themeClasses.text} rounded-lg ${themeClasses.bgHover} transition-colors`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Employee Spotlight Card */}
          <div className={`${themeClasses.bgCard} p-4 rounded-lg border ${themeClasses.border}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <h3 className={`text-[14px] font-semibold ${themeClasses.text}`}>
                  Employee Spotlight
                </h3>
              </div>
              <button className={`px-3 py-1 text-xs font-medium ${themeClasses.textSecondary} border ${themeClasses.border} rounded-lg ${themeClasses.bgHover} transition-colors flex items-center gap-1`}>
                <span>Share</span>
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                  />
                </svg>
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-1 py-3 mb-4">
              <button className={`px-3 py-1 text-xs font-medium ${themeClasses.text} ${themeClasses.bgSecondary} border ${themeClasses.border} rounded-lg`}>
                Overview
              </button>
              <button className={`px-3 py-1 text-xs font-medium ${themeClasses.textMuted} hover:${themeClasses.textSecondary}`}>
                Comments
              </button>
              <button className={`px-3 py-1 text-xs font-medium ${themeClasses.textMuted} hover:${themeClasses.textSecondary}`}>
                Rewards
              </button>
            </div>

            {/* Employee Details */}
            <div className="flex w-full justify-between items-center">
              <h4 className={`text-lg font-bold ${themeClasses.text}`}>
                Matthew Johnson
              </h4>
              <p className={`text-sm ${themeClasses.textSecondary}`}>Software Engineer</p>
            </div>
            <div className="w-full flex justify-center ">
              <img className="w-24" src={BadgeImage} alt="" />
            </div>

            {/* Recognition Message */}
            <div className="text-center">
              <p className={`text-sm font-medium ${themeClasses.text}`}>
                Top-performing employee of January!
              </p>
            </div>
          </div>
        </div>
        <div className=" flex gap-2 flex-col">
          <div className=" flex flex-col  rounded-lg ">
            <h3 className={`text-[14px] py-2 font-bold ${themeClasses.text}`}>
              {selectedDoctor.name} - Analytics Dashboard
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className={`text-center p-3 ${themeClasses.bgSecondary} rounded-lg`}>
                <p className={`text-sm ${themeClasses.textSecondary}`}>Specialization</p>
                <p className={`text-lg font-semibold ${themeClasses.text}`}>
                  {selectedDoctor.specialization}
                </p>
              </div>
              <div className={`text-center p-3 ${themeClasses.bgSecondary} rounded-lg`}>
                <p className={`text-sm ${themeClasses.textSecondary}`}>Total Patients</p>
                <p className="text-lg font-semibold text-blue-600">
                  {selectedDoctor.totalPatients}
                </p>
              </div>
              <div className={`text-center p-3 ${themeClasses.bgSecondary} rounded-lg`}>
                <p className={`text-sm ${themeClasses.textSecondary}`}>Total Income</p>
                <p className="text-lg font-semibold text-green-600">
                  ₹{selectedDoctor.totalIncome.toLocaleString()}
                </p>
              </div>
              {/* Doctor Reviews */}
              <div className={`text-center p-3 ${themeClasses.bgSecondary} rounded-lg`}>
                <p className={`text-sm ${themeClasses.textSecondary} mb-2`}>Patient Reviews</p>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(selectedDoctor?.avgRating || 0)
                          ? "text-yellow-400"
                          : themeClasses.border === 'border-gray-700' ? "text-gray-600" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className={`text-lg font-semibold ${themeClasses.text}`}>
                  {selectedDoctor?.avgRating || 0}
                </p>
                <p className={`text-xs ${themeClasses.textMuted}`}>
                  Based on {selectedDoctor?.reviewCount || 0} reviews
                </p>
              </div>
            </div>
          </div>

          {/* Courses Component */}
          <div className="flex w-full justify-between gap-2 ">
            <div className={`${themeClasses.bgCard} w-[70%] p-4 rounded-lg border ${themeClasses.border}`}>
              {/* Header Section */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className={`text-[14px] font-semibold ${themeClasses.text}`}>
                    Doctors{" "}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  {/* Search Bar */}
                  <div className="relative">
                    <svg
                      className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${themeClasses.textMuted}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search doctors..."
                      value={doctorSearchQuery}
                      onChange={(e) => setDoctorSearchQuery(e.target.value)}
                      className={`pl-10 pr-4 py-1 text-xs border ${themeClasses.input} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                  </div>

                  {/* Filter Button */}
                  <div className="relative" ref={filterMenuRef}>
                    <button
                      onClick={() => setShowFilterMenu(!showFilterMenu)}
                      className={`px-2 py-1 text-xs font-medium ${themeClasses.textSecondary} ${themeClasses.bgSecondary} border ${themeClasses.border} rounded-lg ${themeClasses.bgHover} transition-colors flex items-center gap-1`}
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                        />
                      </svg>
                      {getActiveFilterCount() > 0 && (
                        <span className="w-4 h-4 bg-blue-500 text-white rounded text-xs flex items-center justify-center">
                          {getActiveFilterCount()}
                        </span>
                      )}
                    </button>

                    {/* Filter Dropdown Menu */}
                    {showFilterMenu && (
                      <div className={`absolute right-0 mt-2 w-48 ${themeClasses.bgCard} rounded-lg shadow-lg border ${themeClasses.border} z-10`}>
                        <div className="p-2">
                          <p className="text-xs font-semibold text-gray-700 px-2 py-1">
                            Filter by Status
                          </p>
                          <button
                            onClick={() => handleFilterChange("all")}
                            className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-gray-50 ${
                              doctorStatusFilter === "all"
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            All Status
                          </button>
                          <button
                            onClick={() => handleFilterChange("in-progress")}
                            className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-gray-50 ${
                              doctorStatusFilter === "in-progress"
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            In Progress
                          </button>
                          <button
                            onClick={() => handleFilterChange("completed")}
                            className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-gray-50 ${
                              doctorStatusFilter === "completed"
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            Completed
                          </button>
                          <button
                            onClick={() => handleFilterChange("not-started")}
                            className={`w-full text-left px-2 py-1.5 text-xs rounded hover:bg-gray-50 ${
                              doctorStatusFilter === "not-started"
                                ? "bg-blue-50 text-blue-700 font-medium"
                                : "text-gray-700"
                            }`}
                          >
                            Not Started
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* See All Button */}
                  <button
                    onClick={() => setShowAllDoctors(!showAllDoctors)}
                    className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {showAllDoctors ? "Show Less" : "See All"}
                  </button>
                </div>
              </div>

              {/* Results Counter & Clear Filters */}
              {(doctorSearchQuery || doctorStatusFilter !== "all") && (
                <div className="px-3 py-2 flex items-center justify-between">
                  <span className="text-xs text-gray-600">
                    Showing {getFilteredDoctors().length} of {doctorsProgress.length} doctors
                  </span>
                  <button
                    onClick={() => {
                      setDoctorSearchQuery("");
                      setDoctorStatusFilter("all");
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Table Headers */}
              <div className="grid grid-cols-12 gap-4 py-2 px-3 bg-gray-50 rounded-lg mb-2">
                <div className="col-span-3 text-xs font-medium text-gray-600">
                  Names{" "}
                </div>
                <div className="col-span-4 text-xs font-medium text-gray-600">
                  spacialization
                </div>
                <div className="col-span-2 text-xs font-medium text-gray-600">
               worked hours  
                </div>
                <div className="col-span-2 text-xs font-medium text-gray-600">
                  Status
                </div>
                <div className="col-span-1 text-xs font-medium text-gray-600"></div>
              </div>

              {/* Doctor Progress List */}
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    Loading doctors...
                  </div>
                ) : getFilteredDoctors().length > 0 ? (
                  getFilteredDoctors().map((doctor) => (
                    <div
                      key={doctor.id}
                      className="grid grid-cols-12 gap-4 py-3 px-3 hover:bg-gray-50 rounded-lg"
                    >
                      <div className="col-span-3 flex items-center gap-3">
                        <div
                          className={`w-8 h-8 ${doctor.bgColor} rounded-full flex items-center justify-center`}
                        >
                          <span
                            className={`text-xs font-medium ${doctor.textColor}`}
                          >
                            {doctor.initials}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-800">
                            {doctor.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {doctor.specialization}
                          </p>
                        </div>
                      </div>
                      <div className="col-span-4">
                        <p className="text-xs font-medium text-gray-800">
                          Appointments Progress
                        </p>
                        <p className="text-xs text-gray-500">
                          {doctor.completedAppointments} of{" "}
                          {doctor.totalAppointments} completed
                        </p>
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${doctor.progressPercentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {doctor.progressPercentage}%
                        </span>
                      </div>
                      <div className="col-span-2">
                        {doctor.status === "Completed" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Completed
                          </span>
                        ) : doctor.status === "Not Started" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Not Started
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-orange-800 bg-orange-100 rounded-full">
                            <svg
                              className="w-3 h-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            In Progress
                          </span>
                        )}
                      </div>
                      <div className="col-span-1 flex justify-end">
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <svg
                            className="w-4 h-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No doctors found
                  </div>
                )}
              </div>
            </div>
            {/* Time Tracker Component */}
            <div className={`${themeClasses.bgCard} w-[30%] p-4 rounded-lg border ${themeClasses.border}`}>
              {/* Header Section */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8  border rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-purple-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className={`text-[14px] font-semibold ${themeClasses.text}`}>
                    Time Tracker
                  </p>
                </div>
                <button className={`px-3 py-1 text-xs font-medium ${themeClasses.textSecondary} border ${themeClasses.border} rounded-lg ${themeClasses.bgHover} transition-colors flex items-center gap-1`}>
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>History</span>
                </button>
              </div>

              {/* Current Task Timer Section */}
              <div className={`p-4 rounded-lg mb-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border ${themeClasses.border}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                   
                    <div>
                      <p className={`text-sm font-medium ${themeClasses.text}`}>Dashboard Timer</p>
                    </div>
                  </div>
                  {isTracking && (
                    <span className="flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  )}
                </div>

                <p className={`text-xs ${themeClasses.textMuted} mb-3 uppercase tracking-wide`}>
                  {isTracking ? "TRACKING..." : "READY"}
                </p>

                {/* Timer Display */}
                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold ${themeClasses.text} font-mono`}>
                    {formatTime(currentTime)}
                  </div>
                  <p className={`text-xs ${themeClasses.textMuted} mt-2`}>
                    {isTracking ? "Time is running" : "Press start to begin"}
                  </p>
                </div>

                {/* Start/Stop Button */}
                <button
                  onClick={toggleTimer}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg transition-all duration-200 ${
                    isTracking
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                  }`}
                >
                  {isTracking ? (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6 6h4v12H6zm8 0h4v12h-4z" />
                      </svg>
                      <span className="text-sm font-medium">Stop Timer</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span className="text-sm font-medium">Start Timer</span>
                    </>
                  )}
                </button>
              </div>

              {/* Time History Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`text-xs font-medium ${themeClasses.textMuted} uppercase tracking-wide`}>
                    History ({timeHistory.length})
                  </h4>
                  {timeHistory.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm('Clear all time history?')) {
                          setTimeHistory([]);
                          localStorage.removeItem('dashboardTimeHistory');
                        }
                      }}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Scrollable History List - Shows 2 entries, scrolls if more */}
                <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2 ">
                  {timeHistory.length > 0 ? (
                    timeHistory.map((entry, index) => {
                      // Color variations for different entries
                      const colors = [
                        { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-600', icon: 'bg-purple-200 dark:bg-purple-800/50' },
                        { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600', icon: 'bg-blue-200 dark:bg-blue-800/50' },
                        { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600', icon: 'bg-green-200 dark:bg-green-800/50' },
                        { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600', icon: 'bg-orange-200 dark:bg-orange-800/50' },
                        { bg: 'bg-pink-100 dark:bg-pink-900/30', text: 'text-pink-600', icon: 'bg-pink-200 dark:bg-pink-800/50' },
                      ];
                      const colorScheme = colors[index % colors.length];

                      return (
                        <div
                          key={entry.id}
                          className={`flex items-center justify-between p-2.5 rounded-lg ${colorScheme.bg} hover:opacity-80 transition-opacity`}
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <div className={`w-8 h-8 ${colorScheme.icon} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <svg
                                className={`w-4 h-4 ${colorScheme.text}`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium ${themeClasses.text} truncate`}>
                                Dashboard Session
                              </p>
                              <p className={`text-xs ${themeClasses.textSecondary}`}>
                                {entry.date}
                              </p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0 ml-2">
                            <p className={`text-sm font-bold ${colorScheme.text} font-mono`}>
                              {entry.time}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8">
                      <svg
                        className={`w-12 h-12 ${themeClasses.textMuted} mx-auto mb-3`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className={`text-xs ${themeClasses.textMuted}`}>No time records yet</p>
                      <p className={`text-xs ${themeClasses.textMuted} mt-1`}>
                        Start the timer to track your time
                      </p>
                    </div>
                  )}
                </div>

                {/* Total Time Summary */}
                {timeHistory.length > 0 && (
                  <div className={`mt-4 pt-4 border-t ${themeClasses.border}`}>
                    <div className={`flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg`}>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-5 h-5 text-purple-600"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M11 17c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1zm0-14v4h2V5.08c3.39.49 6 3.39 6 6.92 0 3.87-3.13 7-7 7s-7-3.13-7-7c0-1.68.59-3.22 1.58-4.42L12 13l1.41-1.41-6.8-6.8v.02C4.42 6.45 3 9.05 3 12c0 4.97 4.02 9 9 9 4.97 0 9-4.03 9-9s-4.03-9-9-9h-1zm7 9c0-.55-.45-1-1-1s-1 .45-1 1 .45 1 1 1 1-.45 1-1zM6 12c0 .55.45 1 1 1s1-.45 1-1-.45-1-1-1-1 .45-1 1z" />
                        </svg>
                        <span className={`text-sm font-medium ${themeClasses.text}`}>
                          Total Time
                        </span>
                      </div>
                      <span className="text-lg font-bold text-purple-600 font-mono">
                        {formatTime(timeHistory.reduce((sum, entry) => sum + entry.seconds, 0))}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Analytical Dashboard Cards */}

          {/* Summary Statistics */}
          <div className={`${themeClasses.bgCard} p-4 rounded-lg border ${themeClasses.border}`}>
            <h3 className={`text-[14px] font-semibold mb-4 ${themeClasses.text}`}>
              Performance Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">
                  ₹
                  {selectedDoctor.monthlyIncome[
                    selectedDoctor.monthlyIncome.length - 1
                  ].income.toLocaleString()}
                </p>
                <p className={`text-sm ${themeClasses.textSecondary}`}>Latest Monthly Income</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {
                    selectedDoctor.patientGrowth[
                      selectedDoctor.patientGrowth.length - 1
                    ].patients
                  }
                </p>
                <p className={`text-sm ${themeClasses.textSecondary}`}>Monthly New Patients</p>
              </div>
              <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">
                  ₹
                  {Math.round(
                    selectedDoctor.totalIncome / selectedDoctor.totalPatients
                  ).toLocaleString()}
                </p>
                <p className={`text-sm ${themeClasses.textSecondary}`}>
                  Average Income per Patient
                </p>
              </div>
              <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(
                    selectedDoctor.monthlyIncome.reduce(
                      (acc, curr) => acc + curr.income,
                      0
                    ) / selectedDoctor.monthlyIncome.length
                  ).toLocaleString()}
                </p>
                <p className={`text-sm ${themeClasses.textSecondary}`}>Avg Monthly Income</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Employee Rating Card */}
            <div className="flex flex-col gap-2">
              <div className=" p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-yellow-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-[14px] font-semibold text-gray-800">
                      Employee Rating
                    </h3>
                  </div>
                  <button className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                    Details
                  </button>
                </div>

                <div className=" flex  flex-col w-full ">
                  <p className="text-xs text-gray-500 mb-2">TOTAL RATING</p>
                  <div className="w-full  flex">
                    <div className="flex w-[25%]  items-center gap-2">
                      <svg
                        className="w-26 h-6 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-lg font-bold text-gray-800">
                        3.6/5
                      </span>
                      <span className="text-sm text-gray-500">
                        (Overall 4.5)
                      </span>
                    </div>
                    {/* Purple Line Graph */}
                    <div className="h-20 w-full">
                      <svg
                        className="w-full h-full"
                        viewBox="0 0 100% 100%"
                        preserveAspectRatio="none"
                      >
                        <defs>
                          <pattern
                            id="grid"
                            width="20"
                            height="20"
                            patternUnits="userSpaceOnUse"
                          >
                            <path
                              d="M 20 0 L 0 0 0 20"
                              fill="none"
                              stroke="#afb0b2"
                              strokeWidth="0.5"
                            />
                          </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                        <path
                          d="M10,60 Q30,40 50,50 T90,30 T130,45 T170,25"
                          stroke="#8b5cf6"
                          strokeWidth="1.4"
                          fill="none"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Total work hours include extra hours.</span>
                </div>
              </div>
              <div className=" p-4 rounded-lg border">
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-[14px] font-semibold text-gray-800">
                      Training Analysis
                    </h3>
                  </div>
                  <button className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                    Details
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-lg font-bold text-gray-800 mb-1">
                    12 courses
                  </p>
                  <p className="text-xs text-gray-500">
                    Completed in this quarter
                  </p>
                </div>

                {/* Attendees */}

                <div className="flex  w-full  gap-5">
                  <div className="flex items-center  gap-2 ">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 bg-blue-200 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-800">
                          A
                        </span>
                      </div>
                      <div className="w-6 h-6 bg-green-200 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-xs font-medium text-green-800">
                          B
                        </span>
                      </div>
                      <div className="w-6 h-6 bg-purple-200 rounded-full border-2 border-white flex items-center justify-center">
                        <span className="text-xs font-medium text-purple-800">
                          C
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">26 Attended</span>
                  </div>

                  {/* Purple Bar Chart */}
                  <div className="h-20 w-full">
                    <svg
                      className="w-full h-full"
                      viewBox="0 0 100% 100%"
                      preserveAspectRatio="none"
                    >
                      <defs>
                        <pattern
                          id="grid3"
                          width="20"
                          height="20"
                          patternUnits="userSpaceOnUse"
                        >
                          <path
                            d="M 20 0 L 0 0 0 20"
                            fill="none"
                            stroke="#a4a5a8"
                            strokeWidth="0.5"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid3)" />
                      {/* Bar 1 */}
                      <rect
                        x="20"
                        y="40"
                        width="15"
                        height="40"
                        fill="#8b5cf6"
                      />
                      {/* Bar 2 */}
                      <rect
                        x="45"
                        y="30"
                        width="15"
                        height="50"
                        fill="#8b5cf6"
                      />
                      {/* Bar 3 */}
                      <rect
                        x="70"
                        y="20"
                        width="15"
                        height="60"
                        fill="#8b5cf6"
                      />
                      {/* Bar 4 */}
                      <rect
                        x="95"
                        y="35"
                        width="15"
                        height="45"
                        fill="#8b5cf6"
                      />
                      {/* Bar 5 */}
                      <rect
                        x="120"
                        y="25"
                        width="15"
                        height="55"
                        fill="#8b5cf6"
                      />
                      {/* Bar 6 */}
                      <rect
                        x="145"
                        y="15"
                        width="15"
                        height="65"
                        fill="#8b5cf6"
                      />
                      {/* Bar 7 */}
                      <rect
                        x="170"
                        y="30"
                        width="15"
                        height="50"
                        fill="#8b5cf6"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            {/* Work Hour Analysis Card */}
            <div className={`${themeClasses.bgCard} flex flex-col justify-between p-4 rounded-lg border ${themeClasses.border}`}>
              <div className="flex items-center py-3 border-b justify-between mb-4">
                <div className="flex  items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-[14px] font-semibold text-gray-800">
                    Work Hour Analysis
                  </h3>
                </div>
                <button className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  See All
                </button>
              </div>

              <div className="mb-4 flex flex-col gap-2">
                <p className="text-xs text-gray-500 ">TOTAL WORK</p>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-[14px] font-bold text-gray-800">
                    38 hours · 12 mins
                  </span>
                </div>
              </div>

              {/* Time Range Selectors */}
              <div className="w-full">
                <div className="flex gap-2 justify-around mb-4">
                  {["5D", "2W", "1M", "6M", "1Y"].map((period, index) => (
                    <button
                      key={period}
                      className={`px-10 py-1.5 flex items-center justify-center text-xs font-medium rounded-md transition-colors ${
                        index === 0
                          ? `${themeClasses.bgCard} border ${themeClasses.border} ${themeClasses.text} shadow-sm`
                          : `${themeClasses.textMuted} ${themeClasses.bgHover}`
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              {/* Purple Step Line Graph */}

              <div className="h-50 mb-2">
                <svg
                  className="w-full h-full"
                  viewBox="0 0 100% 100%"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <pattern
                      id="grid2"
                      width="20"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <path
                        d="M 20 0 L 0 0 0 20"
                        fill="none"
                        stroke="#a8a9ac"
                        strokeWidth="0.5"
                      />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid2)" />
                  <path
                    d="M10,50 L40,50 L40,30 L70,30 L70,40 L100,40 L100,25 L130,25 L130,35 L160,35 L160,20 L190,20"
                    stroke="#8b5cf6"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Total work hours include extra hours.</span>
              </div>
            </div>

            {/* Training Analysis Card */}
          </div>

          {/* Charts for Selected Doctor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${themeClasses.bgCard} p-4 rounded-lg shadow`}>
              <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>
                Monthly Income - {selectedDoctor.name}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={selectedDoctor.monthlyIncome}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [
                      `₹${value.toLocaleString()}`,
                      "Income",
                    ]}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={`${themeClasses.bgCard} p-4 rounded-lg shadow`}>
              <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>
                Patient Growth - {selectedDoctor.name}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={selectedDoctor.patientGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => [value, "Patients"]}
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
        </div>
      </div>
    );
  };

  // Render different content based on active page
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return renderDashboardContent();
      case "users":
        return <UserList />;
      case "doctors":
        return <DoctorList />;
      case "appointments":
        return <Appoiment />;
      case "today-appointments":
        return <TodayAppointments />;
      case "finance":
        return <Finance />;
      case "rewiew":
        return <ReivewPage />;
      case "settings":
        return <Settings />;
      default:
        return (
          <div className={`${themeClasses.bgCard} p-6 rounded-lg shadow text-center`}>
            <h3 className={`text-xl font-bold ${themeClasses.text}`}>Page Under Construction</h3>
            <p className={`${themeClasses.textMuted} mt-2`}>
              This section is currently being developed
            </p>
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.bg}`}>
      {/* Sidebar Component */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main content */}
      <div
        style={{
          scrollbarWidth: "none", // For Firefox
          msOverflowStyle: "none", // For Internet Explorer and Edge
          overflow: "auto",
        }}
        className={`md:pl-64 px-2 min-h-screen ${themeClasses.bg}`}
      >
        <div className="p-4 sm:p-6 pb-20 md:pb-6"></div>
        <div className="flex flex-col gap-4 mb-6">
          <div className="w-full justify-between flex">
            <div>
              <h1 className={`text-[22px] font-medium ${themeClasses.text}`}>
                {activePage === "dashboard" && "Dashboard Overview"}
                {activePage === "users" && "User Management"}
                {activePage === "doctors" && "Doctor Management"}
                {activePage === "appointments" && "Appointment Management"}
                {activePage === "today-appointments" &&
                  "Today's Video Sessions"}
                {activePage === "finance" && "Finance Overview"}
                {![
                  "dashboard",
                  "users",
                  "doctors",
                  "appointments",
                  "today-appointments",
                  "finance",
                  "rewiew",
                ].includes(activePage) && ""}
                {activePage === "settings" && "Settings"}
                {activePage === "rewiew" && "Rewiew"}
              </h1>
              <p className={`${themeClasses.textSecondary} text-[16px] mt-1`}>
                Welcome back, Admin
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search Icon with toggleable input */}
              {showSearchInput ? (
                <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
                  <input
                    type="text"
                    className={`${themeClasses.input} rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm animate-in fade-in-0 slide-in-from-right-2 duration-300`}
                    placeholder="Search..."
                    autoFocus
                    onBlur={() => setShowSearchInput(false)}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setShowSearchInput(false);
                    }}
                    style={{ width: 160 }}
                  />
                  <button
                    className={`ml-1 ${themeClasses.textMuted} hover:${themeClasses.textSecondary} transition-colors duration-200`}
                    onClick={() => setShowSearchInput(false)}
                    tabIndex={-1}
                    type="button"
                  >
                    <SearchCheck className="w-   " />
                  </button>
                </div>
              ) : (
                <div
                  className={`w-10 h-10 rounded-xl border ${themeClasses.border} flex items-center justify-center cursor-pointer ${themeClasses.bgHover} transition-all duration-200 hover:scale-105`}
                  onClick={() => setShowSearchInput(true)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ")
                      setShowSearchInput(true);
                  }}
                  title="Search"
                >
                  <Search
                    className={`w-5 h-5 ${themeClasses.textSecondary} transition-transform duration-200`}
                  />
                </div>
              )}

              {/* Notification Icon */}
              <div
                className={`relative w-10 h-10 rounded-xl border ${themeClasses.border} flex items-center justify-center cursor-pointer ${themeClasses.bgHover} transition-colors`}
              >
                <Bell className={`w-5 h-5 ${themeClasses.textSecondary}`} />
                {/* Notification Badge */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>

              {/* Schedule Button */}
              <button
                className={`flex items-center gap-2 px-4 py-2 ${themeClasses.bgCard} border ${themeClasses.border} rounded-lg text-sm font-medium ${themeClasses.text} ${themeClasses.bgHover} transition-colors`}
              >
                <Calendar className="w-4 h-4" />
                Schedule
              </button>
              <IconBtn Icon={<LogOut />} />
            </div>
          </div>

          {/* Dynamic Content based on active page */}
          <div className="space-y-6">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
