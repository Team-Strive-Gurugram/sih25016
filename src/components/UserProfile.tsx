import { Download } from "lucide-react";

export function UserProfile() {
  return (
    <div className="mx-6 mb-6">
      <div className="bg-gradient-to-r from-emerald-400 to-blue-500 p-4 rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-semibold">AS</span>
            </div>
            
            {/* User Info */}
            <div>
              <h2 className="text-white text-xl font-semibold">Aditya Sharma</h2>
              <p className="text-white/80">Roll: CS21001</p>
            </div>
          </div>
          
          {/* Download Button */}
          <button className="bg-blue-600 hover:bg-blue-700 p-3 rounded-full transition-colors">
            <Download className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}