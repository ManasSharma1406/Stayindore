import React, { useState } from 'react';
import { Hotel, StayDuration } from '../types';
import { Star, MapPin, ShieldCheck, Wifi, Tv, Coffee, Utensils, Heart, CheckCircle2 } from 'lucide-react';

interface HotelCardProps {
  key?: any;
  hotel: Hotel;
  selectedDuration: StayDuration;
  onBookNow: (hotel: Hotel, duration: StayDuration) => void;
  onViewDetails: (hotel: Hotel) => void;
}

export default function HotelCard({ hotel, selectedDuration, onBookNow, onViewDetails }: HotelCardProps) {
  const [activeDuration, setActiveDuration] = useState<StayDuration>(selectedDuration);
  const [isLiked, setIsLiked] = useState(false);

  // Helper to map amenity strings to clean React icons
  const renderAmenityIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('wifi')) return <Wifi className="w-3.5 h-3.5" />;
    if (n.includes('tv')) return <Tv className="w-3.5 h-3.5" />;
    if (n.includes('coffee') || n.includes('tea')) return <Coffee className="w-3.5 h-3.5" />;
    if (n.includes('room service') || n.includes('snack') || n.includes('breakfast')) return <Utensils className="w-3.5 h-3.5" />;
    return <CheckCircle2 className="w-3.5 h-3.5" />;
  };

  const currentPrice = hotel.prices[activeDuration];
  // Calculate a mock original full-day-equivalent price to show the massive hourly saving (approx 2.5x standard price)
  const originalPrice = Math.round(currentPrice * 1.6);

  return (
    <div 
      className="bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-brand-light/30 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row group h-full"
      id={`hotel-card-${hotel.id}`}
    >
      {/* Hotel Image with Badges */}
      <div className="relative w-full md:w-80 h-56 md:h-auto overflow-hidden flex-shrink-0">
        <img
          src={hotel.imageUrl}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        
        {/* Heart/Favorite Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md hover:bg-white transition-colors cursor-pointer"
          id={`fav-btn-${hotel.id}`}
        >
          <Heart className={`w-4.5 h-4.5 transition-all ${isLiked ? 'text-rose-500 fill-rose-500 scale-110' : 'text-gray-500'}`} />
        </button>

        {/* Top-Left badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5">
          {hotel.isCoupleFriendly && (
            <span className="bg-emerald-500 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Couple Friendly</span>
            </span>
          )}
          {hotel.stars >= 4 && (
            <span className="bg-amber-500 text-white font-mono text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-xs">
              ★ {hotel.stars} Star Stay
            </span>
          )}
        </div>

        {/* Distance summary strip at bottom of image on mobile */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2.5 py-1 rounded-md flex items-center gap-1.5">
          <MapPin className="w-3 h-3 text-brand-light" />
          <span className="truncate">{hotel.distance}</span>
        </div>
      </div>

      {/* Hotel Content Details */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          
          {/* Header row: Locality & Rating */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-brand-medium bg-brand-light/10 border border-brand-light/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
              📍 {hotel.locality}
            </span>
            <div className="flex items-center gap-1 text-xs">
              <span className="bg-amber-500 text-white font-bold font-mono px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-white text-white" />
                <span>{hotel.rating}</span>
              </span>
              <span className="text-gray-400 font-medium">({hotel.reviewsCount} local reviews)</span>
            </div>
          </div>

          {/* Hotel Name */}
          <h4 
            onClick={() => onViewDetails(hotel)} 
            className="text-base sm:text-lg font-display font-bold text-gray-900 hover:text-brand-medium transition-colors cursor-pointer tracking-tight"
          >
            {hotel.name}
          </h4>

          {/* Full address details */}
          <p className="text-xs text-gray-500 line-clamp-1">
            {hotel.address}
          </p>

          {/* Amenities selection bar */}
          <div className="flex flex-wrap gap-1.5 py-1">
            {hotel.amenities.slice(0, 4).map((amenity, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center gap-1 bg-gray-50 text-gray-600 border border-gray-100 rounded-lg px-2 py-1 text-[10px] font-medium"
              >
                {renderAmenityIcon(amenity)}
                <span>{amenity}</span>
              </span>
            ))}
            {hotel.amenities.length > 4 && (
              <span className="text-[9px] text-brand-medium font-semibold self-center px-1">
                +{hotel.amenities.length - 4} more
              </span>
            )}
          </div>

          {/* Stay Duration Picker INSIDE the Card */}
          <div className="bg-gray-50 border border-gray-100 p-1.5 rounded-xl flex items-center justify-between gap-1.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-1">Packages:</span>
            <div className="flex gap-1">
              {([3, 6, 12] as StayDuration[]).map((hours) => (
                <button
                  key={hours}
                  type="button"
                  onClick={() => setActiveDuration(hours)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold font-mono transition-all cursor-pointer ${
                    activeDuration === hours
                      ? 'bg-brand-bg text-white shadow-xs'
                      : 'text-gray-500 hover:text-brand-dark hover:bg-gray-200/50'
                  }`}
                  id={`card-duration-${hotel.id}-${hours}h`}
                >
                  {hours}h
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer row: Pricing & Dynamic CTAs */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-end justify-between">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-mono tracking-wider">
              {activeDuration} Hours stay rates
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-mono font-bold text-brand-dark">₹{currentPrice}</span>
              <span className="text-xs font-mono text-gray-400 line-through">₹{originalPrice}</span>
              <span className="text-[10px] bg-brand-light/10 text-brand-dark font-bold font-mono px-1 py-0.2 rounded-md">
                -{Math.round(((originalPrice - currentPrice) / originalPrice) * 100)}%
              </span>
            </div>
            <p className="text-[9px] text-brand-medium font-semibold flex items-center gap-1 mt-0.5">
              <span>✔ Includes complimentary local taxes</span>
            </p>
          </div>

          {/* Quick buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onViewDetails(hotel)}
              className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-200 transition-all cursor-pointer"
              id={`detail-btn-${hotel.id}`}
            >
              Info
            </button>
            <button
              onClick={() => onBookNow(hotel, activeDuration)}
              className="px-4 py-2 bg-brand-light hover:bg-brand-medium text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer"
              id={`book-btn-${hotel.id}`}
            >
              Book Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
