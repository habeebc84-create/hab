
import React, { useState } from 'react';
import { User, Shield, Lock, ArrowLeft, AlertCircle } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginScreenProps {
  onLogin: (user: UserType) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [showAdminForm, setShowAdminForm] = useState(false);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Check credentials (mock: admin/password)
    if (userId.trim().toLowerCase() === 'admin' && password === 'password') {
      onLogin({
        name: "Admin User",
        email: "admin@estatemind.com",
        role: "admin",
        avatar: "AD"
      });
    } else {
      setError('Invalid credentials. Please use admin / password');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Background decorative elements */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>

        <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 overflow-hidden transition-all duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">EstateMind AI</h1>
            <p className="text-blue-200">Select your portal to continue</p>
          </div>

          {showAdminForm ? (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <button 
                type="button"
                onClick={() => { setShowAdminForm(false); setError(''); setUserId(''); setPassword(''); }}
                className="flex items-center gap-2 text-sm text-blue-300 hover:text-white transition-colors mb-2"
              >
                <ArrowLeft size={16} /> Back
              </button>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-blue-200 uppercase tracking-wide mb-1.5">User ID</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-blue-300" size={18} />
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Enter User ID"
                      className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder:text-blue-400/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-blue-200 uppercase tracking-wide mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 text-blue-300" size={18} />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter Password"
                      className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-white placeholder:text-blue-400/50"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-sm">
                    <AlertCircle size={16} className="shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] mt-2"
                >
                  Login to Admin Portal
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setShowAdminForm(true)}
                className="w-full group relative flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-600/80 to-blue-500/80 hover:from-blue-600 hover:to-blue-500 border border-blue-400/30 transition-all hover:scale-[1.02] shadow-lg shadow-blue-900/20"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Shield size={24} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-lg">Admin Portal</div>
                  <div className="text-blue-100 text-sm">Requires User ID & Password</div>
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
                  <div className="text-slate-300 text-sm">Quick access for agents</div>
                </div>
              </button>
            </div>
          )}

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
