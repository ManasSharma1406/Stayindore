import React, { useState } from 'react';
import { Hotel, Booking, StayDuration } from '../types';
import { LOCALITIES } from '../data';
import { ShieldCheck, Plus, ListFilter, IndianRupee, KeyRound, Building2, CheckCircle2, Sliders, Eye, Trash2, Heart } from 'lucide-react';

interface AdminPanelProps {
  hotels: Hotel[];
  bookings: Booking[];
  onAddHotel: (hotel: Hotel) => void;
  onUpdateHotelPrices: (id: string, prices: { 3: number, 6: number, 12: number }) => void;
  onDeleteHotel: (id: string) => void;
}

export default function AdminPanel({
  hotels,
  bookings,
  onAddHotel,
  onUpdateHotelPrices,
  onDeleteHotel
}: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'hotels' | 'bookings' | 'add'>('hotels');

  // New Hotel Form State
  const [name, setName] = useState('');
  const [locality, setLocality] = useState('Vijay Nagar');
  const [address, setAddress] = useState('');
  const [distance, setDistance] = useState('');
  const [stars, setStars] = useState(3);
  const [amenitiesInput, setAmenitiesInput] = useState('Air Conditioning, Free High-Speed WiFi, Couple Friendly, Smart TV, Geyser');
  const [price3h, setPrice3h] = useState(599);
  const [price6h, setPrice6h] = useState(999);
  const [price12h, setPrice12h] = useState(1499);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&q=80');

  // Prices editing state per hotel
  const [editPricesId, setEditPricesId] = useState<string | null>(null);
  const [editPrice3h, setEditPrice3h] = useState(0);
  const [editPrice6h, setEditPrice6h] = useState(0);
  const [editPrice12h, setEditPrice12h] = useState(0);

  const handleStartEditPrices = (hotel: Hotel) => {
    setEditPricesId(hotel.id);
    setEditPrice3h(hotel.prices[3]);
    setEditPrice6h(hotel.prices[6]);
    setEditPrice12h(hotel.prices[12]);
  };

  const handleSavePrices = (id: string) => {
    onUpdateHotelPrices(id, {
      3: editPrice3h,
      6: editPrice6h,
      12: editPrice12h
    });
    setEditPricesId(null);
  };

  const handleAddHotelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim() || !distance.trim()) return;

    const parsedAmenities = amenitiesInput
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const isCoupleFriendly = parsedAmenities.some(a => a.toLowerCase().includes('couple'));

    const newHotel: Hotel = {
      id: `h-admin-${Date.now()}`,
      name: name.trim(),
      rating: 4.5,
      reviewsCount: 1,
      locality,
      address: address.trim(),
      distance: distance.trim(),
      amenities: parsedAmenities,
      prices: {
        3: Number(price3h),
        6: Number(price6h),
        12: Number(price12h)
      },
      imageUrl: imageUrl.trim(),
      images: [imageUrl.trim(), 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80'],
      isCoupleFriendly,
      isPayAtHotel: true,
      stars: Number(stars)
    };

    onAddHotel(newHotel);
    
    // Clear forms
    setName('');
    setAddress('');
    setDistance('');
    setPrice3h(599);
    setPrice6h(999);
    setPrice12h(1499);
    setActiveSubTab('hotels');
  };

  // Calculate gross revenues
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const grossRevenue = confirmedBookings.reduce((sum, b) => sum + b.amountPaid, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 relative z-10" id="admin-view">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 border-b border-gray-100 pb-5">
        <div>
          <h2 className="text-2xl font-display font-bold text-brand-bg tracking-tight">
            Indore Partner Console
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Access hotel inventory, customize pricing, monitor real-time bookings, and review hotel performance metrics.
          </p>
        </div>

        {/* Local Mini-Stats Row */}
        <div className="flex flex-wrap gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-3xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-light/10 text-brand-dark flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Gross Bookings Revenue</p>
              <p className="text-base font-mono font-bold text-brand-bg">₹{grossRevenue}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-3xs flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-light/10 text-brand-dark flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Partners Enrolled</p>
              <p className="text-base font-mono font-bold text-brand-bg">{hotels.length} Stays</p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin inner Navigation */}
      <div className="flex gap-2 border-b border-gray-100 pb-4 mb-6">
        <button
          onClick={() => setActiveSubTab('hotels')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'hotels'
              ? 'bg-brand-bg text-white'
              : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
          }`}
          id="admin-subtab-hotels"
        >
          Manage Room Inventories
        </button>

        <button
          onClick={() => setActiveSubTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'bookings'
              ? 'bg-brand-bg text-white'
              : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
          }`}
          id="admin-subtab-bookings"
        >
          Local Reservations Queue ({bookings.length})
        </button>

        <button
          onClick={() => setActiveSubTab('add')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'add'
              ? 'bg-brand-bg text-white'
              : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
          }`}
          id="admin-subtab-add-hotel"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Indore Hotel</span>
        </button>
      </div>

      {/* Panel Body */}
      {activeSubTab === 'hotels' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-brand-bg flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-brand-medium" />
              <span>Modify Hourly Rates & Status</span>
            </h3>
            <span className="text-[10px] text-gray-400 font-bold font-mono uppercase">Indore City Limits list</span>
          </div>

          <div className="divide-y divide-gray-100 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="text-[10px] text-gray-400 uppercase tracking-wider font-bold bg-gray-50/20">
                  <th className="px-6 py-3.5">Hotel Info</th>
                  <th className="px-6 py-3.5">Locality</th>
                  <th className="px-6 py-3.5 font-mono text-center">3h Pack</th>
                  <th className="px-6 py-3.5 font-mono text-center">6h Pack</th>
                  <th className="px-6 py-3.5 font-mono text-center">12h Pack</th>
                  <th className="px-6 py-3.5 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {hotels.map((h) => (
                  <tr key={h.id} className="hover:bg-gray-50/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={h.imageUrl} 
                          alt={h.name} 
                          className="w-12 h-9 object-cover rounded-md border border-gray-100"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{h.name}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{h.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-brand-dark">{h.locality}</td>
                    
                    {editPricesId === h.id ? (
                      <>
                        <td className="px-4 py-4 text-center">
                          <input
                            type="number"
                            value={editPrice3h}
                            onChange={(e) => setEditPrice3h(Number(e.target.value))}
                            className="w-16 bg-gray-50 border border-gray-200 rounded-md px-1.5 py-1 text-center text-xs font-mono font-bold"
                          />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <input
                            type="number"
                            value={editPrice6h}
                            onChange={(e) => setEditPrice6h(Number(e.target.value))}
                            className="w-16 bg-gray-50 border border-gray-200 rounded-md px-1.5 py-1 text-center text-xs font-mono font-bold"
                          />
                        </td>
                        <td className="px-4 py-4 text-center">
                          <input
                            type="number"
                            value={editPrice12h}
                            onChange={(e) => setEditPrice12h(Number(e.target.value))}
                            className="w-16 bg-gray-50 border border-gray-200 rounded-md px-1.5 py-1 text-center text-xs font-mono font-bold"
                          />
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-1.5">
                            <button
                              onClick={() => handleSavePrices(h.id)}
                              className="px-2.5 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-[10px] hover:bg-emerald-700 cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditPricesId(null)}
                              className="px-2.5 py-1.5 bg-gray-200 text-gray-600 font-bold rounded-lg text-[10px] hover:bg-gray-300 cursor-pointer"
                            >
                              Exit
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-center font-mono font-semibold text-gray-800">₹{h.prices[3]}</td>
                        <td className="px-6 py-4 text-center font-mono font-semibold text-gray-800">₹{h.prices[6]}</td>
                        <td className="px-6 py-4 text-center font-mono font-semibold text-gray-800">₹{h.prices[12]}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleStartEditPrices(h)}
                              className="px-2.5 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-[10px] font-bold hover:bg-brand-bg hover:text-white transition-all cursor-pointer"
                              id={`edit-price-btn-${h.id}`}
                            >
                              Edit Price
                            </button>
                            <button
                              onClick={() => onDeleteHotel(h.id)}
                              className="p-1.5 bg-gray-50 hover:bg-rose-50 text-rose-500 hover:text-rose-700 rounded-lg transition-all cursor-pointer"
                              id={`delete-hotel-btn-${h.id}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-brand-bg flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-brand-medium" />
              <span>Real-Time Check-In Desk Activity</span>
            </h3>
            <span className="text-[10px] text-gray-400 font-bold font-mono uppercase">Reservation Log</span>
          </div>

          {bookings.length === 0 ? (
            <div className="p-12 text-center text-gray-400 italic">No guests have booked hourly rooms yet on this session.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="text-[10px] text-gray-400 uppercase tracking-wider font-bold bg-gray-50/20">
                    <th className="px-6 py-3.5">Guest & Contact</th>
                    <th className="px-6 py-3.5">Hotel Booked</th>
                    <th className="px-6 py-3.5 font-mono">Date & Slot</th>
                    <th className="px-6 py-3.5 font-mono text-center">Hours</th>
                    <th className="px-6 py-3.5 font-mono text-right">Paid Amount</th>
                    <th className="px-6 py-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/30">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-bold text-gray-900">{b.guestName}</p>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">📱 {b.guestPhone} • {b.guestEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-700">{b.hotelName}</p>
                          <p className="text-[10px] text-brand-dark uppercase tracking-wide font-medium">📍 {b.locality}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-mono">
                        <p>{b.checkInDate}</p>
                        <p className="text-brand-medium font-bold">{b.checkInTime} to {b.checkOutTime}</p>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-gray-700">{b.duration}h</td>
                      <td className="px-6 py-4 text-right font-mono font-bold text-brand-dark">₹{b.amountPaid}</td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                          b.status === 'confirmed' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'add' && (
        <form onSubmit={handleAddHotelSubmit} className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8 shadow-xs max-w-3xl mx-auto space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="font-display font-bold text-lg text-brand-bg flex items-center gap-1.5">
              <Building2 className="w-5 h-5 text-brand-medium" />
              <span>Enroll New Indore Partner Hotel</span>
            </h3>
            <p className="text-xs text-gray-400 mt-1">Please provide accurate hotel address details, hourly prices, and room image links.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Hotel Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Hotel Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Radisson Blu Indore"
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl px-3 py-2 text-xs"
                id="admin-add-name"
              />
            </div>

            {/* Locality Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Locality Area</label>
              <select
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl px-3 py-2 text-xs"
                id="admin-add-locality"
              >
                {LOCALITIES.filter(l => l !== 'All Localities').map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Postal Address</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 12, Ring Road, Scheme 54, Vijay Nagar, Indore"
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl px-3 py-2 text-xs"
                id="admin-add-address"
              />
            </div>

            {/* Distance */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Local Landmark/Distance</label>
              <input
                type="text"
                required
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 0.4 km from C21 Mall"
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl px-3 py-2 text-xs"
                id="admin-add-distance"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* 3h Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 font-mono">3h Pack Price (₹)</label>
              <input
                type="number"
                required
                value={price3h}
                onChange={(e) => setPrice3h(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl px-3 py-2 text-xs font-mono font-bold"
                id="admin-add-p3"
              />
            </div>

            {/* 6h Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 font-mono">6h Pack Price (₹)</label>
              <input
                type="number"
                required
                value={price6h}
                onChange={(e) => setPrice6h(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl px-3 py-2 text-xs font-mono font-bold"
                id="admin-add-p6"
              />
            </div>

            {/* 12h Price */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 font-mono">12h Pack Price (₹)</label>
              <input
                type="number"
                required
                value={price12h}
                onChange={(e) => setPrice12h(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl px-3 py-2 text-xs font-mono font-bold"
                id="admin-add-p12"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Image selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Room Image Link</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Unsplash / external secure URL"
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl px-3 py-2 text-xs font-mono"
                id="admin-add-image"
              />
            </div>

            {/* Stars selection */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Hotel Star Rating</label>
              <select
                value={stars}
                onChange={(e) => setStars(Number(e.target.value))}
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl px-3 py-2 text-xs"
                id="admin-add-stars"
              >
                <option value="2">2 Stars Economical</option>
                <option value="3">3 Stars Comfort</option>
                <option value="4">4 Stars Premium Executive</option>
                <option value="5">5 Stars Elite Luxury</option>
              </select>
            </div>
          </div>

          {/* Amenities input list */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Amenities (Comma separated)</label>
            <input
              type="text"
              required
              value={amenitiesInput}
              onChange={(e) => setAmenitiesInput(e.target.value)}
              placeholder="e.g. Air Conditioning, Free High-Speed WiFi, Couple Friendly, Smart TV"
              className="w-full bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl px-3 py-2 text-xs"
              id="admin-add-amenities"
            />
            <p className="text-[10px] text-gray-400 mt-1">💡 Keep 'Couple Friendly' in the list to automatically qualify for the verified Couple Friendly green badge.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-medium hover:bg-brand-dark text-white font-display font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all text-xs cursor-pointer"
            id="admin-add-submit"
          >
            Enroll Partner Hotel
          </button>
        </form>
      )}

    </div>
  );
}
