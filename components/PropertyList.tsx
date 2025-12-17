
import React from 'react';
import { MapPin, BedDouble, Bath, Square, Tag, User, Phone } from 'lucide-react';
import { MOCK_PROPERTIES } from '../constants';

const PropertyList: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Property Listings</h2>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          Add New Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROPERTIES.map((property) => (
          <div key={property.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
            <div className="relative h-48 overflow-hidden">
              <img 
                src={property.imageUrl} 
                alt={property.address} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-slate-800 shadow-sm">
                ${property.price.toLocaleString()}
              </div>
              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm ${
                property.status === 'For Sale' ? 'bg-green-500' :
                property.status === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {property.status}
              </div>
            </div>
            
            <div className="p-5">
              <div className="flex items-start gap-2 mb-3">
                <MapPin size={16} className="text-slate-400 mt-1 flex-shrink-0" />
                <h3 className="font-semibold text-slate-800 line-clamp-1">{property.address}</h3>
              </div>

              <div className="grid grid-cols-3 gap-2 py-4 border-t border-b border-slate-100">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <BedDouble size={16} />
                    <span className="font-semibold text-slate-700">{property.bedrooms}</span>
                  </div>
                  <span className="text-xs text-slate-400 mt-1">Beds</span>
                </div>
                <div className="flex flex-col items-center border-l border-r border-slate-100">
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <Bath size={16} />
                    <span className="font-semibold text-slate-700">{property.bathrooms}</span>
                  </div>
                  <span className="text-xs text-slate-400 mt-1">Baths</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-slate-500 text-sm">
                    <Square size={16} />
                    <span className="font-semibold text-slate-700">{property.sqft}</span>
                  </div>
                  <span className="text-xs text-slate-400 mt-1">Sqft</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-lg space-y-2 border border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <User size={14} className="text-slate-400" />
                  <span className="font-medium text-slate-500 uppercase tracking-wide">Owner:</span>
                  <span className="font-semibold text-slate-700">{property.ownerName}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Phone size={14} className="text-slate-400" />
                  <span className="font-medium text-slate-500 uppercase tracking-wide">Contact:</span>
                  <span className="font-mono text-slate-700">{property.ownerContact}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                  <Tag size={12} />
                  {property.type}
                </span>
                <span className="text-xs text-slate-400">Listed: {property.listedDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyList;
