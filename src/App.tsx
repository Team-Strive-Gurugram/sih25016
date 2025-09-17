import { useState } from 'react';
import { StudentHome } from './components/StudentHome';
import { FacultyHome } from './components/FacultyHome';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminStudents } from './components/admin/AdminStudents';
import { AdminFaculties } from './components/admin/AdminFaculties';
import { AdminBatches } from './components/admin/AdminBatches';
import { AdminAnalytics } from './components/admin/AdminAnalytics';
import { Button } from './components/ui/button';
import { Switch } from './components/ui/switch';
import { User, GraduationCap, Shield } from 'lucide-react';

type UserRole = 'student' | 'faculty' | 'admin';
type AdminRoute = 'dashboard' | 'students' | 'faculties' | 'batches' | 'analytics';

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [adminRoute, setAdminRoute] = useState<AdminRoute>('dashboard');

  // Mock student data
  const studentData = {
    name: 'John Doe',
    rollNumber: 'CS21001',
    attendanceData: {
      '2024-12-15': true,
      '2024-12-14': true,
      '2024-12-13': false,
      '2024-12-12': true,
      '2024-12-11': true,
      '2024-12-10': false,
      '2024-12-09': true,
    },
    schedule: [
      {
        subject: 'Data Structures',
        time: '9:00 AM - 10:00 AM',
        room: 'Room 101',
        isPresent: true,
      },
      {
        subject: 'Algorithm Analysis',
        time: '10:15 AM - 11:15 AM',
        room: 'Room 102',
        isPresent: undefined,
      },
      {
        subject: 'Database Systems',
        time: '2:00 PM - 3:00 PM',
        room: 'Room 201',
        isPresent: undefined,
      },
    ],
    stats: {
      overall: 78,
      subjects: [
        { name: 'Data Structures', present: 18, absent: 4, total: 22, percentage: 82 },
        { name: 'Algorithm Analysis', present: 15, absent: 7, total: 22, percentage: 68 },
        { name: 'Database Systems', present: 19, absent: 3, total: 22, percentage: 86 },
        { name: 'Computer Networks', present: 14, absent: 6, total: 20, percentage: 70 },
      ],
    },
  };

  // Mock faculty data
  const facultyData = {
    name: 'Dr. Smith Johnson',
    department: 'Computer Science',
    batches: [
      {
        id: '1',
        name: 'CS-A (2021-2025)',
        subject: 'Data Structures',
        studentCount: 45,
        semester: '5th',
        year: '2024',
      },
      {
        id: '2',
        name: 'CS-B (2021-2025)',
        subject: 'Algorithm Analysis',
        studentCount: 42,
        semester: '5th',
        year: '2024',
      },
      {
        id: '3',
        name: 'IT-A (2022-2026)',
        subject: 'Database Systems',
        studentCount: 38,
        semester: '3rd',
        year: '2024',
      },
    ],
  };

  const cycleRole = () => {
    if (userRole === 'student') setUserRole('faculty');
    else if (userRole === 'faculty') setUserRole('admin');
    else setUserRole('student');
  };

  const renderAdminContent = () => {
    switch (adminRoute) {
      case 'students':
        return <AdminStudents onNavigate={setAdminRoute} />;
      case 'faculties':
        return <AdminFaculties onNavigate={setAdminRoute} />;
      case 'batches':
        return <AdminBatches onNavigate={setAdminRoute} />;
      case 'analytics':
        return <AdminAnalytics onNavigate={setAdminRoute} />;
      default:
        return <AdminDashboard onNavigate={setAdminRoute} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Role Switcher */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold">AttendEase</h1>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleRole}
              className="flex items-center gap-2"
            >
              {userRole === 'student' && (
                <>
                  <User className="w-4 h-4" />
                  <span className="text-sm">Student</span>
                </>
              )}
              {userRole === 'faculty' && (
                <>
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm">Faculty</span>
                </>
              )}
              {userRole === 'admin' && (
                <>
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Admin</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {userRole === 'student' && <StudentHome studentData={studentData} />}
      {userRole === 'faculty' && <FacultyHome facultyData={facultyData} />}
      {userRole === 'admin' && renderAdminContent()}
    </div>
  );
}