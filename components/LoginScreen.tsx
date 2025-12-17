
import React from 'react';
import { User, Shield } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginScreenProps {
  onLogin: (user: UserType) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Background decorative elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">EstateMind AI</h1>
            <p className="text-blue-200">Select your portal to continue</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => onLogin({
                name: "Admin User",
                email: "admin@estatemind.com",
                role: "admin",
                avatar: "AD"
              })}
              className="w-full group relative flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-600 hover:to-blue-500 border border-blue-400/30 transition-all hover:scale-[1.02] shadow-lg shadow-blue-900/20"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                <Shield size={24} />
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-lg">Admin Portal</div>
                <div className="text-blue-100 text-sm">Full system access & controls</div>
              </div>
            </button>

            <button
              onClick={() => onLogin({
                name: "Sarah Connor",
                email: "sarah@estatemind.com",
                role: "agent",
                avatar: "SC"
              })}
              className="w-full group relative flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]"
            >
              <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                <User size={24} />
              </div>
              <div className="text-left">
                <div className="font-bold text-white text-lg">Agent Portal</div>
                <div className="text-slate-300 text-sm">Sales tracking & client view</div>
              </div>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400">Secure Enterprise Login System</p>
            <p className="text-xs text-slate-500 mt-1">&copy; 2024 EstateMind Solutions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
