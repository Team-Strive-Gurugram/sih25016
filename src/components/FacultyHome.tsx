import { useState } from 'react';
import { BatchCard } from './BatchCard';
import { AttendancePage } from './AttendancePage';
import { Button } from './ui/button';
import { ArrowLeft, GraduationCap } from 'lucide-react';

interface Batch {
  id: string;
  name: string;
  subject: string;
  studentCount: number;
  semester: string;
  year: string;
}

interface FacultyHomeProps {
  facultyData: {
    name: string;
    department: string;
    batches: Batch[];
  };
}

export function FacultyHome({ facultyData }: FacultyHomeProps) {
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'attendance'>('home');

  const handleBatchSelect = (batch: Batch) => {
    setSelectedBatch(batch);
    setCurrentView('attendance');
  };

  const handleBack = () => {
    setCurrentView('home');
    setSelectedBatch(null);
  };

  if (currentView === 'attendance' && selectedBatch) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="font-medium">{selectedBatch.name}</h1>
              <p className="text-sm text-muted-foreground">{selectedBatch.subject}</p>
            </div>
          </div>
        </div>
        <AttendancePage batch={selectedBatch} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-medium">{facultyData.name}</h1>
            <p className="text-sm text-muted-foreground">{facultyData.department}</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <h2 className="mb-4">Your Batches</h2>
        <div className="space-y-3">
          {facultyData.batches.map((batch) => (
            <BatchCard 
              key={batch.id} 
              batch={batch} 
              onSelect={() => handleBatchSelect(batch)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}