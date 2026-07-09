"use client";

import { MapPin, Star } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

import { ServiceCard } from "@/components/services/service-card";
import { MessageButton } from "@/components/shared/message-button";
import { ReviewForm } from "@/components/shared/review-form";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ReviewBreakdown } from "@/components/ui/review-breakdown";
import { ReviewCard } from "@/components/ui/review-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/AuthContext";
import { useMyBookingForService } from "@/hooks/use-bookings";
import { useRelatedServices, useService } from "@/hooks/use-service";

// Most service-page visitors browse without booking — defer this bundle
// until Book Now is actually clicked.
const BookingModal = dynamic(() => import("@/components/services/booking-modal").then((m) => m.BookingModal), {
  ssr: false,
});
import { useDeleteReview, useReviews } from "@/hooks/use-reviews";
import type { ServiceProvider } from "@/types/service";

export default function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { data: service, isLoading } = useService(slug);
  const { data: related = [] } = useRelatedServices(slug);
  const { data: myBooking } = useMyBookingForService(slug, !!user);
  const { data: reviewsData } = useReviews("service", service?.id ?? "");
  const deleteReview = useDeleteReview("service", service?.id ?? "");
  const [bookingOpen, setBookingOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Skeleton className="h-96 w-full rounded-card" />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <EmptyState title="Service not found" description="This listing doesn't exist or has been removed." />
      </div>
    );
  }

  const provider = typeof service.provider === "object" ? (service.provider as ServiceProvider) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 md:grid-cols-2">
        <div className="relative aspect-video overflow-hidden rounded-card border border-border bg-elevated">
          {service.images[0] && (
            <Image src={service.images[0]} alt={service.title} fill className="object-cover" />
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold text-text-primary">{service.title}</h1>

          <div className="mt-2 flex items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              {service.ratingAvg.toFixed(1)} ({service.ratingCount} reviews)
            </span>
            {service.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" /> {service.location}
              </span>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-text-secondary">{service.description}</p>

          {provider && (
            <div className="mt-6 flex items-center justify-between rounded-card border border-border bg-card p-4">
              <Link href={`/profile/${provider.username}`} className="flex items-center gap-3 hover:opacity-90">
                <Avatar src={provider.avatarUrl} name={provider.name} size="md" />
                <div>
                  <p className="text-sm font-medium text-text-primary">{provider.name}</p>
                  <p className="text-xs text-text-muted">
                    {provider.verificationStatus === "verified" ? "Verified Provider" : "Provider"}
                  </p>
                </div>
              </Link>
              <MessageButton username={provider.username} />
            </div>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold text-text-primary">Packages</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {service.packages.map((pkg) => (
            <div key={pkg.name} className="flex flex-col rounded-card border border-border bg-card p-5">
              <p className="text-sm font-semibold text-text-primary">{pkg.name}</p>
              <p className="mt-1 text-2xl font-bold text-text-primary">${pkg.price.toFixed(0)}</p>
              <p className="mt-1 text-xs text-text-muted">{pkg.deliveryDays} day delivery</p>
              {pkg.features.length > 0 && (
                <ul className="mt-3 flex-1 space-y-1.5 text-sm text-text-secondary">
                  {pkg.features.map((f) => (
                    <li key={f}>• {f}</li>
                  ))}
                </ul>
              )}
              <Button className="mt-4 w-full" onClick={() => setBookingOpen(true)}>
                Book Now
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-text-primary">
            Reviews {service.ratingCount > 0 && <span className="text-text-muted">({service.ratingCount})</span>}
          </h2>
          {myBooking && (
            <div className="flex gap-2">
              <ReviewForm
                targetType="service"
                targetId={service.id}
                bookingId={myBooking._id}
                triggerLabel="Write a Review"
              />
              {provider && (
                <ReviewForm
                  targetType="user"
                  targetId={provider.id ?? (provider as any)._id}
                  bookingId={myBooking._id}
                  triggerLabel="Rate the Provider"
                />
              )}
            </div>
          )}
        </div>

        {reviewsData && reviewsData.items.length > 0 ? (
          <div className="rounded-card border border-border bg-card p-6">
            <ReviewBreakdown 
              ratingAvg={service.ratingAvg} 
              ratingCount={service.ratingCount} 
              breakdown={reviewsData.breakdown || {}} 
              className="mb-8"
            />
            
            <div className="flex flex-col">
              {reviewsData.items.map((review) => {
                const author = typeof review.author === "object" ? review.author : null;
                return (
                  <ReviewCard
                    key={review._id}
                    id={review._id}
                    authorId={author?._id}
                    authorName={author?.name ?? "Nexora user"}
                    authorUsername={author?.username}
                    authorAvatarUrl={author?.avatarUrl}
                    rating={review.rating}
                    comment={review.comment}
                    createdAt={review.createdAt}
                    onDelete={(id) => deleteReview.mutate(id)}
                    isDeleting={deleteReview.isPending}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <EmptyState
            icon={Star}
            title="No reviews yet"
            description={
              myBooking
                ? "You've booked this — be the first to leave a review."
                : "Reviews will appear here once clients leave feedback."
            }
          />
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-4 text-lg font-semibold text-text-primary">Related Services</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {related.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        </div>
      )}

      <BookingModal service={service} open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}
