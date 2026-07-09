import type { Booking } from "@/types/booking";
import { apiClient } from "./client";

export interface CreateBookingPayload {
  service: string;
  packageName: string;
  scheduledDate?: string;
  notes?: string;
}

export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  const { data } = await apiClient.post<{ booking: Booking }>("/bookings", payload);
  return data.booking;
}

export async function fetchMyBookings(): Promise<Booking[]> {
  const { data } = await apiClient.get<{ items: Booking[] }>("/bookings");
  return data.items;
}

export async function updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
  const { data } = await apiClient.patch<{ booking: Booking }>(`/bookings/${bookingId}/status`, { status });
  return data.booking;
}

export async function fetchMyBookingForService(serviceSlug: string): Promise<Booking | null> {
  const { data } = await apiClient.get<{ booking: Booking | null }>("/bookings/my-booking", {
    params: { service: serviceSlug },
  });
  return data.booking;
}
