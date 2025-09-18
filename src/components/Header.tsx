import { useState, useRef, useEffect } from "react";
import { Check, GraduationCap, Users, Shield, ChevronDown } from "lucide-react";

interface HeaderProps {
  currentPanel: 'student' | 'faculty' | 'admin';
  onPanelChange: (panel: 'student' | 'faculty' | 'admin') => void;
}

export function Header({ currentPanel, onPanelChange }: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const panels = [
    { id: 'student' as const, label: 'Student', icon: GraduationCap },
    { id: 'faculty' as const, label: 'Faculty', icon: Users },
    { id: 'admin' as const, label: 'Admin', icon: Shield }
  ];

  const handleRoleSelect = (panelId: 'student' | 'faculty' | 'admin') => {
    onPanelChange(panelId);
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      
      {/* User Role Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 hover:bg-white/20 transition-colors"
        >
          <span className="text-white text-sm font-medium">User Role</span>
          <ChevronDown className={`w-4 h-4 text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 bg-slate-800/95 backdrop-blur-sm rounded-lg border border-slate-700 shadow-xl z-50 min-w-[150px]">
            {panels.map((panel) => {
              const Icon = panel.icon;
              const isSelected = currentPanel === panel.id;
              
              return (
                <button
                  key={panel.id}
                  onClick={() => handleRoleSelect(panel.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-700/50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    isSelected ? 'bg-slate-700/50 text-cyan-400' : 'text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-cyan-400' : 'text-white/70'}`} />
                  <span className="text-sm font-medium">{panel.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400 ml-auto" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}