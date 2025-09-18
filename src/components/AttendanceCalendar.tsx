import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CircularProgress } from "./CircularProgress";
import { useAttendance } from "./AttendanceContext";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Generate calendar weeks for any month/year
const generateCalendarWeeks = (year: number, month: number) => {
  const weeks: (number | null)[][] = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  
  // Start from Monday (1 = Monday, 0 = Sunday in our display)
  const startDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1; // Convert Sunday=0 to Sunday=6
  
  let currentWeek: (number | null)[] = [];
  
  // Add empty cells for days before the first day of month
  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push(null);
  }
  
  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayOfWeek = date.getDay();
    
    // Only show weekdays (Monday to Friday)
    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      currentWeek.push(day);
    }
    
    // If we've filled a work week (5 days) or reached end of month, start new week
    if (currentWeek.filter(d => d !== null).length === 5 || day === daysInMonth) {
      // Pad the week to 5 days if needed
      while (currentWeek.length < 5) {
        currentWeek.push(null);
      }
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  }
  
  return weeks;
};



export function AttendanceCalendar() {
  const { subjects, getOverallAttendance, currentDate } = useAttendance();
  
  // State for current viewed month/year
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());
  
  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "present":
        return "bg-emerald-500";
      case "absent":
        return "bg-red-500";
      case "pending":
        return "bg-gray-500";
      case "current":
        return "bg-blue-500";
      default:
        return "";
    }
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(viewYear, viewMonth + direction);
    setViewMonth(newDate.getMonth());
    setViewYear(newDate.getFullYear());
  };

  const getDateStatus = (date: number | null) => {
    if (!date) return null;
    
    const dateString = `${viewYear}-${(viewMonth + 1).toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
    const isToday = dateString === currentDate;
    
    if (isToday) return "current";
    
    // Check if any subject has attendance for this date
    const hasAttendance = subjects.some(subject => 
      subject.attendance.some(record => record.date === dateString)
    );
    
    if (hasAttendance) {
      // Get the most common status for this date
      const statuses = subjects.flatMap(subject => 
        subject.attendance.filter(record => record.date === dateString).map(record => record.status)
      );
      const presentCount = statuses.filter(s => s === 'present').length;
      const absentCount = statuses.filter(s => s === 'absent').length;
      
      if (presentCount > absentCount) return "present";
      if (absentCount > 0) return "absent";
      return "pending";
    }
    
    return null;
  };

  return (
    <div className="mx-6 mb-6">
      <h2 className="text-white text-lg mb-4">Attendance Calendar</h2>
      
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigateMonth(-1)}>
          <ChevronLeft className="w-6 h-6 text-white hover:text-cyan-400 transition-colors" />
        </button>
        <h3 className="text-white text-lg">
          {monthNames[viewMonth]} {viewYear}
        </h3>
        <button onClick={() => navigateMonth(1)}>
          <ChevronRight className="w-6 h-6 text-white hover:text-cyan-400 transition-colors" />
        </button>
      </div>

      <div className="flex items-start gap-6">
        {/* Progress Circle */}
        <div className="flex-shrink-0">
          <CircularProgress 
            percentage={getOverallAttendance()} 
            size={80} 
            color={getOverallAttendance() >= 75 ? "#22c55e" : getOverallAttendance() >= 50 ? "#eab308" : "#ef4444"}
            backgroundColor="#374151"
          />
        </div>

        {/* Calendar Grid */}
        <div className="flex-1">
          {/* Days of Week Header */}
          <div className="grid grid-cols-5 gap-2 mb-2">
            {daysOfWeek.slice(1, 6).map((day, index) => (
              <div key={`day-${index}-${day}`} className="text-center text-gray-400 text-sm py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Dates */}
          <div className="grid grid-cols-5 gap-2">
            {generateCalendarWeeks(viewYear, viewMonth).flat().map((date, index) => {
              const uniqueKey = `date-${index}-${date || 'empty'}`;
              
              if (!date) return <div key={uniqueKey} />;
              
              const status = getDateStatus(date);

              return (
                <div
                  key={uniqueKey}
                  className="relative text-center text-white py-2"
                >
                  <span>{date}</span>
                  {status && (
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(status)} absolute -bottom-1 left-1/2 transform -translate-x-1/2`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-gray-300 text-sm">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-gray-300 text-sm">Absent</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-500" />
          <span className="text-gray-300 text-sm">Pending</span>
        </div>
      </div>
    </div>
  );
}