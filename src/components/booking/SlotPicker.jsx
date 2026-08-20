import React, { useState, useEffect } from 'react';
import api from '../../instance';

export default function SlotPicker({ doctor, onSlotSelected, selectedSlot, onHoldCreated }) {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate next 14 days for date picker
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    dates.push({
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate(),
      month: d.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0,
    });
  }

  // Fetch available slots whenever doctor or date changes
  useEffect(() => {
    if (!doctor?._id || !selectedDate) return;

    const fetchSlots = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/doctors/${doctor._id}/available-slots/${selectedDate}`);
        if (res.data && res.data.slots) {
          setSlots(res.data.slots);
        } else {
          setSlots([]);
        }
      } catch (err) {
        console.warn('Fallback default slots:', err.message);
        setSlots([
          { startTime: '09:00 AM', endTime: '09:45 AM', category: 'morning', isAvailable: true },
          { startTime: '10:00 AM', endTime: '10:45 AM', category: 'morning', isAvailable: true },
          { startTime: '11:15 AM', endTime: '12:00 PM', category: 'morning', isAvailable: true },
          { startTime: '02:00 PM', endTime: '02:45 PM', category: 'afternoon', isAvailable: true },
          { startTime: '03:30 PM', endTime: '04:15 PM', category: 'afternoon', isAvailable: true },
          { startTime: '05:00 PM', endTime: '05:45 PM', category: 'evening', isAvailable: true },
          { startTime: '06:00 PM', endTime: '06:45 PM', category: 'evening', isAvailable: true },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [doctor?._id, selectedDate]);

  const handleSlotClick = async (slot) => {
    if (!slot.isAvailable) return;

    onSlotSelected({
      date: selectedDate,
      time: slot.startTime,
      endTime: slot.endTime,
      durationMinutes: slot.durationMinutes || 45,
    });

    // 7-minute concurrency hold
    try {
      const holdRes = await api.post('/appointments/hold', {
        doctorId: doctor._id,
        date: selectedDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
      });

      if (holdRes.data && holdRes.data.success && onHoldCreated) {
        onHoldCreated(holdRes.data.data);
      }
    } catch (holdErr) {
      console.warn('Slot hold status:', holdErr.response?.data?.message || holdErr.message);
    }
  };

  const morningSlots = slots.filter((s) => s.category === 'morning');
  const afternoonSlots = slots.filter((s) => s.category === 'afternoon');
  const eveningSlots = slots.filter((s) => s.category === 'evening' || s.category === 'night');

  return (
    <div className="space-y-6">
      {/* 1. Date Selector (Horizontal scrollable calendar chips) */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center gap-1.5 font-headline">
          <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
          <span>1. Select Date</span>
        </label>

        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide">
          {dates.map((d) => {
            const isSelected = selectedDate === d.dateStr;
            return (
              <button
                key={d.dateStr}
                type="button"
                onClick={() => setSelectedDate(d.dateStr)}
                className={`flex flex-col items-center justify-center min-w-[72px] py-3 px-2 rounded-2xl border transition-all text-center ${
                  isSelected
                    ? 'bg-primary text-on-primary border-primary shadow-[0px_4px_12px_rgba(74,101,78,0.25)] scale-105'
                    : 'bg-surface-container-lowest text-on-surface border-outline-variant hover:border-primary hover:bg-surface-container-low'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
                  {d.dayName}
                </span>
                <span className="font-headline text-lg font-bold my-0.5">{d.dayNum}</span>
                <span className={`text-[10px] font-medium ${isSelected ? 'text-primary-fixed' : 'text-on-surface-variant'}`}>
                  {d.month}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Slot Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3 flex items-center justify-between font-headline">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
            <span>2. Choose 45-Minute Slot</span>
          </span>
          <span className="text-[11px] font-bold text-on-secondary-container bg-secondary-container px-2.5 py-0.5 rounded-full">
            45 Mins
          </span>
        </label>

        {loading ? (
          <div className="py-10 flex flex-col items-center justify-center text-on-surface-variant gap-2">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Checking availability...</span>
          </div>
        ) : slots.length === 0 ? (
          <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant text-center text-on-surface-variant text-xs flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-secondary">info</span>
            <span>No slots available for this date. Please pick another date.</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Morning */}
            {morningSlots.length > 0 && (
              <div>
                <div className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-600">wb_sunny</span>
                  <span>Morning</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {morningSlots.map((slot) => {
                    const isSelected = selectedSlot?.time === slot.startTime && selectedSlot?.date === selectedDate;
                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => handleSlotClick(slot)}
                        className={`py-2 px-2 rounded-full text-xs font-bold border transition-all text-center ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary shadow-sm'
                            : slot.isAvailable
                            ? 'bg-surface-container-lowest text-on-surface border-outline-variant hover:border-primary hover:bg-surface-container-low'
                            : 'bg-surface-container text-outline border-transparent cursor-not-allowed line-through'
                        }`}
                      >
                        {slot.startTime}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Afternoon */}
            {afternoonSlots.length > 0 && (
              <div>
                <div className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-orange-600">light_mode</span>
                  <span>Afternoon</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {afternoonSlots.map((slot) => {
                    const isSelected = selectedSlot?.time === slot.startTime && selectedSlot?.date === selectedDate;
                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => handleSlotClick(slot)}
                        className={`py-2 px-2 rounded-full text-xs font-bold border transition-all text-center ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary shadow-sm'
                            : slot.isAvailable
                            ? 'bg-surface-container-lowest text-on-surface border-outline-variant hover:border-primary hover:bg-surface-container-low'
                            : 'bg-surface-container text-outline border-transparent cursor-not-allowed line-through'
                        }`}
                      >
                        {slot.startTime}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Evening */}
            {eveningSlots.length > 0 && (
              <div>
                <div className="text-xs font-bold text-on-surface-variant mb-2 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-indigo-600">dark_mode</span>
                  <span>Evening</span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {eveningSlots.map((slot) => {
                    const isSelected = selectedSlot?.time === slot.startTime && selectedSlot?.date === selectedDate;
                    return (
                      <button
                        key={slot.startTime}
                        type="button"
                        disabled={!slot.isAvailable}
                        onClick={() => handleSlotClick(slot)}
                        className={`py-2 px-2 rounded-full text-xs font-bold border transition-all text-center ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary shadow-sm'
                            : slot.isAvailable
                            ? 'bg-surface-container-lowest text-on-surface border-outline-variant hover:border-primary hover:bg-surface-container-low'
                            : 'bg-surface-container text-outline border-transparent cursor-not-allowed line-through'
                        }`}
                      >
                        {slot.startTime}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
