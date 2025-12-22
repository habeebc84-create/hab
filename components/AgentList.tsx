
import React, { useState, useMemo } from 'react';
import { Mail, Phone, Star, TrendingUp, Plus, X, Award, Radar, Loader2, MapPin, LandPlot, Home, Globe, Search, Gem, Landmark, ShieldCheck, CheckCircle, Users, ExternalLink, Building2, ArrowUpRight, ArrowRight, MessageCircle, Copy, Check, Briefcase, Factory, Building } from 'lucide-react';
import { MOCK_AGENTS, MOCK_PROPERTIES, MARKET_PORTALS } from '../constants';
import { Agent, User } from '../types';
import { findNearbySellers, searchWebForAgents } from '../services/geminiService';

interface AgentListProps {
  user: User;
  onViewAgentProperties: (agentId: number) => void;
}

const AgentList: React.FC<AgentListProps> = ({ user, onViewAgentProperties }) => {
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  const [isScoutModalOpen, setIsScoutModalOpen] = useState(false);
  const [scoutType, setScoutType] = useState<'Local' | 'Global'>('Local');
  const [scoutCategory, setScoutCategory] = useState<keyof typeof MARKET_PORTALS>('Residential');
  const [isScouting, setIsScouting] = useState(false);
  const [scoutResults, setScoutResults] = useState<{text: string, sources: any[]} | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  
  const [contactAgent, setContactAgent] = useState<Agent | null>(null);
  const [copiedType, setCopiedType] = useState<'email' | 'phone' | null>(null);

  const filteredAgents = useMemo(() => {
    return agents.filter(agent => {
      const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = specialtyFilter === 'All' || agent.specialty === specialtyFilter;
      return matchesSearch && matchesSpecialty;
    });
  }, [agents, searchQuery, specialtyFilter]);

  const getAgentPropertyCount = (agentId: number) => {
    return MOCK_PROPERTIES.filter(p => p.agentId === agentId).length;
  };

  const handleScoutSellers = async () => {
    setScoutResults(null);
    setIsScouting(true);

    try {
      if (scoutType === 'Global') {
        const query = specialtyFilter === 'All' ? `top agents in ${scoutCategory} sector` : `${specialtyFilter} specialists in ${scoutCategory} category`;
        const result = await searchWebForAgents(query, scoutCategory);
        setScoutResults({ text: result.text, sources: result.sources });
      } else {
        if (!navigator.geolocation) {
          alert("Geolocation not supported.");
          setIsScouting(false);
          return;
        }
        navigator.geolocation.getCurrentPosition(async (pos) => {
          try {
            const textResult = await findNearbySellers(pos.coords.latitude, pos.coords.longitude, 'Any');
            setScoutResults({ text: textResult, sources: [] });
          } catch (err) {
            console.error(err);
          } finally {
            setIsScouting(false);
          }
        }, () => setIsScouting(false));
      }
    } catch (err) {
      console.error(err);
      setIsScouting(false);
    } finally {
      if (scoutType === 'Global') setIsScouting(false);
    }
  };

  const copyToClipboard = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleViewPropertiesFromModal = () => {
    if (contactAgent) {
      onViewAgentProperties(contactAgent.id);
      setContactAgent(null);
    }
  };

  const getSpecialtyIcon = (specialty: string) => {
    switch(specialty) {
      case 'Luxury': return <Gem size={14} />;
      case 'Residential': return <Home size={14} />;
      case 'Commercial': return <Building size={14} />;
      case 'Plots': return <Landmark size={14} />;
      case 'Foreclosure': return <TrendingUp size={14} />;
      case 'Industrial': return <Factory size={14} />;
      default: return <Briefcase size={14} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="glass-header-3d text-2xl font-bold">Global Talent Registry</h2>
          <p className="text-xs text-slate-500 font-black uppercase tracking-[0.2em] mt-3 px-4 py-1.5 bg-white/40 border border-white/40 rounded-full inline-flex items-center gap-2">
            <Globe size={14} className="text-blue-500" /> Professional Network Intel
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button onClick={() => setIsScoutModalOpen(true)} className="flex-1 md:flex-none px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2">
            <Radar size={18} /> Global Scout
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-[32px] flex flex-col xl:flex-row gap-6 shadow-xl border-white/40">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search talent network..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 bg-white/50 border border-slate-200/60 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 outline-none transition-all"
          />
        </div>
        <select 
          value={specialtyFilter}
          onChange={(e) => setSpecialtyFilter(e.target.value)}
          className="px-4 py-3 bg-white/50 border border-slate-200/60 rounded-2xl text-xs font-black text-slate-700 outline-none min-w-[180px]"
        >
          <option value="All">All Specialty Clusters</option>
          <option value="Luxury">Luxe Property</option>
          <option value="Plots">Land Acquisition</option>
          <option value="Residential">Standard Residential</option>
          <option value="Commercial">Commercial Assets</option>
          <option value="Industrial">Industrial Facilities</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="glass-panel p-8 rounded-[40px] flex flex-col hover:bg-white/80 transition-all duration-500 group shadow-lg border-white/50 relative overflow-hidden h-full border-t-4 border-t-transparent hover:border-t-blue-500">
            <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full -mr-16 -mt-16 transition-all group-hover:scale-150 duration-700 ${
              agent.specialty === 'Luxury' ? 'bg-amber-500' : 'bg-blue-500'
            }`} />

            <div className="absolute top-6 right-8 flex flex-col items-end gap-2 z-10">
               <div className="px-3 py-1 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center gap-1.5">
                  <Building2 size={12} className="text-blue-600" />
                  <span className="text-[9px] font-black text-blue-700 uppercase tracking-tighter">
                     {getAgentPropertyCount(agent.id)} ACTIVE
                  </span>
               </div>
               <div className="px-2 py-0.5 bg-slate-900/10 border border-slate-900/10 rounded text-[8px] font-black text-slate-500 uppercase tracking-widest">
                  VIA {agent.source}
               </div>
            </div>

            <div className="flex gap-6 items-start mb-8 relative z-10">
              <div className="relative shrink-0">
                <img 
                  src={agent.imageUrl || `https://i.pravatar.cc/150?u=${agent.email}`} 
                  alt={agent.name} 
                  className="w-20 h-20 rounded-3xl object-cover shadow-2xl ring-4 ring-white/80 group-hover:scale-105 transition-transform" 
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-2xl flex items-center justify-center border-4 border-white">
                  <ShieldCheck size={14} className="text-blue-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black text-slate-800 truncate group-hover:text-blue-700 transition-colors">{agent.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                   <Star size={12} className="text-amber-500 fill-amber-500" />
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{agent.rating} RATING • {agent.experienceYears}Y EXP</p>
                </div>
                <div className="mt-3">
                   <span className="px-2.5 py-1 bg-slate-100 text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] rounded-lg border border-slate-200/50">
                      {agent.source} ELITE
                   </span>
                </div>
              </div>
            </div>

            <div className="mb-8 relative z-10 flex-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Core Competencies</p>
               <div className="flex flex-wrap gap-2">
                 {agent.topSpecialties.map((spec, idx) => (
                   <div 
                     key={idx}
                     className={`flex items-center gap-2 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                       idx === 0 
                        ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20' 
                        : 'bg-white/50 text-slate-600 border-slate-100 group-hover:border-blue-100'
                     }`}
                   >
                     {getSpecialtyIcon(spec)}
                     {spec}
                   </div>
                 ))}
               </div>
            </div>

            <div className="space-y-3 mb-8 relative z-10">
               <button 
                 onClick={() => setContactAgent(agent)}
                 className="w-full flex items-center gap-4 p-4 bg-white/40 rounded-2xl border border-slate-100 hover:bg-white hover:border-blue-200 transition-all group/contact"
               >
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-xl group-hover/contact:bg-blue-600 group-hover/contact:text-white transition-colors">
                    <MessageCircle size={18} />
                  </div>
                  <div className="text-left">
                    <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Now</span>
                    <span className="text-xs font-black text-slate-700">Quick Contact Agent</span>
                  </div>
               </button>
            </div>

            <div className="space-y-3 relative z-10">
               <button 
                 onClick={() => onViewAgentProperties(agent.id)}
                 className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 group/btn"
               >
                 <Building2 size={16} /> View Active Portfolio
                 <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
               </button>
               <button className="w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-slate-100 text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 hover:text-white transition-all">
                 Full Dossier <ArrowUpRight size={14} />
               </button>
            </div>
          </div>
        ))}
      </div>

      {contactAgent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => setContactAgent(null)} />
          <div className="relative w-full max-w-lg glass-panel bg-white/95 rounded-[40px] shadow-2xl overflow-hidden animate-fade-in border border-white/20">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h3 className="glass-header-3d text-xl font-black text-slate-900 bg-white/60">Expert Contact Hub</h3>
              <button onClick={() => setContactAgent(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-transform hover:rotate-90">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="flex items-center gap-6">
                <img 
                  src={contactAgent.imageUrl || `https://i.pravatar.cc/150?u=${contactAgent.email}`} 
                  alt={contactAgent.name} 
                  className="w-24 h-24 rounded-3xl object-cover shadow-2xl border-4 border-white ring-4 ring-blue-50" 
                />
                <div>
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight">{contactAgent.name}</h4>
                  <p className="text-xs font-black text-blue-600 uppercase tracking-widest mt-1 flex items-center gap-1.5">
                    <Award size={14} /> {contactAgent.specialty} Specialist
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">Identity Verified by EstateMind</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="group relative">
                  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[32px] border border-slate-100 group-hover:bg-blue-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <Mail className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</span>
                        <span className="text-sm font-bold text-slate-700">{contactAgent.email}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(contactAgent.email, 'email')}
                      className="p-3 hover:bg-blue-600 hover:text-white rounded-2xl text-slate-400 transition-all active:scale-90"
                    >
                      {copiedType === 'email' ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>

                <div className="group relative">
                  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[32px] border border-slate-100 group-hover:bg-emerald-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-2xl shadow-sm">
                        <Phone className="text-emerald-600" size={20} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</span>
                        <span className="text-sm font-bold text-slate-700">{contactAgent.phone}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => copyToClipboard(contactAgent.phone, 'phone')}
                      className="p-3 hover:bg-emerald-600 hover:text-white rounded-2xl text-slate-400 transition-all active:scale-90"
                    >
                      {copiedType === 'phone' ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4">
                <button 
                  onClick={handleViewPropertiesFromModal}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-blue-600 text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
                >
                  <Building2 size={18} /> View Agent's Properties
                </button>
                <a 
                  href={`mailto:${contactAgent.email}?subject=Inquiry regarding property via EstateMind AI`}
                  className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white text-[12px] font-black uppercase tracking-[0.2em] rounded-3xl hover:bg-black transition-all shadow-2xl"
                >
                  Send Direct Message <ArrowRight size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {isScoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => setIsScoutModalOpen(false)} />
          <div className="relative w-full max-w-2xl glass-panel bg-white/95 rounded-[40px] shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
             <div className="p-10 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Radar size={32} className="text-blue-600 animate-pulse" />
                  <div>
                    <h3 className="glass-header-3d text-2xl font-black text-slate-900 bg-white/60 uppercase">Market Intelligence Scout</h3>
                    <p className="text-xs text-slate-500 font-black tracking-widest mt-3 ml-2">Grounding from 100+ specialized industry platforms</p>
                  </div>
                </div>
                <button onClick={() => setIsScoutModalOpen(false)} className="p-3 hover:rotate-90 transition-transform text-slate-400 hover:text-slate-900"><X size={28}/></button>
             </div>
             <div className="p-10 flex-1 overflow-y-auto">
               <div className="mb-8">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Scout Scope</p>
                 <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
                    <button onClick={() => setScoutType('Local')} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${scoutType === 'Local' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Local Neighborhood</button>
                    <button onClick={() => setScoutType('Global')} className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all ${scoutType === 'Global' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Global Portals</button>
                 </div>
               </div>

               {scoutType === 'Global' && (
                 <div className="mb-10">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Industry Cluster</p>
                   <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                     {Object.keys(MARKET_PORTALS).map((cat) => (
                       <button 
                         key={cat}
                         onClick={() => setScoutCategory(cat as any)}
                         className={`py-3 rounded-xl text-[9px] font-black uppercase border transition-all ${scoutCategory === cat ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200'}`}
                       >
                         {cat}
                       </button>
                     ))}
                   </div>
                 </div>
               )}

               <button onClick={handleScoutSellers} disabled={isScouting} className="w-full py-6 bg-blue-600 text-white font-black uppercase tracking-widest rounded-[32px] flex items-center justify-center gap-4 shadow-xl hover:bg-blue-700 transition-all disabled:opacity-50">
                 {isScouting ? <Loader2 className="animate-spin" size={24} /> : <Radar size={24} />}
                 {isScouting ? 'FETCHING INTEL...' : `SCAN ${scoutCategory.toUpperCase()} TALENT`}
               </button>

               {scoutResults && (
                 <div className="mt-12 p-8 bg-slate-50 border-2 border-white rounded-[40px] shadow-inner text-slate-700 leading-relaxed font-medium">
                    <div className="whitespace-pre-wrap">{scoutResults.text}</div>
                    {scoutResults.sources.length > 0 && (
                      <div className="mt-8 pt-6 border-t border-slate-200">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Official Platform Grounding</h4>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {scoutResults.sources.map((chunk: any, i: number) => (
                              chunk.web && (
                                <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-white rounded-2xl hover:bg-blue-50 transition-colors group border border-slate-100">
                                   <span className="text-[10px] font-bold text-slate-700 truncate mr-4">{chunk.web.title || 'Market Source'}</span>
                                   <ExternalLink size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
                                </a>
                              )
                            ))}
                         </div>
                      </div>
                    )}
                 </div>
               )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentList;
