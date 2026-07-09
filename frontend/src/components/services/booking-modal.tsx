"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Calendar, Check, ChevronRight, FileText, Package as PackageIcon, ShieldCheck, Sparkles, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateBooking } from "@/hooks/use-bookings";
import type { Service, ServiceProvider } from "@/types/service";
import { cn } from "@/lib/utils";

export function BookingModal({
  service,
  open,
  onClose,
}: {
  service: Service;
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const createBooking = useCreateBooking();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [packageName, setPackageName] = useState(service.packages[0]?.name ?? "");
  const [scheduledDate, setScheduledDate] = useState("");
  const [notes, setNotes] = useState("");
  const [placedBookingId, setPlacedBookingId] = useState<string | null>(null);

  const provider = typeof service.provider === "object" ? (service.provider as ServiceProvider) : null;
  const selectedPackage = service.packages.find((p) => p.name === packageName) || service.packages[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    createBooking.mutate(
      { service: service.id, packageName, scheduledDate: scheduledDate || undefined, notes: notes || undefined },
      { onSuccess: (booking) => {
          setPlacedBookingId(booking._id);
          setStep(4);
        }
      }
    );
  }

  function handleClose() {
    setPlacedBookingId(null);
    setScheduledDate("");
    setNotes("");
    setStep(1);
    onClose();
  }

  function nextStep() {
    if (!user) {
      router.push("/login");
      return;
    }
    setStep((s) => Math.min(s + 1, 4) as any);
  }

  function prevStep() {
    setStep((s) => Math.max(s - 1, 1) as any);
  }

  const steps = [
    { id: 1, title: "Package", icon: PackageIcon },
    { id: 2, title: "Details", icon: Calendar },
    { id: 3, title: "Review", icon: FileText },
  ];

  return (
    <Modal open={open} onClose={handleClose} title={step === 4 ? "Booking Confirmed" : "Request Booking"} className="max-w-3xl">
      {step < 4 && (
        <div className="mb-6 flex items-center justify-between px-4">
          {steps.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                step === s.id ? "border-primary bg-primary text-ink" : 
                step > s.id ? "border-primary bg-primary/10 text-primary" : 
                "border-border bg-surface text-text-muted"
              )}>
                {step > s.id ? <Check className="h-4 w-4" /> : s.id}
              </div>
              <span className={cn(
                "ml-2 text-xs font-medium hidden sm:block",
                step >= s.id ? "text-text-primary" : "text-text-muted"
              )}>
                {s.title}
              </span>
              {i < steps.length - 1 && (
                <div className={cn(
                  "mx-3 h-[2px] w-8 rounded-full sm:w-12",
                  step > s.id ? "bg-primary/50" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {service.packages.map((pkg) => {
              const isSelected = packageName === pkg.name;
              return (
                <label
                  key={pkg.name}
                  className={cn(
                    "flex cursor-pointer flex-col rounded-card border p-5 transition-all",
                    isSelected ? "border-primary bg-primary/5 shadow-sm scale-[1.02]" : "border-border bg-surface hover:border-primary/50"
                  )}
                  onClick={() => setPackageName(pkg.name)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-text-primary">{pkg.name}</span>
                    <input
                      type="radio"
                      name="package"
                      checked={isSelected}
                      onChange={() => setPackageName(pkg.name)}
                      className="h-4 w-4 accent-primary"
                    />
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-bold text-text-primary">${pkg.price.toFixed(0)}</span>
                  </div>
                  <p className="mt-1 text-xs text-text-muted font-medium">{pkg.deliveryDays} Day Delivery</p>
                  
                  {pkg.features.length > 0 && (
                    <div className="mt-4 flex-1 border-t border-border/50 pt-4">
                      <ul className="space-y-2">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-text-secondary">
                            <Check className="h-3.5 w-3.5 shrink-0 text-primary mt-0.5" />
                            <span className="leading-tight">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-border">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button onClick={nextStep}>Continue</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div className="rounded-card border border-border bg-surface p-5">
            <h4 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" /> Schedule & Requirements
            </h4>
            <div className="space-y-5">
              <div>
                <Label htmlFor="scheduledDate">Preferred date (optional)</Label>
                <input
                  id="scheduledDate"
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="mt-1.5 h-11 w-full rounded-input border border-border bg-card px-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                />
                <p className="mt-1 text-xs text-text-muted">Let the provider know when you need this by.</p>
              </div>

              <div>
                <Label htmlFor="notes">Notes for the provider (optional)</Label>
                <Textarea
                  id="notes"
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your requirements, goals, or any specific details the provider should know before accepting your booking..."
                  className="mt-1.5 bg-card"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Review Booking</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Left: Summary */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-text-primary">Booking Summary</h4>
              <div className="rounded-card border border-border bg-surface p-4 space-y-4">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider font-medium mb-1">Service</p>
                  <p className="text-sm font-medium text-text-primary">{service.title}</p>
                </div>
                <div className="flex justify-between items-center border-t border-border pt-4">
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider font-medium mb-1">Package</p>
                    <p className="text-sm font-medium text-text-primary">{selectedPackage?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-text-muted uppercase tracking-wider font-medium mb-1">Total</p>
                    <p className="text-lg font-bold text-primary">${selectedPackage?.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Provider & Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-text-primary">Provider Details</h4>
              {provider ? (
                <div className="flex items-center gap-3 rounded-card border border-border bg-surface p-4">
                  <Avatar src={provider.avatarUrl} name={provider.name} size="md" />
                  <div>
                    <p className="text-sm font-medium text-text-primary">{provider.name}</p>
                    <p className="text-xs text-text-muted flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3 text-success" />
                      {provider.verificationStatus === "verified" ? "Verified" : "Provider"}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-card border border-border bg-surface p-4 text-sm text-text-muted">
                  Provider details unavailable
                </div>
              )}

              <div className="rounded-card border border-border bg-surface p-4 space-y-3">
                <div className="flex gap-2">
                  <Calendar className="h-4 w-4 text-text-muted shrink-0" />
                  <p className="text-sm text-text-secondary">
                    {scheduledDate ? new Date(scheduledDate).toLocaleDateString() : "No date specified"}
                  </p>
                </div>
                {notes && (
                  <div className="flex gap-2 border-t border-border pt-3">
                    <FileText className="h-4 w-4 text-text-muted shrink-0" />
                    <p className="text-sm text-text-secondary line-clamp-3 italic">"{notes}"</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-border">
            <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>
            <Button type="submit" isLoading={createBooking.isPending}>Confirm Request</Button>
          </div>
        </form>
      )}

      {step === 4 && placedBookingId && (
        <div className="space-y-6 text-center py-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary">
            <Sparkles className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Booking Requested!</h3>
            <p className="mt-2 text-sm text-text-secondary max-w-sm mx-auto">
              Your request for <span className="font-medium text-text-primary">{service.title}</span> has been sent to the provider.
            </p>
            <p className="mt-2 text-xs text-text-muted">You will be notified once they accept or decline.</p>
          </div>
          <div className="flex justify-center pt-4">
            <Button onClick={() => router.push("/dashboard/bookings")}>
              View My Bookings
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
