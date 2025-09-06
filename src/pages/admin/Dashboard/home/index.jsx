import { useState } from "react";
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
import { Input } from "../../../../components/shadcn/input/input";
import { BadgeImage } from "../../../../assets";
import { Search, Bell, Calendar, Plus, Power, SearchCheck } from "lucide-react";

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
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedDoctorId, setSelectedDoctorId] = useState(1);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [searchValue, setSearchValue] = useState("");
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

  
  // Doctor data with individual information
  const doctorsData = [
    {
      id: 1,
      name: "Dr. Rajesh Kumar",
      specialization: "Clinical Psychology",
      totalIncome: 145000,
      totalPatients: 156,
      bgColor: "bg-blue-500",
      monthlyIncome: [
        { name: "Jan", income: 18000 },
        { name: "Feb", income: 20000 },
        { name: "Mar", income: 22000 },
        { name: "Apr", income: 19000 },
        { name: "May", income: 25000 },
        { name: "Jun", income: 28000 },
      ],
      patientGrowth: [
        { name: "Jan", patients: 20 },
        { name: "Feb", patients: 25 },
        { name: "Mar", patients: 30 },
        { name: "Apr", patients: 35 },
        { name: "May", patients: 40 },
        { name: "Jun", patients: 45 },
      ],
    },
    {
      id: 2,
      name: "Dr. Priya Sharma",
      specialization: "Cognitive Behavioral Therapy",
      totalIncome: 120000,
      totalPatients: 134,
      bgColor: "bg-green-500",
      monthlyIncome: [
        { name: "Jan", income: 15000 },
        { name: "Feb", income: 17000 },
        { name: "Mar", income: 19000 },
        { name: "Apr", income: 16000 },
        { name: "May", income: 21000 },
        { name: "Jun", income: 24000 },
      ],
      patientGrowth: [
        { name: "Jan", patients: 18 },
        { name: "Feb", patients: 22 },
        { name: "Mar", patients: 26 },
        { name: "Apr", patients: 30 },
        { name: "May", patients: 35 },
        { name: "Jun", patients: 38 },
      ],
    },
    {
      id: 3,
      name: "Dr. Amit Verma",
      specialization: "Child Psychology",
      totalIncome: 180000,
      totalPatients: 198,
      bgColor: "bg-purple-500",
      monthlyIncome: [
        { name: "Jan", income: 22000 },
        { name: "Feb", income: 24000 },
        { name: "Mar", income: 26000 },
        { name: "Apr", income: 28000 },
        { name: "May", income: 30000 },
        { name: "Jun", income: 32000 },
      ],
      patientGrowth: [
        { name: "Jan", patients: 25 },
        { name: "Feb", patients: 30 },
        { name: "Mar", patients: 35 },
        { name: "Apr", patients: 40 },
        { name: "May", patients: 45 },
        { name: "Jun", patients: 50 },
      ],
    },
    {
      id: 4,
      name: "Dr. Neha Patel",
      specialization: "Marriage & Family Therapy",
      totalIncome: 95000,
      totalPatients: 89,
      bgColor: "bg-orange-500",
      monthlyIncome: [
        { name: "Jan", income: 12000 },
        { name: "Feb", income: 14000 },
        { name: "Mar", income: 15000 },
        { name: "Apr", income: 16000 },
        { name: "May", income: 18000 },
        { name: "Jun", income: 20000 },
      ],
      patientGrowth: [
        { name: "Jan", patients: 12 },
        { name: "Feb", patients: 15 },
        { name: "Mar", patients: 18 },
        { name: "Apr", patients: 22 },
        { name: "May", patients: 25 },
        { name: "Jun", patients: 28 },
      ],
    },
    {
      id: 5,
      name: "Dr. Arjun Singh",
      specialization: "Addiction Therapy",
      totalIncome: 210000,
      totalPatients: 245,
      bgColor: "bg-indigo-500",
      monthlyIncome: [
        { name: "Jan", income: 25000 },
        { name: "Feb", income: 27000 },
        { name: "Mar", income: 29000 },
        { name: "Apr", income: 31000 },
        { name: "May", income: 33000 },
        { name: "Jun", income: 35000 },
      ],
      patientGrowth: [
        { name: "Jan", patients: 30 },
        { name: "Feb", patients: 35 },
        { name: "Mar", patients: 40 },
        { name: "Apr", patients: 45 },
        { name: "May", patients: 50 },
        { name: "Jun", patients: 55 },
      ],
    },
  ];
  
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
          <p className="text-lg font-bold">{doctor.specialization}</p>
          <p className="text-xs opacity-70 mt-1">
            {doctor.totalPatients} patients
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-80">Total Income</p>
          <p className="text-xl font-bold">
            ₹{doctor.totalIncome.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
  
  // Add PropTypes to DoctorCard
  DoctorCard.propTypes = DoctorCardPropTypes;
  
  // Dashboard Overview Content
  const renderDashboardContent = () => (
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
          <div className=" p-4 bg-white rounded-lg border">
            <div className="flex items-center justify-between ">
              <div className="flex items-center gap-3">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-[14px] font-semibold text-gray-800">
                  Daily Work Hours
                </h3>
              </div>
              <button className="px-4 py-1 text-sm font-medium text-black rounded-lg hover:bg-blue-100 border transition-colors">
                Details
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-[12px] font-bold text-gray-800">
                12 hours 41 minutes in total
              </span>
              <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-gray-600"
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
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden flex">
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
                <span className="text-sm text-gray-600">Pause Time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Active Time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-sm text-gray-600">Extra Time</span>
              </div>
            </div>
          </div>

          {/* Course Progress Card */}
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
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
                <h3 className="text-[14px] font-semibold text-gray-800">
                  Course Progress
                </h3>
              </div>
              <button className="px-3 py-1 text-xs font-medium text-gray-600  border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
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
                    className="stroke-gray-200"
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
                  <span className="text-sm font-semibold text-gray-800">
                    25%
                  </span>
                </div>
              </div>

              {/* Course Info */}
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-800 mb-1">
                  Team Diversity Training
                </h4>
                <p className="text-xs text-gray-500 mb-3">
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
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-gray-600"
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
              <h3 className="text-[14px] font-semibold text-gray-800">Notes</h3>
            </div>
            <button
              onClick={() => setShowAddNoteModal(true)}
              className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              + Add Note
            </button>
          </div>

          {/* Notes List */}
          <div className="flex flex-col gap-2 px-3 py-2 max-h-60 overflow-y-auto">
            {notes.map((note) => (
              <div key={note.id} className="flex gap-4 items-start">
                <input
                  type="checkbox"
                  checked={note.completed}
                  onChange={() => toggleNoteCompletion(note.id)}
                  className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <div className="flex flex-col gap-1 flex-1">
                  <div className="flex flex-col w-full">
                    <h4
                      className={`text-sm font-medium ${
                        note.completed
                          ? "text-gray-400 line-through"
                          : "text-gray-800"
                      }`}
                    >
                      {note.title}
                    </h4>
                    <p
                      className={`text-xs ${
                        note.completed ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      {note.description}
                    </p>
                  </div>
                </div>
                {note.completed && (
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="mt-1 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h3 className="text-lg font-semibold mb-4">Add New Note</h3>

              <div className="space-y-4">
<div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newNote.title}
                    onChange={(e) =>
                      setNewNote({ ...newNote, title: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter note title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newNote.description}
                    onChange={(e) =>
                      setNewNote({ ...newNote, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Employee Spotlight Card */}
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex items-center justify-between">
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
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-[14px] font-semibold text-gray-800">
                Employee Spotlight
              </h3>
            </div>
            <button className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1">
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
            <button className="px-3 py-1 text-xs font-medium text-gray-800 bg-white border border-gray-200 rounded-lg">
              Overview
            </button>
            <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700">
              Comments
            </button>
            <button className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700">
              Rewards
            </button>
          </div>

          {/* Employee Details */}
          <div className="flex w-full justify-between items-center">
            <h4 className="text-lg font-bold text-gray-800 ">
              Matthew Johnson
            </h4>
            <p className="text-sm text-gray-600">Software Engineer</p>
          </div>
          <div className="w-full flex justify-center ">
            <img className="w-24" src={BadgeImage} alt="" />
          </div>

          {/* Recognition Message */}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">
              Top-performing employee of January!
            </p>
          </div>
        </div>
      </div>
      <div className=" flex gap-2 flex-col">
        <div className=" flex flex-col  rounded-lg ">
          <h3 className="text-[14px] py-2 font-bold ">
          {selectedDoctor.name} - Analytics Dashboard
        </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Specialization</p>
              <p className="text-lg font-semibold">
                {selectedDoctor.specialization}
              </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-lg font-semibold text-blue-600">
                {selectedDoctor.totalPatients}
              </p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Total Income</p>
              <p className="text-lg font-semibold text-green-600">
                ₹{selectedDoctor.totalIncome.toLocaleString()}
              </p>
          </div>
            {/* Doctor Reviews */}
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Patient Reviews</p>
              <div className="flex items-center justify-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
        </div>
              <p className="text-lg font-semibold text-gray-800">4.8</p>
              <p className="text-xs text-gray-500">Based on 156 reviews</p>
            </div>
          </div>
        </div>

        {/* Courses Component */}
        <div className="flex w-full justify-between gap-2 ">
          <div className="bg-white w-[70%] p-4 rounded-lg border">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
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
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-[14px] font-semibold text-gray-800">
                  Dotors{" "}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {/* Search Bar */}
                <div className="relative">
                  <svg
                    className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
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
                    placeholder="Search..."
                    className="pl-10 pr-4 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Filter Button */}
                <button className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1">
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
                  <span className="w-4 h-4 bg-gray-200 rounded text-xs flex items-center justify-center">
                    1
                  </span>
                </button>

                {/* See All Button */}
                <button className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  See All
                </button>
              </div>
            </div>

            {/* Table Headers */}
            <div className="grid grid-cols-12 gap-4 py-2 px-3 bg-gray-50 rounded-lg mb-2">
              <div className="col-span-3 text-xs font-medium text-gray-600">
                Names{" "}
              </div>
              <div className="col-span-4 text-xs font-medium text-gray-600">
                Date/Time
              </div>
              <div className="col-span-2 text-xs font-medium text-gray-600">
                Progress
              </div>
              <div className="col-span-2 text-xs font-medium text-gray-600">
                Status
              </div>
              <div className="col-span-1 text-xs font-medium text-gray-600"></div>
            </div>

            {/* Course List */}
            <div className="space-y-3">
              {/* Course 1 */}
              <div className="grid grid-cols-12 gap-4 py-3 px-3 hover:bg-gray-50 rounded-lg">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-yellow-800">
                      NA
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800">
                      Nuray Aksoy
                    </p>
                    <p className="text-xs text-gray-500">Product Manager</p>
                  </div>
                </div>
                <div className="col-span-4">
                  <p className="text-xs font-medium text-gray-800">
                    Time Management
                  </p>
                  <p className="text-xs text-gray-500">Aug 21 - Sep 04</p>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">30%</span>
                </div>
                <div className="col-span-2">
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

              {/* Course 2 */}
              <div className="grid grid-cols-12 gap-4 py-3 px-3 hover:bg-gray-50 rounded-lg">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-blue-800">
                      AT
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800">
                      Arthur Taylor
                    </p>
                    <p className="text-xs text-gray-500">Entrepreneur / CEO</p>
                  </div>
                </div>
                <div className="col-span-4">
                  <p className="text-xs font-medium text-gray-800">
                    Leadership Skills
                  </p>
                  <p className="text-xs text-gray-500">Aug 02 - Aug 18</p>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "70%" }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">70%</span>
                </div>
                <div className="col-span-2">
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

              {/* Course 3 */}
              <div className="grid grid-cols-12 gap-4 py-3 px-3 hover:bg-gray-50 rounded-lg">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-green-800">
                      WC
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800">
                      Wei Chen
                    </p>
                    <p className="text-xs text-gray-500">Operations Manager</p>
                  </div>
                </div>
                <div className="col-span-4">
                  <p className="text-xs font-medium text-gray-800">
                    Diversity Training
                  </p>
                  <p className="text-xs text-gray-500">June 24 - July 03</p>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">100%</span>
                </div>
                <div className="col-span-2">
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

              {/* Course 4 */}
              <div className="grid grid-cols-12 gap-4 py-3 px-3 hover:bg-gray-50 rounded-lg">
                <div className="col-span-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-purple-800">
                      LM
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-800">
                      Lena Müller
                    </p>
                    <p className="text-xs text-gray-500">Marketing Manager</p>
                  </div>
                </div>
                <div className="col-span-4">
                  <p className="text-xs font-medium text-gray-800">
                    Efficiency at Work
                  </p>
                  <p className="text-xs text-gray-500">June 04 - June 28</p>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600">100%</span>
                </div>
                <div className="col-span-2">
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
            </div>
          </div>
          {/* Time Tracker Component */}
          <div className="bg-white w-[30%] p-4 rounded-lg border">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="text-[14px] font-semibold text-gray-800">
                  Time Tracker
                </p>
              </div>
              <button className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1">
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
            <div className=" p-4 rounded-lg mb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex  w-full justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-red-400 to-yellow-400 rounded flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-sm transform rotate-12"></div>
                      <div className="w-3 h-3 bg-white rounded-sm transform -rotate-12 -ml-1"></div>
                    </div>
                    <div>
                      <p>Timer</p>
                    </div>
                  </div>

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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-3">AWAITING</p>

              {/* Timer Display */}
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-gray-800">
                  <span className="text-gray-800">00:00</span>
                  <span className="text-gray-400">:00</span>
                </div>
              </div>

              {/* Start Button */}
              <button className="w-full flex items-center justify-center gap-2 py-2 px-4  text-black rounded-lg hover:bg-blue-500 border hover:text-white transition-colors">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span className="text-sm font-medium">Start Time Tracker</span>
              </button>
            </div>

            {/* Previous Tasks Section */}
            <div>
              <h4 className="text-xs font-medium text-gray-500 uppercase py-2 tracking-wide ">
                PREVIOUS TASKS
              </h4>

              <div className="space-y-3">
                {/* Task 1 */}
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-purple-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Loom Rebranding
                      </p>
                      <p className="text-xs text-gray-500">1:23:05</p>
                    </div>
                  </div>
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

                {/* Task 2 */}
                <div className="flex items-center justify-between ">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        Evernote App Redesign
                      </p>
                      <p className="text-xs text-gray-500">3:14:26</p>
                    </div>
                  </div>
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
            </div>
          </div>
        </div>

{/* Analytical Dashboard Cards */}


      {/* Summary Statistics */}
      <div className="bg-white p-4 rounded-lg border">
        <h3 className="text-[14px] font-semibold mb-4">Performance Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
                ₹
                {selectedDoctor.monthlyIncome[
                  selectedDoctor.monthlyIncome.length - 1
                ].income.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Latest Monthly Income</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
                {
                  selectedDoctor.patientGrowth[
                    selectedDoctor.patientGrowth.length - 1
                  ].patients
                }
            </p>
            <p className="text-sm text-gray-600">Monthly New Patients</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
                ₹
                {Math.round(
                  selectedDoctor.totalIncome / selectedDoctor.totalPatients
                ).toLocaleString()}
            </p>
              <p className="text-sm text-gray-600">
                Average Income per Patient
              </p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
                {Math.round(
                  selectedDoctor.monthlyIncome.reduce(
                    (acc, curr) => acc + curr.income,
                    0
                  ) / selectedDoctor.monthlyIncome.length
                ).toLocaleString()}
            </p>
            <p className="text-sm text-gray-600">Avg Monthly Income</p>
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
          <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <h3 className="text-[14px] font-semibold text-gray-800">Employee Rating</h3>
      </div>
      <button className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
        Details
      </button>
    </div>
    
    <div className=" flex  flex-col w-full ">
      <p className="text-xs text-gray-500 mb-2">TOTAL RATING</p>
<div className="w-full  flex">
      <div className="flex w-[25%]  items-center gap-2">
        <svg className="w-26 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <span className="text-lg font-bold text-gray-800">3.6/5</span>
        <span className="text-sm text-gray-500">(Overall 4.5)</span>
      </div>
         {/* Purple Line Graph */}
    <div className="h-20 w-full">
      <svg className="w-full h-full" viewBox="0 0 100% 100%" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#afb0b2" strokeWidth="0.5"/>
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
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Total work hours include extra hours.</span>
    </div>
  </div>
  <div className=" p-4 rounded-lg border">
    <div className="flex items-center justify-between ">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-[14px] font-semibold text-gray-800">Training Analysis</h3>
      </div>
      <button className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
        Details
      </button>
    </div>
    
    <div className="mb-4">
      <p className="text-lg font-bold text-gray-800 mb-1">12 courses</p>
      <p className="text-xs text-gray-500">Completed in this quarter</p>
    </div>
    
    {/* Attendees */}

    <div className="flex  w-full  gap-5">
    <div className="flex items-center  gap-2 ">
      <div className="flex -space-x-2">
        <div className="w-6 h-6 bg-blue-200 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-xs font-medium text-blue-800">A</span>
        </div>
        <div className="w-6 h-6 bg-green-200 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-xs font-medium text-green-800">B</span>
        </div>
        <div className="w-6 h-6 bg-purple-200 rounded-full border-2 border-white flex items-center justify-center">
          <span className="text-xs font-medium text-purple-800">C</span>
        </div>
      </div>
      <span className="text-xs text-gray-500">26 Attended</span>
    </div>
    
    {/* Purple Bar Chart */}
    <div className="h-20 w-full">
      <svg className="w-full h-full" viewBox="0 0 100% 100%" preserveAspectRatio="none">
        <defs>
          <pattern id="grid3" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#a4a5a8" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid3)" />
        {/* Bar 1 */}
        <rect x="20" y="40" width="15" height="40" fill="#8b5cf6" />
        {/* Bar 2 */}
        <rect x="45" y="30" width="15" height="50" fill="#8b5cf6" />
        {/* Bar 3 */}
        <rect x="70" y="20" width="15" height="60" fill="#8b5cf6" />
        {/* Bar 4 */}
        <rect x="95" y="35" width="15" height="45" fill="#8b5cf6" />
        {/* Bar 5 */}
        <rect x="120" y="25" width="15" height="55" fill="#8b5cf6" />
        {/* Bar 6 */}
        <rect x="145" y="15" width="15" height="65" fill="#8b5cf6" />
        {/* Bar 7 */}
        <rect x="170" y="30" width="15" height="50" fill="#8b5cf6" />
      </svg>
    </div>
    </div>
  </div>
  </div>
  {/* Work Hour Analysis Card */}
  <div className="bg-white flex flex-col justify-between p-4 rounded-lg border">
    <div className="flex items-center py-3 border-b justify-between mb-4">
      <div className="flex  items-center gap-3">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-[14px] font-semibold text-gray-800">Work Hour Analysis</h3>
      </div>
      <button className="px-3 py-1 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
        See All
      </button>
    </div>
    
    <div className="mb-4 flex flex-col gap-2">
      <p className="text-xs text-gray-500 ">TOTAL WORK</p>
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-[14px] font-bold text-gray-800">38 hours · 12 mins</span>
      </div>
    </div>
    
    {/* Time Range Selectors */}
    <div className="w-full">
    <div className="flex gap-2 justify-around mb-4">
      {['5D', '2W', '1M', '6M', '1Y'].map((period, index) => (
        <button
          key={period}
          className={`px-10 py-1.5 flex items-center justify-center text-xs font-medium rounded-md transition-colors ${
            index === 0 
              ? 'bg-white border border-gray-300 text-gray-800 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          {period}
        </button>
      ))}
    </div>
    </div>
    
    {/* Purple Step Line Graph */}

    <div className="h-50 mb-2">
      <svg className="w-full h-full" viewBox="0 0 100% 100%" preserveAspectRatio="none">
        <defs>
          <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#a8a9ac" strokeWidth="0.5"/>
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
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Total work hours include extra hours.</span>
    </div>
 
  </div>

  {/* Training Analysis Card */}


 
      </div>
      
      {/* Charts for Selected Doctor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
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
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
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
                <Bar dataKey="patients" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      

      </div>
    </div>
  );
  
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
      case "settings":
        return <Settings />;
      default:
        return (
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-xl font-bold">Page Under Construction</h3>
            <p className="text-gray-500 mt-2">
              This section is currently being developed
            </p>
          </div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar Component */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      
      {/* Main content */}
      <div 
      style={{
        scrollbarWidth: "none", // For Firefox
        msOverflowStyle: "none", // For Internet Explorer and Edge
        overflow: "auto",
      }}
      className="md:pl-64  px-2 min-h-screen">
        <div className="p-4 sm:p-6 pb-20 md:pb-6"></div>
           <div className="flex flex-col gap-4 mb-6">
             <div className="w-full justify-between flex">
               <div>
                 <h1 className="text-[22px] font-medium text-gray-800">
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
                   ].includes(activePage) && ""}
                   {activePage === "settings" && "Settings"}
                 </h1>
                 <p className="text-gray-500 text-[16px] mt-1">
                   Welcome back, Admin
                 </p>
               </div>

               <div className="flex items-center gap-4">
            {/* Search Icon with toggleable input */}
            {showSearchInput ? (
              <div className="flex items-center gap-2 animate-in slide-in-from-right-2 duration-300">
                <input
                  type="text"
                  className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-200 text-sm animate-in fade-in-0 slide-in-from-right-2 duration-300"
                  placeholder="Search..."
                  autoFocus
                  onBlur={() => setShowSearchInput(false)}
                  value={searchValue}
                  onChange={e => setSearchValue(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Escape") setShowSearchInput(false);
                  }}
                  style={{ width: 160 }}
                />
                <button
                  className="ml-1 text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  onClick={() => setShowSearchInput(false)}
                  tabIndex={-1}
                  type="button"
                >
                  <SearchCheck className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                className="w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all duration-200 hover:scale-105"
                onClick={() => setShowSearchInput(true)}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") setShowSearchInput(true);
                }}
                title="Search"
              >
                <Search className="w-5 h-5 text-gray-600 transition-transform duration-200" />
              </div>
            )}
            
            {/* Notification Icon */}
            <div className="relative w-10 h-10 rounded-xl border flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              {/* Notification Badge */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
            
            {/* Schedule Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4" />
              Schedule
            </button>
            
            {/* Create Request Button */}
             <button className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
               <Power className="w-4 h-4" />
               Logout
             </button>
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
