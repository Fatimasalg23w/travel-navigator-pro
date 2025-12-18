export type UserRole = 'admin' | 'advisor';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Advisor {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  videoCalls: number;
  quotes: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  reservationNumber?: string;
  createdAt: Date;
}

export type VideoCallCategory = 
  | 'request'
  | 'bachelor_party'
  | 'wedding'
  | 'proposal'
  | 'honeymoon'
  | 'birthday'
  | 'custom_trip'
  | 'business_trip'
  | 'group_trip'
  | 'booking_confirmation';

export type VideoCallStatus = 'scheduled' | 'completed' | 'cancelled';

export interface VideoCall {
  id: string;
  clientId: string;
  clientName: string;
  advisorId?: string;
  advisorName?: string;
  category: VideoCallCategory;
  status: VideoCallStatus;
  scheduledAt: Date;
  notes?: string;
}

export type QuoteStatus = 'pending' | 'done';

export interface Quote {
  id: string;
  clientId: string;
  clientName: string;
  advisorId: string;
  tourId?: string;
  tourName?: string;
  status: QuoteStatus;
  type: 'hotel_flight' | 'hotel_flight_tour';
  totalPrice: number;
  comments: string;
  createdAt: Date;
}

export interface TourDay {
  day: number;
  activity: string;
  link?: string;
  pickup: string;
  dropOff: string;
  departures: string;
  totalTime: string;
  startTime?: string;
  finishTime?: string;
  cancelationPolicy: string;
  mealsIncluded?: string;
  provider?: string;
  pricing: {
    adultPriceMXN: number;
    childPriceMXN: number;
  };
  description: string;
  pictures: string[];
}

export interface Tour {
  id: string;
  tourName: string;
  year: number;
  month: string;
  arrivalDate: number;
  departureDate: number;
  airport: {
    name: string;
    code: string;
  };
  transfersIncluded: string;
  days: TourDay[];
  compania: string[];
  destino: string[];
  especial: string[];
  plan: string[];
}
