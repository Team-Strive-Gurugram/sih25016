import { useState } from 'react';
import { UserPlus, Edit, Trash2, School, BarChart3, Settings, Save, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card } from './ui/card';
import { Switch } from './ui/switch';
import { toast } from 'sonner@2.0.3';

// Mock data
const mockUsers = [
  { id: 1, name: 'Dr. Sarah Johnson', email: 'sarah.johnson@university.edu', role: 'Faculty', department: 'Computer Science', status: 'Active' },
  { id: 2, name: 'John Smith', email: 'john.smith@student.edu', role: 'Student', department: 'Computer Science', status: 'Active' },
  { id: 3, name: 'Prof. Michael Brown', email: 'michael.brown@university.edu', role: 'Faculty', department: 'Information Technology', status: 'Active' },
  { id: 4, name: 'Emily Davis', email: 'emily.davis@student.edu', role: 'Student', department: 'Computer Science', status: 'Inactive' },
];

const mockDepartments = [
  { id: 1, name: 'Computer Science', head: 'Dr. Sarah Johnson', students: 324, faculty: 12 },
  { id: 2, name: 'Information Technology', head: 'Prof. Michael Brown', students: 256, faculty: 8 },
  { id: 3, name: 'Data Science', head: 'Dr. Lisa Wilson', students: 189, faculty: 6 },
  { id: 4, name: 'Software Engineering', head: 'Prof. James Miller', students: 278, faculty: 10 },
];

// User Management Modal
interface UserManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserManagementModal({ isOpen, onClose }: UserManagementModalProps) {
  const [users, setUsers] = useState(mockUsers);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    status: 'Active'
  });

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email || !newUser.role || !newUser.department) {
      toast.error('Please fill in all fields');
      return;
    }

    const user = {
      id: users.length + 1,
      ...newUser
    };
    setUsers([...users, user]);
    setNewUser({ name: '', email: '', role: '', department: '', status: 'Active' });
    toast.success('User added successfully!');
  };

  const handleDeleteUser = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    toast.success('User deleted successfully!');
  };

  const toggleUserStatus = (userId: number) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
    toast.success('User status updated!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            User Management
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Manage faculty and student accounts
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New User */}
          <Card className="bg-slate-800 border-slate-700 p-4">
            <h3 className="text-white font-medium mb-4">Add New User</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Full Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Input
                placeholder="Email Address"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="Faculty">Faculty</SelectItem>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <Select value={newUser.department} onValueChange={(value) => setNewUser({ ...newUser, department: value })}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Information Technology">Information Technology</SelectItem>
                  <SelectItem value="Data Science">Data Science</SelectItem>
                  <SelectItem value="Software Engineering">Software Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleAddUser} className="mt-4 bg-green-600 hover:bg-green-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </Card>

          {/* Users Table */}
          <div className="bg-slate-800 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700">
                  <TableHead className="text-slate-300">Name</TableHead>
                  <TableHead className="text-slate-300">Email</TableHead>
                  <TableHead className="text-slate-300">Role</TableHead>
                  <TableHead className="text-slate-300">Department</TableHead>
                  <TableHead className="text-slate-300">Status</TableHead>
                  <TableHead className="text-slate-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-slate-700">
                    <TableCell className="text-white">{user.name}</TableCell>
                    <TableCell className="text-slate-300">{user.email}</TableCell>
                    <TableCell className="text-slate-300">{user.role}</TableCell>
                    <TableCell className="text-slate-300">{user.department}</TableCell>
                    <TableCell>
                      <Switch
                        checked={user.status === 'Active'}
                        onCheckedChange={() => toggleUserStatus(user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Department Management Modal
interface DepartmentManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepartmentManagementModal({ isOpen, onClose }: DepartmentManagementModalProps) {
  const [departments, setDepartments] = useState(mockDepartments);
  const [newDepartment, setNewDepartment] = useState({
    name: '',
    head: ''
  });

  const handleAddDepartment = () => {
    if (!newDepartment.name || !newDepartment.head) {
      toast.error('Please fill in all fields');
      return;
    }

    const department = {
      id: departments.length + 1,
      ...newDepartment,
      students: 0,
      faculty: 0
    };
    setDepartments([...departments, department]);
    setNewDepartment({ name: '', head: '' });
    toast.success('Department added successfully!');
  };

  const handleDeleteDepartment = (deptId: number) => {
    setDepartments(departments.filter(dept => dept.id !== deptId));
    toast.success('Department deleted successfully!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <School className="w-5 h-5" />
            Department Management
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Manage academic departments and their heads
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Department */}
          <Card className="bg-slate-800 border-slate-700 p-4">
            <h3 className="text-white font-medium mb-4">Add New Department</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Department Name"
                value={newDepartment.name}
                onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Input
                placeholder="Department Head"
                value={newDepartment.head}
                onChange={(e) => setNewDepartment({ ...newDepartment, head: e.target.value })}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Button onClick={handleAddDepartment} className="mt-4 bg-green-600 hover:bg-green-700">
              <School className="w-4 h-4 mr-2" />
              Add Department
            </Button>
          </Card>

          {/* Departments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <Card key={dept.id} className="bg-slate-800 border-slate-700 p-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-white font-medium">{dept.name}</h3>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteDepartment(dept.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="text-slate-300">Head: {dept.head}</p>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Students:</span>
                    <span className="text-white">{dept.students}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Faculty:</span>
                    <span className="text-white">{dept.faculty}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// System Analytics Modal
interface SystemAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemAnalyticsModal({ isOpen, onClose }: SystemAnalyticsModalProps) {
  const analyticsData = {
    totalUsers: 1296,
    activeUsers: 1248,
    attendanceRate: 89.5,
    systemUptime: 99.9,
    dailyLogins: 856,
    weeklyGrowth: 12.5
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            System Analytics
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            View system performance and usage statistics
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-800 border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{analyticsData.totalUsers.toLocaleString()}</div>
              <div className="text-slate-300 text-sm">Total Users</div>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{analyticsData.activeUsers.toLocaleString()}</div>
              <div className="text-slate-300 text-sm">Active Users</div>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{analyticsData.attendanceRate}%</div>
              <div className="text-slate-300 text-sm">Attendance Rate</div>
            </Card>
            <Card className="bg-slate-800 border-slate-700 p-4 text-center">
              <div className="text-2xl font-bold text-yellow-400">{analyticsData.systemUptime}%</div>
              <div className="text-slate-300 text-sm">System Uptime</div>
            </Card>
          </div>

          {/* Additional Stats */}
          <Card className="bg-slate-800 border-slate-700 p-4">
            <h3 className="text-white font-medium mb-4">Daily Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-300">Today's Logins</span>
                <span className="text-white font-medium">{analyticsData.dailyLogins}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Weekly Growth</span>
                <span className="text-green-400 font-medium">+{analyticsData.weeklyGrowth}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">Database Size</span>
                <span className="text-white font-medium">2.4 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-300">API Calls Today</span>
                <span className="text-white font-medium">12,847</span>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// System Settings Modal
interface SystemSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemSettingsModal({ isOpen, onClose }: SystemSettingsModalProps) {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    sessionTimeout: 30,
    maxAttendanceDistance: 50,
    qrCodeExpiry: 15
  });

  const handleSaveSettings = () => {
    // In a real app, this would save to the backend
    toast.success('Settings saved successfully!');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Settings className="w-5 h-5" />
            System Settings
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Configure system-wide settings and preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* General Settings */}
          <Card className="bg-slate-800 border-slate-700 p-4">
            <h3 className="text-white font-medium mb-4">General Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white">Maintenance Mode</div>
                  <div className="text-slate-400 text-sm">Temporarily disable system access</div>
                </div>
                <Switch
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white">Allow New Registration</div>
                  <div className="text-slate-400 text-sm">Enable new user sign-ups</div>
                </div>
                <Switch
                  checked={settings.allowRegistration}
                  onCheckedChange={(checked) => setSettings({ ...settings, allowRegistration: checked })}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-white">Email Verification Required</div>
                  <div className="text-slate-400 text-sm">Require email verification for new accounts</div>
                </div>
                <Switch
                  checked={settings.requireEmailVerification}
                  onCheckedChange={(checked) => setSettings({ ...settings, requireEmailVerification: checked })}
                />
              </div>
            </div>
          </Card>

          {/* Attendance Settings */}
          <Card className="bg-slate-800 border-slate-700 p-4">
            <h3 className="text-white font-medium mb-4">Attendance Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm">Session Timeout (minutes)</label>
                <Input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                  className="mt-1 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <label className="text-white text-sm">Max Attendance Distance (meters)</label>
                <Input
                  type="number"
                  value={settings.maxAttendanceDistance}
                  onChange={(e) => setSettings({ ...settings, maxAttendanceDistance: parseInt(e.target.value) })}
                  className="mt-1 bg-slate-700 border-slate-600 text-white"
                />
              </div>
              
              <div>
                <label className="text-white text-sm">QR Code Expiry (minutes)</label>
                <Input
                  type="number"
                  value={settings.qrCodeExpiry}
                  onChange={(e) => setSettings({ ...settings, qrCodeExpiry: parseInt(e.target.value) })}
                  className="mt-1 bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
          </Card>

          {/* Save Button */}
          <Button onClick={handleSaveSettings} className="w-full bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}