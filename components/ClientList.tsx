
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, MoreHorizontal, X, Mail, DollarSign, Building, Phone, Calendar, ArrowRight, ArrowUpDown, ListFilter, IndianRupee, MapPin, TrendingUp, Users, Target } from 'lucide-react';
import { MOCK_CLIENTS, MOCK_PROPERTIES } from '../constants';
import { Client } from '../types';

const ClientList: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [statusFilter, setStatusFilter] = useState<'Any' | 'For Sale' | 'Pending' | 'Sold'>('For Sale');
  const [sortOption, setSortOption] = useState<'relevance' | 'price-asc' | 'price-desc'>('relevance');

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

  useEffect(() => {
    if (selectedClient) {
      setStatusFilter('For Sale');
      setSortOption('relevance');
    }
  }, [selectedClient]);

  const processedProperties = useMemo(() => {
    if (!selectedClient) return [];
    
    let props = MOCK_PROPERTIES.filter(p => 
      selectedClient.interestedIn.includes(p.type) && p.price <= selectedClient.budget
    );

    if (statusFilter !== 'Any') {
        props = props.filter(p => p.status === statusFilter);
    }

    return props.sort((a, b) => {
        if (sortOption === 'price-asc') return a.price - b.price;
        if (sortOption === 'price-desc') return b.price - a.price;
        if (sortOption === 'relevance') {
            if (a.status === 'For Sale' && b.status !== 'For Sale') return -1;
            if (a.status !== 'For Sale' && b.status === 'For Sale') return 1;
            return b.price - a.price;
        }
        return 0;
    });
  }, [selectedClient, statusFilter, sortOption]);

  return (
    <div className="space-y-6 relative animate-fade-in">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="glass-header-3d text-2xl font-bold">Client Management</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search clients..." 
              className="w-full pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
          <button className="p-2 bg-white/60 backdrop-blur-sm border border-slate-200/60 rounded-lg text-slate-600 hover:bg-slate-50">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-5 rounded-xl flex items-center gap-4 hover:bg-white/50 transition-colors">
            <div className="p-3 bg-blue-100/50 text-blue-600 rounded-lg backdrop-blur-sm">
                <Users size={24} />
            </div>
            <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Active Clients</p>
                <h3 className="text-2xl font-black text-slate-800">{activeClients} <span className="text-base text-slate-400 font-normal">/ {MOCK_CLIENTS.length}</span></h3>
            </div>
        </div>
        <div className="glass-panel p-5 rounded-xl flex items-center gap-4 hover:bg-white/50 transition-colors">
            <div className="p-3 bg-emerald-100/50 text-emerald-600 rounded-lg backdrop-blur-sm">
                <IndianRupee size={24} />
            </div>
            <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pipeline Value</p>
                <h3 className="text-2xl font-black text-slate-800">{formatINR(totalPipeline)}</h3>
            </div>
        </div>
        <div className="glass-panel p-5 rounded-xl flex items-center gap-4 hover:bg-white/50 transition-colors">
            <div className="p-3 bg-indigo-100/50 text-indigo-600 rounded-lg backdrop-blur-sm">
                <Target size={24} />
            </div>
            <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Top Interest</p>
                <h3 className="text-2xl font-black text-slate-800">{topCityName}</h3>
            </div>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden shadow-lg border border-white/40">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-md z-10 shadow-sm">
              <tr className="border-b border-slate-200/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Client Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred City</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Interests</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/50">
              {MOCK_CLIENTS.map((client) => (
                <tr 
                  key={client.id} 
                  className="hover:bg-blue-50/30 transition-colors cursor-pointer group"
                  onClick={() => setSelectedClient(client)}
                >
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{client.name}</div>
                      <div className="text-xs text-slate-500">{client.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-700 flex items-center gap-1">
                      <MapPin size={14} className="text-slate-400" />
                      {client.preferredCity}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-700">
                      {formatINR(client.budget)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1 flex-wrap max-w-[200px]">
                      {client.interestedIn.map(interest => (
                        <span key={interest} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      client.status === 'Active' ? 'bg-emerald-100/50 text-emerald-700 border-emerald-200' :
                      client.status === 'Cold' ? 'bg-slate-100/50 text-slate-600 border-slate-200' :
                      'bg-blue-100/50 text-blue-700 border-blue-200'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      className="text-slate-400 hover:text-blue-600 transition-colors p-1 rounded-full hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedClient(client);
                      }}
                    >
                      <MoreHorizontal size={20} />
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
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedClient(null)}
          />
          
          <div className="relative w-full max-w-2xl glass-panel bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl ring-1 ring-white/50 overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-start p-6 border-b border-white/40 bg-white/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-500/30 ring-2 ring-white/50">
                  {selectedClient.name.charAt(0)}
                </div>
                <div>
                  <h3 className="glass-header-3d text-2xl font-bold">{selectedClient.name}</h3>
                  <div className="flex items-center gap-3 mt-3 ml-1">
                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        selectedClient.status === 'Active' ? 'bg-green-50/50 text-green-700 border-green-200' :
                        selectedClient.status === 'Cold' ? 'bg-slate-50/50 text-slate-700 border-slate-200' :
                        'bg-blue-50/50 text-blue-700 border-blue-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                            selectedClient.status === 'Active' ? 'bg-green-500' :
                            selectedClient.status === 'Cold' ? 'bg-slate-500' :
                            'bg-blue-500'
                        }`} />
                        {selectedClient.status}
                      </span>
                      <span className="text-sm text-slate-500 flex items-center gap-1">
                        <Mail size={14} /> {selectedClient.email}
                      </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedClient(null)}
                className="p-2 hover:bg-white/50 rounded-full transition-colors text-slate-500 hover:text-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/60 border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-100/80 text-green-600 rounded-lg">
                      <IndianRupee size={20} />
                    </div>
                    <span className="text-sm font-medium text-slate-500">Maximum Budget</span>
                  </div>
                  <div className="text-2xl font-bold text-slate-800 pl-1">
                    {formatINR(selectedClient.budget)}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/60 border border-white/60 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-indigo-100/80 text-indigo-600 rounded-lg">
                      <Building size={20} />
                    </div>
                    <span className="text-sm font-medium text-slate-500">Property Interests</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1 pl-1">
                    {selectedClient.interestedIn.map(interest => (
                      <span key={interest} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50/80 text-indigo-700 border border-indigo-100">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                  <div>
                    <h4 className="glass-header-3d text-lg font-bold flex items-center gap-2">
                      Recommended Properties
                      <span className="text-xs font-normal text-slate-500 ml-2 bg-white/60 border border-white/50 px-2 py-0.5 rounded-full">
                        {processedProperties.length} matches
                      </span>
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <ListFilter size={14} className="text-slate-500" />
                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="bg-white/50 border border-white/60 text-slate-600 text-xs rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-1.5 backdrop-blur-sm cursor-pointer hover:bg-white/80 transition-colors"
                      >
                        <option value="For Sale">For Sale</option>
                        <option value="Pending">Pending</option>
                        <option value="Sold">Sold</option>
                        <option value="Any">Any Status</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <ArrowUpDown size={14} className="text-slate-500" />
                      <select 
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value as any)}
                        className="bg-white/50 border border-white/60 text-slate-600 text-xs rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-1.5 backdrop-blur-sm cursor-pointer hover:bg-white/80 transition-colors"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  {processedProperties.length > 0 ? (
                    processedProperties.map(property => (
                      <div key={property.id} className="group flex items-center gap-4 p-3 rounded-xl bg-white/60 border border-white/60 hover:bg-white/90 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer">
                        <img 
                          src={property.imageUrl} 
                          alt={property.address} 
                          className="w-24 h-24 rounded-lg object-cover shadow-sm group-hover:scale-105 transition-transform duration-300" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h5 className="font-semibold text-slate-800 truncate pr-2">{property.address}</h5>
                            <span className="text-blue-600 font-bold text-sm bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100">
                              {formatINR(property.price)}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">{property.city} • {property.type} • {property.bedrooms} Beds</p>
                          <div className="flex items-center gap-2 mt-2">
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                                property.status === 'For Sale' ? 'bg-green-100/80 text-green-700' :
                                property.status === 'Pending' ? 'bg-yellow-100/80 text-yellow-700' : 'bg-red-100/80 text-red-700'
                             }`}>
                                {property.status}
                             </span>
                             <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                               Match: {property.city === selectedClient.preferredCity ? 'High' : 'Med'}
                             </span>
                          </div>
                        </div>
                        <div className="pr-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight size={20} className="text-slate-400" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 px-6 bg-white/40 rounded-xl border border-dashed border-slate-300/50">
                      <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                        <Building size={24} />
                      </div>
                      <p className="text-slate-600 font-medium">No properties found</p>
                      <p className="text-sm text-slate-400 mt-1">Try adjusting filters or client criteria.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/60 border-t border-white/40 flex justify-end gap-3 backdrop-blur-md">
              <button 
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-white/50 rounded-lg transition-colors border border-transparent hover:border-white/50"
              >
                Log Activity
              </button>
              <button className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2">
                <Mail size={16} />
                Contact Client
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
