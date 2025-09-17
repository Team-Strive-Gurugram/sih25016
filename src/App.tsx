import { useState } from "react";
import { Header } from "./components/Header";
import { AttendanceCalendar } from "./components/AttendanceCalendar";
import { AttendanceStats } from "./components/AttendanceStats";
import { AttendanceProvider } from "./components/AttendanceContext";
import { Navigation } from "./components/Navigation";
import { HomeView } from "./components/HomeView";
import { ProfileView } from "./components/ProfileView";
import { FacultyView } from "./components/FacultyView";
import { AdminView } from "./components/AdminView";
import { Toaster } from "./components/ui/sonner";

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [currentPanel, setCurrentPanel] = useState<'student' | 'faculty' | 'admin'>('student');

  const renderContent = () => {
    if (currentPanel === 'faculty') {
      return <FacultyView />;
    }
    
    if (currentPanel === 'admin') {
      return <AdminView />;
    }

    // Student panel content
    switch (activeTab) {
      case 'home':
        return <HomeView />;
      case 'calendar':
        return <AttendanceCalendar />;
      case 'stats':
        return <AttendanceStats />;
      case 'profile':
        return <ProfileView />;
      default:
        return <HomeView />;
    }
  };

  const shouldShowNavigation = currentPanel === 'student';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <Header currentPanel={currentPanel} onPanelChange={setCurrentPanel} />
        
        {/* Dynamic Content */}
        {renderContent()}
        
        {/* Bottom padding for navigation */}
        {shouldShowNavigation && <div className="h-8" />}
      </div>
      
      {/* Bottom Navigation - Only show for student panel */}
      {shouldShowNavigation && (
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AttendanceProvider>
      <AppContent />
      <Toaster />
    </AttendanceProvider>
  );
}