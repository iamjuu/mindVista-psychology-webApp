import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Calendar, Award, Eye, Clock, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/shadcn/select';

// Income Card Component
const IncomeCard = ({ title, amount, growth, icon, bgColor, timeFrame }) => (
  <div className={`${bgColor} p-6 rounded-2xl text-white shadow-lg`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium opacity-90">{title}</p>
        <p className="text-3xl font-bold">₹{amount.toLocaleString()}</p>
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
  return (
    <>
      {/* Income Statistics Cards */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className="text-[14px] font-bold text-gray-900">Income Statistics</h1>
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
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
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
        <div className="h-80">
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

      {/* Appointment Statistics Cards */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h2 className="text-[22px] font-medium text-gray-800">Appointment Overview</h2>
          <button 
            onClick={fetchDoctorAppointments}
            disabled={appointmentsLoading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
          >
            {appointmentsLoading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <Eye size={16} />
            )}
            {appointmentsLoading ? 'Refreshing...' : 'Refresh Appointments'}
          </button>
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

