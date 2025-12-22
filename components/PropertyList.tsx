
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { MapPin, BedDouble, Bath, Square, Tag, User, Phone, Plus, X, Upload, Image as ImageIcon, DollarSign, Calendar, Loader2, Navigation, IndianRupee, Hash, Globe, Filter, Clock, CheckCircle, CalendarCheck, MessageSquare, Mail, ArrowRight, PenTool, ShieldCheck, Gem, Landmark, Search, ExternalLink, UserCircle, Building2, TrendingDown, Scale, Check } from 'lucide-react';
import { MOCK_PROPERTIES, MOCK_AGENTS, REAL_ESTATE_IMAGES } from '../constants';
import { Property } from '../types';
import { findNearbyProperties, searchWebForProperties } from '../services/geminiService';

interface PropertyListProps {
  onBookProperty?: (property: Property) => void;
  agentFilterId?: number | null;
  onClearFilter?: () => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ onBookProperty, agentFilterId, onClearFilter }) => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isWebScouting, setIsWebScouting] = useState(false);
  const [scoutCategory, setScoutCategory] = useState<'Residential' | 'Commercial' | 'Luxury' | 'Distressed'>('Residential');
  const [statusFilter, setStatusFilter] = useState<'All' | 'For Sale' | 'Pending' | 'Sold'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Plot' | 'Villa' | 'Residential'>('All');
  
  // Selection & Comparison State
  const [selectedForComparison, setSelectedForComparison] = useState<number[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Details Modal State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [nearbyResults, setNearbyResults] = useState<{text: string, sources: any[]} | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchesType = typeFilter === 'All' 
        ? true 
        : typeFilter === 'Residential' 
        ? !['Plot', 'Villa'].includes(p.type)
        : p.type === typeFilter;
      const matchesAgent = !agentFilterId || p.agentId === agentFilterId;
      return matchesStatus && matchesType && matchesAgent;
    });
  }, [properties, statusFilter, typeFilter, agentFilterId]);

  const filteringAgent = useMemo(() => {
    if (!agentFilterId) return null;
    return MOCK_AGENTS.find(a => a.id === agentFilterId);
  }, [agentFilterId]);

  const formatINR = (value: number) => {
    if (value >= 10000000) return `₹ ${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹ ${(value / 100000).toFixed(2)} L`;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleToggleComparison = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedForComparison(prev => {
      if (prev.includes(id)) return prev.filter(pId => pId !== id);
      if (prev.length >= 4) {
        alert("Maximum 4 properties can be compared at once.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleOfficialBooking = (e: React.MouseEvent | null, property: Property) => {
    if (e) e.stopPropagation();
    setSelectedProperty(null); 
    if (onBookProperty) {
      onBookProperty(property);
    }
  };

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);
    setNearbyResults(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const resultText = await findNearbyProperties(latitude, longitude);
          setNearbyResults({ text: resultText, sources: [] });
        } catch (error) {
          console.error("Failed to fetch nearby properties", error);
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        console.error("Error getting location", error);
        setLoadingLocation(false);
        alert("Please enable location services to use this feature.");
      }
    );
  };

  const handleWebScout = async () => {
    setIsWebScouting(true);
    setNearbyResults(null);
    try {
      const query = typeFilter === 'All' ? `top ${scoutCategory} real estate listings` : `${typeFilter} properties in ${scoutCategory} category`;
      const result = await searchWebForProperties(query, scoutCategory);
      setNearbyResults({ text: result.text, sources: result.sources });
    } catch (err) {
      console.error(err);
    } finally {
      setIsWebScouting(false);
    }
  };

  const comparisonProperties = useMemo(() => {
    return properties.filter(p => selectedForComparison.includes(p.id));
  }, [properties, selectedForComparison]);

  return (
    <div className="space-y-6 relative animate-fade-in">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h2 className="glass-header-3d text-2xl font-bold">Premium Inventory</h2>
          {filteringAgent ? (
             <div className="mt-3 flex items-center gap-3 px-4 py-2 bg-blue-600 text-white rounded-2xl shadow-lg animate-fade-in">
                <UserCircle size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Assets by {filteringAgent.name}</span>
                <button onClick={onClearFilter} className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors">
                   <X size={14} />
                </button>
             </div>
          ) : (
            <p className="text-xs text-slate-500 font-black uppercase tracking-widest mt-3 px-3 py-1 bg-white/40 border border-white/40 rounded-full inline-block">
              Global Platform Aggregator
            </p>
          )}
        </div>
        
        <div className="flex gap-2 flex-wrap sm:flex-nowrap w-full xl:w-auto items-center">
          {selectedForComparison.length >= 2 && (
            <button 
              onClick={() => setIsComparisonOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-amber-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/30 animate-pulse"
            >
              <Scale size={16} /> Compare ({selectedForComparison.length})
            </button>
          )}

          <div className="relative group min-w-[120px]">
            <select
              value={scoutCategory}
              onChange={(e) => setScoutCategory(e.target.value as any)}
              className="w-full px-4 py-3 bg-slate-900 text-white border-none rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer backdrop-blur-sm transition-all shadow-xl"
            >
              <option value="Residential">Residential Portals</option>
              <option value="Commercial">Commercial (LoopNet/CoStar)</option>
              <option value="Luxury">Luxury (Sotheby's/Mansion)</option>
              <option value="Distressed">Distressed/Auctions</option>
            </select>
          </div>

          <button 
            onClick={handleWebScout}
            disabled={isWebScouting}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            {isWebScouting ? <Loader2 className="animate-spin" size={16} /> : <Globe size={16} />}
            {isWebScouting ? 'SCANNING...' : `Scout ${scoutCategory}`}
          </button>

          <button 
            onClick={handleFindNearby}
            disabled={loadingLocation}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30 disabled:opacity-70 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            {loadingLocation ? <Loader2 className="animate-spin" size={16} /> : <Navigation size={16} />}
            {loadingLocation ? 'LOCATING...' : 'Nearby'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <div 
              key={property.id} 
              onClick={() => handlePropertyClick(property)}
              className="glass-panel rounded-3xl overflow-hidden hover:scale-[1.03] transition-all duration-500 group cursor-pointer hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col border-white/30 relative"
            >
              {/* Compare Selection Toggle */}
              <button
                onClick={(e) => handleToggleComparison(e, property.id)}
                className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-xl backdrop-blur-md flex items-center justify-center transition-all ${
                  selectedForComparison.includes(property.id)
                    ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/40'
                    : 'bg-black/20 text-white border border-white/20 hover:bg-black/40'
                }`}
              >
                {selectedForComparison.includes(property.id) ? <Check size={20} /> : <Scale size={20} />}
              </button>

              <div className="relative h-64 overflow-hidden bg-slate-900">
                <img 
                  src={property.imageUrl} 
                  alt={property.address} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
                />
                
                <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md ${
                  property.status === 'For Sale' ? 'bg-green-500/80 border border-green-400/30' :
                  property.status === 'Pending' ? 'bg-yellow-500/80 border border-yellow-400/30' : 'bg-red-500/80 border border-red-400/30'
                }`}>
                  {property.status}
                </div>

                <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/40 backdrop-blur-xl border border-white/20 rounded-2xl flex justify-between items-center transform translate-y-0 group-hover:-translate-y-2 transition-transform duration-500">
                   <div className="flex flex-col">
                      <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Market Value</span>
                      <span className="text-xl font-black text-white">{formatINR(property.price)}</span>
                   </div>
                   <div className="bg-white/10 p-2 rounded-xl border border-white/20 group-hover:bg-blue-600 transition-colors">
                      <ArrowRight size={20} className="text-white" />
                   </div>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start gap-2 mb-1">
                  <MapPin size={18} className="text-blue-600 mt-1 flex-shrink-0" />
                  <h3 className="font-black text-slate-800 text-lg leading-tight line-clamp-1 group-hover:text-blue-700 transition-colors">{property.address}</h3>
                </div>
                <p className="text-sm text-slate-500 mb-6 ml-6 font-bold uppercase tracking-tight">{property.city} • Managed via {property.source}</p>

                <div className="grid grid-cols-3 gap-4 py-4 border-t border-slate-100 mb-4">
                  {property.type !== 'Plot' ? (
                    <>
                      <div className="flex flex-col items-center gap-1">
                        <BedDouble size={20} className="text-blue-500" />
                        <span className="font-black text-slate-800">{property.bedrooms}</span>
                        <span className="text-[9px] text-slate-400 font-black uppercase">Beds</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 border-l border-r border-slate-100">
                        <Bath size={20} className="text-blue-500" />
                        <span className="font-black text-slate-800">{property.bathrooms}</span>
                        <span className="text-[9px] text-slate-400 font-black uppercase">Baths</span>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2 flex items-center justify-center gap-4">
                       <Landmark size={24} className="text-emerald-500" />
                       <div className="text-left">
                          <span className="block font-black text-slate-800 uppercase text-xs">Ready Build</span>
                          <span className="text-[10px] text-emerald-600 font-bold">Approved Site</span>
                       </div>
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-1">
                    <Square size={20} className="text-blue-500" />
                    <span className="font-black text-slate-800">{property.sqft}</span>
                    <span className="text-[9px] text-slate-400 font-black uppercase">Sqft</span>
                  </div>
                </div>

                <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    property.type === 'Villa' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    property.type === 'Plot' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {property.type}
                  </span>
                  <div className="flex items-center gap-2">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">SOURCE: {property.source}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-28 text-center glass-panel rounded-[40px] border-2 border-dashed border-slate-200">
             <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-slate-100 mb-6 text-slate-300">
              <Building2 size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-800">Zero Inventory Found</h3>
            <p className="text-slate-500 mt-2 font-black uppercase tracking-widest text-[10px]">No assets match current intel parameters</p>
            {agentFilterId && (
              <button onClick={onClearFilter} className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl">
                 Clear Active Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Comparison Modal */}
      {isComparisonOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-2xl" onClick={() => setIsComparisonOpen(false)} />
          <div className="relative w-full max-w-7xl glass-panel bg-white/95 rounded-[40px] shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg">
                  <Scale size={24} />
                </div>
                <div>
                  <h3 className="glass-header-3d text-xl font-black text-slate-900 uppercase">Asset Comparison Grid</h3>
                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Side-by-side performance analysis</p>
                </div>
              </div>
              <button onClick={() => setIsComparisonOpen(false)} className="p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-transform hover:rotate-90">
                <X size={28} />
              </button>
            </div>

            <div className="flex-1 overflow-x-auto p-8 custom-scrollbar">
              <div className="min-w-max flex gap-8 pb-4">
                {comparisonProperties.map((prop) => (
                  <div key={prop.id} className="w-80 flex flex-col bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden animate-fade-in">
                    <div className="relative h-48">
                      <img src={prop.imageUrl} alt={prop.address} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-2xl font-black text-white">{formatINR(prop.price)}</p>
                        <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">{prop.city}</p>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification</span>
                          <span className="text-xs font-black text-slate-800">{prop.type}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dimension</span>
                          <span className="text-xs font-black text-slate-800">{prop.sqft} SQFT</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Architecture</span>
                          <span className="text-xs font-black text-slate-800">
                            {prop.type === 'Plot' ? 'N/A' : `${prop.bedrooms}B / ${prop.bathrooms}B`}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Market Status</span>
                          <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase ${
                            prop.status === 'For Sale' ? 'bg-green-100 text-green-700' :
                            prop.status === 'Pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {prop.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center border-b border-slate-50 pb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source Network</span>
                          <span className="text-[10px] font-black text-blue-600 uppercase italic">{prop.source}</span>
                        </div>
                      </div>

                      <div className="pt-4 flex flex-col gap-2">
                        <button 
                          onClick={() => handleOfficialBooking(null, prop)}
                          className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg"
                        >
                          Book Inspection
                        </button>
                        <button 
                          onClick={() => setSelectedForComparison(prev => prev.filter(id => id !== prop.id))}
                          className="w-full py-3 bg-slate-50 text-slate-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-all"
                        >
                          Remove from Comparison
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {comparisonProperties.length < 4 && (
                  <div className="w-80 flex flex-col items-center justify-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200 p-8 text-center group hover:bg-white hover:border-blue-400 transition-all cursor-pointer" onClick={() => setIsComparisonOpen(false)}>
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Plus size={32} />
                    </div>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Add more assets</p>
                    <p className="text-[10px] text-slate-300 mt-2">Up to 4 total</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 flex justify-center bg-slate-50/30">
              <button 
                onClick={() => setIsComparisonOpen(false)}
                className="px-12 py-4 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-xl"
              >
                Close Comparison View
              </button>
            </div>
          </div>
        </div>
      )}

       {/* Nearby / Web Search Results Modal */}
       {nearbyResults && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={() => setNearbyResults(null)} />
            <div className="relative w-full max-w-2xl glass-panel bg-white/95 rounded-[40px] shadow-2xl overflow-hidden animate-fade-in flex flex-col max-h-[85vh]">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
                         <Globe size={24} className="animate-pulse" />
                      </div>
                      <div>
                         <h3 className="glass-header-3d text-xl font-black text-slate-900 uppercase">Live {scoutCategory} Intelligence</h3>
                         <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 ml-1">Cross-referencing 100+ Market Portals</p>
                      </div>
                   </div>
                   <button onClick={() => setNearbyResults(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-transform hover:rotate-90"><X size={24}/></button>
                </div>
                <div className="p-8 overflow-y-auto text-slate-700 leading-relaxed font-medium">
                   <div className="whitespace-pre-wrap">{nearbyResults.text}</div>
                   
                   {nearbyResults.sources.length > 0 && (
                     <div className="mt-8 pt-6 border-t border-slate-100">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Direct Listing Verifications</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                           {nearbyResults.sources.map((chunk: any, i: number) => (
                             chunk.web && (
                               <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 transition-colors group border border-slate-100">
                                  <span className="text-[10px] font-bold text-slate-700 truncate mr-4">{chunk.web.title || 'Official Listing'}</span>
                                  <ExternalLink size={14} className="text-blue-500 group-hover:scale-110 transition-transform" />
                               </a>
                             )
                           ))}
                        </div>
                     </div>
                   )}
                </div>
                <div className="p-8 border-t border-slate-100 flex justify-center">
                   <button onClick={() => setNearbyResults(null)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
                      Acknowledge Intelligence
                   </button>
                </div>
            </div>
         </div>
       )}

       {/* Property Details Modal */}
       {selectedProperty && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-lg transition-opacity duration-500"
              onClick={() => setSelectedProperty(null)}
            />
            <div className="relative w-full max-w-6xl glass-panel bg-white/95 backdrop-blur-3xl rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden animate-fade-in flex flex-col md:flex-row max-h-[95vh] border-white/50">
                {/* Image Side */}
                <div className="w-full md:w-3/5 relative h-80 md:h-auto bg-slate-900 group">
                    <img src={selectedProperty.imageUrl} alt={selectedProperty.address} className="w-full h-full object-cover opacity-95" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/20" />
                    <div className="absolute top-8 left-8 flex flex-col gap-3">
                        <div className="px-5 py-2 bg-blue-600 rounded-2xl text-[10px] font-black text-white shadow-2xl tracking-widest uppercase">
                           VERIFIED ASSET
                        </div>
                        <div className="px-5 py-2 bg-slate-900/80 backdrop-blur-md rounded-2xl text-[9px] font-black text-white border border-white/20 uppercase tracking-widest">
                           SOURCE: {selectedProperty.source}
                        </div>
                    </div>

                    <div className="absolute bottom-12 left-12 right-12 text-white">
                        <h2 className="text-6xl font-black mb-4 drop-shadow-2xl">{formatINR(selectedProperty.price)}</h2>
                        <div className="flex items-center gap-3 text-white/90 font-bold text-xl drop-shadow-lg">
                            <MapPin size={24} className="text-blue-400" />
                            {selectedProperty.address}
                        </div>
                        <p className="mt-2 text-white/70 font-black uppercase tracking-[0.2em]">{selectedProperty.city}</p>
                    </div>
                </div>

                {/* Content Side */}
                <div className="flex-1 p-12 flex flex-col bg-white relative overflow-y-auto custom-scrollbar">
                    <button 
                        onClick={() => setSelectedProperty(null)}
                        className="absolute top-10 right-10 p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-all hover:rotate-90"
                    >
                        <X size={28} />
                    </button>

                    <div className="mb-12">
                        <h3 className="glass-header-3d text-3xl font-black text-slate-900 mb-2 bg-white/60">Asset Intelligence</h3>
                        <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest mt-4 ml-2">Verified via {selectedProperty.source} Platform</p>
                    </div>
                    
                    <div className="space-y-12 flex-1">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 group hover:bg-blue-50 transition-colors">
                                <Square className="text-blue-600 mb-3" size={32} />
                                <div className="text-2xl font-black text-slate-900">{selectedProperty.sqft}</div>
                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Dimension (SQFT)</div>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 group hover:bg-emerald-50 transition-colors">
                                <Tag className="text-emerald-600 mb-3" size={32} />
                                <div className="text-2xl font-black text-slate-900">{selectedProperty.type}</div>
                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Classification</div>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <h4 className="glass-header-3d font-black text-slate-900 text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 bg-white/60">
                                <PenTool size={18} className="text-blue-500" /> Executive Brief
                            </h4>
                            <p className="text-slate-600 text-lg leading-relaxed font-medium italic mt-6">
                                "This {selectedProperty.type} listed on {selectedProperty.source} represents a high-yield opportunity within our verified ecosystem in {selectedProperty.city}."
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-slate-10