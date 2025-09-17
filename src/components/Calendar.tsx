import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface CalendarProps {
  attendanceData: { [key: string]: boolean };
}

export function Calendar({ attendanceData }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const today = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  const currentDateObj = new Date(startDate);
  
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDateObj));
    currentDateObj.setDate(currentDateObj.getDate() + 1);
  }
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
  };
  
  const getDateKey = (date: Date) => {
    return date.toISOString().split('T')[0];
  };
  
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigateMonth(-1)}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="font-medium">
          {monthNames[month]} {year}
        </h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigateMonth(1)}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          const isCurrentMonth = date.getMonth() === month;
          const isToday = date.toDateString() === today.toDateString();
          const dateKey = getDateKey(date);
          const hasAttendance = attendanceData[dateKey];
          
          return (
            <div
              key={index}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg
                ${!isCurrentMonth ? 'text-muted-foreground' : ''}
                ${isToday ? 'bg-primary text-primary-foreground' : ''}
                ${hasAttendance && !isToday ? 'bg-green-100 text-green-800' : ''}
              `}
            >
              {date.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
}