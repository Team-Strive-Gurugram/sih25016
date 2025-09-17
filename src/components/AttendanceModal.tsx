import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Check, X, Clock, MapPin } from "lucide-react";
import { useAttendance } from "./AttendanceContext";
import { toast } from "sonner@2.0.3";

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject: {
    id: string;
    name: string;
    time: string;
    room: string;
  } | null;
}

export function AttendanceModal({ isOpen, onClose, subject }: AttendanceModalProps) {
  const { markAttendance, currentDate } = useAttendance();

  const handleMarkAttendance = (status: 'present' | 'absent') => {
    if (!subject) return;
    
    markAttendance(subject.id, currentDate, status);
    toast.success(`Marked as ${status} for ${subject.name}`, {
      description: `Date: ${new Date(currentDate).toLocaleDateString()}`
    });
    onClose();
  };

  if (!subject) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            Mark Attendance
          </DialogTitle>
          <DialogDescription>
            Mark your attendance for today's class
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Subject Info */}
          <div className="bg-slate-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">{subject.name}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{subject.time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{subject.room}</span>
              </div>
            </div>
          </div>

          {/* Attendance Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={() => handleMarkAttendance('present')}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              <Check className="w-4 h-4 mr-2" />
              Present
            </Button>
            <Button
              onClick={() => handleMarkAttendance('absent')}
              variant="destructive"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Absent
            </Button>
          </div>

          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}