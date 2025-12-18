
import React, { useState } from 'react';
import { User, Lock, AlertCircle, ShieldCheck, Search, ArrowRight } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginScreenProps {
  onLogin: (user: UserType) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState<'owner' | 'public'>('owner');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleOwnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const inputId = userId.trim();
    const inputPass = password.trim();

    // Owner / Admin Login (Habeeb)
    if (inputId === 'HABEEB' && inputPass === 'HABEEB') {
      onLogin({
        name: "Habeeb",
        email: "habeeb@estatemind.com",
        role: "admin",
        avatar: "HB"
      });
      return;
    }
    setError('Invalid Owner credentials. Access Denied.');
  };

  const handleGuestAccess = () => {
    // Public / Guest Access to search agents
    onLogin({
      name: "Guest User",
      email: "guest@public.com",
      role: "guest",
      avatar: "GS"
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        
        {/* 3D Glass Card */}
        <div className="glass-3d rounded-3xl p-10 overflow-hidden relative animate-fade-in shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 backdrop-blur-xl bg-white/10">
          <div className="relative z-10">
            <div className="text-center mb-6">
              <h1 className="glass-header-3d text-3xl font-black text-slate-800 mb-4 drop-shadow-lg tracking-tight bg-white/80">EstateMind AI</h1>
              <p className="text-blue-100 font-medium drop-shadow-md">Real Estate Management System</p>
            </div>

            {/* Login Tabs */}
            <div className="flex p-1 bg-white/10 rounded-xl mb-8 border border-white/10 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => { setActiveTab('owner'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'owner' 
                    ? 'bg-white text-slate-900 shadow-md' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck size={16} /> Owner Login
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('public'); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-bold transition-all ${
                  activeTab === 'public' 
                    ? 'bg-white text-slate-900 shadow-md' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Search size={16} /> Public Search
              </button>
            </div>

            {activeTab === 'owner' ? (
              <form onSubmit={handleOwnerLogin} className="space-y-5 animate-fade-in">
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1.5 drop-shadow">
                      Secure Owner ID
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-white/70" size={18} />
                      <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        placeholder="Enter Owner ID"
                        className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none transition-all text-white placeholder:text-blue-100/50 font-semibold backdrop-blur-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-blue-100 uppercase tracking-wider mb-1.5 drop-shadow">
                      Encrypted Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-white/70" size={18} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 outline-none transition-all text-white placeholder:text-blue-100/50 font-semibold backdrop-blur-sm tracking-widest"
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-500/30 border border-red-400/50 rounded-lg text-white text-sm font-medium backdrop-blur-md animate-fade-in">
                      <AlertCircle size={16} className="shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mt-4 border border-white/20 flex items-center justify-center gap-2"
                  >
                    <Lock size={18} /> Access Dashboard
                  </button>
                </div>
              </form>
            ) : (
              <div className="animate-fade-in text-center space-y-6 py-4">
                 <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="text-xl font-bold text-white mb-2">Find Your Dream Agent</h3>
                    <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                      Search our public directory of top-rated real estate agents and browse available properties in your area.
                    </p>
                    <button
                      onClick={handleGuestAccess}
                      className="w-full py-3.5 rounded-xl bg-white text-slate-900 font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all border border-white/50 flex items-center justify-center gap-2"
                    >
                      Search Agents <ArrowRight size={18} />
                    </button>
                 </div>
                 <p className="text-xs text-blue-200">
                    *Public access is restricted to viewing properties and agent profiles only.
                 </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-center mt-6 text-white/60 text-xs font-medium drop-shadow">
           &copy; 2024 EstateMind AI. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
