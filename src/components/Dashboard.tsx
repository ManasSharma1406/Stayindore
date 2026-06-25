import { useState } from 'react';
import { Booking } from '../types';
import { ShieldCheck, Calendar, Clock, AlertTriangle, Printer, Navigation, QrCode, FileText, RefreshCw, XSquare, ClipboardCheck, Sparkles, X } from 'lucide-react';

interface DashboardProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => void;
}

export default function Dashboard({ bookings, onCancelBooking }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [selectedInvoice, setSelectedInvoice] = useState<Booking | null>(null);

  // Separate bookings
  const activeBookings = bookings.filter(b => b.status === 'confirmed');
  const historyBookings = bookings.filter(b => b.status === 'cancelled');

  const handleCancelClick = (id: string) => {
    if (confirm('Are you sure you want to cancel this hourly reservation? You will receive a 100% refund of any payments.')) {
      onCancelBooking(id);
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'confirmed') {
      return (
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-wide">
          ● confirmed
        </span>
      );
    }
    return (
      <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-wide">
        ● Cancelled
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 relative z-10" id="dashboard-view">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-display font-bold text-brand-bg tracking-tight">
            My Hourly Reservation Desk
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Track and manage your active hourly stays, download invoice slips, and access instant QR check-in codes.
          </p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'active'
                ? 'bg-white text-brand-bg shadow-sm'
                : 'text-gray-500 hover:text-brand-dark'
            }`}
            id="tab-active-bookings"
          >
            Active & Upcoming ({activeBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-brand-bg shadow-sm'
                : 'text-gray-500 hover:text-brand-dark'
            }`}
            id="tab-history-bookings"
          >
            Past & Cancelled ({historyBookings.length})
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      {activeTab === 'active' ? (
        activeBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-3xs text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <Calendar className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-brand-bg">No Active Hourly Bookings</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                You do not have any upcoming reservations in Indore. Search local localities like Vijay Nagar or Rajwada to make a booking.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeBookings.map((bk) => (
              <div 
                key={bk.id} 
                className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all p-5 sm:p-6 space-y-4 relative"
                id={`booking-card-${bk.id}`}
              >
                
                {/* Header row: ID & Status */}
                <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider font-mono">Hourly Reservation ID</p>
                    <p className="font-mono font-bold text-xs text-brand-dark">{bk.id}</p>
                  </div>
                  {getStatusBadge(bk.status)}
                </div>

                {/* Hotel row */}
                <div>
                  <span className="text-[9px] bg-brand-light/10 text-brand-dark font-mono font-bold uppercase px-2 py-0.5 rounded-md">
                    🏨 {bk.locality}
                  </span>
                  <h4 className="font-display font-bold text-sm text-gray-900 mt-1">{bk.hotelName}</h4>
                </div>

                {/* Date slot detail cards */}
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="space-y-0.5">
                    <span className="text-[9px] text-gray-400 uppercase font-bold flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Check-In
                    </span>
                    <p className="font-mono text-[11px] font-bold text-gray-700">{bk.checkInDate}</p>
                    <p className="font-mono text-[11px] font-bold text-brand-medium">{bk.checkInTime}</p>
                  </div>
                  <div className="space-y-0.5 border-l border-gray-200 pl-3">
                    <span className="text-[9px] text-gray-400 uppercase font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Check-Out
                    </span>
                    <p className="font-mono text-[11px] font-bold text-gray-700">{bk.checkInDate}</p>
                    <p className="font-mono text-[11px] font-bold text-rose-600">{bk.checkOutTime}</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Hourly Package Chosen:</span>
                    <span className="font-bold text-brand-dark font-mono">{bk.duration} Hours Stays</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Primary Guest:</span>
                    <span className="font-medium text-gray-900">{bk.guestName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-semibold text-gray-900 font-mono capitalize">
                      {bk.paymentMethod === 'hotel' ? '💳 Pay at Hotel front-desk' : '✔ Paid Online'}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-gray-100 pt-2 font-bold text-gray-900">
                    <span>Billing Paid/Due:</span>
                    <span className="font-mono text-brand-bg text-sm">₹{bk.amountPaid}</span>
                  </div>
                </div>

                {/* QR Check-in preview slot */}
                <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100 flex items-center gap-3">
                  <div className="bg-white p-1 rounded-lg border border-emerald-200">
                    <QrCode className="w-10 h-10 text-emerald-700" />
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-emerald-800">Front Desk Express Pass</h5>
                    <p className="text-[9px] text-emerald-600 leading-tight mt-0.5">
                      Show this code & original Aadhaar Card at the check-in desk for lightning-fast entry.
                    </p>
                  </div>
                </div>

                {/* Actions row */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-gray-50">
                  <button
                    onClick={() => setSelectedInvoice(bk)}
                    className="flex-1 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-semibold text-gray-600 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    id={`invoice-btn-${bk.id}`}
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Slip</span>
                  </button>

                  <button
                    onClick={() => handleCancelClick(bk.id)}
                    className="py-2 px-3 border border-rose-100 hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                    id={`cancel-btn-${bk.id}`}
                  >
                    <XSquare className="w-3.5 h-3.5" />
                    <span>Cancel</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )
      ) : (
        historyBookings.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-3xs text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mx-auto text-gray-400">
              <XSquare className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-bold text-base text-brand-bg">No Past or Cancelled Stays</h4>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No past transactions or cancelled bookings were recorded on this device.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {historyBookings.map((bk) => (
              <div 
                key={bk.id} 
                className="bg-white rounded-3xl border border-gray-100 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-3xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-gray-400">ID: {bk.id}</span>
                    {getStatusBadge(bk.status)}
                  </div>
                  <h4 className="font-display font-bold text-sm text-gray-800 mt-1">{bk.hotelName}</h4>
                  <p className="text-xs text-gray-400">📍 {bk.locality} • Checked stay of {bk.duration} Hours</p>
                </div>

                <div className="text-xs text-gray-500 font-medium">
                  <p>Check-In Slot: <strong className="text-gray-700 font-mono">{bk.checkInDate} • {bk.checkInTime}</strong></p>
                  <p>Cancelled on: <strong className="text-gray-700 font-mono">{new Date(bk.createdAt).toLocaleDateString()}</strong></p>
                </div>

                <div className="flex sm:flex-col items-end gap-2">
                  <span className="font-mono font-bold text-gray-400">₹{bk.amountPaid} refunded</span>
                  <button
                    onClick={() => setSelectedInvoice(bk)}
                    className="py-1 px-3 border border-gray-200 hover:bg-gray-50 rounded-lg text-[11px] font-medium text-gray-500 cursor-pointer"
                  >
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Invoice modal / slip detail popup */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl border-4 border-brand-dark/20 max-w-md w-full p-6 sm:p-8 relative space-y-5 shadow-2xl my-auto max-h-[85vh] overflow-y-auto">
            {/* Close */}
            <button 
              onClick={() => setSelectedInvoice(null)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 cursor-pointer"
              id="close-invoice-modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Invoice Top */}
            <div className="text-center space-y-2 border-b border-gray-100 pb-5">
              <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6 text-brand-light" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-gray-900">revistay Indore Receipt</h3>
                <p className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Hourly Booking Confirmation Voucher</p>
              </div>
            </div>

            {/* Details table */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-y-3 font-medium text-gray-600">
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Booking ID</p>
                  <p className="font-mono text-gray-900 font-bold">{selectedInvoice.id}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Voucher Status</p>
                  <p className="font-mono font-bold uppercase text-emerald-600">{selectedInvoice.status}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Hotel Partner</p>
                  <p className="text-gray-900 font-bold">{selectedInvoice.hotelName}</p>
                  <p className="text-[10px] text-gray-400 font-normal">{selectedInvoice.locality}, Indore</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Stay Package</p>
                  <p className="text-brand-dark font-extrabold">{selectedInvoice.duration} Hours Stays</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Check-In Date</p>
                  <p className="font-mono text-gray-900">{selectedInvoice.checkInDate}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Check-In Slot</p>
                  <p className="font-mono text-gray-900 font-bold text-brand-medium">{selectedInvoice.checkInTime}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Calculated Check-Out</p>
                  <p className="font-mono text-rose-600 font-bold">{selectedInvoice.checkOutTime}</p>
                </div>
                <div className="col-span-2 border-t border-gray-100 pt-2.5">
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Primary Guest Name</p>
                  <p className="text-gray-900 font-semibold">{selectedInvoice.guestName}</p>
                  <p className="text-[10px] text-gray-500 font-mono">📱 {selectedInvoice.guestPhone} • {selectedInvoice.guestEmail}</p>
                </div>
              </div>

              {/* Total Billing Paid */}
              <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-gray-400 uppercase font-bold">Hourly Rates + Local Tax Surcharge</p>
                  <p className="text-[10px] text-gray-500 font-mono capitalize">Payment Type: {selectedInvoice.paymentMethod === 'hotel' ? 'Pay At Hotel Desk' : 'Paid Online'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">Amount Due</p>
                  <p className="text-lg font-mono font-bold text-brand-bg">₹{selectedInvoice.amountPaid}</p>
                </div>
              </div>

              {/* QR Pass */}
              {selectedInvoice.status === 'confirmed' && (
                <div className="border-t border-dashed border-gray-200 pt-4 text-center space-y-2">
                  <div className="w-28 h-28 bg-white border border-gray-100 shadow-3xs p-2 rounded-xl mx-auto flex items-center justify-center">
                    <QrCode className="w-full h-full text-brand-bg" />
                  </div>
                  <p className="text-[10px] text-gray-400 max-w-xs mx-auto">
                    Show this verified reservation voucher and Aadhaar card at the reception for standard key handover.
                  </p>
                </div>
              )}
            </div>

            {/* Print Slip */}
            <div className="pt-2">
              <button
                onClick={() => window.print()}
                className="w-full bg-brand-bg hover:bg-brand-dark text-white font-display font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                id="print-invoice-slip"
              >
                <Printer className="w-4 h-4" />
                <span>Print Copy of Receipt</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
