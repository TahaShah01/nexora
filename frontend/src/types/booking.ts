export type BookingStatus = "pending" | "accepted" | "declined" | "completed" | "cancelled";

export interface BookingPackageSnapshot {
  name: string;
  price: number;
  deliveryDays: number;
  features: string[];
}

interface BookingPartyRef {
  _id: string;
  name: string;
  username: string;
  avatarUrl?: string;
}

export interface Booking {
  _id: string;
  service: { _id: string; title: string; slug: string; images: string[] } | string;
  package: BookingPackageSnapshot;
  buyer: BookingPartyRef | string;
  provider: BookingPartyRef | string;
  status: BookingStatus;
  scheduledDate?: string;
  notes?: string;
  createdAt: string;
}
