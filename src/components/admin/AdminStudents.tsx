import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ArrowLeft, Plus, Search, Mail, User, Hash } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdminStudentsProps {
  onNavigate: (route: 'dashboard' | 'students' | 'faculties' | 'batches' | 'analytics') => void;
}

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  batch: string;
  semester: string;
  year: string;
  status: 'active' | 'inactive';
}

export function AdminStudents({ onNavigate }: AdminStudentsProps) {
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'John Doe', email: 'john.doe@example.com', rollNumber: 'CS21001', batch: 'CS-A', semester: '5th', year: '2024', status: 'active' },
    { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', rollNumber: 'CS21002', batch: 'CS-A', semester: '5th', year: '2024', status: 'active' },
    { id: '3', name: 'Mike Johnson', email: 'mike.johnson@example.com', rollNumber: 'IT21001', batch: 'IT-A', semester: '3rd', year: '2024', status: 'active' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    rollNumber: '',
    batch: '',
    semester: '',
    year: '2024',
  });

  const batches = [
    { id: 'cs-a', name: 'CS-A (2021-2025)', semester: '5th' },
    { id: 'cs-b', name: 'CS-B (2021-2025)', semester: '5th' },
    { id: 'it-a', name: 'IT-A (2022-2026)', semester: '3rd' },
    { id: 'it-b', name: 'IT-B (2022-2026)', semester: '3rd' },
  ];

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddStudent = () => {
    if (!newStudent.name || !newStudent.email || !newStudent.rollNumber || !newStudent.batch) {
      toast('Please fill in all required fields');
      return;
    }

    const selectedBatch = batches.find(b => b.id === newStudent.batch);
    
    const student: Student = {
      id: Date.now().toString(),
      name: newStudent.name,
      email: newStudent.email,
      rollNumber: newStudent.rollNumber,
      batch: selectedBatch?.name.split(' ')[0] || newStudent.batch,
      semester: selectedBatch?.semester || newStudent.semester,
      year: newStudent.year,
      status: 'active',
    };

    setStudents(prev => [...prev, student]);
    setNewStudent({ name: '', email: '', rollNumber: '', batch: '', semester: '', year: '2024' });
    setIsDialogOpen(false);
    toast('Student registered successfully');
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
            <h1>Student Management</h1>
            <p className="text-sm text-muted-foreground">Register and manage student accounts</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Controls */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students by name, email, roll number, or batch..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Register Student
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Register New Student</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Student Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={newStudent.name}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter email address"
                        value={newStudent.email}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="rollNumber"
                        placeholder="Enter roll number"
                        value={newStudent.rollNumber}
                        onChange={(e) => setNewStudent(prev => ({ ...prev, rollNumber: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="batch">Assign to Batch</Label>
                    <Select value={newStudent.batch} onValueChange={(value) => setNewStudent(prev => ({ ...prev, batch: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a batch" />
                      </SelectTrigger>
                      <SelectContent>
                        {batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name} - {batch.semester} Semester
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Academic Year</Label>
                    <Select value={newStudent.year} onValueChange={(value) => setNewStudent(prev => ({ ...prev, year: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2024">2024</SelectItem>
                        <SelectItem value="2023">2023</SelectItem>
                        <SelectItem value="2025">2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddStudent}>
                    Register Student
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Students Table */}
        <Card>
          <div className="p-4 border-b">
            <h3>Registered Students ({filteredStudents.length})</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roll Number</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Semester</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.rollNumber}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                  <TableCell>{student.semester}</TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      student.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {student.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}