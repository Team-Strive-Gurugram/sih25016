import { ChevronLeft, ChevronRight } from "lucide-react";
import { CircularProgress } from "./CircularProgress";
import { useAttendance } from "./AttendanceContext";

const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];

// Calendar data for September 2025 - proper calendar structure
const generateCalendarWeeks = () => {
  // September 2025 starts on Monday (1st)
  return [
    [1, 2, 3, 4, 5],      // Week 1: Mon-Fri
    [8, 9, 10, 11, 12],   // Week 2: Mon-Fri  
    [15, 16, 17, 18, 19], // Week 3: Mon-Fri
    [22, 23, 24, 25, 26], // Week 4: Mon-Fri
    [29, 30, null, null, null] // Week 5: Mon-Tue
  ];
};



export function AttendanceCalendar() {
  const { subjects, getOverallAttendance, currentDate } = useAttendance();
  
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

  const getDateStatus = (date: number | null) => {
    if (!date) return null;
    
    const dateString = `2025-09-${date.toString().padStart(2, '0')}`;
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
        <button>
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <h3 className="text-white text-lg">September 2025</h3>
        <button>
          <ChevronRight className="w-6 h-6 text-white" />
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
            {generateCalendarWeeks().flat().map((date, index) => {
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