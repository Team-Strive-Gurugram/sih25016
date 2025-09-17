import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Users, GraduationCap, BookOpen, BarChart3, ChevronRight } from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (route: 'students' | 'faculties' | 'batches' | 'analytics') => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const dashboardStats = {
    students: 1247,
    faculties: 85,
    batches: 24,
    subjects: 156,
  };

  const dashboardCards = [
    {
      title: 'Students',
      description: 'Register and manage student accounts',
      icon: Users,
      count: dashboardStats.students,
      route: 'students' as const,
      color: 'bg-blue-500',
    },
    {
      title: 'Faculties',
      description: 'Register and manage faculty accounts',
      icon: GraduationCap,
      count: dashboardStats.faculties,
      route: 'faculties' as const,
      color: 'bg-green-500',
    },
    {
      title: 'Batches',
      description: 'Create subjects, assign faculties, and manage schedules',
      icon: BookOpen,
      count: dashboardStats.batches,
      route: 'batches' as const,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      {/* Header */}
      <div className="bg-white border-b px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your institution's attendance system</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Main Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dashboardCards.map((card) => (
            <Card key={card.title} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate(card.route)}>
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3>{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-semibold">{card.count.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground">registered</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Analytics Card */}
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onNavigate('analytics')}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3>Analytics & Reports</h3>
                <p className="text-sm text-muted-foreground">View institution-wide attendance trends and generate reports</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="text-2xl font-semibold text-blue-600">{dashboardStats.students}</div>
            <div className="text-sm text-muted-foreground">Active Students</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-semibold text-green-600">{dashboardStats.faculties}</div>
            <div className="text-sm text-muted-foreground">Active Faculty</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-semibold text-purple-600">{dashboardStats.batches}</div>
            <div className="text-sm text-muted-foreground">Total Batches</div>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl font-semibold text-orange-600">{dashboardStats.subjects}</div>
            <div className="text-sm text-muted-foreground">Total Subjects</div>
          </Card>
        </div>
      </div>
    </div>
  );
}