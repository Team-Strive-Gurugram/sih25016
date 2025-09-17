import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { ArrowLeft, Plus, Search, Mail, User, Briefcase } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AdminFacultiesProps {
  onNavigate: (route: 'dashboard' | 'students' | 'faculties' | 'batches' | 'analytics') => void;
}

interface Faculty {
  id: string;
  name: string;
  email: string;
  department: string;
  designation: string;
  subjects: string[];
  status: 'active' | 'inactive';
}

export function AdminFaculties({ onNavigate }: AdminFacultiesProps) {
  const [faculties, setFaculties] = useState<Faculty[]>([
    { 
      id: '1', 
      name: 'Dr. Smith Johnson', 
      email: 'smith.johnson@university.edu', 
      department: 'Computer Science', 
      designation: 'Professor',
      subjects: ['Data Structures', 'Algorithm Analysis'],
      status: 'active' 
    },
    { 
      id: '2', 
      name: 'Dr. Emily Davis', 
      email: 'emily.davis@university.edu', 
      department: 'Information Technology', 
      designation: 'Associate Professor',
      subjects: ['Database Systems', 'Web Development'],
      status: 'active' 
    },
    { 
      id: '3', 
      name: 'Prof. Michael Brown', 
      email: 'michael.brown@university.edu', 
      department: 'Computer Science', 
      designation: 'Assistant Professor',
      subjects: ['Computer Networks', 'Operating Systems'],
      status: 'active' 
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
  });

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
  ];

  const designations = [
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'Senior Lecturer',
  ];

  const filteredFaculties = faculties.filter(faculty =>
    faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faculty.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddFaculty = () => {
    if (!newFaculty.name || !newFaculty.email || !newFaculty.department || !newFaculty.designation) {
      toast('Please fill in all required fields');
      return;
    }

    const faculty: Faculty = {
      id: Date.now().toString(),
      name: newFaculty.name,
      email: newFaculty.email,
      department: newFaculty.department,
      designation: newFaculty.designation,
      subjects: [],
      status: 'active',
    };

    setFaculties(prev => [...prev, faculty]);
    setNewFaculty({ name: '', email: '', department: '', designation: '' });
    setIsDialogOpen(false);
    toast('Faculty registered successfully');
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
            <h1>Faculty Management</h1>
            <p className="text-sm text-muted-foreground">Register and manage faculty accounts</p>
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
                placeholder="Search faculty by name, email, department, or designation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Register Faculty
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Register New Faculty</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Faculty Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={newFaculty.name}
                        onChange={(e) => setNewFaculty(prev => ({ ...prev, name: e.target.value }))}
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
                        value={newFaculty.email}
                        onChange={(e) => setNewFaculty(prev => ({ ...prev, email: e.target.value }))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select value={newFaculty.department} onValueChange={(value) => setNewFaculty(prev => ({ ...prev, department: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Select value={newFaculty.designation} onValueChange={(value) => setNewFaculty(prev => ({ ...prev, designation: value }))}>
                        <SelectTrigger className="pl-10">
                          <SelectValue placeholder="Select designation" />
                        </SelectTrigger>
                        <SelectContent>
                          {designations.map((designation) => (
                            <SelectItem key={designation} value={designation}>
                              {designation}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddFaculty}>
                    Register Faculty
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        {/* Faculty Table */}
        <Card>
          <div className="p-4 border-b">
            <h3>Registered Faculty ({filteredFaculties.length})</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Designation</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFaculties.map((faculty) => (
                <TableRow key={faculty.id}>
                  <TableCell className="font-medium">{faculty.name}</TableCell>
                  <TableCell>{faculty.email}</TableCell>
                  <TableCell>{faculty.department}</TableCell>
                  <TableCell>{faculty.designation}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {faculty.subjects.length > 0 ? (
                        faculty.subjects.map((subject, index) => (
                          <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                            {subject}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm">No subjects assigned</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                      faculty.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {faculty.status}
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