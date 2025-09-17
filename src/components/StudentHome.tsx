import { Calendar } from './Calendar';
import { AttendanceStats } from './AttendanceStats';
import { ScheduleCard } from './ScheduleCard';
import { Button } from './ui/button';
import { Download, User } from 'lucide-react';

interface StudentHomeProps {
  studentData: {
    name: string;
    rollNumber: string;
    attendanceData: { [key: string]: boolean };
    schedule: Array<{
      subject: string;
      time: string;
      room: string;
      isPresent?: boolean;
    }>;
    stats: {
      overall: number;
      subjects: Array<{
        name: string;
        present: number;
        absent: number;
        total: number;
        percentage: number;
      }>;
    };
  };
}

export function StudentHome({ studentData }: StudentHomeProps) {
  const handleDownload = () => {
    // Mock download functionality
    const csvContent = [
      ['Subject', 'Present', 'Absent', 'Total', 'Percentage'],
      ...studentData.stats.subjects.map(s => [s.name, s.present, s.absent, s.total, `${s.percentage}%`]),
      ['Overall', '', '', '', `${studentData.stats.overall}%`]
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-medium">{studentData.name}</h1>
            <p className="text-sm text-muted-foreground">Roll: {studentData.rollNumber}</p>
          </div>
        </div>
        
        <Button 
          onClick={handleDownload}
          className="w-full mt-4"
          variant="outline"
        >
          <Download className="w-4 h-4 mr-2" />
          Download Attendance Report
        </Button>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Calendar */}
        <div>
          <h2 className="mb-4">Attendance Calendar</h2>
          <Calendar attendanceData={studentData.attendanceData} />
          <p className="text-sm text-muted-foreground mt-2">
            Green days indicate classes where attendance was marked present
          </p>
        </div>
        
        {/* Today's Schedule */}
        <div>
          <h2 className="mb-4">Today's Schedule</h2>
          <div className="space-y-3">
            {studentData.schedule.map((item, index) => (
              <ScheduleCard key={index} {...item} />
            ))}
          </div>
        </div>
        
        {/* Attendance Stats */}
        <div>
          <h2 className="mb-4">Attendance Statistics</h2>
          <AttendanceStats stats={studentData.stats} />
        </div>
      </div>
    </div>
  );
}