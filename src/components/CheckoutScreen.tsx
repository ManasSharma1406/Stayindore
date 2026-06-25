import React, { useState, useEffect } from 'react';
import { Hotel, Booking, StayDuration, PromoCode } from '../types';
import { PROMO_CODES } from '../data';
import { ShieldAlert, ArrowLeft, Ticket, CreditCard, Hotel as HotelIcon, Clock, Calendar, CheckCircle, Smartphone, User, Mail, Sparkles, AlertTriangle } from 'lucide-react';

interface CheckoutScreenProps {
  hotel: Hotel;
  duration: StayDuration;
  checkInDate: string;
  checkInTime: string;
  onBack: () => void;
  onSuccess: (booking: Booking) => void;
}

export default function CheckoutScreen({
  hotel,
  duration,
  checkInDate,
  checkInTime,
  onBack,
  onSuccess
}: CheckoutScreenProps) {
  // Guest Form
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [purpose, setPurpose] = useState('Couple Stay');
  const [agreedToIdTerms, setAgreedToIdTerms] = useState(false);

  // Coupon
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<PromoCode | null>(null);
  const [couponError, setCouponError] = useState('');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'hotel' | 'online'>('hotel');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const basePrice = hotel.prices[duration];
  const gstTax = Math.round(basePrice * 0.12); // 12% GST
  const convenienceFee = 29; // ₹29 convenience fee

  // Calculate discount
  const discountAmount = appliedCoupon 
    ? Math.round(basePrice * (appliedCoupon.discountPercent / 100)) 
    : 0;

  const finalPrice = basePrice + gstTax + convenienceFee - discountAmount;

  // Pre-fill fields for easy testing
  useEffect(() => {
    setGuestName('Arjun Saxena');
    setGuestEmail('arjun.saxena@gmail.com');
    setGuestPhone('9876543210');
  }, []);

  const handleApplyCoupon = () => {
    setCouponError('');
    const found = PROMO_CODES.find(p => p.code.toUpperCase() === couponInput.toUpperCase());
    if (found) {
      setAppliedCoupon(found);
    } else {
      setCouponError('Invalid coupon code for Indore. Try INDORE20 or SARAFA30!');
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError('');
  };

  // Calculate Check-out date/time helper
  const getCheckOutDateAndTime = () => {
    try {
      const parts = checkInTime.split(' ');
      const [time, modifier] = parts;
      const subParts = time.split(':');
      let hour = Number(subParts[0]);
      const minute = subParts.length > 1 ? Number(subParts[1]) : 0;

      if (modifier === 'PM' && hour < 12) hour += 12;
      if (modifier === 'AM' && hour === 12) hour = 0;

      const dateObj = new Date(checkInDate);
      dateObj.setHours(hour, minute, 0, 0);

      const checkOutDate = new Date(dateObj.getTime() + duration * 60 * 60 * 1000);

      const dateFormatted = checkOutDate.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
      const timeFormatted = checkOutDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });

      return {
        date: dateFormatted,
        time: timeFormatted
      };
    } catch {
      return { date: checkInDate, time: '' };
    }
  };

  const checkOutInfo = getCheckOutDateAndTime();

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToIdTerms) {
      alert('You must confirm that you possess a valid government photo ID for local check-in.');
      return;
    }

    setIsSubmitting(true);

    // Simulate database write time
    setTimeout(() => {
      const newBooking: Booking = {
        id: `BST-IND-${Math.floor(100000 + Math.random() * 900000)}`,
        hotelId: hotel.id,
        hotelName: hotel.name,
        locality: hotel.locality,
        checkInDate,
        checkInTime,
        duration,
        checkOutTime: checkOutInfo.time,
        guestName: guestName.trim(),
        guestEmail: guestEmail.trim(),
        guestPhone: guestPhone.trim(),
        purpose,
        amountPaid: finalPrice,
        discount: discountAmount,
        status: 'confirmed',
        paymentMethod,
        createdAt: new Date().toISOString()
      };

      setIsSubmitting(false);
      onSuccess(newBooking);
    }, 1200);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 relative z-10" id="checkout-view">
      
      {/* Back button */}
      <button 
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-dark hover:text-brand-light mb-6 transition-colors group cursor-pointer"
        id="back-to-explore"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Hotel Listings</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left 7 Cols: Guest Info Form */}
        <form onSubmit={handleBookingSubmit} className="lg:col-span-7 space-y-6">
          
          {/* Guest Details Section */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-lg text-brand-bg flex items-center gap-2 border-b border-gray-100 pb-3">
              <User className="w-5 h-5 text-brand-medium" />
              <span>Primary Guest & Contact Information</span>
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Full Name (as in Aadhaar Card)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <User className="w-4 h-4" />
                    </span>
                    <input
                      type="text"
                      required
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="e.g. Arjun Saxena"
                      className="w-full bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-medium outline-none transition-all"
                      id="guest-name"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    WhatsApp Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Smartphone className="w-4 h-4" />
                    </span>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className="w-full bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-medium outline-none transition-all font-mono"
                      id="guest-phone"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Email Address (for invoice details)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="e.g. arjun@gmail.com"
                      className="w-full bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-medium outline-none transition-all"
                      id="guest-email"
                    />
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                    Purpose of Stay
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl px-3.5 py-2.5 text-xs font-medium outline-none cursor-pointer"
                    id="guest-purpose"
                  >
                    <option value="Couple Stay">Couple Stay (Privacy Assured)</option>
                    <option value="Transit Rest">Transit Rest (Train/Flight Layover)</option>
                    <option value="Business Layover">Business Layover / Quick Refresh</option>
                    <option value="Leisure Rest">Leisure Rest / Quiet Space</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-lg text-brand-bg flex items-center gap-2 border-b border-gray-100 pb-3">
              <CreditCard className="w-5 h-5 text-brand-medium" />
              <span>Choose Payment Mode</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Option 1: Pay at Hotel */}
              <div
                onClick={() => setPaymentMethod('hotel')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  paymentMethod === 'hotel'
                    ? 'border-brand-medium bg-brand-light/5'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                }`}
                id="payment-hotel-btn"
              >
                <div className="w-5 h-5 rounded-full border-2 border-brand-medium flex items-center justify-center mt-0.5">
                  {paymentMethod === 'hotel' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-medium" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900">
                    <HotelIcon className="w-4 h-4 text-brand-medium" />
                    <span>Pay At Hotel</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Zero advance payment. Pay directly at the front desk of the hotel during check-in using Cash, UPI, or Card.
                  </p>
                </div>
              </div>

              {/* Option 2: Pay Online */}
              <div
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  paymentMethod === 'online'
                    ? 'border-brand-medium bg-brand-light/5'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                }`}
                id="payment-online-btn"
              >
                <div className="w-5 h-5 rounded-full border-2 border-brand-medium flex items-center justify-center mt-0.5">
                  {paymentMethod === 'online' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-medium" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900">
                    <Smartphone className="w-4 h-4 text-brand-medium" />
                    <span>Pay Securely Online</span>
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Pay now with mock UPI or NetBanking to guarantee express entry and skip front-desk billing.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Local ID acceptance check */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200/60 flex gap-3.5">
            <div className="mt-0.5 text-amber-600 flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1.5">
              <h5 className="text-xs font-bold text-amber-800">Mandatory Local ID Declaration</h5>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                All guests checking in must present any original physical government-approved photo ID (Aadhaar Card, Passport, Driving License, or Voter ID). <strong>Indore local residency IDs are fully accepted!</strong> PAN Card is not valid as proof of address.
              </p>
              <label className="flex items-center gap-2 mt-2 cursor-pointer text-xs font-bold text-amber-900">
                <input
                  type="checkbox"
                  checked={agreedToIdTerms}
                  onChange={(e) => setAgreedToIdTerms(e.target.checked)}
                  className="w-4 h-4 accent-brand-dark rounded cursor-pointer"
                  required
                  id="id-declaration-check"
                />
                <span>I possess and will carry original ID proof for all guests.</span>
              </label>
            </div>
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-medium hover:bg-brand-dark text-white font-display font-bold py-4 rounded-xl shadow-md hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 disabled:bg-gray-300 cursor-pointer"
            id="confirm-booking-btn"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2 animate-pulse">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Processing Indore Reservation...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 text-brand-light" />
                <span>Confirm reservation at {hotel.name}</span>
              </span>
            )}
          </button>
        </form>

        {/* Right 5 Cols: Stay Summary and pricing */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Reservation Summary */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-4">
            <h3 className="font-display font-bold text-base text-brand-bg border-b border-gray-100 pb-3">
              Hourly Stay Summary
            </h3>

            <div className="flex gap-4">
              <img 
                src={hotel.imageUrl} 
                alt={hotel.name} 
                className="w-20 h-16 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                referrerPolicy="no-referrer"
              />
              <div>
                <p className="text-xs text-brand-medium font-bold uppercase tracking-wider font-mono">📍 {hotel.locality}</p>
                <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{hotel.name}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1">{hotel.address}</p>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-xs">
              {/* Check in */}
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Check-In Date:
                </span>
                <span className="font-mono font-semibold text-gray-900">{checkInDate}</span>
              </div>

              {/* Time slot */}
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Check-In Slot:
                </span>
                <span className="font-mono font-semibold text-gray-900">{checkInTime}</span>
              </div>

              {/* Stay length */}
              <div className="flex items-center justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  Stay Package:
                </span>
                <span className="font-mono font-bold text-brand-dark bg-brand-light/10 px-2 py-0.5 rounded-md">{duration} Hours Stay</span>
              </div>

              {/* Calculated checkout */}
              <div className="flex items-center justify-between text-gray-600 bg-brand-bg/5 p-2 rounded-xl border border-brand-medium/10">
                <span className="font-medium text-brand-dark">Calculated Check-Out:</span>
                <span className="font-mono font-bold text-brand-dark text-right">
                  {checkOutInfo.date} • {checkOutInfo.time}
                </span>
              </div>
            </div>
          </div>

          {/* Indore Special Coupon widget */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Ticket className="w-4 h-4 text-brand-medium" />
              <span>Apply Indore Promo Code</span>
            </h4>

            {appliedCoupon ? (
              <div className="bg-brand-light/10 border border-brand-light/30 p-3 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-brand-medium uppercase font-bold tracking-wider">Coupon Active</p>
                  <p className="font-mono font-extrabold text-xs text-brand-dark">{appliedCoupon.code}</p>
                  <p className="text-[9px] text-gray-500 mt-0.5">{appliedCoupon.discountPercent}% off: {appliedCoupon.description}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs font-bold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                  id="remove-coupon-btn"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter INDORE20 or SARAFA30"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 focus:border-brand-medium rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase outline-none"
                    id="coupon-input-box"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-brand-bg hover:bg-brand-dark text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    id="coupon-apply-btn"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-[10px] text-rose-500 font-semibold">{couponError}</p>
                )}
                {/* Available Coupons list */}
                <div className="pt-2 border-t border-gray-50 space-y-1.5">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Tap to copy local promo codes:</p>
                  {PROMO_CODES.map((promo) => (
                    <div 
                      key={promo.code} 
                      onClick={() => {
                        setCouponInput(promo.code);
                        setCouponError('');
                      }}
                      className="text-[10px] bg-gray-50 hover:bg-brand-light/5 border border-gray-100 hover:border-brand-light/30 p-1.5 rounded-lg flex justify-between items-center cursor-pointer transition-colors"
                    >
                      <span className="font-mono font-bold text-brand-dark">{promo.code}</span>
                      <span className="text-gray-400 truncate max-w-44 text-right">({promo.discountPercent}% off • {promo.code === 'SARAFA30' ? 'Nights' : 'Flat'})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Breakdown Sheet */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-xs space-y-3.5">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Billing Breakdown</h4>

            <div className="space-y-2 text-xs text-gray-600">
              {/* Base price */}
              <div className="flex justify-between">
                <span>Base Rate ({duration} Hrs stay)</span>
                <span className="font-mono text-gray-900 font-semibold">₹{basePrice}</span>
              </div>

              {/* Promo discount */}
              {appliedCoupon && (
                <div className="flex justify-between text-brand-medium font-semibold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-light" />
                    <span>Promo Discount ({appliedCoupon.code})</span>
                  </span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}

              {/* SGST + CGST */}
              <div className="flex justify-between">
                <span>Indore Local GST (12%)</span>
                <span className="font-mono text-gray-900">₹{gstTax}</span>
              </div>

              {/* Convenience fee */}
              <div className="flex justify-between">
                <span>Convenience & Protection Surcharge</span>
                <span className="font-mono text-gray-900">₹{convenienceFee}</span>
              </div>

              {/* Net total */}
              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-brand-bg">Net Payable Amount:</span>
                <div className="text-right">
                  <span className="text-xl font-mono font-bold text-brand-dark">₹{finalPrice}</span>
                  <p className="text-[8px] text-gray-400 uppercase tracking-wider mt-0.5">Includes complimentary taxes</p>
                </div>
              </div>
            </div>

            {/* Refund disclaimer */}
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-[10px] text-gray-500 flex gap-2">
              <ShieldAlert className="w-4 h-4 text-brand-medium flex-shrink-0" />
              <span>Free cancellation and full refund available up to 12 hours before check-in. Just tap Cancel inside bookings panel.</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
