import React,{useState} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Calendar, Award, Eye, Clock, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/shadcn/select';
import { Button } from '../../../components/shadcn/button/button';
import { PageHeader } from '../../../components/core/cardHeader';

// Income Card Component
const IncomeCard = ({ title, amount, growth, icon, bgColor, timeFrame }) => (
  <div className={`${bgColor} p-6 rounded-2xl text-white shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
      <PageHeader 
     titleclassName={'text-white'}
     desclassName={'text-white'}
  title={title} 
  description={`₹${amount.toLocaleString()}`} 
/>

        {/* <p className="text-sm font-medium opacity-90">{title}</p>
        <p className="text-3xl font-bold">₹{amount.toLocaleString()}</p> */}
        <div className="flex items-center mt-2">
          <TrendingUp size={16} className="mr-1" />
          <span className="text-sm font-medium">+{growth}%</span>
        </div>
      </div>
      <div className="p-3 bg-white bg-opacity-20 rounded-xl">
        {icon}
      </div>
    </div>
  </div>
);

const OverviewTab = ({ 
  selectedTimeFrame, 
  setSelectedTimeFrame, 
  incomeData, 
  doctorAppointments, 
  appointmentsLoading, 
  fetchDoctorAppointments 
}) => {

  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

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

  return (
    <>
      {/* Income Statistics Cards */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          {/* <h1 className="text-[14px] font-bold text-gray-900">Income Statistics</h1> */}
          <PageHeader
          title='Income Statistics'/>
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-600 font-medium">View:</label>
            <Select value={selectedTimeFrame} onValueChange={setSelectedTimeFrame}>
              <SelectTrigger className="w-[180px] bg-white">
                <SelectValue placeholder="Select time frame" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          <IncomeCard
            title="Daily Income"
            amount={incomeData.daily}
            growth={incomeData.dailyGrowth}
            icon={<DollarSign size={24} />}
            bgColor="bg-gradient-to-br from-blue-500 to-blue-600"
            timeFrame="day"
          />
          <IncomeCard
            title="Weekly Income"
            amount={incomeData.weekly}
            growth={incomeData.weeklyGrowth}
            icon={<TrendingUp size={24} />}
            bgColor="bg-gradient-to-br from-emerald-500 to-emerald-600"
            timeFrame="week"
          />
          <IncomeCard
            title="Monthly Income"
            amount={incomeData.monthly}
            growth={incomeData.monthlyGrowth}
            icon={<Calendar size={24} />}
            bgColor="bg-gradient-to-br from-purple-500 to-purple-600"
            timeFrame="month"
          />
          <IncomeCard
            title="Yearly Income"
            amount={incomeData.yearly}
            growth={incomeData.yearlyGrowth}
            icon={<Award size={24} />}
            bgColor="bg-gradient-to-br from-orange-500 to-orange-600"
            timeFrame="year"
          />
        </div>
      </div>

      {/* Income Chart */}
      <div className='grid gap-5 grid-cols-2'>
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h3 className="text-[18px] font-semibold text-gray-900 mb-2 sm:mb-0">
            {selectedTimeFrame === 'daily' ? 'Daily' : 
             selectedTimeFrame === 'weekly' ? 'Weekly' : 
             selectedTimeFrame === 'monthly' ? 'Monthly' : 'Yearly'} Income Trend
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              Income
            </div>
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={selectedTimeFrame === 'weekly' ? incomeData.weeklyChart : incomeData.monthlyChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `₹${value.toLocaleString()}`}
              />
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Income']}
                labelFormatter={(label) => `${selectedTimeFrame === 'weekly' ? 'Day' : 'Month'}: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8, fill: '#1D4ED8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
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
          <div className="flex  flex-col gap-2 px-3 py-2 max-h-60 overflow-y-auto">
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
      </div>
      </div>

      {/* Appointment Statistics Cards */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-[22px] font-medium text-gray-800">Appointment Overview</h2>
          <Button 
            variant='outline'
            onClick={fetchDoctorAppointments}
            disabled={appointmentsLoading}
          >
            {appointmentsLoading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <Eye size={16} />
            )}
            {appointmentsLoading ? 'Refreshing...' : 'Refresh Appointments'}
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{doctorAppointments.length}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Calendar size={24} className="text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {doctorAppointments.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-3xl font-bold text-green-600">
                  {doctorAppointments.filter(a => a.status === 'approved').length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewTab;

