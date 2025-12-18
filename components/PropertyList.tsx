
import React, { useState, useRef, useMemo } from 'react';
import { MapPin, BedDouble, Bath, Square, Tag, User, Phone, Plus, X, Upload, Image as ImageIcon, DollarSign, Calendar, Loader2, Navigation, IndianRupee, Hash, Globe, Filter, Clock, CheckCircle, CalendarCheck, MessageSquare, Mail, ArrowRight, PenTool, ShieldCheck, Gem, Landmark } from 'lucide-react';
import { MOCK_PROPERTIES, REAL_ESTATE_IMAGES } from '../constants';
import { Property } from '../types';
import { findNearbyProperties } from '../services/geminiService';

interface PropertyListProps {
  onBookProperty?: (property: Property) => void;
}

const PropertyList: React.FC<PropertyListProps> = ({ onBookProperty }) => {
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'For Sale' | 'Pending' | 'Sold'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Plot' | 'Villa' | 'Residential'>('All');
  
  // Details Modal State
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Partial<Property>>({
    address: '',
    city: '',
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
    type: 'Single Family',
    status: 'For Sale',
    ownerName: '',
    ownerContact: '',
    imageUrl: '',
    source: 'Direct'
  });

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      const matchesType = typeFilter === 'All' 
        ? true 
        : typeFilter === 'Residential' 
        ? !['Plot', 'Villa'].includes(p.type)
        : p.type === typeFilter;
      return matchesStatus && matchesType;
    });
  }, [properties, statusFilter, typeFilter]);

  const formatINR = (value: number) => {
    if (value >= 10000000) return `₹ ${(value / 10000000).toFixed(2)} Cr`;
    if (value >= 100000) return `₹ ${(value / 100000).toFixed(2)} L`;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'sqft') 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property);
  };

  const handleOfficialBooking = (e: React.MouseEvent | null, property: Property) => {
    if (e) e.stopPropagation();
    setSelectedProperty(null); 
    if (onBookProperty) {
      onBookProperty(property);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewImage(result);
        setFormData(prev => ({ ...prev, imageUrl: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFindNearby = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const realProperties = await findNearbyProperties(latitude, longitude);
          
          const newProperties: Property[] = realProperties.map((p: any, index: number) => ({
            id: Date.now() + index,
            address: p.address,
            city: "Found Nearby", 
            price: p.price * 80, 
            bedrooms: p.bedrooms,
            bathrooms: p.bathrooms,
            sqft: p.sqft,
            type: p.type || "Single Family",
            status: "For Sale",
            agentId: Math.floor(Math.random() * 50) + 1,
            imageUrl: REAL_ESTATE_IMAGES[index % REAL_ESTATE_IMAGES.length],
            listedDate: new Date().toISOString().split('T')[0],
            ownerName: "Verified Owner",
            ownerContact: "+91 99887 76655",
            source: "Google Intelligence"
          }));

          setProperties(prev => [...newProperties, ...prev]);
        } catch (error) {
          console.error("Failed to fetch nearby properties", error);
          alert("Could not fetch nearby properties. Please check your API key.");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProperty: Property = {
      id: Date.now(),
      address: formData.address || 'Unknown Address',
      city: formData.city || 'Unknown City',
      price: formData.price || 0,
      bedrooms: formData.bedrooms || 0,
      bathrooms: formData.bathrooms || 0,
      sqft: formData.sqft || 0,
      type: (formData.type as any) || 'Single Family',
      status: (formData.status as any) || 'For Sale',
      agentId: 1,
      imageUrl: previewImage || REAL_ESTATE_IMAGES[0], 
      listedDate: new Date().toISOString().split('T')[0],
      ownerName: formData.ownerName || 'Unknown',
      ownerContact: formData.ownerContact || 'Unknown',
      source: 'Direct Entry'
    };

    setProperties([newProperty, ...properties]);
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      address: '',
      city: '',
      price: 0,
      bedrooms: 0,
      bathrooms: 0,
      sqft: 0,
      type: 'Single Family',
      status: 'For Sale',
      ownerName: '',
      ownerContact: '',
      imageUrl: '',
      source: 'Direct'
    });
    setPreviewImage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 relative animate-fade-in">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="glass-header-3d text-2xl font-bold">Premium Inventory</h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-2 px-3 py-1 bg-white/40 border border-white/40 rounded-full inline-block">
            Verified Plots & Luxury Villas
          </p>
        </div>
        
        <div className="flex gap-2 flex-wrap sm:flex-nowrap w-full xl:w-auto">
          {/* Status Filter */}
          <div className="relative group min-w-[120px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-4 py-2 bg-white/60 border border-white/60 rounded-xl text-xs font-bold text-slate-700 hover:bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer backdrop-blur-sm transition-all shadow-sm"
            >
              <option value="All">All Status</option>
              <option value="For Sale">For Sale</option>
              <option value="Pending">Pending</option>
              <option value="Sold">Sold</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="relative group min-w-[140px]">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="w-full px-4 py-2 bg-white/60 border border-white/60 rounded-xl text-xs font-bold text-slate-700 hover:bg-white/80 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer backdrop-blur-sm transition-all shadow-sm"
            >
              <option value="All">All Categories</option>
              <option value="Plot">Premium Plots</option>
              <option value="Villa">Luxury Villas</option>
              <option value="Residential">Residential Houses</option>
            </select>
          </div>

          <button 
            onClick={handleFindNearby}
            disabled={loadingLocation}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/30 disabled:opacity-70 disabled:cursor-not-allowed backdrop-blur-sm"
          >
            {loadingLocation ? <Loader2 className="animate-spin" size={16} /> : <Navigation size={16} />}
            {loadingLocation ? 'Scanning...' : 'Nearby Real-Time'}
          </button>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 backdrop-blur-sm"
          >
            <Plus size={16} /> List New Asset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProperties.length > 0 ? (
          filteredProperties.map((property) => (
            <div 
              key={property.id} 
              onClick={() => handlePropertyClick(property)}
              className="glass-panel rounded-3xl overflow-hidden hover:scale-[1.03] transition-all duration-500 group cursor-pointer hover:shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col border-white/30"
            >
              <div className="relative h-64 overflow-hidden bg-slate-900">
                <img 
                  src={property.imageUrl} 
                  alt={property.address} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 opacity-90 group-hover:opacity-100"
                />
                
                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-lg backdrop-blur-md ${
                  property.status === 'For Sale' ? 'bg-green-500/80 border border-green-400/30' :
                  property.status === 'Pending' ? 'bg-yellow-500/80 border border-yellow-400/30' : 'bg-red-500/80 border border-red-400/30'
                }`}>
                  {property.status}
                </div>

                {/* Exclusive Category Badge */}
                {property.type === 'Villa' && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-amber-500/90 backdrop-blur-md border border-amber-400/40 rounded-full text-[9px] font-black text-white shadow-xl flex items-center gap-1.5 animate-pulse">
                    <Gem size={12} /> LUXURY COLLECTION
                  </div>
                )}
                {property.type === 'Plot' && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500/90 backdrop-blur-md border border-emerald-400/40 rounded-full text-[9px] font-black text-white shadow-xl flex items-center gap-1.5">
                    <Landmark size={12} /> INVESTMENT PLOT
                  </div>
                )}

                {/* Price Display */}
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
              
              <div className="p-6">
                <div className="flex items-start gap-2 mb-1">
                  <MapPin size={18} className="text-blue-600 mt-1 flex-shrink-0" />
                  <h3 className="font-black text-slate-800 text-lg leading-tight line-clamp-1">{property.address}</h3>
                </div>
                <p className="text-sm text-slate-500 mb-6 ml-6 font-bold uppercase tracking-tight">{property.city} • Verified Asset</p>

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
                          <span className="block font-black text-slate-800 uppercase text-xs">Ready for Const.</span>
                          <span className="text-[10px] text-emerald-600 font-bold">Vastu Compliant</span>
                       </div>
                    </div>
                  )}
                  <div className="flex flex-col items-center gap-1">
                    <Square size={20} className="text-blue-500" />
                    <span className="font-black text-slate-800">{property.sqft}</span>
                    <span className="text-[9px] text-slate-400 font-black uppercase">{property.type === 'Plot' ? 'Sqft Area' : 'Build Area'}</span>
                  </div>
                </div>

                <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    property.type === 'Villa' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    property.type === 'Plot' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                  }`}>
                    {property.type}
                  </span>
                  <div className="flex items-center gap-2">
                     <span className="text-[10px] font-black text-slate-400">VIA {property.source?.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 mb-6 text-slate-300">
              <Filter size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800">Matching Inventory Empty</h3>
            <p className="text-slate-500 mt-2 font-medium">No assets found matching these filters. Try expanding your search.</p>
          </div>
        )}
      </div>

       {/* Property Details Modal - Redesigned for High Impact */}
       {selectedProperty && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-slate-900/80 backdrop-blur-lg transition-opacity duration-500"
              onClick={() => setSelectedProperty(null)}
            />
            <div className="relative w-full max-w-6xl glass-panel bg-white/95 backdrop-blur-3xl rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.4)] overflow-hidden animate-fade-in flex flex-col md:flex-row max-h-[95vh] border-white/50">
                {/* Image Side - Massive Cover */}
                <div className="w-full md:w-3/5 relative h-80 md:h-auto bg-slate-900 group">
                    <img src={selectedProperty.imageUrl} alt={selectedProperty.address} className="w-full h-full object-cover opacity-95" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-slate-900/20" />
                    <div className="absolute top-8 left-8 flex gap-3">
                        <div className="px-5 py-2 bg-blue-600 rounded-2xl text-xs font-black text-white shadow-2xl tracking-widest">
                           ESTATE MIND VERIFIED
                        </div>
                        {selectedProperty.type === 'Villa' && <div className="px-5 py-2 bg-amber-600 rounded-2xl text-xs font-black text-white shadow-2xl tracking-widest flex items-center gap-2"><Gem size={14}/> LUXE</div>}
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

                {/* Content Side - Detailed Analytics */}
                <div className="flex-1 p-12 flex flex-col bg-white relative overflow-y-auto custom-scrollbar">
                    <button 
                        onClick={() => setSelectedProperty(null)}
                        className="absolute top-10 right-10 p-3 hover:bg-slate-100 rounded-full text-slate-400 transition-all hover:rotate-90"
                    >
                        <X size={28} />
                    </button>

                    <div className="mb-12">
                        <h3 className="text-3xl font-black text-slate-900 mb-2">Technical Specifications</h3>
                        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Reference ID: EM-PR-{selectedProperty.id}</p>
                    </div>
                    
                    <div className="space-y-12 flex-1">
                        {/* High Impact Stats */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 group hover:bg-blue-50 transition-colors">
                                <Square className="text-blue-600 mb-3" size={32} />
                                <div className="text-2xl font-black text-slate-900">{selectedProperty.sqft}</div>
                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Square Feet Area</div>
                            </div>
                            <div className="p-6 bg-slate-50 rounded-[32px] border border-slate-100 group hover:bg-emerald-50 transition-colors">
                                <Tag className="text-emerald-600 mb-3" size={32} />
                                <div className="text-2xl font-black text-slate-900">{selectedProperty.type}</div>
                                <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Asset Category</div>
                            </div>
                        </div>
                        
                        <div className="space-y-6">
                            <h4 className="font-black text-slate-900 text-xs uppercase tracking-[0.3em] flex items-center gap-3">
                                <PenTool size={18} className="text-blue-500" /> Executive Summary
                            </h4>
                            <p className="text-slate-600 text-lg leading-relaxed font-medium italic">
                                "A rare opportunity to acquire a prime {selectedProperty.type} in {selectedProperty.city}. 
                                This asset has been rigorously audited for value optimization and legal clearance."
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {['Legal Clear', '24/7 Security', 'Ready to Occupy', 'Investor Choice', 'High Yield'].map((feature, i) => (
                                    <span key={i} className="px-5 py-2 bg-slate-900 rounded-full text-[10px] font-black text-white uppercase tracking-widest">
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-10 border-t border-slate-100">
                        <button 
                            onClick={(e) => handleOfficialBooking(null, selectedProperty)}
                            className="group w-full py-6 bg-slate-900 text-white rounded-[32px] font-black uppercase tracking-widest shadow-2xl shadow-blue-900/40 flex items-center justify-center gap-4 hover:bg-blue-700 transition-all duration-500 overflow-hidden relative"
                        >
                            <CalendarCheck size={24} /> Register for Exclusive Viewing
                            <ArrowRight size={24} className="group-hover:translate-x-3 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
         </div>
       )}

      {/* Add Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-3xl glass-panel bg-white rounded-[40px] shadow-2xl overflow-hidden animate-fade-in">
             <div className="p-10 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900">List New Market Asset</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24}/></button>
             </div>
             <form onSubmit={handleSubmit} className="p-10 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-8">
                   <div className="col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3">Property Location</label>
                      <input type="text" name="address" required value={formData.address} onChange={handleInputChange} placeholder="Full Street Address" className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3">City / Region</label>
                      <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3">Asset Price (₹)</label>
                      <input type="number" name="price" required value={formData.price} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3">Asset Type</label>
                      <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold">
                        {['Plot', 'Villa', 'Single Family', 'Condo', 'Loft'].map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-3">Area (SQFT)</label>
                      <input type="number" name="sqft" required value={formData.sqft} onChange={handleInputChange} className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none font-bold" />
                   </div>
                </div>
                <div className="mt-12 flex justify-end gap-4">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 text-slate-400 font-black uppercase text-xs">Cancel</button>
                   <button type="submit" className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-500/30">Commit Listing</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyList;
