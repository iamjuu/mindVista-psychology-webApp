import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, Plus, Trash2, Save, X } from 'lucide-react';
import { Button } from '../../../components/shadcn/button/button';
import { toast } from 'react-toastify';
import apiInstance from '../../../instance';
import PropTypes from 'prop-types';

const AvailableSlots = ({ doctorData }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ startTime: '', endTime: '', isAvailable: true });
  const [isAddingSlot, setIsAddingSlot] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState(new Set());

  // Format a date as YYYY-MM-DD in local time to avoid timezone shifts
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  // Check if date has available slots
  const hasAvailableSlots = (date) => {
    return availableDates.has(date.toDateString());
  };

  // Format time for display
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Add new time slot
  const addTimeSlot = () => {
    if (!newSlot.startTime || !newSlot.endTime) {
      toast.error('Please fill in both start and end times');
      return;
    }

    if (newSlot.startTime >= newSlot.endTime) {
      toast.error('End time must be after start time');
      return;
    }

    const slot = {
      id: Date.now(),
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      isAvailable: newSlot.isAvailable,
      date: formatLocalDate(selectedDate)
    };

    setTimeSlots([...timeSlots, slot]);
    setNewSlot({ startTime: '', endTime: '', isAvailable: true });
    setIsAddingSlot(false);
    toast.success('Time slot added successfully');
  };

  // Remove time slot
  const removeTimeSlot = (slotId) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== slotId));
    toast.success('Time slot removed');
  };

  // Save slots to backend
  const saveSlots = async () => {
    if (!doctorData._id) {
      toast.error('Doctor data not available');
      return;
    }

    setSaving(true);
    try {
      const slotsToSave = timeSlots.map(slot => ({
        doctorId: doctorData._id,
        date: formatLocalDate(selectedDate),
        startTime: slot.startTime,
        endTime: slot.endTime,
        isAvailable: slot.isAvailable
      }));

      const requestData = {
        doctorId: doctorData._id,
        date: formatLocalDate(selectedDate),
        slots: slotsToSave
      };

      // Debug logging
      console.log('[Frontend] Sending data to backend:', {
        selectedDate: selectedDate.toDateString(),
        formattedDate: formatLocalDate(selectedDate),
        requestData,
        timestamp: new Date().toISOString()
      });

      const response = await apiInstance.post('/doctors/available-slots', requestData);
      console.log('[Frontend] Backend response:', response.data);

      if (response.data.success) {
        toast.success('Available slots saved successfully');
        // Update available dates
        setAvailableDates(prev => new Set([...prev, selectedDate.toDateString()]));
        // Re-fetch slots from server to ensure UI reflects saved data
        await loadSlotsForDate(selectedDate);
      } else {
        toast.error(response.data.message || 'Failed to save slots');
      }
    } catch (error) {
      console.error('Error saving slots:', error);
      toast.error('Failed to save slots. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Load existing slots for selected date
  const loadSlotsForDate = useCallback(async (date) => {
    if (!doctorData._id) return;

    setLoading(true);
    try {
      const dateString = formatLocalDate(date);
      
      // Debug logging
      console.log('[Frontend] Loading slots for date:', {
        selectedDate: date.toDateString(),
        formattedDate: dateString,
        doctorId: doctorData._id,
        timestamp: new Date().toISOString()
      });

      const response = await apiInstance.get(`/doctors/${doctorData._id}/available-slots/${dateString}`);
      
      console.log('[Frontend] Load slots response:', {
        date: dateString,
        response: response.data,
        timestamp: new Date().toISOString()
      });
      
      if (response.data.success) {
        setTimeSlots(response.data.slots || []);
        if (response.data.slots && response.data.slots.length > 0) {
          setAvailableDates(prev => new Set([...prev, date.toDateString()]));
        }
      } else {
        setTimeSlots([]);
      }
    } catch (error) {
      console.error('Error loading slots:', error);
      setTimeSlots([]);
    } finally {
      setLoading(false);
    }
  }, [doctorData._id]);

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    loadSlotsForDate(date);
  };

  // Navigate calendar months
  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + direction);
      return newMonth;
    });
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Check if date is in current month
  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  useEffect(() => {
    if (doctorData._id) {
      loadSlotsForDate(selectedDate);
    }
  }, [doctorData._id, selectedDate, loadSlotsForDate]);

  const calendarDays = generateCalendarDays();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Available Slots</h2>
          <p className="text-gray-600">Manage your available time slots for appointments</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">
            {selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Calendar</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(-1)}
                className="p-2"
              >
                ←
              </Button>
              <span className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth(1)}
                className="p-2"
              >
                →
              </Button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => (
              <button
                key={index}
                onClick={() => handleDateSelect(date)}
                className={`
                  relative p-2 text-sm rounded-lg transition-all duration-200 hover:bg-blue-50
                  ${!isCurrentMonth(date) ? 'text-gray-300' : 'text-gray-700'}
                  ${isToday(date) ? 'bg-blue-100 font-semibold' : ''}
                  ${isSelected(date) ? 'bg-blue-600 text-white font-semibold' : ''}
                  ${hasAvailableSlots(date) && !isSelected(date) ? 'bg-green-50 border border-green-200' : ''}
                `}
              >
                {date.getDate()}
                {hasAvailableSlots(date) && !isSelected(date) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Time Slots Management */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Time Slots</h3>
            <Button
              onClick={() => setIsAddingSlot(true)}
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Slot
            </Button>
          </div>

          {/* Add New Slot Form */}
          {isAddingSlot && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={addTimeSlot}
                  className="bg-green-600 hover:bg-green-700"
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setIsAddingSlot(false);
                    setNewSlot({ startTime: '', endTime: '', isAvailable: true });
                  }}
                  variant="outline"
                  size="sm"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Time Slots List */}
          <div className="space-y-2">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading slots...</p>
              </div>
            ) : timeSlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No time slots available for this date</p>
                <p className="text-xs text-gray-400 mt-1">Click &quot;Add Slot&quot; to create your first slot</p>
              </div>
            ) : (
              timeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      slot.isAvailable 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {slot.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <Button
                    onClick={() => removeTimeSlot(slot.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Save Button */}
          {timeSlots.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                onClick={saveSlots}
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save All Slots
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">How to use Available Slots:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click on any date in the calendar to select it</li>
          <li>• Click &quot;Add Slot&quot; to create new time slots for the selected date</li>
          <li>• Set start and end times for each slot</li>
          <li>• Click &quot;Save All Slots&quot; to save your availability</li>
          <li>• Dates with available slots are highlighted in green</li>
        </ul>
      </div>
    </div>
  );
};

export default AvailableSlots;

AvailableSlots.propTypes = {
  doctorData: PropTypes.shape({
    _id: PropTypes.string
  }).isRequired
};
