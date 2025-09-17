import { Shield, Users, School, BarChart3, Settings, UserPlus, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useState } from "react";
import { 
  UserManagementModal, 
  DepartmentManagementModal, 
  SystemAnalyticsModal, 
  SystemSettingsModal 
} from "./AdminModals";

export function AdminView() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  const adminStats = [
    { label: "Total Faculty", value: "24", icon: Users },
    { label: "Total Students", value: "1,248", icon: School },
    { label: "Departments", value: "8", icon: BarChart3 },
    { label: "Active Classes", value: "156", icon: FileText }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Admin Header */}
      <div className="text-center py-8">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full w-20 h-20 mx-auto mb-4">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-white text-2xl font-semibold mb-2">Admin Dashboard</h2>
        <p className="text-white/70">Manage system settings and oversight</p>
      </div>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {adminStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 p-4 text-center">
              <Icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <div className="text-white text-lg font-semibold">{stat.value}</div>
              <div className="text-white/70 text-xs">{stat.label}</div>
            </Card>
          );
        })}
      </div>

      {/* Admin Actions */}
      <div className="space-y-4">
        <h3 className="text-white font-semibold">Administrative Actions</h3>
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 justify-start"
            onClick={() => setActiveModal('users')}
          >
            <UserPlus className="w-4 h-4 mr-3" />
            Manage Users
          </Button>
          <Button 
            variant="outline" 
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 justify-start"
            onClick={() => setActiveModal('departments')}
          >
            <School className="w-4 h-4 mr-3" />
            Manage Departments
          </Button>
          <Button 
            variant="outline" 
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 justify-start"
            onClick={() => setActiveModal('analytics')}
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            System Analytics
          </Button>
          <Button 
            variant="outline" 
            className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 justify-start"
            onClick={() => setActiveModal('settings')}
          >
            <Settings className="w-4 h-4 mr-3" />
            System Settings
          </Button>
        </div>
      </div>

      {/* Admin Modals */}
      <UserManagementModal 
        isOpen={activeModal === 'users'} 
        onClose={() => setActiveModal(null)} 
      />
      <DepartmentManagementModal 
        isOpen={activeModal === 'departments'} 
        onClose={() => setActiveModal(null)} 
      />
      <SystemAnalyticsModal 
        isOpen={activeModal === 'analytics'} 
        onClose={() => setActiveModal(null)} 
      />
      <SystemSettingsModal 
        isOpen={activeModal === 'settings'} 
        onClose={() => setActiveModal(null)} 
      />
    </div>
  );
}