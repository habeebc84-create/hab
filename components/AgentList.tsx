
import React, { useState, useMemo } from 'react';
import { Mail, Phone, Star, TrendingUp, Plus, X, Award, Radar, Loader2, MapPin, LandPlot, Home, Globe, Search, Gem, Landmark, ShieldCheck, CheckCircle, Users } from 'lucide-react';
import { MOCK_AGENTS } from '../constants';
import { Agent, User } from '../types';
import { findNearbySellers } from '../services/geminiService';

interface AgentListProps {
  user: User;
}

const AgentList: React.FC<AgentListProps> = ({ user }) => {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [isScoutModalOpen, setIsScoutModalOpen] = useState(false);
  const [scoutType, setScoutType] = useState<'Plot' | 'Villa'>('Plot');
  const [isScouting, setIsScouting] = useState(false);
  const [scoutResults, setScoutResults] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');

  const isAdmin = user.role === 'admin';

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = specialtyFilter === 'All' || agent.specialty === specialtyFilter;
      return matchesSearch && matchesSpecialty;
    });
  }, [agents, searchQuery, specialtyFilter]);

  const handleScoutSellers = () => {
    if (!navigator.geolocation) return;
    setIsScouting(true);
    setScoutResults(null);
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const textResult = await findNearbySellers(pos.coords.latitude, pos.coords.longitude, scoutType);
        setScoutResults(textResult);
      } finally {
        setIsScouting(false);
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center gap-6">
        <div>
          <h2 className="glass-header-3d text-2xl font-bold">Global Talent Registry</h2>
          <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] mt-3 px-4 py-1.5 bg-white/40 border border-white/40 rounded-full inline-flex items-center gap-2">
            <Globe size={14} className="text-blue-500" /> 100+ Aggregated Sources
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsScoutModalOpen(true)} className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl">
            <Radar size={18} className="inline mr-2" /> Deep Scout
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-[32px] flex flex-col xl:flex-row gap-6 shadow-xl border-white/40">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white/50 border border-slate-200/60 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 outline-none transition-all"
          />
        </div>
        <select 
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          className="px-4 py-3 bg-white/50 border border-slate-200/60 rounded-2xl text-xs font-black text-slate-700 outline-none min-w-[160px]"
        >
          <option value="All">All Disciplines</option>
          <option value="Luxury">Luxury Estates</option>
          <option value="Plots">Land & Plots</option>
          <option value="Residential">Residential</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="glass-panel p-8 rounded-[40px] flex flex-col hover:bg-white/80 transition-all duration-500 group shadow-lg border-white/50 relative overflow-hidden">
            {agent.specialty === 'Luxury' && <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full -mr-16 -mt-16" />}
            {agent.specialty === 'Plots' && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16" />}

            <div className="flex gap-6 items-start mb-8">
              <div className="relative shrink-0">
                <img src={agent.imageUrl} alt={agent.name} className="w-20 h-20 rounded-3xl object-cover shadow-2xl ring-4 ring-white/80" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-2xl flex items-center justify-center border-4 border-white">
                  <ShieldCheck size={14} className="text-blue-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black text-slate-800 truncate">{agent.name}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">• {agent.experienceYears}Y Exp • {agent.rating}★</p>
                <span className="px-3 py-1 bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest rounded-lg border border-slate-100 mt-2 inline-block">
                  VIA {agent.source}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className={`p-4 rounded-3xl border ${agent.specialty === 'Luxury' ? 'bg-amber-50 border-amber-100' : 'bg-blue-50 border-blue-100'}`}>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Specialty</p>
                <p className="text-xs font-black flex items-center gap-2">
                   {agent.specialty === 'Luxury' ? <Gem size={14} className="text-amber-600" /> : <Landmark size={14} className="text-blue-600" />} 
                   {agent.specialty}
                </p>
              </div>
              <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Performance</p>
                <p className="text-sm font-black text-white">PRO</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
               <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-600 truncate">{agent.email}</span>
               </div>
               <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-xs font-bold text-slate-600">{agent.phone}</span>
               </div>
            </div>
            <button className="w-full py-4 bg-white border-2 border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
               View Full Dossier
            </button>
          </div>
        ))}
      </div>

      {isScoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => setIsScoutModalOpen(false)} />
          <div className="relative w-full max-w-2xl glass-panel bg-white/95 rounded-[40px] shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
             <div className="p-10 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Radar size={32} className="text-slate-900 animate-pulse" />
                  <div>
                    <h3 className="glass-header-3d text-2xl font-black text-slate-900 bg-white/60">Intelligence Scout</h3>
                    <p className="text-xs text-slate-500 font-black tracking-widest mt-3 ml-2">Maps-Grounded Lead Gen</p>
                  </div>
                </div>
                <button onClick={() => setIsScoutModalOpen(false)} className="p-3 hover:rotate-90 transition-transform"><X size={28}/></button>
             </div>
             <div className="p-10 flex-1 overflow-y-auto">
               <div className="grid grid-cols-2 gap-4 mb-10 p-2 bg-slate-100 rounded-[32px]">
                 {['Plot', 'Villa'].map((type) => (
                   <button 
                     key={type}
                     onClick={() => setScoutType(type as any)}
                     className={`flex items-center justify-center gap-3 py-4 rounded-[24px] text-xs font-black uppercase tracking-widest transition-all ${
                       scoutType === type ? 'bg-white text-slate-900 shadow-xl' : 'text-slate-400'
                     }`}
                   >
                     {type === 'Plot' ? <Landmark size={20} /> : <Gem size={20} />} {type}s
                   </button>
                 ))}
               </div>
               <button onClick={handleScoutSellers} disabled={isScouting} className="w-full py-6 bg-slate-900 text-white font-black uppercase tracking-widest rounded-[32px] flex items-center justify-center gap-4">
                 {isScouting ? <Loader2 className="animate-spin" size={24} /> : <Radar size={24} />}
                 {isScouting ? 'SCANNING...' : `START ${scoutType.toUpperCase()} SCOUT`}
               </button>
               {scoutResults && (
                 <div className="mt-12 p-8 bg-white border-2 border-slate-50 rounded-[40px] shadow-inner text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                    {scoutResults}
                 </div>
               )}
             </div>
             <div className="p-8 border-t border-slate-100 flex justify-center">
               <button onClick={() => setIsScoutModalOpen(false)} className="px-10 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest">
                  Close Intelligence Feed
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentList;
