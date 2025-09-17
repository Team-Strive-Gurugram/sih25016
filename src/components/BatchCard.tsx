import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Users, BookOpen, ChevronRight } from 'lucide-react';

interface Batch {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  semester: string;
  year: string;
}

interface BatchCardProps {
  batch: Batch;
  onSelect: () => void;
}

export function BatchCard({ batch, onSelect }: BatchCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-medium">{batch.name}</h4>
            <Badge variant="secondary">{batch.semester} Sem</Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              {batch.subject}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              {batch.studentCount} students
            </div>
          </div>
          
          <div className="mt-3">
            <Button onClick={onSelect} variant="outline" size="sm" className="w-full">
              Mark Attendance
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}