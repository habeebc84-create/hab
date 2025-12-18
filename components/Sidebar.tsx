
import React from 'react';
import { LayoutDashboard, Building, Users, Briefcase, Database, LogOut } from 'lucide-react';
import { ViewState, User } from '../types';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, user, onLogout }) => {
  const allNavItems = [
    { id: ViewState.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: ViewState.PROPERTIES, label: 'Properties', icon: Building },
    { id: ViewState.AGENTS, label: 'Agents', icon: Briefcase },
    { id: ViewState.CLIENTS, label: 'Clients', icon: Users },
    { id: ViewState.SQL_ANALYST, label: 'SQL Analyst', icon: Database },
  ];

  // Filter nav items based on user role
  const navItems = allNavItems.filter(item => {
    if (user.role === 'admin') return true;
    if (user.role === 'agent') {
      // Agents only see Properties and Agents views
      return [ViewState.PROPERTIES, ViewState.AGENTS].includes(item.id);
    }
    // Guests only see Properties and Agents views
    if (user.role === 'guest') {
       return [ViewState.AGENTS, ViewState.PROPERTIES].includes(item.id);
    }
    return false;
  });

  return (
    <div className="w-64 glass-sidebar text-white h-screen flex flex-col fixed left-0 top-0 shadow-2xl z-10">
      <div className="p-6 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <h1 className="glass-header-3d text-2xl font-bold flex items-center gap-2 drop-shadow-md bg-white/80">
          <span className="text-blue-600">Estate</span>Mind
        </h1>
        <p className="text-slate-300 text-xs mt-3 tracking-wider uppercase pl-2">
          {user.role === 'admin' ? 'Enterprise Edition' : user.role === 'agent' ? 'Agent Portal' : 'Public Directory'}
        </p>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600/80 text-white shadow-lg shadow-blue-900/50 backdrop-blur-sm border border-blue-500/50' 
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-4 bg-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm shadow-lg border border-white/20">
            {user.avatar}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate text-white">{user.name}</p>
            <p className="text-xs text-slate-300 truncate">{user.email}</p>
          </div>
        </div>
        
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-slate-300 text-xs font-medium transition-all border border-white/5"
        >
          <LogOut size={14} />
          {user.role === 'guest' ? 'Exit Search' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
