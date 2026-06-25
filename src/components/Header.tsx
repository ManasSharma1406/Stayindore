import { useState } from 'react';
import { Clock, User, Building2, Phone, ShieldCheck, LayoutDashboard, Sparkles, MapPin } from 'lucide-react';

interface HeaderProps {
  activeTab: 'explore' | 'dashboard' | 'admin';
  setActiveTab: (tab: 'explore' | 'dashboard' | 'admin') => void;
  bookingCount: number;
}

export default function Header({ activeTab, setActiveTab, bookingCount }: HeaderProps) {
  const [showPromoAlert, setShowPromoAlert] = useState(true);

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-xs border-b border-gray-100">
      {/* Promo banner strip */}
      {showPromoAlert && (
        <div className="bg-brand-bg text-white text-[10px] sm:text-xs py-1.5 pl-4 pr-8 sm:px-4 text-center relative flex flex-wrap items-center justify-center gap-1.5">
          <span className="inline-flex items-center gap-1 font-medium text-brand-light">
            <Sparkles className="w-3 h-3 animate-pulse" /> Local Special:
          </span>
          <span>Use coupon <strong className="text-brand-light font-semibold">INDORE20</strong> for flat 20% off on all hourly bookings today!</span>
          <button 
            onClick={() => setShowPromoAlert(false)} 
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 hover:text-brand-light transition-colors text-gray-400 text-base font-bold cursor-pointer"
            id="close-promo-btn"
          >
            ×
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand logo & location badge */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div 
            onClick={() => setActiveTab('explore')} 
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group"
            id="logo-brand"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-brand-bg flex items-center justify-center border border-brand-dark/40 group-hover:scale-105 transition-all">
              <Clock className="w-4.5 h-4.5 sm:w-5.5 sm:h-5.5 text-brand-light" />
            </div>
            <div>
              <div className="flex items-center gap-0.5 sm:gap-1">
                <span className="font-display font-bold text-sm sm:text-lg text-brand-bg tracking-tight">revistay</span>
                <span className="font-display font-extrabold text-sm sm:text-lg text-brand-light tracking-tight">Indore</span>
              </div>
              <p className="text-[8px] sm:text-[10px] font-mono tracking-wider text-brand-medium/90 uppercase logo-text-subtitle">Hourly Hotel Engine</p>
            </div>
          </div>

          {/* Indore ONLY Badge */}
          <div className="hidden md:flex items-center gap-1.5 bg-brand-light/10 border border-brand-light/30 px-2.5 py-1 rounded-full text-[11px] font-medium text-brand-dark">
            <MapPin className="w-3.5 h-3.5 text-brand-medium" />
            <span>Indore City Limits Only</span>
          </div>
        </div>

        {/* Right: Actions and Local Helpline */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-5">
          {/* Helpline */}
          <a 
            href="tel:+917314000888" 
            className="hidden lg:flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-brand-medium transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-brand-dark">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 uppercase font-mono">Indore Helpdesk</p>
              <p className="text-gray-700 font-mono">+91 731-4000888</p>
            </div>
          </a>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
            {/* Explore Button */}
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
                activeTab === 'explore'
                  ? 'bg-white text-brand-bg shadow-2xs font-semibold border border-gray-200/50'
                  : 'text-gray-500 hover:text-brand-dark hover:bg-gray-100/50'
              }`}
              id="nav-explore-btn"
            >
              <Building2 className="w-3.5 h-3.5 text-brand-medium" />
              <span className="nav-btn-text">Explore<span className="hidden sm:inline"> Stays</span></span>
            </button>

            {/* Dashboard Button */}
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 rounded-lg text-[10px] sm:text-xs font-medium transition-all relative ${
                activeTab === 'dashboard'
                  ? 'bg-white text-brand-bg shadow-2xs font-semibold border border-gray-200/50'
                  : 'text-gray-500 hover:text-brand-dark hover:bg-gray-100/50'
              }`}
              id="nav-dashboard-btn"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-brand-medium" />
              <span className="nav-btn-text">Bookings</span>
              {bookingCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-light text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white animate-bounce">
                  {bookingCount}
                </span>
              )}
            </button>

            {/* Admin Panel Button */}
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1.5 sm:px-3 rounded-lg text-[10px] sm:text-xs font-medium transition-all ${
                activeTab === 'admin'
                  ? 'bg-brand-bg text-white shadow-2xs font-semibold'
                  : 'text-gray-500 hover:text-brand-dark hover:bg-gray-100/50'
              }`}
              id="nav-admin-btn"
            >
              <User className="w-3.5 h-3.5 sm:text-brand-light text-gray-500" />
              <span className="nav-btn-text">Partner<span className="hidden sm:inline"> Desk</span></span>
            </button>
          </div>

          {/* Safety disclaimer */}
          <div className="hidden md:flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs border border-emerald-100 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Couple Safe</span>
          </div>
        </div>
      </div>
    </header>
  );
}
