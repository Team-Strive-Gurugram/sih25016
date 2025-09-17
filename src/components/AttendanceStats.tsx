import { CircularProgress } from "./CircularProgress";
import { useAttendance } from "./AttendanceContext";

interface StatCardProps {
  title: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
  color: string;
}

function StatCard({ title, present, absent, total, percentage, color }: StatCardProps) {
  return (
    <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-4 mb-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-medium mb-2">{title}</h3>
          <div className="flex items-center gap-4 text-gray-300 text-sm">
            <span>Present: {present}</span>
            <span>Absent: {absent}</span>
            <span>Total: {total}</span>
          </div>
        </div>
        
        <CircularProgress 
          percentage={percentage}
          size={60}
          color={color}
          backgroundColor="#374151"
          strokeWidth={6}
        />
      </div>
    </div>
  );
}

export function AttendanceStats() {
  const { getAttendanceStats } = useAttendance();
  const statsData = getAttendanceStats();

  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 75) return "#22c55e"; // Green
    if (percentage >= 50) return "#eab308"; // Yellow
    return "#ef4444"; // Red
  };

  return (
    <div className="mx-6">
      <h2 className="text-white text-lg mb-4">Attendance Statistics</h2>
      <div>
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.subject}
            present={stat.present}
            absent={stat.absent}
            total={stat.total}
            percentage={stat.percentage}
            color={getColorByPercentage(stat.percentage)}
          />
        ))}
      </div>
    </div>
  );
}