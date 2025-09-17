import { useState } from "react";
import { UserProfile } from "./UserProfile";
import { ScheduleCard } from "./ScheduleCard";
import { AttendanceModal } from "./AttendanceModal";
import { QRScanner } from "./QRScanner";
import { useAttendance } from "./AttendanceContext";
import { Button } from "./ui/button";
import { QrCode } from "lucide-react";

export function HomeView() {
  const { getTodayAttendance } = useAttendance();
  const [selectedSubject, setSelectedSubject] = useState<{
    id: string;
    name: string;
    time: string;
    room: string;
  } | null>(null);
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);

  const todaySchedule = getTodayAttendance();

  const handleMarkAttendance = (subject: { id: string; name: string; time: string; room: string }) => {
    setSelectedSubject(subject);
  };

  const handleQRScanSuccess = (qrData: string) => {
    // Handle successful QR scan - this would update attendance in a real app
    console.log('QR Code scanned:', qrData);
  };

  return (
    <>
      {/* User Profile */}
      <UserProfile />
      
      {/* QR Scanner Button */}
      <div className="mx-6 mb-6">
        <Button 
          onClick={() => setIsQRScannerOpen(true)}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white h-12"
        >
          <QrCode className="w-5 h-5 mr-2" />
          Scan QR Code to Mark Attendance
        </Button>
      </div>
      
      {/* Today's Schedule */}
      <div className="mx-6 mb-6">
        <h2 className="text-white text-lg mb-4">Today's Schedule</h2>
        <div>
          {todaySchedule.map((subject) => {
            const todayAttendance = subject.attendance.find(
              record => record.date === new Date().toISOString().split('T')[0]
            );
            
            return (
              <ScheduleCard
                key={subject.id}
                id={subject.id}
                title={subject.name}
                time={subject.time}
                room={subject.room}
                status={todayAttendance?.status || 'pending'}
                isCompleted={todayAttendance?.status === 'present'}
                onMarkAttendance={handleMarkAttendance}
              />
            );
          })}
        </div>
      </div>

      {/* Attendance Modal */}
      <AttendanceModal
        isOpen={!!selectedSubject}
        onClose={() => setSelectedSubject(null)}
        subject={selectedSubject}
      />

      {/* QR Scanner Modal */}
      <QRScanner
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        onScanSuccess={handleQRScanSuccess}
      />
    </>
  );
}