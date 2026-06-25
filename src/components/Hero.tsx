import { useState } from 'react';
import { LOCALITIES } from '../data';
import { StayDuration, SearchCriteria } from '../types';
import { Search, Calendar, Clock, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onSearch: (criteria: SearchCriteria) => void;
  initialCriteria: SearchCriteria;
}

export default function Hero({ onSearch, initialCriteria }: HeroProps) {
  const [locality, setLocality] = useState(initialCriteria.locality || 'All Localities');
  const [checkInDate, setCheckInDate] = useState(initialCriteria.checkInDate);
  const [checkInTime, setCheckInTime] = useState(initialCriteria.checkInTime);
  const [duration, setDuration] = useState<StayDuration>(initialCriteria.duration);

  const timeSlots = [
    '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', 
    '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM'
  ];

  const handleSearchClick = () => {
    onSearch({
      locality,
      checkInDate,
      checkInTime,
      duration
    });
  };

  return (
    <section className="relative overflow-hidden bg-brand-bg text-white py-12 md:py-20 px-4 sm:px-6 lg:px-8">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#39542c15_1px,transparent_1px),linear-gradient(to_bottom,#39542c15_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-brand-light/10 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and Local Badges */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-brand-light/10 border border-brand-light/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-light">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Indore's First Smart Hourly Booking Service</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight leading-[1.1] text-white">
              <span className="text-brand-light text-shadow-sm">Hourly Hotels</span> in Indore
            </h1>
            
            <p className="text-gray-300 text-sm sm:text-base max-w-lg leading-relaxed">
              Book stylish rooms in premium Indore hotels for <strong className="text-white font-semibold">3, 6, or 12 Hours</strong> packs. Choose your custom check-in slot anytime. Completely couple-friendly with local ID verification accepted!
            </p>

            {/* Quick local benefit checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-gray-200">
                <CheckCircle2 className="w-4.5 h-4.5 text-brand-light flex-shrink-0" />
                <span>Indore Local ID Accepted (Aadhaar/DL)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-200">
                <CheckCircle2 className="w-4.5 h-4.5 text-brand-light flex-shrink-0" />
                <span>No Judgment • Fully Couple Safe</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-200">
                <CheckCircle2 className="w-4.5 h-4.5 text-brand-light flex-shrink-0" />
                <span>Pay at Hotel Option Available</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-gray-200">
                <CheckCircle2 className="w-4.5 h-4.5 text-brand-light flex-shrink-0" />
                <span>Instant confirmation in 2 minutes</span>
              </div>
            </div>
          </div>

          {/* Right Column: Search Widget Box */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-5 sm:p-7 text-gray-800 shadow-2xl border border-white/15 relative">
            <div className="absolute -top-3 right-6 bg-brand-light text-brand-bg text-[10px] font-bold font-mono tracking-wider px-3 py-1 rounded-full uppercase shadow-md">
              Save up to 60%
            </div>
            
            <h3 className="font-display font-bold text-lg text-brand-bg mb-5 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Clock className="w-5 h-5 text-brand-medium" />
              <span>Find Indore Hourly Rooms</span>
            </h3>

            <div className="space-y-4">
              
              {/* Locality Selector */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-medium" />
                  <span>Select Locality / Area in Indore</span>
                </label>
                <select
                  value={locality}
                  onChange={(e) => setLocality(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 hover:border-brand-medium focus:border-brand-medium rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-700 outline-none transition-all cursor-pointer"
                  id="search-locality"
                >
                  {LOCALITIES.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc === 'All Localities' ? '📍 Search Across Indore City Limits' : `🏨 ${loc}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time Slot Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Date */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-brand-medium" />
                    <span>Check-in Date</span>
                  </label>
                  <input
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-50 border border-gray-200 hover:border-brand-medium focus:border-brand-medium rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-700 outline-none transition-all cursor-pointer"
                    id="search-date"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-brand-medium" />
                    <span>Check-in Time</span>
                  </label>
                  <select
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 hover:border-brand-medium focus:border-brand-medium rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-700 outline-none transition-all cursor-pointer"
                    id="search-time"
                  >
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Hourly stay selection buttons */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Choose Staying Duration Pack
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([3, 6, 12] as StayDuration[]).map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => setDuration(hours)}
                      className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        duration === hours
                          ? 'border-brand-medium bg-brand-light/10 text-brand-dark shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50/50 text-gray-600'
                      }`}
                      id={`duration-btn-${hours}h`}
                    >
                      <span className="text-sm font-mono">{hours} Hrs</span>
                      <span className="text-[9px] text-gray-400 font-normal uppercase">Package</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit search button */}
              <button
                type="button"
                onClick={handleSearchClick}
                className="w-full bg-brand-light hover:bg-brand-medium text-white font-display font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer"
                id="search-submit-btn"
              >
                <Search className="w-4 h-4" />
                <span>Search Local Hourly Hotels</span>
              </button>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
