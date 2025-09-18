import { User, Mail, Phone, MapPin, Calendar, Download, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { useAttendance } from "./AttendanceContext";
import { CircularProgress } from "./CircularProgress";

export function ProfileView() {
  const { getOverallAttendance, getAttendanceStats } = useAttendance();
  const overallAttendance = getOverallAttendance();
  const stats = getAttendanceStats();

  const totalClasses = stats.reduce((sum, stat) => sum + stat.total, 0);
  const totalPresent = stats.reduce((sum, stat) => sum + stat.present, 0);
  const totalAbsent = stats.reduce((sum, stat) => sum + stat.absent, 0);

  return (
    <div className="mx-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-2xl font-semibold">AS</span>
          </div>
          <div>
            <h2 className="text-white text-xl font-semibold">Aditya Sharma</h2>
            <p className="text-gray-300">Computer Science</p>
            <p className="text-gray-400 text-sm">Roll: CS21001</p>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-gray-300">
            <Mail className="w-4 h-4" />
            <span className="text-sm">aditya.sharma@gurugramuniversity.edu</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <Phone className="w-4 h-4" />
            <span className="text-sm">+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-3 text-gray-300">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">New Delhi, India</span>
          </div>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-white text-lg mb-4">Overall Attendance</h3>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="text-gray-300 text-sm">
              <span className="text-emerald-400">{totalPresent}</span> Present
            </div>
            <div className="text-gray-300 text-sm">
              <span className="text-red-400">{totalAbsent}</span> Absent
            </div>
            <div className="text-gray-300 text-sm">
              <span className="text-white">{totalClasses}</span> Total Classes
            </div>
          </div>
          <CircularProgress
            percentage={overallAttendance}
            size={80}
            color={overallAttendance >= 75 ? "#22c55e" : overallAttendance >= 50 ? "#eab308" : "#ef4444"}
            backgroundColor="#374151"
          />
        </div>
      </div>

      {/* Academic Info */}
      <div className="bg-slate-700/50 backdrop-blur-sm rounded-2xl p-6">
        <h3 className="text-white text-lg mb-4">Academic Information</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Semester</span>
            <span className="text-white">2nd</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Year</span>
            <span className="text-white">3rd Year</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">Pursuing</span>
            <span className="text-white">Computer Science</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Download Attendance Report
        </Button>
        <Button variant="outline" className="w-full border-slate-600 text-white hover:bg-slate-700">
          <Settings className="w-4 h-4 mr-2" />
          Account Settings
        </Button>
      </div>
    </div>
  );
}