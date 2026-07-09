"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/api/client";
import { createBooking, fetchMyBookingForService, fetchMyBookings, updateBookingStatus, type CreateBookingPayload } from "@/lib/api/bookings.api";

export function useMyBookings() {
  return useQuery({ queryKey: ["bookings", "mine"], queryFn: fetchMyBookings });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, status }: { bookingId: string; status: string }) =>
      updateBookingStatus(bookingId, status),
    onSuccess: () => {
      toast.success("Booking updated");
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Couldn't update that booking")),
  });
}

export function useMyBookingForService(serviceSlug: string, enabled: boolean) {
  return useQuery({
    queryKey: ["bookings", "for-service", serviceSlug],
    queryFn: () => fetchMyBookingForService(serviceSlug),
    enabled: enabled && !!serviceSlug,
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBookingPayload) => createBooking(payload),
    onSuccess: () => {
      toast.success("Booking request sent to the provider");
      queryClient.invalidateQueries({ queryKey: ["bookings", "mine"] });
    },
    onError: (err) => toast.error(getErrorMessage(err, "Couldn't send that booking request")),
  });
}
