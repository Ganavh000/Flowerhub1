
import React from 'react';
import { Garland } from '../types';

interface GarlandCardProps {
  garland: Garland;
  isSelected: boolean;
  onSelect: (garland: Garland) => void;
}

const GarlandCard: React.FC<GarlandCardProps> = ({ garland, isSelected, onSelect }) => {
  return (
    <div 
      onClick={() => onSelect(garland)}
      className={`relative group cursor-pointer transition-all duration-500 rounded-2xl overflow-hidden border-2 ${
        isSelected ? 'border-[#B76E79] scale-[1.02]' : 'border-transparent'
      }`}
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img 
          src={garland.imageUrl} 
          alt={garland.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="p-4 bg-white">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-serif text-lg text-[#2D2D2D]">{garland.name}</h3>
          <span className="text-xs font-bold text-[#B76E79]">${garland.price}</span>
        </div>
        <p className="text-xs text-[#2D2D2D]/60 leading-relaxed mb-3">{garland.description}</p>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 bg-[#F5F5F4] text-[10px] font-bold text-[#2D2D2D]/40 rounded uppercase tracking-tighter">
            {garland.type}
          </span>
        </div>
      </div>
      {isSelected && (
        <div className="absolute top-4 right-4 bg-[#B76E79] text-white p-1.5 rounded-full shadow-lg">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default GarlandCard;
