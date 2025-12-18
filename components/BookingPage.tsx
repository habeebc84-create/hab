
import React, { useState } from 'react';
import { Property } from '../types';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, ArrowLeft, CheckCircle, ShieldCheck, MapPin, IndianRupee, FileText, PenTool, Printer } from 'lucide-react';

interface BookingPageProps {
  property: Property | null;
  onBack: () => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ property, onBack }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '10:00',
    notes: '',
    termsAccepted: false
  });

  if (!property) return null;

  const formatINR = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setIsSuccess(true);
    }, 1000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center animate-fade-in glass-panel rounded-3xl p-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-blue-500/10" />
        <div className="relative z-10 text-center space-y-6 max-w-lg">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-xl shadow-green-500/30">
             <CheckCircle className="text-green-600 w-12 h-12" />
          </div>
          <h2 className="glass-header-3d text-3xl font-black text-slate-900">Booking Confirmed</h2>
          <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-sm">
             <p className="text-slate-600 font-medium mb-2">Reservation Reference: <span className="font-mono font-bold text-slate-900">#{Math.floor(Math.random() * 1000000)}</span></p>
             <p className="text-sm text-slate-500">
               A confirmation email has been sent to <strong>{formData.email}</strong>. 
               Our agent will contact you at <strong>{formData.phone}</strong> within 2 hours to finalize the visit to <strong>{property.address}</strong>.
             </p>
          </div>
          <button 
            onClick={onBack}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-0.5"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 bg-white/40 hover:bg-white/60 rounded-full text-slate-700 transition-colors backdrop-blur-sm"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="glass-header-3d text-xl font-bold">Official Booking Application</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="glass-panel p-4 rounded-2xl overflow-hidden relative group">
              <div className="h-48 rounded-xl overflow-hidden mb-4 relative">
                <img src={property.imageUrl} alt={property.address} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 left-3 px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full shadow-lg">
                   {property.status}
                </div>
              </div>
              
              <h3 className="glass-header-3d text-xl font-black text-slate-800 mb-1 w-full bg-white/60">{formatINR(property.price)}</h3>
              <div className="flex items-start gap-2 text-slate-600 my-4 pl-2">
                 <MapPin size={16} className="mt-1 shrink-0" />
                 <p className="font-medium text-sm">{property.address}, {property.city}</p>
              </div>

              <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-200/50">
                  <div className="text-center">
                    <span className="block font-bold text-slate-800">{property.bedrooms}</span>
                    <span className="text-[10px] uppercase text-slate-500 font-bold">Beds</span>
                  </div>
                  <div className="text-center border-l border-r border-slate-200/50">
                    <span className="block font-bold text-slate-800">{property.bathrooms}</span>
                    <span className="text-[10px] uppercase text-slate-500 font-bold">Baths</span>
                  </div>
                  <div className="text-center">
                    <span className="block font-bold text-slate-800">{property.sqft}</span>
                    <span className="text-[10px] uppercase text-slate-500 font-bold">Sqft</span>
                  </div>
              </div>
           </div>

           <div className="glass-panel p-6 rounded-2xl bg-blue-900/5 border-blue-200/30">
              <div className="flex items-center gap-3 mb-4">
                 <ShieldCheck className="text-blue-600" size={24} />
                 <div>
                    <h4 className="font-bold text-slate-800">Verified Listing</h4>
                    <p className="text-xs text-slate-500">Document ID: EST-{property.id}-2024</p>
                 </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                 This property has been vetted by EstateMind AI for legal compliance and accurate pricing. 
                 By booking, you agree to our standard visitation protocols.
              </p>
           </div>
        </div>

        <div className="lg:col-span-2">
           <div className="glass-panel p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl relative">
              <div className="absolute top-8 right-8 opacity-10 pointer-events-none">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Infobox_info_icon.svg/1200px-Infobox_info_icon.svg.png" className="w-32 h-32 grayscale" alt="watermark" />
              </div>

              <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-200/60">
                 <div className="p-3 bg-slate-900 text-white rounded-lg shadow-lg">
                    <FileText size={24} />
                 </div>
                 <div>
                    <h3 className="glass-header-3d text-xl font-bold">Viewing Request Form</h3>
                    <p className="text-sm text-slate-500 mt-2 ml-1">Please complete all required fields below</p>
                 </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="space-y-4">
                    <h4 className="glass-header-3d text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <User size={12} /> Applicant Information
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700">First Name <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="firstName" 
                            required 
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="e.g. John"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700">Last Name <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            name="lastName" 
                            required 
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="e.g. Doe"
                          />
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700">Email Address <span className="text-red-500">*</span></label>
                          <div className="relative">
                             <Mail className="absolute left-3 top-3.5 text-slate-400" size={18} />
                             <input 
                                type="email" 
                                name="email" 
                                required 
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="john@company.com"
                             />
                          </div>
                       </div>
                       <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700">Phone Number <span className="text-red-500">*</span></label>
                          <div className="relative">
                             <Phone className="absolute left-3 top-3.5 text-slate-400" size={18} />
                             <input 
                                type="tel" 
                                name="phone" 
                                required 
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="+91 98765 43210"
                             />
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-4 space-y-4 border-t border-slate-200/60">
                    <h4 className="glass-header-3d text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Calendar size={12} /> Appointment Details
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                       <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700">Preferred Date <span className="text-red-500">*</span></label>
                          <input 
                            type="date" 
                            name="date" 
                            required 
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-600"
                          />
                       </div>
                       <div className="space-y-1">
                          <label className="text-sm font-semibold text-slate-700">Preferred Time <span className="text-red-500">*</span></label>
                          <div className="relative">
                             <Clock className="absolute left-3 top-3.5 text-slate-400" size={18} />
                             <input 
                                type="time" 
                                name="time" 
                                required 
                                value={formData.time}
                                onChange={handleInputChange}
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-600"
                             />
                          </div>
                       </div>
                    </div>
                    <div className="space-y-1">
                       <label className="text-sm font-semibold text-slate-700">Special Requests / Notes</label>
                       <textarea 
                          name="notes"
                          rows={3}
                          value={formData.notes}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl bg-white/50 border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="I am interested in the mortgage options as well..."
                       />
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-200/60">
                    <label className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-white transition-colors">
                       <input 
                         type="checkbox" 
                         name="termsAccepted"
                         checked={formData.termsAccepted}
                         onChange={(e) => setFormData(prev => ({...prev, termsAccepted: e.target.checked}))}
                         className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                         required
                       />
                       <span className="text-xs text-slate-600">
                          I agree to the <strong>Terms of Service</strong> and <strong>Privacy Policy</strong>. 
                          I understand that this booking is subject to confirmation by the agent. 
                          <br/><span className="text-slate-400 italic">By clicking confirm, you are digitally signing this request.</span>
                       </span>
                    </label>
                 </div>

                 <div className="flex items-center justify-between pt-2">
                    <button type="button" onClick={onBack} className="text-slate-500 font-semibold hover:text-slate-800 transition-colors">
                       Cancel Request
                    </button>
                    <button 
                      type="submit" 
                      disabled={!formData.termsAccepted}
                      className="px-8 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                       <PenTool size={18} /> Confirm Official Reservation
                    </button>
                 </div>
              </form>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
