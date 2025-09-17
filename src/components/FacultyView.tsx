import { QrCode, Download } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { AttendanceListModal } from "./AttendanceListModal";
import { QRGenerator } from "./QRGenerator";

export function FacultyView() {
  const [selectedClass, setSelectedClass] = useState<{
    name: string;
    code: string;
  } | null>(null);
  const [isQRGeneratorOpen, setIsQRGeneratorOpen] = useState(false);

  const classes = [
    { name: 'CS-A Data Structures', code: 'CS-A', subject: 'Data Structures' },
    { name: 'CS-B Algorithm Analysis', code: 'CS-B', subject: 'Algorithm Analysis' },
    { name: 'IT-A Database Systems', code: 'IT-A', subject: 'Database Systems' }
  ];

  const handleMarkAttendance = (className: string, code: string) => {
    setSelectedClass({ name: className, code });
  };

  const handleExportAttendance = () => {
    // Mock attendance data for export
    const attendanceData = [
      { name: 'John Doe', id: 'ST001', class: 'CS-A Data Structures', date: '2024-01-15', status: 'Present' },
      { name: 'Jane Smith', id: 'ST002', class: 'CS-A Data Structures', date: '2024-01-15', status: 'Present' },
      { name: 'Mike Johnson', id: 'ST003', class: 'CS-A Data Structures', date: '2024-01-15', status: 'Absent' },
      { name: 'Sarah Wilson', id: 'ST004', class: 'CS-B Algorithm Analysis', date: '2024-01-15', status: 'Present' },
      { name: 'Tom Brown', id: 'ST005', class: 'IT-A Database Systems', date: '2024-01-15', status: 'Present' },
    ];

    // Convert to CSV
    const headers = ['Name', 'Student ID', 'Class', 'Date', 'Status'];
    const csvContent = [
      headers.join(','),
      ...attendanceData.map(row => [
        `"${row.name}"`,
        row.id,
        `"${row.class}"`,
        row.date,
        row.status
      ].join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    import('sonner@2.0.3').then(({ toast }) => {
      toast.success('Attendance data exported successfully!');
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Faculty Header */}
      <div className="text-center py-8">
        <div className="bg-gradient-to-r from-green-500 to-teal-500 p-4 rounded-full w-20 h-20 mx-auto mb-4">
          <QrCode className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-white text-2xl font-semibold mb-2">Faculty Dashboard</h2>
        <p className="text-white/70">Manage attendance and class schedules</p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold">Quick Actions</h3>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 justify-start"
            onClick={() => setIsQRGeneratorOpen(true)}
          >
            <QrCode className="w-4 h-4 mr-3" />
            Generate QR Code
          </Button>
          <Button 
            variant="outline" 
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 justify-start"
            onClick={handleExportAttendance}
          >
            <Download className="w-4 h-4 mr-3" />
            Export Attendance
          </Button>
        </div>
      </div>

      {/* Class List */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold">Today's Classes</h3>
        <div className="space-y-3">
          {classes.map((classItem, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{classItem.name}</h4>
                  <p className="text-white/70 text-sm">10:00 AM - 11:00 AM</p>
                </div>
                <Button 
                  size="sm" 
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => handleMarkAttendance(classItem.name, classItem.code)}
                >
                  Mark Attendance
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attendance List Modal */}
      {selectedClass && (
        <AttendanceListModal 
          className={selectedClass.name}
          classCode={selectedClass.code}
          onClose={() => setSelectedClass(null)}
        />
      )}

      {/* QR Generator Modal */}
      <QRGenerator
        isOpen={isQRGeneratorOpen}
        onClose={() => setIsQRGeneratorOpen(false)}
      />
    </div>
  );
}