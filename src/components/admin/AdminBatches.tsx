import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '../ui/dialog';

import { Badge } from '../ui/badge';
import { ArrowLeft, Plus, Search, BookOpen, Users, Download, UserPlus, GraduationCap } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdminBatchesProps {
  onNavigate: (route: 'dashboard' | 'students' | 'faculties' | 'batches' | 'analytics') => void;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  facultyId: string;
  facultyName: string;
  credits: number;
}

interface Batch {
  id: string;
  name: string;
  department: string;
  semester: string;
  year: string;
  studentCount: number;
  subjects: Subject[];
  schedule: ScheduleSlot[];
  assignedFaculty: string[]; // Array of faculty IDs
}

interface ScheduleSlot {
  id: string;
  day: string;
  time: string;
  subject: string;
  faculty: string;
  room: string;
  type: 'regular' | 'special' | 'cancelled';
  date?: string; // For special classes or cancellations
}

export function AdminBatches({ onNavigate }: AdminBatchesProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [isFacultyDialogOpen, setIsFacultyDialogOpen] = useState(false);

  const [batches, setBatches] = useState<Batch[]>([
    {
      id: '1',
      name: 'CS-A (2021-2025)',
      department: 'Computer Science',
      semester: '5th',
      year: '2024',
      studentCount: 45,
      assignedFaculty: ['1', '2'],
      subjects: [
        { id: '1', name: 'Data Structures', code: 'CS301', facultyId: '1', facultyName: 'Dr. Smith Johnson', credits: 4 },
        { id: '2', name: 'Algorithm Analysis', code: 'CS302', facultyId: '1', facultyName: 'Dr. Smith Johnson', credits: 3 },
      ],
      schedule: [
        { id: '1', day: 'Monday', time: '9:00-10:00', subject: 'Data Structures', faculty: 'Dr. Smith Johnson', room: 'Room 101', type: 'regular' },
        { id: '2', day: 'Monday', time: '10:15-11:15', subject: 'Algorithm Analysis', faculty: 'Dr. Smith Johnson', room: 'Room 102', type: 'regular' },
        { id: '3', day: 'Tuesday', time: '9:00-10:00', subject: 'Data Structures', faculty: 'Dr. Smith Johnson', room: 'Room 101', type: 'regular' },
      ]
    },
    {
      id: '2',
      name: 'CS-B (2021-2025)',
      department: 'Computer Science',
      semester: '5th',
      year: '2024',
      studentCount: 42,
      assignedFaculty: ['3'],
      subjects: [
        { id: '3', name: 'Computer Networks', code: 'CS303', facultyId: '3', facultyName: 'Prof. Michael Brown', credits: 4 },
      ],
      schedule: []
    },
  ]);

  const [newSubject, setNewSubject] = useState({
    name: '',
    code: '',
    facultyId: '',
    credits: 3,
  });



  const faculties = [
    { id: '1', name: 'Dr. Smith Johnson', department: 'Computer Science' },
    { id: '2', name: 'Dr. Emily Davis', department: 'Information Technology' },
    { id: '3', name: 'Prof. Michael Brown', department: 'Computer Science' },
    { id: '4', name: 'Dr. Sarah Wilson', department: 'Mathematics' },
    { id: '5', name: 'Prof. Alex Turner', department: 'Physics' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '9:00-10:00', '10:15-11:15', '11:30-12:30', '1:30-2:30', '2:45-3:45', '4:00-5:00'
  ];

  const filteredBatches = batches.filter(batch =>
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSubject = () => {
    if (!selectedBatch || !newSubject.name || !newSubject.code || !newSubject.facultyId) {
      toast('Please fill in all required fields');
      return;
    }

    const faculty = faculties.find(f => f.id === newSubject.facultyId);
    const subject: Subject = {
      id: Date.now().toString(),
      name: newSubject.name,
      code: newSubject.code,
      facultyId: newSubject.facultyId,
      facultyName: faculty?.name || '',
      credits: newSubject.credits,
    };

    setBatches(prev => prev.map(batch => 
      batch.id === selectedBatch.id 
        ? { ...batch, subjects: [...batch.subjects, subject] }
        : batch
    ));

    // Update selected batch to reflect changes immediately
    setSelectedBatch(prev => prev ? {
      ...prev,
      subjects: [...prev.subjects, subject]
    } : null);

    setNewSubject({ name: '', code: '', facultyId: '', credits: 3 });
    toast('Subject added successfully');
  };



  const exportAttendance = (batch: Batch) => {
    // Mock export functionality - in real app, would generate XLSX
    toast('Attendance report downloaded successfully');
  };

  const handleAssignFaculty = (facultyId: string) => {
    if (!selectedBatch) return;

    setBatches(prev => prev.map(batch => 
      batch.id === selectedBatch.id 
        ? { 
            ...batch, 
            assignedFaculty: batch.assignedFaculty.includes(facultyId) 
              ? batch.assignedFaculty.filter(id => id !== facultyId)
              : [...batch.assignedFaculty, facultyId]
          }
        : batch
    ));

    // Update selected batch
    setSelectedBatch(prev => prev ? {
      ...prev,
      assignedFaculty: prev.assignedFaculty.includes(facultyId)
        ? prev.assignedFaculty.filter(id => id !== facultyId)
        : [...prev.assignedFaculty, facultyId]
    } : null);

    toast(
      selectedBatch.assignedFaculty.includes(facultyId) 
        ? 'Faculty removed from batch' 
        : 'Faculty assigned to batch'
    );
  };

  const getAssignedFaculty = (batch: Batch) => {
    return faculties.filter(faculty => batch.assignedFaculty.includes(faculty.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1>Batch Management</h1>
            <p className="text-sm text-muted-foreground">Create subjects, assign faculties, and manage schedules</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
            <Card className="p-4">
              <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search batches..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBatches.map((batch) => (
                <Card key={batch.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer" 
                      onClick={() => {
                        setSelectedBatch(batch);
                        setIsSubjectDialogOpen(true);
                      }}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h4>{batch.name}</h4>
                      <Badge variant="secondary">{batch.semester} Sem</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{batch.department}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {batch.studentCount} students
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="w-4 h-4" />
                        {batch.subjects.length} subjects
                      </div>
                    </div>
                    
                    {/* Subjects List */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <BookOpen className="w-4 h-4" />
                        Subjects
                      </div>
                      <div className="space-y-1">
                        {batch.subjects.length > 0 ? (
                          batch.subjects.slice(0, 3).map((subject) => (
                            <div key={subject.id} className="text-xs bg-primary/5 p-2 rounded border">
                              <div className="font-medium">{subject.name} ({subject.code})</div>
                              <div className="text-muted-foreground">{subject.facultyName} • {subject.credits} credits</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded border border-dashed">
                            Click to add subjects
                          </div>
                        )}
                        {batch.subjects.length > 3 && (
                          <div className="text-xs text-muted-foreground text-center">
                            +{batch.subjects.length - 3} more subjects
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBatch(batch);
                        setIsFacultyDialogOpen(true);
                      }}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Assign Faculty
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1" onClick={(e) => {
                        e.stopPropagation();
                        exportAttendance(batch);
                      }}>
                        <Download className="w-4 h-4 mr-2" />
                        Reports
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

        {/* Add Subject Dialog */}
        <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Subject to {selectedBatch?.name}</DialogTitle>
              <DialogDescription>
                Fill in the details below to add a new subject to this batch.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Subject Name</Label>
                <Input
                  placeholder="Enter subject name"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Subject Code</Label>
                <Input
                  placeholder="Enter subject code"
                  value={newSubject.code}
                  onChange={(e) => setNewSubject(prev => ({ ...prev, code: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Assign Faculty</Label>
                <Select value={newSubject.facultyId} onValueChange={(value) => setNewSubject(prev => ({ ...prev, facultyId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.id}>
                        {faculty.name} - {faculty.department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Credits</Label>
                <Select value={newSubject.credits.toString()} onValueChange={(value) => setNewSubject(prev => ({ ...prev, credits: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Credit</SelectItem>
                    <SelectItem value="2">2 Credits</SelectItem>
                    <SelectItem value="3">3 Credits</SelectItem>
                    <SelectItem value="4">4 Credits</SelectItem>
                    <SelectItem value="5">5 Credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Current Subjects List */}
              {selectedBatch && selectedBatch.subjects.length > 0 && (
                <div className="space-y-2">
                  <Label>Current Subjects</Label>
                  <div className="max-h-40 overflow-y-auto space-y-2 p-3 bg-muted/20 rounded-lg">
                    {selectedBatch.subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center justify-between p-2 bg-background rounded border">
                        <div>
                          <div className="font-medium text-sm">{subject.name} ({subject.code})</div>
                          <div className="text-xs text-muted-foreground">{subject.facultyName} • {subject.credits} credits</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => {
                setIsSubjectDialogOpen(false);
                setNewSubject({ name: '', code: '', facultyId: '', credits: 3 });
              }}>
                Cancel
              </Button>
              <Button onClick={handleAddSubject}>Add Subject</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Faculty Assignment Dialog */}
        <Dialog open={isFacultyDialogOpen} onOpenChange={setIsFacultyDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                Assign Faculty to {selectedBatch?.name}
              </DialogTitle>
              <DialogDescription>
                Select faculty members to assign or remove from this batch.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-3">
                {faculties.map((faculty) => {
                  const isAssigned = selectedBatch?.assignedFaculty.includes(faculty.id) || false;
                  return (
                    <div key={faculty.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{faculty.name}</p>
                        <p className="text-sm text-muted-foreground">{faculty.department}</p>
                      </div>
                      <Button
                        variant={isAssigned ? "destructive" : "default"}
                        size="sm"
                        onClick={() => handleAssignFaculty(faculty.id)}
                      >
                        {isAssigned ? "Remove" : "Assign"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsFacultyDialogOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>


      </div>
    </div>
  );
}