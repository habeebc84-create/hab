
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, MoreHorizontal, X, Mail, DollarSign, Building, Phone, Calendar, ArrowRight, ArrowUpDown, ListFilter, IndianRupee, MapPin, TrendingUp, Users, Target, Briefcase, Globe, Clock, ShieldCheck, Zap } from 'lucide-react';
import { MOCK_CLIENTS, MOCK_PROPERTIES } from '../constants';
import { Client } from '../types';

const ClientList: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [statusFilter, setStatusFilter] = useState<'Any' | 'For Sale' | 'Pending' | 'Sold'>('For Sale');
  const [sortOption, setSortOption] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');
  const [searchQuery, setSearchQuery] = useState('');

  const formatINR = (value: number) => {
    if (value >= 10000000) return `₹ ${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹ ${(value / 100000).toFixed(1)}L`;
    return `₹ ${(value / 1000).toFixed(0)}k`;
  };

  const activeClients = MOCK_CLIENTS.filter(c => c.status === 'Active').length;
  const totalPipeline = MOCK_CLIENTS.filter(c => c.status === 'Active').reduce((acc, curr) => acc + curr.budget, 0);
  const topCities = MOCK_CLIENTS.reduce((acc, curr) => {
    acc[curr.preferredCity] = (acc[curr.preferredCity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topCityName = Object.entries(topCities).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || 'N/A';

  const filteredClientList = useMemo(() => {
    return MOCK_CLIENTS.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.source.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  useEffect(() => {
    if (selectedClient) {
      setStatusFilter('For Sale');
      setSortOption('relevance');
    }
  }, [selectedClient]);

  const processedProperties = useMemo(() => {
    if (!selectedClient) return [];
    
    let props = MOCK_PROPERTIES.filter(p => 
      selectedClient.interestedIn.includes(p.type) && p.price <= (selectedClient.budget * 1.2) // Show slightly above budget
    );

    if (statusFilter !== 'Any') {
        props = props.filter(p => p.status === statusFilter);
    }

    return props.sort((a, b) => {
        if (sortOption === 'price-asc') return a.price - b.price;
        if (sortOption === 'price-desc') return b.price - a.price;
        if (sortOption === 'relevance') {
            const aCityMatch = a.city === selectedClient.preferredCity ? 1 : 0;
            const bCityMatch = b.city === selectedClient.preferredCity ? 1 : 0;
            if (aCityMatch !== bCityMatch) return bCityMatch - aCityMatch;
            return b.price - a.price;
        }
        return 0;
    });
  }, [selectedClient, statusFilter, sortOption]);

  return (
    <div className="space-y-6 relative animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="glass-header-3d text-2xl font-bold">Lead Intelligence Center</h2>
          <p className="text-xs text-slate-500 font-black uppercase tracking-widest mt-2 px-3 py-1 bg-white/40 border border-white/40 rounded-full inline-block">
            Aggregated from 50 Global Platforms
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, job, or platform..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:bg-white/50 transition-all shadow-lg border-white/40">
            <div className="p-4 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30">
                <Users size={28} />
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active Leads</p>
                <h3 className="text-2xl font-black text-slate-800">{activeClients} <span className="text-sm text-slate-400 font-bold ml-1">/ 50 TOTAL</span></h3>
            </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:bg-white/50 transition-all shadow-lg border-white/40">
            <div className="p-4 bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/30">
                <IndianRupee size={28} />
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Portfolio Value</p>
                <h3 className="text-2xl font-black text-slate-800">{formatINR(totalPipeline)}</h3>
            </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 hover:bg-white/50 transition-all shadow-lg border-white/40">
            <div className="p-4 bg-amber-600 text-white rounded-xl shadow-lg shadow-amber-500/30">
                <Target size={28} />
            </div>
            <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Hot Territory</p>
                <h3 className="text-2xl font-black text-slate-800">{topCityName}</h3>
            </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/40 bg-white/40 backdrop-blur-xl">
        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-white/90 backdrop-blur-xl z-10 shadow-sm border-b border-white/20">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Profile</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Interest Profile</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Investment Capacity</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Acquisition Source</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Lead Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Intel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {filteredClientList.map((client) => (
                <tr 
                  key={client.id} 
                  className="hover:bg-white/60 transition-all cursor-pointer group"
                  onClick={() => setSelectedClient(client)}
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img src={client.imageUrl} alt={client.name} className="w-12 h-12 rounded-2xl object-cover shadow-lg border-2 border-white ring-1 ring-slate-100 group-hover:scale-110 transition-transform" />
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${client.status === 'Active' ? 'bg-green-500' : 'bg-slate-300'}`} />
                      </div>
                      <div>
                        <div className="font-black text-slate-800 text-sm group-hover:text-blue-700 transition-colors uppercase tracking-tight">{client.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">{client.jobTitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="text-xs font-black text-slate-700 flex items-center gap-1.5 uppercase">
                        <MapPin size={12} className="text-blue-500" />
                        {client.preferredCity}
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {client.interestedIn.map(interest => (
                          <span key={interest} className="px-2 py-0.5 rounded-lg text-[9px] font-black bg-slate-100 text-slate-500 border border-slate-200/50 uppercase">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-black text-slate-800">
                      {formatINR(client.budget)}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-[9px] font-black bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest shadow-sm">
                      <Globe size={10} /> {client.source}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest ${
                      client.status === 'Active' ? 'bg-green-500 text-white border-green-400 shadow-md shadow-green-500/20' :
                      client.status === 'Cold' ? 'bg-slate-100 text-slate-400 border-slate-200' :
                      'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="text-slate-400 group-hover:text-blue-600 transition-all p-2 rounded-2xl hover:bg-white shadow-sm border border-transparent hover:border-slate-100">
                      <Zap size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl transition-opacity duration-500"
            onClick={() => setSelectedClient(null)}
          />
          
          <div className="relative w-full max-w-4xl glass-panel bg-white/95 backdrop-blur-3xl rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.4)] border-white/50 overflow-hidden animate-fade-in flex flex-col md:flex-row max-h-[95vh]">
            {/* Lead Sidebar Profile */}
            <div className="w-full md:w-80 bg-slate-900 text-white p-10 flex flex-col">
              <div className="mb-10 text-center">
                <img src={selectedClient.imageUrl} alt={selectedClient.name} className="w-40 h-40 rounded-[32px] object-cover mx-auto shadow-2xl border-4 border-white/10 ring-8 ring-blue-500/20 mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tight">{selectedClient.name}</h3>
                <p className="text-blue-400 text-xs font-black uppercase tracking-[0.2em] mt-2">{selectedClient.jobTitle}</p>
              </div>

              <div className="space-y-6 flex-1">
                <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Lead Dossier</p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail size={14} className="text-blue-400" />
                      <span className="text-[11px] font-bold text-slate-300 truncate">{selectedClient.email}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone size={14} className="text-blue-400" />
                      <span className="text-[11px] font-bold text-slate-300">{selectedClient.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-3xl border border-white/10">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">System Identity</p>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-blue-600 rounded text-[9px] font-black uppercase">Source: {selectedClient.source}</span>
                  </div>
                  <p className="text-[9px] text-slate-500 mt-2 font-bold uppercase italic">Captured on {selectedClient.lastActive}</p>
                </div>
              </div>
              
              <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-xl">
                 Initiate Protocol
              </button>
            </div>

            {/* Recommendations Content */}
            <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-white relative">
              <button onClick={() => setSelectedClient(null)} className="absolute top-10 right-10 p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-all hover:rotate-90">
                <X size={28} />
              </button>

              <div className="mb-12">
                <h3 className="glass-header-3d text-3xl font-black text-slate-900 bg-white/60 mb-2">Inventory Matching</h3>
                <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em] mt-4 ml-2">Market Intelligence Analysis</p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                  <DollarSign className="text-blue-600 mb-3" size={32} />
                  <div className="text-2xl font-black text-slate-900">{formatINR(selectedClient.budget)}</div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Max Liquidity</div>
                </div>
                <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                  <Target className="text-amber-600 mb-3" size={32} />
                  <div className="text-2xl font-black text-slate-900">{selectedClient.preferredCity}</div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Priority Zone</div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end mb-6">
                   <h4 className="glass-header-3d text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 bg-white/60">
                      <Zap size={18} className="text-amber-500" /> High Relevance Matches
                   </h4>
                   <div className="flex gap-2">
                     <select 
                       value={statusFilter}
                       onChange={(e) => setStatusFilter(e.target.value as any)}
                       className="bg-slate-50 border-none text-[10px] font-black uppercase rounded-xl p-2 cursor-pointer"
                     >
                       <option value="For Sale">For Sale</option>
                       <option value="Any">All Status</option>
                     </select>
                   </div>
                </div>

                <div className="space-y-4">
                  {processedProperties.length > 0 ? (
                    processedProperties.map(property => (
                      <div key={property.id} className="group flex items-center gap-6 p-4 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer">
                        <img src={property.imageUrl} alt={property.address} className="w-24 h-24 rounded-2xl object-cover shadow-lg group-hover:scale-110 transition-transform" />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h5 className="font-black text-slate-800 text-sm truncate uppercase tracking-tight">{property.address}</h5>
                            <span className="text-blue-600 font-black text-xs">
                              {formatINR(property.price)}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{property.city} • {property.type}</p>
                          <div className="flex items-center gap-3 mt-3">
                             <div className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                                property.status === 'For Sale' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                             }`}>
                                {property.status}
                             </div>
                             <div className="flex items-center gap-1.5 text-blue-500">
                                <ShieldCheck size={14} />
                                <span className="text-[9px] font-black uppercase">Verified</span>
                             </div>
                          </div>
                        </div>
                        <ArrowRight size={24} className="text-slate-200 group-hover:text-blue-600 group-hover:translate-x-2 transition-all" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                      <Building size={48} className="mx-auto text-slate-200 mb-4" />
                      <p className="text-slate-500 font-black text-xs uppercase tracking-widest">No Intelligence Matches Found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
