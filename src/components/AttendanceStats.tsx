import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface AttendanceStatsProps {
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
}

export function AttendanceStats({ stats }: AttendanceStatsProps) {
  return (
    <div className="space-y-4">
      {/* Overall Attendance */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">Overall Attendance</h3>
          <span className="font-semibold text-lg">{stats.overall}%</span>
        </div>
        <Progress value={stats.overall} className="h-2" />
      </Card>
      
      {/* Subject-wise Attendance */}
      <div className="space-y-3">
        {stats.subjects.map((subject, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{subject.name}</h4>
              <span className="font-semibold">{subject.percentage}%</span>
            </div>
            <Progress value={subject.percentage} className="h-2 mb-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Present: {subject.present}</span>
              <span>Absent: {subject.absent}</span>
              <span>Total: {subject.total}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}