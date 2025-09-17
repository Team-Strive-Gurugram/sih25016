import { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ArrowLeft, Download, TrendingUp, TrendingDown, Users, Calendar, BarChart3, PieChart } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Pie } from 'recharts';

interface AdminAnalyticsProps {
  onNavigate: (route: 'dashboard' | 'students' | 'faculties' | 'batches' | 'analytics') => void;
}

export function AdminAnalytics({ onNavigate }: AdminAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('current-month');
  const [selectedBatch, setSelectedBatch] = useState('all');

  // Mock analytics data
  const overallStats = {
    totalStudents: 1247,
    totalClasses: 156,
    avgAttendance: 82.5,
    attendanceChange: 3.2,
  };

  const attendanceTrends = [
    { month: 'Jan', attendance: 78 },
    { month: 'Feb', attendance: 82 },
    { month: 'Mar', attendance: 79 },
    { month: 'Apr', attendance: 85 },
    { month: 'May', attendance: 83 },
    { month: 'Jun', attendance: 87 },
    { month: 'Jul', attendance: 84 },
    { month: 'Aug', attendance: 89 },
    { month: 'Sep', attendance: 86 },
    { month: 'Oct', attendance: 90 },
    { month: 'Nov', attendance: 88 },
    { month: 'Dec', attendance: 85 },
  ];

  const batchWiseData = [
    { batch: 'CS-A', present: 387, absent: 58, total: 445, percentage: 87 },
    { batch: 'CS-B', present: 356, absent: 72, total: 428, percentage: 83 },
    { batch: 'IT-A', present: 298, absent: 42, total: 340, percentage: 88 },
    { batch: 'IT-B', present: 278, absent: 62, total: 340, percentage: 82 },
    { batch: 'EC-A', present: 234, absent: 38, total: 272, percentage: 86 },
  ];

  const subjectWiseData = [
    { name: 'Data Structures', value: 88, fill: '#8884d8' },
    { name: 'Database Systems', value: 92, fill: '#82ca9d' },
    { name: 'Computer Networks', value: 79, fill: '#ffc658' },
    { name: 'Algorithm Analysis', value: 85, fill: '#ff7c7c' },
    { name: 'Web Development', value: 91, fill: '#8dd1e1' },
  ];

  const lowAttendanceStudents = [
    { name: 'Alex Johnson', batch: 'CS-A', attendance: 45, subjects: ['Data Structures', 'Algorithms'] },
    { name: 'Sarah Wilson', batch: 'IT-B', attendance: 52, subjects: ['Database Systems'] },
    { name: 'Mike Davis', batch: 'CS-B', attendance: 38, subjects: ['Computer Networks', 'Web Development'] },
  ];

  const exportReport = () => {
    // Mock export functionality
    const csvContent = [
      ['Batch', 'Present', 'Absent', 'Total', 'Percentage'],
      ...batchWiseData.map(b => [b.batch, b.present, b.absent, b.total, `${b.percentage}%`])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance_analytics.csv';
    a.click();
    window.URL.revokeObjectURL(url);
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
            <h1>Analytics & Reports</h1>
            <p className="text-sm text-muted-foreground">View institution-wide attendance trends and generate reports</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Controls */}
        <Card className="p-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Time Period</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current-month">Current Month</SelectItem>
                    <SelectItem value="last-month">Last Month</SelectItem>
                    <SelectItem value="current-semester">Current Semester</SelectItem>
                    <SelectItem value="last-semester">Last Semester</SelectItem>
                    <SelectItem value="current-year">Current Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Batch Filter</label>
                <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    <SelectItem value="cs-a">CS-A</SelectItem>
                    <SelectItem value="cs-b">CS-B</SelectItem>
                    <SelectItem value="it-a">IT-A</SelectItem>
                    <SelectItem value="it-b">IT-B</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={exportReport}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </div>
        </Card>

        {/* Overall Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-xl font-semibold">{overallStats.totalStudents.toLocaleString()}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Classes</p>
                <p className="text-xl font-semibold">{overallStats.totalClasses}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Attendance</p>
                <p className="text-xl font-semibold">{overallStats.avgAttendance}%</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                {overallStats.attendanceChange > 0 ? (
                  <TrendingUp className="w-5 h-5 text-green-600" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Change</p>
                <p className={`text-xl font-semibold ${overallStats.attendanceChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {overallStats.attendanceChange > 0 ? '+' : ''}{overallStats.attendanceChange}%
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Attendance Trends */}
        <Card className="p-6">
          <h3 className="mb-4">Attendance Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
              <Line type="monotone" dataKey="attendance" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Batch-wise and Subject-wise Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="mb-4">Batch-wise Attendance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={batchWiseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="batch" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Attendance']} />
                <Bar dataKey="percentage" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Subject-wise Attendance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPieChart>
                <Pie
                  data={subjectWiseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {subjectWiseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Low Attendance Alert */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-red-600" />
            </div>
            <h3>Students Requiring Attention</h3>
          </div>
          <div className="space-y-3">
            {lowAttendanceStudents.map((student, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="font-medium text-red-900">{student.name}</p>
                  <p className="text-sm text-red-700">{student.batch} • {student.attendance}% attendance</p>
                  <div className="flex gap-1 mt-1">
                    {student.subjects.map((subject, i) => (
                      <span key={i} className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Contact
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

