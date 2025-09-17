import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, MapPin, CheckCircle, XCircle } from 'lucide-react';

interface ScheduleCardProps {
  subject: string;
  time: string;
  room: string;
  isPresent?: boolean;
}

export function ScheduleCard({ subject, time, room, isPresent }: ScheduleCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-medium mb-2">{subject}</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {time}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {room}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isPresent !== undefined && (
            <div className="flex items-center gap-1">
              {isPresent ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600" />
              )}
            </div>
          )}
          <Badge variant={isPresent === true ? "default" : isPresent === false ? "destructive" : "secondary"}>
            {isPresent === true ? "Present" : isPresent === false ? "Absent" : "Pending"}
          </Badge>
        </div>
      </div>
    </Card>
  );
}