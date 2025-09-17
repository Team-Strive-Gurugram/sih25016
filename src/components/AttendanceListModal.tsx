import { useState } from "react";
import { ArrowLeft, Download, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "./ui/dialog";

interface AttendanceListModalProps {
  className: string;
  classCode: string;
  onClose: () => void;
}

interface Student {
  id: string;
  name: string;
  studentId: string;
  status: 'present' | 'absent';
}

export function AttendanceListModal({ className, classCode, onClose }: AttendanceListModalProps) {
  // Generate realistic student names based on the class code
  const generateStudents = (code: string): Student[] => {
    const firstNames = [
      'John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Chris', 'Jessica',
      'Daniel', 'Ashley', 'Ryan', 'Megan', 'Tyler', 'Lauren', 'Kevin', 'Rachel',
      'Brandon', 'Sophia', 'Jake', 'Emma', 'Alex', 'Madison', 'Sean', 'Olivia',
      'Nick', 'Hannah', 'Matt', 'Chloe', 'Josh', 'Grace', 'Andrew', 'Natalie'
    ];
    
    const lastNames = [
      'Doe', 'Smith', 'Johnson', 'Wilson', 'Brown', 'Davis', 'Miller', 'Moore',
      'Taylor', 'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson',
      'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee', 'Walker',
      'Hall', 'Allen', 'Young', 'King', 'Wright', 'Lopez', 'Hill', 'Scott'
    ];

    const studentCount = Math.floor(Math.random() * 10) + 25; // 25-35 students
    const students: Student[] = [];
    
    for (let i = 0; i < studentCount; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const studentNumber = String(i + 1).padStart(3, '0');
      
      students.push({
        id: `${code.toLowerCase()}${studentNumber}`,
        name: `${firstName} ${lastName}`,
        studentId: `${code}${studentNumber}`,
        status: Math.random() > 0.2 ? 'present' : 'absent' // 80% attendance rate
      });
    }
    
    return students.sort((a, b) => a.name.localeCompare(b.name));
  };

  const [students, setStudents] = useState<Student[]>(() => generateStudents(classCode));

  const toggleStudentStatus = (studentId: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, status: student.status === 'present' ? 'absent' : 'present' }
        : student
    ));
  };

  const presentCount = students.filter(s => s.status === 'present').length;
  const absentCount = students.length - presentCount;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full max-h-[90vh] bg-white p-0 border-none rounded-xl overflow-hidden">
        <DialogTitle className="sr-only">
          Attendance List for {className}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Mark attendance for students in {className}. Current attendance: {presentCount} present, {absentCount} absent.
        </DialogDescription>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 p-4 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/20 p-1"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h2 className="font-semibold">{classCode} (2021-2025)</h2>
              <p className="text-white/80 text-sm">{className.split(' ').slice(1).join(' ')}</p>
            </div>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <span className="text-sm">Faculty</span>
            </Button>
          </div>
        </div>

        {/* Today's Attendance Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-900">Today's Attendance</h3>
            <Button variant="outline" size="sm" className="text-sm">
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Present: {presentCount}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Absent: {absentCount}</span>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="flex-1 overflow-y-auto max-h-96">
          {students.map((student) => (
            <div key={student.id} className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{student.name}</h4>
                <p className="text-sm text-gray-500">{student.studentId}</p>
              </div>
              <div className="flex items-center gap-2">
                {student.status === 'present' ? (
                  <>
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Present
                    </span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => toggleStudentStatus(student.id)}
                      className="text-xs px-3 py-1 h-auto"
                    >
                      Mark Absent
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Absent
                    </span>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => toggleStudentStatus(student.id)}
                      className="text-xs px-3 py-1 h-auto bg-green-600 hover:bg-green-700"
                    >
                      Mark Present
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}