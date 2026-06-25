import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { INITIAL_HOTELS } from './data';
import { Hotel, Booking, SearchCriteria, StayDuration } from './types';
import Header from './components/Header';
import Hero from './components/Hero';
import HotelCard from './components/HotelCard';
import HotelDetailModal from './components/HotelDetailModal';
import CheckoutScreen from './components/CheckoutScreen';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import FAQs from './components/FAQs';

// Helper to get formatted today date
const getTodayDateStr = () => {
  return new Date().toISOString().split('T')[0];
};

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'explore' | 'dashboard' | 'admin'>('explore');

  // Core Data State (with localStorage persistence)
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Search/Filter State
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    locality: 'All Localities',
    checkInDate: getTodayDateStr(),
    checkInTime: '12:00 PM',
    duration: 3
  });

  // Sidebar Filter Controls
  const [selectedStars, setSelectedStars] = useState<number[]>([]);
  const [onlyCoupleFriendly, setOnlyCoupleFriendly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState<'recommended' | 'low-high' | 'high-low' | 'rating'>('recommended');

  // Booking details flow
  const [detailHotel, setDetailHotel] = useState<Hotel | null>(null);
  const [checkoutHotel, setCheckoutHotel] = useState<Hotel | null>(null);
  const [isCheckoutActive, setIsCheckoutActive] = useState(false);
  const [newlyCreatedBooking, setNewlyCreatedBooking] = useState<Booking | null>(null);

  // Initialize and load from LocalStorage
  useEffect(() => {
    // Hotels
    const localHotels = localStorage.getItem('indore_hourly_hotels');
    if (localHotels) {
      setHotels(JSON.parse(localHotels));
    } else {
      setHotels(INITIAL_HOTELS);
      localStorage.setItem('indore_hourly_hotels', JSON.stringify(INITIAL_HOTELS));
    }

    // Bookings
    const localBookings = localStorage.getItem('indore_hourly_bookings');
    if (localBookings) {
      setBookings(JSON.parse(localBookings));
    } else {
      setBookings([]);
      localStorage.setItem('indore_hourly_bookings', JSON.stringify([]));
    }
  }, []);

  // Sync state functions back to local storage
  const handleAddHotel = (newHotel: Hotel) => {
    const updated = [newHotel, ...hotels];
    setHotels(updated);
    localStorage.setItem('indore_hourly_hotels', JSON.stringify(updated));
  };

  const handleUpdateHotelPrices = (id: string, prices: { 3: number, 6: number, 12: number }) => {
    const updated = hotels.map(h => h.id === id ? { ...h, prices } : h);
    setHotels(updated);
    localStorage.setItem('indore_hourly_hotels', JSON.stringify(updated));
  };

  const handleDeleteHotel = (id: string) => {
    if (confirm('Are you sure you want to remove this hotel partner from the Indore list?')) {
      const updated = hotels.filter(h => h.id !== id);
      setHotels(updated);
      localStorage.setItem('indore_hourly_hotels', JSON.stringify(updated));
    }
  };

  const handleCreateBooking = (newBooking: Booking) => {
    const updated = [newBooking, ...bookings];
    setBookings(updated);
    localStorage.setItem('indore_hourly_bookings', JSON.stringify(updated));
    setNewlyCreatedBooking(newBooking);
  };

  const handleCancelBooking = (id: string) => {
    const updated = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' as const } : b);
    setBookings(updated);
    localStorage.setItem('indore_hourly_bookings', JSON.stringify(updated));
  };

  // Trigger search from Hero search bar
  const handleSearchTrigger = (criteria: SearchCriteria) => {
    setSearchCriteria(criteria);
    setIsCheckoutActive(false);
    setCheckoutHotel(null);
    setNewlyCreatedBooking(null);
    
    // Smooth scroll down to hotel listing section
    const listSection = document.getElementById('listings-anchor');
    if (listSection) {
      listSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Start checkout sequence
  const handleInitiateCheckout = (hotel: Hotel, duration: StayDuration, date?: string, time?: string) => {
    setCheckoutHotel(hotel);
    setSearchCriteria(prev => ({
      ...prev,
      duration,
      checkInDate: date || prev.checkInDate,
      checkInTime: time || prev.checkInTime
    }));
    setDetailHotel(null);
    setIsCheckoutActive(true);
    setNewlyCreatedBooking(null);
  };

  // Filter & Sort Logic
  const filteredHotels = hotels
    .filter(hotel => {
      // 1. Filter by locality
      if (searchCriteria.locality !== 'All Localities') {
        if (hotel.locality.toLowerCase() !== searchCriteria.locality.toLowerCase()) return false;
      }
      // 2. Filter by stars
      if (selectedStars.length > 0) {
        if (!selectedStars.includes(hotel.stars)) return false;
      }
      // 3. Filter by couple friendly
      if (onlyCoupleFriendly && !hotel.isCoupleFriendly) return false;
      // 4. Filter by price range
      const priceForSelectedDuration = hotel.prices[searchCriteria.duration];
      if (priceForSelectedDuration > maxPrice) return false;

      return true;
    })
    .sort((a, b) => {
      const priceA = a.prices[searchCriteria.duration];
      const priceB = b.prices[searchCriteria.duration];

      if (sortBy === 'low-high') return priceA - priceB;
      if (sortBy === 'high-low') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // Default recommended (as is)
    });

  const toggleStarFilter = (star: number) => {
    setSelectedStars(prev => 
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between selection:bg-brand-light selection:text-white" id="main-app-shell">
      
      {/* Top Navigation */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsCheckoutActive(false);
          setNewlyCreatedBooking(null);
        }} 
        bookingCount={bookings.filter(b => b.status === 'confirmed').length} 
      />

      {/* Main Page Routing Wrapper */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {activeTab === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* Hero Banner with Search */}
              <Hero onSearch={handleSearchTrigger} initialCriteria={searchCriteria} />

              {/* Anchor point for search scroll */}
              <div id="listings-anchor" className="h-4" />

              {/* Booking Checkout Flow Overlay */}
              {isCheckoutActive && checkoutHotel ? (
                newlyCreatedBooking ? (
                  // Success Booking Screen
                  <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6" id="success-screen">
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20 shadow-sm animate-bounce">
                      <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-mono font-bold text-brand-medium uppercase tracking-widest">Reservation Secured</p>
                      <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-brand-bg tracking-tight">Voucher Confirmed!</h2>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto">
                        Your hourly room reservation at <strong className="text-gray-800 font-semibold">{checkoutHotel.name}</strong> is locked in. We have sent the confirmation voucher to your registered email.
                      </p>
                    </div>

                    {/* Booking metadata */}
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs text-left max-w-md mx-auto space-y-3.5 text-xs">
                      <div className="flex justify-between border-b border-gray-50 pb-2">
                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Booking ID</span>
                        <span className="font-mono font-bold text-brand-dark text-right">{newlyCreatedBooking.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-medium">Check-In Date</span>
                        <span className="font-mono font-bold text-gray-900">{newlyCreatedBooking.checkInDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-medium">Check-In Slot</span>
                        <span className="font-mono font-bold text-brand-medium">{newlyCreatedBooking.checkInTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 font-medium">Staying Duration</span>
                        <span className="font-mono font-bold text-brand-dark">{newlyCreatedBooking.duration} Hours Package</span>
                      </div>
                      <div className="flex justify-between border-t border-dashed border-gray-100 pt-3">
                        <span className="font-bold text-gray-900 text-sm">Amount Paid/Due:</span>
                        <span className="font-mono font-black text-brand-bg text-base">₹{newlyCreatedBooking.amountPaid}</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-3 max-w-sm mx-auto pt-2">
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className="w-full bg-brand-bg hover:bg-brand-dark text-white font-display font-bold py-3 px-4 rounded-xl text-xs shadow-md cursor-pointer"
                        id="view-success-booking-btn"
                      >
                        Go to My Bookings
                      </button>
                      <button
                        onClick={() => {
                          setIsCheckoutActive(false);
                          setCheckoutHotel(null);
                          setNewlyCreatedBooking(null);
                        }}
                        className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 font-display font-bold py-3 px-4 rounded-xl text-xs cursor-pointer"
                        id="keep-exploring-btn"
                      >
                        Keep Exploring
                      </button>
                    </div>
                  </div>
                ) : (
                  // Active checkout form
                  <CheckoutScreen
                    hotel={checkoutHotel}
                    duration={searchCriteria.duration}
                    checkInDate={searchCriteria.checkInDate}
                    checkInTime={searchCriteria.checkInTime}
                    onBack={() => setIsCheckoutActive(false)}
                    onSuccess={handleCreateBooking}
                  />
                )
              ) : (
                // Traditional Hotel Listings Explorer Screen
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Column: Sidebar Filters */}
                    <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-gray-100 shadow-3xs space-y-6">
                      <div className="border-b border-gray-50 pb-3 flex items-center justify-between">
                        <h4 className="font-display font-extrabold text-sm text-brand-bg uppercase tracking-wider">Refine Listings</h4>
                        <button 
                          onClick={() => {
                            setSelectedStars([]);
                            setOnlyCoupleFriendly(false);
                            setMaxPrice(3000);
                            setSortBy('recommended');
                          }}
                          className="text-[10px] font-bold text-gray-400 hover:text-rose-600 transition-colors"
                          id="clear-all-filters-btn"
                        >
                          Reset
                        </button>
                      </div>

                      {/* Sorting filter */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sort Rooms By</label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-700 outline-none cursor-pointer"
                          id="sort-selector"
                        >
                          <option value="recommended">⭐ Recommended Picks</option>
                          <option value="low-high">₹ Price: Low to High</option>
                          <option value="high-low">₹ Price: High to Low</option>
                          <option value="rating">★ Rating: Highest First</option>
                        </select>
                      </div>

                      {/* Star stars */}
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Star Classification</label>
                        <div className="space-y-1.5">
                          {[5, 4, 3, 2].map((star) => {
                            const isChecked = selectedStars.includes(star);
                            return (
                              <label key={star} className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer hover:text-brand-dark transition-colors">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleStarFilter(star)}
                                  className="w-4 h-4 accent-brand-medium rounded cursor-pointer"
                                />
                                <span>{star} Star Hotels</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      {/* Couple Friendly Toggle */}
                      <div className="space-y-2 pt-2 border-t border-gray-50">
                        <label className="flex items-center gap-2.5 text-xs font-semibold text-gray-700 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={onlyCoupleFriendly}
                            onChange={(e) => setOnlyCoupleFriendly(e.target.checked)}
                            className="w-4.5 h-4.5 accent-brand-medium rounded cursor-pointer"
                            id="couple-friendly-toggle-filter"
                          />
                          <span className="flex items-center gap-1">
                            <span>Only Couple Friendly</span>
                            <span className="text-[9px] bg-emerald-500 text-white font-mono px-1 rounded-sm uppercase">safe</span>
                          </span>
                        </label>
                      </div>

                      {/* Price Range Slider */}
                      <div className="space-y-2 pt-4 border-t border-gray-50">
                        <div className="flex justify-between items-baseline">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Max Hourly Rate</label>
                          <span className="text-xs font-mono font-bold text-brand-dark">₹{maxPrice}</span>
                        </div>
                        <input
                          type="range"
                          min="300"
                          max="3000"
                          step="50"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(Number(e.target.value))}
                          className="w-full h-1 bg-gray-200 accent-brand-medium rounded-lg cursor-pointer appearance-none"
                          id="price-range-slider"
                        />
                        <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                          <span>Min ₹300</span>
                          <span>Max ₹3,000</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Listings */}
                    <div className="lg:col-span-9 space-y-6">
                      
                      {/* Search metrics bar */}
                      <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-3xs">
                        <div>
                          <h3 className="font-display font-extrabold text-sm text-brand-bg tracking-tight uppercase">
                            {searchCriteria.locality === 'All Localities' 
                              ? 'Hourly Stays in Indore' 
                              : `${searchCriteria.locality} Hourly Stays`}
                          </h3>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Showing <strong className="text-brand-medium font-semibold">{filteredHotels.length} verified rooms</strong> for check-in on <strong className="text-gray-700 font-medium">{searchCriteria.checkInDate} ({searchCriteria.duration} hrs slot)</strong>.
                          </p>
                        </div>
                        
                        <div className="bg-gray-100/50 border border-gray-200 px-3 py-1.5 rounded-lg text-[10px] font-mono font-semibold text-gray-500">
                          Active Package: <span className="text-brand-dark font-extrabold">{searchCriteria.duration} Hours Stays</span>
                        </div>
                      </div>

                      {/* Grid lists */}
                      {filteredHotels.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 border border-gray-100 text-center space-y-4 shadow-3xs">
                          <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center mx-auto text-gray-400">
                            🔍
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-display font-bold text-gray-800 text-base">No Hotels Match Your Filters</h4>
                            <p className="text-xs text-gray-400 max-w-sm mx-auto">
                              No rooms meet all your specifications inside Indore limits. Try sliding the price filter or selecting another stay duration.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-6">
                          {filteredHotels.map((hotel) => (
                            <HotelCard
                              key={hotel.id}
                              hotel={hotel}
                              selectedDuration={searchCriteria.duration}
                              onBookNow={(h, d) => handleInitiateCheckout(h, d)}
                              onViewDetails={(h) => setDetailHotel(h)}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* Informative Frequently Asked Questions */}
              <FAQs />
            </motion.div>
          )}

          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <Dashboard bookings={bookings} onCancelBooking={handleCancelBooking} />
            </motion.div>
          )}

          {activeTab === 'admin' && (
            <motion.div
              key="admin"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <AdminPanel
                hotels={hotels}
                bookings={bookings}
                onAddHotel={handleAddHotel}
                onUpdateHotelPrices={handleUpdateHotelPrices}
                onDeleteHotel={handleDeleteHotel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Detail Sheet / Modal */}
      {detailHotel && (
        <HotelDetailModal
          hotel={detailHotel}
          isOpen={!!detailHotel}
          onClose={() => setDetailHotel(null)}
          onBookNow={handleInitiateCheckout}
          defaultDuration={searchCriteria.duration}
          defaultDate={searchCriteria.checkInDate}
          defaultTime={searchCriteria.checkInTime}
        />
      )}

      {/* Local Brand Tag Footer */}
      <footer className="bg-brand-bg text-gray-400 py-6 text-center text-[11px] border-t border-white/5 relative z-10">
        <p className="font-mono uppercase tracking-wider text-white text-shadow-sm flex items-center justify-center gap-1">
          <span>© 2026 revistay Indore City Limits</span>
          <span className="text-brand-light font-extrabold animate-pulse">●</span>
          <span>Madhya Pradesh Tourism Compliant</span>
        </p>
        <p className="mt-1 text-gray-500">
          This service represents a curated local franchise platform. Rates are customized and managed directly by Indore hotel operators.
        </p>
      </footer>

    </div>
  );
}
