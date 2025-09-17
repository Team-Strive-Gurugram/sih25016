import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'pending';
}

interface Subject {
  id: string;
  name: string;
  time: string;
  room: string;
  attendance: AttendanceRecord[];
}

interface AttendanceContextType {
  subjects: Subject[];
  markAttendance: (subjectId: string, date: string, status: 'present' | 'absent') => void;
  getTodayAttendance: () => Subject[];
  getAttendanceStats: () => { subject: string; present: number; absent: number; total: number; percentage: number; }[];
  getOverallAttendance: () => number;
  currentDate: string;
}

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export function useAttendance() {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error('useAttendance must be used within an AttendanceProvider');
  }
  return context;
}

const generateInitialData = (): Subject[] => {
  const today = new Date().toISOString().split('T')[0];
  const subjects = [
    { id: '1', name: 'Data Structures', time: '9:00 AM - 10:00 AM', room: 'Room 101' },
    { id: '2', name: 'Algorithm Analysis', time: '10:00 AM - 11:00 AM', room: 'Room 102' },
    { id: '3', name: 'Database Systems', time: '2:00 PM - 4:00 PM', room: 'Room 101' }
  ];

  return subjects.map(subject => ({
    ...subject,
    attendance: [
      // Sample past attendance data
      { date: '2025-09-16', status: 'present' as const },
      { date: '2025-09-23', status: 'present' as const },
      { date: '2025-09-24', status: 'absent' as const },
      { date: '2025-09-30', status: 'pending' as const },
      { date: today, status: subject.id === '1' ? 'present' as const : 'pending' as const }
    ]
  }));
};

interface AttendanceProviderProps {
  children: ReactNode;
}

export function AttendanceProvider({ children }: AttendanceProviderProps) {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('attendance-data');
    return saved ? JSON.parse(saved) : generateInitialData();
  });

  const currentDate = new Date().toISOString().split('T')[0];

  useEffect(() => {
    localStorage.setItem('attendance-data', JSON.stringify(subjects));
  }, [subjects]);

  const markAttendance = (subjectId: string, date: string, status: 'present' | 'absent') => {
    setSubjects(prev => prev.map(subject => {
      if (subject.id === subjectId) {
        const updatedAttendance = subject.attendance.filter(record => record.date !== date);
        updatedAttendance.push({ date, status });
        return { ...subject, attendance: updatedAttendance };
      }
      return subject;
    }));
  };

  const getTodayAttendance = () => {
    return subjects.map(subject => ({
      ...subject,
      todayStatus: subject.attendance.find(record => record.date === currentDate)?.status || 'pending'
    }));
  };

  const getAttendanceStats = () => {
    return subjects.map(subject => {
      const present = subject.attendance.filter(record => record.status === 'present').length;
      const absent = subject.attendance.filter(record => record.status === 'absent').length;
      const total = present + absent;
      const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

      return {
        subject: subject.name,
        present,
        absent,
        total,
        percentage
      };
    });
  };

  const getOverallAttendance = () => {
    const stats = getAttendanceStats();
    const totalPresent = stats.reduce((sum, stat) => sum + stat.present, 0);
    const totalClasses = stats.reduce((sum, stat) => sum + stat.total, 0);
    return totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
  };

  return (
    <AttendanceContext.Provider value={{
      subjects,
      markAttendance,
      getTodayAttendance,
      getAttendanceStats,
      getOverallAttendance,
      currentDate
    }}>
      {children}
    </AttendanceContext.Provider>
  );
}