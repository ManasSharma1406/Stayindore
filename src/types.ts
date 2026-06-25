export interface Hotel {
  id: string;
  name: string;
  rating: number;
  reviewsCount: number;
  locality: string;
  address: string;
  distance: string;
  amenities: string[];
  prices: {
    3: number;
    6: number;
    12: number;
  };
  imageUrl: string;
  images: string[];
  isCoupleFriendly: boolean;
  isPayAtHotel: boolean;
  stars: number;
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  locality: string;
  checkInDate: string;
  checkInTime: string;
  duration: 3 | 6 | 12;
  checkOutTime: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  purpose: string;
  amountPaid: number;
  discount: number;
  status: 'confirmed' | 'cancelled';
  paymentMethod: 'hotel' | 'online';
  createdAt: string;
}

export interface Review {
  id: string;
  hotelId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
}

export type StayDuration = 3 | 6 | 12;

export interface SearchCriteria {
  locality: string;
  checkInDate: string;
  checkInTime: string;
  duration: StayDuration;
}
