import { Hotel, PromoCode, Review } from './types';

export const LOCALITIES = [
  'All Localities',
  'Vijay Nagar',
  'Rajwada (Old City)',
  'Palasia',
  'Bhawar Kuan',
  'LIG Colony',
  'Indore Junction (Railway Station)',
  'Airport Road'
];

export const PROMO_CODES: PromoCode[] = [
  {
    code: 'INDORE20',
    discountPercent: 20,
    description: 'Get 20% flat discount on any hourly stay across Indore.'
  },
  {
    code: 'SARAFA30',
    discountPercent: 30,
    description: '30% off for late-night hourly stays (valid for check-ins after 6:00 PM).'
  },
  {
    code: 'BREVIHOUR',
    discountPercent: 15,
    description: '15% off for first-time hourly bookings in Indore.'
  }
];

export const INITIAL_HOTELS: Hotel[] = [
  {
    id: 'h1',
    name: 'The Grand Shreem Regency',
    rating: 4.8,
    reviewsCount: 215,
    locality: 'Vijay Nagar',
    address: 'Plot 12, Scheme 54, Vijay Nagar, Near C21 Mall, Indore',
    distance: '0.4 km from C21 Mall',
    amenities: ['Air Conditioning', 'Free High-Speed WiFi', 'Couple Friendly', '24h Room Service', 'King Size Bed', 'Geyser', 'Smart TV', 'Card Payment Accepted'],
    prices: {
      3: 699,
      6: 1099,
      12: 1599
    },
    imageUrl: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&q=80'
    ],
    isCoupleFriendly: true,
    isPayAtHotel: true,
    stars: 4
  },
  {
    id: 'h2',
    name: 'Sayaji Hourly Retreat',
    rating: 4.9,
    reviewsCount: 342,
    locality: 'Vijay Nagar',
    address: 'H-1, Scheme No. 54, Vijay Nagar, Indore',
    distance: '1.2 km from Meghdoot Garden',
    amenities: ['Air Conditioning', 'Free High-Speed WiFi', 'Couple Friendly', 'Swimming Pool Access', 'Premium Toiletries', 'Bathtub', 'In-room Mini Bar', 'Valet Parking'],
    prices: {
      3: 1199,
      6: 1899,
      12: 2699
    },
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80'
    ],
    isCoupleFriendly: true,
    isPayAtHotel: true,
    stars: 5
  },
  {
    id: 'h3',
    name: 'Rajwada Palace Residency',
    rating: 4.5,
    reviewsCount: 128,
    locality: 'Rajwada (Old City)',
    address: '15, Jawahar Marg, Opposite Rajwada Main Gate, Indore',
    distance: '50 meters from Rajwada Fort',
    amenities: ['Air Conditioning', 'Free High-Speed WiFi', 'Couple Friendly', 'Geyser', 'Traditional Cafe', 'Luggage Storage', 'Elevator', 'CCTV Secured'],
    prices: {
      3: 499,
      6: 799,
      12: 1199
    },
    imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80'
    ],
    isCoupleFriendly: true,
    isPayAtHotel: true,
    stars: 3
  },
  {
    id: 'h4',
    name: 'Hotel Palasia Executive',
    rating: 4.6,
    reviewsCount: 94,
    locality: 'Palasia',
    address: '42, AB Road, near Palasia Square, Indore',
    distance: '0.2 km from Palasia Post Office',
    amenities: ['Air Conditioning', 'Free High-Speed WiFi', 'Couple Friendly', 'Smart TV', 'Complimentary Drinking Water', 'Elevator', 'Tea/Coffee Maker'],
    prices: {
      3: 599,
      6: 949,
      12: 1399
    },
    imageUrl: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80'
    ],
    isCoupleFriendly: true,
    isPayAtHotel: false,
    stars: 3
  },
  {
    id: 'h5',
    name: 'Bhawarkuan Smart Stay',
    rating: 4.4,
    reviewsCount: 180,
    locality: 'Bhawar Kuan',
    address: '67, Professor Colony, Near DAVV Campus Gate, Bhawar Kuan, Indore',
    distance: '0.3 km from DAVV University campus',
    amenities: ['Air Conditioning', 'Free High-Speed WiFi', 'Couple Friendly', 'Study Desk', 'Ironing Service', 'Kitchenette Access', 'Snack Bar'],
    prices: {
      3: 449,
      6: 749,
      12: 1099
    },
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80'
    ],
    isCoupleFriendly: true,
    isPayAtHotel: true,
    stars: 3
  },
  {
    id: 'h6',
    name: 'Station Transit Inn',
    rating: 4.3,
    reviewsCount: 156,
    locality: 'Indore Junction (Railway Station)',
    address: '12-A, Chhoti Gwaltoli, Near Indore Junction Railway Station Platform 1 Gate, Indore',
    distance: '0.1 km from Railway Station',
    amenities: ['Air Conditioning', 'Free High-Speed WiFi', 'Couple Friendly', '24h Quick Check-in', 'Luggage Storage Room', 'Soundproof Windows', 'Doctor on Call'],
    prices: {
      3: 399,
      6: 699,
      12: 999
    },
    imageUrl: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80'
    ],
    isCoupleFriendly: true,
    isPayAtHotel: true,
    stars: 2
  },
  {
    id: 'h7',
    name: 'FlyHigh Hourly Suites',
    rating: 4.7,
    reviewsCount: 78,
    locality: 'Airport Road',
    address: 'Opposite Indore Domestic Airport Entrance, Airport Road, Indore',
    distance: '0.3 km from Devi Ahilyabai Holkar Airport',
    amenities: ['Air Conditioning', 'Free High-Speed WiFi', 'Couple Friendly', 'Airport Shuttle', 'Luggage Assistance', 'Premium Soundproofing', 'Mini Fridge'],
    prices: {
      3: 799,
      6: 1299,
      12: 1799
    },
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'
    ],
    isCoupleFriendly: true,
    isPayAtHotel: true,
    stars: 4
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    hotelId: 'h1',
    userName: 'Aarav Sharma',
    rating: 5,
    comment: 'Superb concept. Booked for 3 hours to take a shower and rest during my business trip in Vijay Nagar. Highly professional and clean rooms.',
    date: '2026-06-15'
  },
  {
    id: 'r2',
    hotelId: 'h1',
    userName: 'Ananya Vyas',
    rating: 4,
    comment: 'Very polite staff and completely hassle-free check-in for couples. Local ID was accepted without any issue.',
    date: '2026-06-12'
  },
  {
    id: 'r3',
    hotelId: 'h2',
    userName: 'Rohan Joshi',
    rating: 5,
    comment: 'Luxury hourly stay at Sayaji. Perfectly private, clean towels, and prompt service. The pool access was a fantastic touch!',
    date: '2026-06-20'
  },
  {
    id: 'r4',
    hotelId: 'h3',
    userName: 'Nisha Agrawal',
    rating: 5,
    comment: 'Unbeatable location right in front of Rajwada. Clean beds and very helpful for quick freshening up before sightseeing.',
    date: '2026-06-18'
  },
  {
    id: 'r5',
    hotelId: 'h5',
    userName: 'Vikram Patel',
    rating: 4,
    comment: 'Great value for students or anyone visiting the DAVV campus. Quiet environment, super-fast internet, and friendly hosts.',
    date: '2026-06-22'
  }
];

export const FAQS = [
  {
    question: 'How do hourly hotel bookings work in Indore?',
    answer: 'Hourly bookings allow you to choose a flexible check-in time and check out exactly 3, 6, or 12 hours later. This means you do not have to pay for a full 24-hour stay if you only need a room for a short layover, business meeting, or transit rest.'
  },
  {
    question: 'Are hourly hotels in Indore safe and couple friendly?',
    answer: 'Absolutely. All our listed hotels in Indore are handpicked, highly rated, and legally certified. They explicitly support couple stays. Guest privacy is our absolute priority, and the hotel staff is trained to offer professional, non-judgmental service.'
  },
  {
    question: 'Is Indore Local ID accepted for check-in?',
    answer: 'Yes! Unlike standard traditional hotels which forbid local residents, all our properties on IndoreStay allow check-ins using local Indore IDs (Aadhaar Card, Driving License, Passport, etc.). Any government-authorized photo ID is accepted, except PAN Card.'
  },
  {
    question: 'Can I extend my hourly stay if needed?',
    answer: 'Yes, extension is very simple. You can extend your booking directly from your Active Dashboard or by contacting the hotel reception. Extra hours are charged proportionally based on your chosen package.'
  },
  {
    question: 'What is the refund and cancellation policy?',
    answer: 'We provide free cancellation with a 100% refund up to 12 hours before your scheduled check-in time. For cancellations made within 12 hours of check-in, a micro-fee may apply or you can easily reschedule your slot free of charge.'
  }
];
