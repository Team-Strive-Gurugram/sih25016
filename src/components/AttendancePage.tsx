import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Download, UserCheck, UserX } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  isPresent: boolean;
}

interface Batch {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  semester: string;
  year: string;
}

interface AttendancePageProps {
  batch: Batch;
}

export function AttendancePage({ batch }: AttendancePageProps) {
  // Mock student data
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'John Doe', rollNumber: 'CS001', isPresent: true },
    { id: '2', name: 'Jane Smith', rollNumber: 'CS002', isPresent: false },
    { id: '3', name: 'Mike Johnson', rollNumber: 'CS003', isPresent: true },
    { id: '4', name: 'Sarah Wilson', rollNumber: 'CS004', isPresent: false },
    { id: '5', name: 'David Brown', rollNumber: 'CS005', isPresent: true },
    { id: '6', name: 'Emily Davis', rollNumber: 'CS006', isPresent: true },
    { id: '7', name: 'Alex Miller', rollNumber: 'CS007', isPresent: false },
    { id: '8', name: 'Lisa Garcia', rollNumber: 'CS008', isPresent: true },
  ]);

  const toggleAttendance = (studentId: string) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, isPresent: !student.isPresent }
          : student
      )
    );
  };

  const handleDownload = () => {
    // Mock download functionality
    const csvContent = [
      ['Roll Number', 'Name', 'Status'],
      ...students.map(s => [s.rollNumber, s.name, s.isPresent ? 'Present' : 'Absent'])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${batch.name}_attendance.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const presentCount = students.filter(s => s.isPresent).length;
  const absentCount = students.length - presentCount;

  return (
    <div className="p-4 space-y-4">
      {/* Stats */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-medium">Today's Attendance</h3>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm">Present: {presentCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm">Absent: {absentCount}</span>
          </div>
        </div>
      </Card>

      {/* Student List */}
      <div className="space-y-3">
        {students.map((student) => (
          <Card key={student.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h4 className="font-medium">{student.name}</h4>
                <p className="text-sm text-muted-foreground">{student.rollNumber}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={student.isPresent ? "default" : "destructive"}>
                  {student.isPresent ? "Present" : "Absent"}
                </Badge>
                <Button
                  onClick={() => toggleAttendance(student.id)}
                  variant={student.isPresent ? "destructive" : "default"}
                  size="sm"
                >
                  {student.isPresent ? (
                    <>
                      <UserX className="w-4 h-4 mr-2" />
                      Mark Absent
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4 mr-2" />
                      Mark Present
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}