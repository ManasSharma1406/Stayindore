import React, { useState, useEffect } from 'react';
import { Hotel, Review, StayDuration } from '../types';
import { INITIAL_REVIEWS } from '../data';
import { X, Star, MapPin, ShieldCheck, Heart, Sparkles, MessageSquare, Plus, CheckCircle2 } from 'lucide-react';

interface HotelDetailModalProps {
  hotel: Hotel;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: (hotel: Hotel, duration: StayDuration, date: string, time: string) => void;
  defaultDuration: StayDuration;
  defaultDate: string;
  defaultTime: string;
}

export default function HotelDetailModal({ 
  hotel, 
  isOpen, 
  onClose, 
  onBookNow,
  defaultDuration,
  defaultDate,
  defaultTime
}: HotelDetailModalProps) {
  const [selectedDuration, setSelectedDuration] = useState<StayDuration>(defaultDuration);
  const [bookingDate, setBookingDate] = useState(defaultDate);
  const [bookingTime, setBookingTime] = useState(defaultTime);
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReviewer, setNewReviewer] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    // Load reviews matching this hotel
    const local = localStorage.getItem(`reviews_hotel_${hotel.id}`);
    if (local) {
      setReviews(JSON.parse(local));
    } else {
      const filtered = INITIAL_REVIEWS.filter(r => r.hotelId === hotel.id);
      setReviews(filtered);
      localStorage.setItem(`reviews_hotel_${hotel.id}`, JSON.stringify(filtered));
    }
    // Reset active image index
    setActiveImageIdx(0);
    // Sync default dates
    setSelectedDuration(defaultDuration);
    setBookingDate(defaultDate);
    setBookingTime(defaultTime);
    setShowReviewForm(false);
  }, [hotel, defaultDuration, defaultDate, defaultTime]);

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewer.trim() || !newComment.trim()) return;

    const added: Review = {
      id: `r-user-${Date.now()}`,
      hotelId: hotel.id,
      userName: newReviewer.trim(),
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toISOString().split('T')[0]
    };

    const updated = [added, ...reviews];
    setReviews(updated);
    localStorage.setItem(`reviews_hotel_${hotel.id}`, JSON.stringify(updated));

    // Clear form
    setNewReviewer('');
    setNewRating(5);
    setNewComment('');
    setShowReviewForm(false);
  };

  // Calculate Check-out time helper
  const getCheckOutTimeStr = () => {
    try {
      const parts = bookingTime.split(' ');
      if (parts.length < 2) return '';
      const [time, modifier] = parts;
      const subParts = time.split(':');
      let hour = Number(subParts[0]);
      const minute = subParts.length > 1 ? Number(subParts[1]) : 0;

      if (modifier === 'PM' && hour < 12) hour += 12;
      if (modifier === 'AM' && hour === 12) hour = 0;

      const dateObj = new Date(bookingDate);
      dateObj.setHours(hour, minute, 0, 0);

      // Add stay duration in hours
      const checkOutDate = new Date(dateObj.getTime() + selectedDuration * 60 * 60 * 1000);

      const dayStr = checkOutDate.toLocaleDateString([], { month: 'short', day: 'numeric' });
      const timeStr = checkOutDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

      return `${dayStr} • ${timeStr}`;
    } catch {
      return '';
    }
  };

  if (!isOpen) return null;

  const currentPrice = hotel.prices[selectedDuration];
  const oldPrice = Math.round(currentPrice * 1.6);
  const checkoutTime = getCheckOutTimeStr();

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-y-auto relative shadow-2xl border border-gray-100 flex flex-col md:flex-row"
        id="hotel-detail-container"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-xs shadow-md border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
          id="close-modal-btn"
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Left Half: Gallery, Amenities, Info */}
        <div className="w-full md:w-1/2 p-5 sm:p-7 space-y-6 overflow-y-auto">
          {/* Main big image preview */}
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-gray-100 shadow-xs border border-gray-100">
            <img
              src={hotel.images[activeImageIdx] || hotel.imageUrl}
              alt={hotel.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {hotel.isCoupleFriendly && (
              <span className="absolute bottom-3 left-3 bg-emerald-500 text-white font-mono text-[9px] font-bold uppercase px-2.5 py-1 rounded-md flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Couple Friendly Stay</span>
              </span>
            )}
          </div>

          {/* Mini carousel image thumbnails */}
          {hotel.images.length > 1 && (
            <div className="flex gap-2 pb-1 overflow-x-auto">
              {hotel.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    activeImageIdx === i ? 'border-brand-medium scale-95' : 'border-gray-200'
                  }`}
                  id={`thumb-btn-${i}`}
                >
                  <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}

          {/* Hotel Meta Headers */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-brand-light/10 text-brand-dark text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md font-mono border border-brand-light/20">
                📍 {hotel.locality}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold font-mono">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{hotel.rating}</span>
                <span className="text-gray-400 font-normal">({reviews.length} ratings)</span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900 tracking-tight leading-snug">
              {hotel.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-medium flex-shrink-0" />
              <span>{hotel.address} • <strong className="text-brand-medium font-semibold">{hotel.distance}</strong></span>
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amenities Provided</h5>
            <div className="grid grid-cols-2 gap-2">
              {hotel.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl text-xs text-gray-700">
                  <CheckCircle2 className="w-4 h-4 text-brand-light flex-shrink-0" />
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Indore Policy Rules Box */}
          <div className="bg-brand-bg/5 rounded-2xl p-4 border border-brand-medium/10 space-y-2 text-xs">
            <h6 className="font-bold text-brand-dark uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-medium" />
              <span>Indore Local Hourly Policies</span>
            </h6>
            <ul className="space-y-1.5 text-gray-600 list-disc list-inside">
              <li>Couples welcomed unconditionally; complete safety and privacy guaranteed.</li>
              <li>Local Indore address IDs (Aadhaar, Voter ID, Driving License) are completely accepted.</li>
              <li>Physical original government ID is mandatory at checkout/check-in.</li>
              <li>Quick 3-minute transit check-in process.</li>
            </ul>
          </div>
        </div>

        {/* Right Half: Live Booking Calculator & Reviews list */}
        <div className="w-full md:w-1/2 bg-gray-50 p-5 sm:p-7 border-t md:border-t-0 md:border-l border-gray-100 flex flex-col justify-between overflow-y-auto max-h-[90vh]">
          <div className="space-y-6">
            
            {/* Live Stay Calculator Widget */}
            <div className="bg-white rounded-2xl p-5 border border-gray-200/50 shadow-sm space-y-4">
              <h5 className="font-display font-bold text-sm text-brand-bg uppercase tracking-wide border-b border-gray-100 pb-2">
                Configure Hourly Stay
              </h5>

              {/* Selector Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 focus:outline-none"
                    id="calc-date-input"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                    Check-in Time
                  </label>
                  <select
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 focus:outline-none"
                    id="calc-time-input"
                  >
                    {['08:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM', '10:00 PM'].map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Package size */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Staying Hours Pack
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([3, 6, 12] as StayDuration[]).map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => setSelectedDuration(hours)}
                      className={`py-2 px-1 rounded-lg border text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                        selectedDuration === hours
                          ? 'border-brand-medium bg-brand-light/10 text-brand-dark shadow-xs'
                          : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                      }`}
                      id={`calc-pack-${hours}h`}
                    >
                      <span className="text-sm font-mono">{hours}h</span>
                      <span className="text-[8px] text-gray-400 font-normal uppercase">Slot</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkout Calculation Summary */}
              {checkoutTime && (
                <div className="bg-brand-light/5 border border-brand-light/20 p-3 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <p className="text-gray-400 text-[9px] uppercase font-bold">Estimated Checkout</p>
                    <p className="font-mono font-bold text-brand-dark">{checkoutTime}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-[9px] uppercase font-bold">Total Stay</p>
                    <p className="font-display font-bold text-brand-medium">{selectedDuration} Hours</p>
                  </div>
                </div>
              )}

              {/* Pricing breakdown & Checkout CTA */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-[9px] uppercase font-mono">Special Hourly rate</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold font-mono text-brand-bg">₹{currentPrice}</span>
                    <span className="text-xs text-gray-400 line-through">₹{oldPrice}</span>
                  </div>
                </div>
                <button
                  onClick={() => onBookNow(hotel, selectedDuration, bookingDate, bookingTime)}
                  className="bg-brand-light hover:bg-brand-medium text-white font-display font-bold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all text-xs cursor-pointer"
                  id="checkout-cta-btn"
                >
                  Book Instant Room
                </button>
              </div>
            </div>

            {/* Guest Reviews Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h5 className="font-display font-bold text-sm text-brand-bg flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-brand-medium" />
                  <span>Guest Reviews ({reviews.length})</span>
                </h5>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-xs font-semibold text-brand-medium hover:text-brand-dark flex items-center gap-0.5 cursor-pointer"
                  id="add-review-trigger-btn"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Review</span>
                </button>
              </div>

              {/* Add Review Form Overlay */}
              {showReviewForm && (
                <form 
                  onSubmit={handleAddReviewSubmit} 
                  className="bg-white p-4 rounded-xl border border-gray-200 space-y-3 shadow-sm"
                  id="review-submit-form"
                >
                  <p className="text-[10px] uppercase font-bold text-gray-400">Write Your Experience</p>
                  <div className="grid grid-cols-3 gap-3 items-center">
                    <div className="col-span-2">
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={newReviewer}
                        onChange={(e) => setNewReviewer(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-700 outline-none"
                        required
                        id="new-reviewer-input"
                      />
                    </div>
                    <div>
                      <select
                        value={newRating}
                        onChange={(e) => setNewRating(Number(e.target.value))}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-bold text-amber-500 outline-none"
                        id="new-rating-input"
                      >
                        <option value="5">★ 5 Stars</option>
                        <option value="4">★ 4 Stars</option>
                        <option value="3">★ 3 Stars</option>
                        <option value="2">★ 2 Stars</option>
                        <option value="1">★ 1 Star</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <textarea
                      placeholder="Share details of your stay (cleanliness, staff, couple friendly check-in, etc.)"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={2}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-xs text-gray-700 outline-none"
                      required
                      id="new-comment-input"
                    />
                  </div>
                  <div className="flex justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-3 py-1.5 bg-gray-50 text-gray-500 text-xs rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-brand-bg text-white text-xs rounded-lg font-bold hover:bg-brand-dark"
                      id="submit-review-btn"
                    >
                      Post Review
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {reviews.length === 0 ? (
                  <p className="text-xs text-gray-400 italic py-2">No reviews yet for this hotel. Be the first to leave one!</p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="bg-white p-3 rounded-xl border border-gray-100 shadow-3xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-gray-800">{rev.userName}</span>
                        <div className="flex items-center gap-1">
                          <div className="flex text-amber-400">
                            {Array.from({ length: rev.rating }).map((_, i) => (
                              <Star key={i} className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                          <span className="text-[10px] text-gray-400 font-mono">{rev.date}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed font-normal">
                        {rev.comment}
                      </p>
                    </div>
                  ))
                )}
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
