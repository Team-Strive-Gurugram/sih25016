import { useState } from "react";
import { X, Check, UserCheck, UserX, Calendar, Users } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Checkbox } from "./ui/checkbox";
import { toast } from "sonner@2.0.3";

interface AttendanceSheetModalProps {
  batch: string;
  subject: string;
  students: number;
  onClose: () => void;
}

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  isPresent: boolean;
}

export function AttendanceSheetModal({ batch, subject, students, onClose }: AttendanceSheetModalProps) {
  // Generate mock student data
  const [studentList, setStudentList] = useState<Student[]>(() => {
    const names = [
      "Alex Johnson", "Emily Davis", "Michael Brown", "Sarah Wilson", "David Lee",
      "Jessica Chen", "Ryan Martinez", "Ashley Taylor", "Kevin Garcia", "Lauren Anderson",
      "James Rodriguez", "Natalie Thompson", "Christopher White", "Samantha Hall",
      "Daniel Lewis", "Megan Clark", "Andrew Young", "Olivia King", "Matthew Scott",
      "Rachel Green", "Jonathan Adams", "Hannah Baker", "Nicholas Cooper", "Grace Murphy",
      "Brandon Reed", "Sophia Phillips", "Tyler Evans", "Madison Turner", "Jacob Collins",
      "Emma Parker", "Joshua Stewart", "Chloe Morris", "Ethan Rogers", "Ava Mitchell"
    ];
    
    return Array.from({ length: students }, (_, i) => ({
      id: `student-${i + 1}`,
      name: names[i % names.length],
      rollNumber: `${batch.split('-')[0]}${(2021 + Math.floor(i / 20))}${String(i + 1).padStart(3, '0')}`,
      isPresent: Math.random() > 0.3 // 70% default attendance
    }));
  });

  const handleStudentToggle = (studentId: string) => {
    setStudentList(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, isPresent: !student.isPresent }
          : student
      )
    );
  };

  const handleMarkAllPresent = () => {
    setStudentList(prev => prev.map(student => ({ ...student, isPresent: true })));
    toast.success("All students marked present");
  };

  const handleMarkAllAbsent = () => {
    setStudentList(prev => prev.map(student => ({ ...student, isPresent: false })));
    toast.success("All students marked absent");
  };

  const handleSaveAttendance = () => {
    const presentCount = studentList.filter(s => s.isPresent).length;
    const attendancePercentage = Math.round((presentCount / students) * 100);
    
    toast.success(`Attendance saved! ${presentCount}/${students} present (${attendancePercentage}%)`);
    onClose();
  };

  const presentCount = studentList.filter(s => s.isPresent).length;
  const absentCount = students - presentCount;
  const attendancePercentage = Math.round((presentCount / students) * 100);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full max-h-[90vh] bg-slate-900/95 backdrop-blur-sm border-slate-700">
        <DialogHeader className="border-b border-slate-700 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg">Mark Attendance</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-slate-800">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-left space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 text-sm">
              <Calendar className="w-4 h-4" />
              <span>{subject}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 text-sm">
              <Users className="w-4 h-4" />
              <span>{batch} • {students} Students</span>
            </div>
          </div>
        </DialogHeader>

        {/* Attendance Summary */}
        <div className="grid grid-cols-3 gap-3 py-4">
          <div className="bg-green-500/20 rounded-lg p-3 text-center">
            <div className="text-green-400 text-lg font-semibold">{presentCount}</div>
            <div className="text-green-300 text-xs">Present</div>
          </div>
          <div className="bg-red-500/20 rounded-lg p-3 text-center">
            <div className="text-red-400 text-lg font-semibold">{absentCount}</div>
            <div className="text-red-300 text-xs">Absent</div>
          </div>
          <div className="bg-blue-500/20 rounded-lg p-3 text-center">
            <div className="text-blue-400 text-lg font-semibold">{attendancePercentage}%</div>
            <div className="text-blue-300 text-xs">Rate</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pb-4">
          <Button 
            onClick={handleMarkAllPresent}
            variant="outline" 
            size="sm" 
            className="flex-1 bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20"
          >
            <UserCheck className="w-4 h-4 mr-1" />
            All Present
          </Button>
          <Button 
            onClick={handleMarkAllAbsent}
            variant="outline" 
            size="sm" 
            className="flex-1 bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20"
          >
            <UserX className="w-4 h-4 mr-1" />
            All Absent
          </Button>
        </div>

        {/* Student List */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {studentList.map((student) => (
            <div 
              key={student.id}
              className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800/70 transition-colors"
            >
              <Checkbox
                checked={student.isPresent}
                onCheckedChange={() => handleStudentToggle(student.id)}
                className="border-slate-600"
              />
              <div className="flex-1">
                <div className="text-white text-sm font-medium">{student.name}</div>
                <div className="text-slate-400 text-xs">{student.rollNumber}</div>
              </div>
              <div className={`w-2 h-2 rounded-full ${student.isPresent ? 'bg-green-400' : 'bg-red-400'}`} />
            </div>
          ))}
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-700">
          <Button 
            onClick={handleSaveAttendance}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Save Attendance ({attendancePercentage}%)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}