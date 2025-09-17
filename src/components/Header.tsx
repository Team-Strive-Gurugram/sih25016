import { Check, GraduationCap, Users, Shield } from "lucide-react";

interface HeaderProps {
  currentPanel: 'student' | 'faculty' | 'admin';
  onPanelChange: (panel: 'student' | 'faculty' | 'admin') => void;
}

export function Header({ currentPanel, onPanelChange }: HeaderProps) {
  const panels = [
    { id: 'student' as const, label: 'Student', icon: GraduationCap },
    { id: 'faculty' as const, label: 'Faculty', icon: Users },
    { id: 'admin' as const, label: 'Admin', icon: Shield }
  ];

  const nextPanel = () => {
    const currentIndex = panels.findIndex(panel => panel.id === currentPanel);
    const nextIndex = (currentIndex + 1) % panels.length;
    onPanelChange(panels[nextIndex].id);
  };

  return (
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <div className="bg-gradient-to-r from-cyan-400 to-blue-500 p-3 rounded-xl">
          <Check className="w-6 h-6 text-white" />
        </div>
        
        {/* App Name */}
        <h1 className="text-white text-2xl font-semibold">AttendEase</h1>
      </div>
      
      {/* Panel Switcher */}
      <button
        onClick={nextPanel}
        className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 hover:bg-white/20 transition-colors"
      >
        {panels.map(panel => {
          const Icon = panel.icon;
          return (
            <div key={panel.id} className="flex items-center gap-1">
              <Icon className={`w-4 h-4 ${currentPanel === panel.id ? 'text-cyan-400' : 'text-white/60'}`} />
              <span className={`text-xs font-medium ${currentPanel === panel.id ? 'text-white' : 'text-white/60'}`}>
                {panel.label}
              </span>
              {panel.id !== 'admin' && <div className="w-2 h-2 rounded-full bg-white/20 mx-1" />}
            </div>
          );
        })}
      </button>
    </div>
  );
}