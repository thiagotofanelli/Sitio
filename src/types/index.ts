export type PricingCategory = 'WEEKEND' | 'DAY_USE';
export type BookingStatus = 'PENDING' | 'CONTACTED' | 'BOOKED' | 'CANCELLED';
export type EventType = 'CASAMENTO' | 'ANIVERSARIO' | 'RETIRO' | 'FAMILIA' | 'EMPRESA' | 'OUTRO';
export type BlockedDateReason = 'RESERVA_CONFIRMADA' | 'MANUTENCAO' | 'OUTRO';
export type GalleryCategory = 'todos' | 'piscina' | 'sede' | 'alojamentos' | 'salao' | 'natureza';

export interface PricingTier {
  id: string;
  category: PricingCategory;
  peopleCount: number;
  price: number;
  validityNote?: string | null;
}

export interface BlockedDate {
  id: string;
  startDate: Date;
  endDate: Date;
  reason?: string | null;
}

export interface BookingInquiry {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  eventType: EventType;
  startDate: Date;
  endDate: Date;
  guestCount: number;
  estimatedTotal: number;
  status: BookingStatus;
  createdAt: Date;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
}
