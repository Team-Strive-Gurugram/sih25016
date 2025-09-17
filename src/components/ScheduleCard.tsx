import { Clock, MapPin, Check } from "lucide-react";

interface ScheduleCardProps {
  id: string;
  title: string;
  time: string;
  room: string;
  status: "present" | "pending" | "absent";
  isCompleted?: boolean;
  onMarkAttendance?: (subject: { id: string; name: string; time: string; room: string }) => void;
}

export function ScheduleCard({ id, title, time, room, status, isCompleted = false, onMarkAttendance }: ScheduleCardProps) {
  const statusColors = {
    present: "bg-emerald-500 text-white",
    pending: "bg-orange-500 text-white",
    absent: "bg-red-500 text-white"
  };

  const statusText = {
    present: "Present",
    pending: "Pending",
    absent: "Absent"
  };

  const handleClick = () => {
    if (status === 'pending' && onMarkAttendance) {
      onMarkAttendance({ id, name: title, time, room });
    }
  };

  return (
    <div 
      className={`bg-slate-700/50 backdrop-blur-sm rounded-2xl p-4 mb-3 transition-all duration-200 ${
        status === 'pending' ? 'cursor-pointer hover:bg-slate-600/50 active:scale-[0.98]' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Status Icon */}
          {status === 'present' && (
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Check className="w-4 h-4 text-white" />
            </div>
          )}
          
          {/* Course Info */}
          <div className="flex-1">
            <h3 className="text-white font-medium mb-1">{title}</h3>
            <div className="flex items-center gap-4 text-gray-300 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{time}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{room}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
          {statusText[status]}
          {status === 'pending' && (
            <span className="ml-1 text-xs opacity-75">• Tap to mark</span>
          )}
        </div>
      </div>
    </div>
  );
}