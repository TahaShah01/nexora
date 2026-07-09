"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { Check, ChevronRight, CreditCard, Receipt, ShieldCheck, Truck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateOrder } from "@/hooks/use-orders";
import { invoiceDownloadUrl } from "@/lib/api/orders.api";
import type { Product } from "@/types/product";
import { cn } from "@/lib/utils";

export function BuyNowModal({
  product,
  open,
  onClose,
}: {
  product: Product;
  open: boolean;
  onClose: () => void;
}) {
  const { user } = useAuth();
  const router = useRouter();
  const createOrder = useCreateOrder();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("online");
  const [paymentProofUrl, setPaymentProofUrl] = useState("");
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push("/login");
      return;
    }
    createOrder.mutate(
      { product: product.id, shippingAddress, paymentMethod, paymentProofUrl: paymentMethod === "online" ? paymentProofUrl : undefined },
      { onSuccess: (order) => {
          setPlacedOrderId(order._id);
          setStep(4);
        }
      }
    );
  }

  function handleClose() {
    setPlacedOrderId(null);
    setShippingAddress("");
    setPaymentMethod("online");
    setPaymentProofUrl("");
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
    { id: 1, title: "Cart", icon: Receipt },
    { id: 2, title: "Shipping", icon: Truck },
    { id: 3, title: "Payment", icon: CreditCard },
  ];

  return (
    <Modal open={open} onClose={handleClose} title={step === 4 ? "Order Confirmed" : "Checkout"}>
      {step < 4 && (
        <div className="mb-6 flex items-center justify-between">
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
              {i < steps.length - 1 && (
                <div className={cn(
                  "mx-2 h-[2px] w-8 rounded-full",
                  step > s.id ? "bg-primary/50" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div className="flex gap-4 rounded-card border border-border p-4 bg-surface">
            {product.images[0] && (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-input border border-border">
                <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
              </div>
            )}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h4 className="text-sm font-medium text-text-primary line-clamp-2">{product.title}</h4>
                <p className="mt-1 text-xs text-text-muted capitalize">Condition: {product.condition.replace("_", " ")}</p>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs font-medium text-text-secondary">Qty: 1</span>
                <span className="font-semibold text-text-primary">${product.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 rounded-card border border-border p-4 bg-card">
            <div className="flex justify-between text-sm text-text-secondary">
              <span>Subtotal</span>
              <span>${product.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-text-secondary">
              <span>Shipping</span>
              <span className="text-success font-medium">Free</span>
            </div>
            <div className="pt-3 border-t border-border flex justify-between font-semibold text-text-primary">
              <span>Total</span>
              <span>${product.price.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={handleClose}>Cancel</Button>
            <Button onClick={nextStep}>Continue to Shipping</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <Label htmlFor="shippingAddress">Shipping address</Label>
            <Textarea
              id="shippingAddress"
              rows={4}
              required
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Full Name&#10;Street Address&#10;City, State, Postal Code&#10;Country"
              className="mt-1.5"
            />
            <p className="mt-2 text-xs text-text-muted">Orders are typically processed within 24 hours.</p>
          </div>
          <div className="flex justify-between pt-2">
            <Button variant="ghost" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep} disabled={shippingAddress.trim().length < 10}>
              Continue to Payment
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors",
                paymentMethod === "online" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex h-5 items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                  className="h-4 w-4 accent-primary"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-primary">Online Payment (Mock)</span>
                  <CreditCard className="h-4 w-4 text-text-muted" />
                </div>
                <p className="mt-1 text-xs text-text-muted">Pay securely with bank transfer and upload proof.</p>
                {paymentMethod === "online" && (
                  <div className="mt-4 space-y-3 rounded-input bg-surface p-3 border border-border">
                    <p className="text-xs font-medium text-text-secondary">Please transfer <span className="font-bold text-primary">${product.price.toFixed(2)}</span> to:</p>
                    <div className="text-xs text-text-muted p-2 bg-card rounded font-mono">
                      Bank: Nexora Demo Bank<br/>
                      Account: 1234-5678-9012<br/>
                      Name: Nexora Escrow
                    </div>
                    <div>
                      <Label htmlFor="paymentProofUrl" className="text-xs">Payment Proof URL (Screenshot)</Label>
                      <Input
                        id="paymentProofUrl"
                        type="url"
                        required={paymentMethod === "online"}
                        placeholder="https://example.com/receipt.jpg"
                        value={paymentProofUrl}
                        onChange={(e) => setPaymentProofUrl(e.target.value)}
                        className="mt-1 h-9 text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            </label>

            <label
              className={cn(
                "flex cursor-pointer items-start gap-3 rounded-card border p-4 transition-colors",
                paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex h-5 items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="h-4 w-4 accent-primary"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-text-primary">Cash on Delivery</span>
                  <Truck className="h-4 w-4 text-text-muted" />
                </div>
                <p className="mt-1 text-xs text-text-muted">Pay with cash when the order is delivered to you.</p>
              </div>
            </label>
          </div>

          <div className="flex justify-between pt-2">
            <Button type="button" variant="ghost" onClick={prevStep}>Back</Button>
            <Button type="submit" isLoading={createOrder.isPending}>Place Order</Button>
          </div>
        </form>
      )}

      {step === 4 && placedOrderId && (
        <div className="space-y-6 text-center py-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-text-primary">Order Confirmed!</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Your order for <span className="font-medium text-text-primary">{product.title}</span> has been successfully placed.
            </p>
            {paymentMethod === "online" && (
              <p className="mt-1 text-xs text-text-muted">We will verify your payment shortly.</p>
            )}
          </div>
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
            <a href={invoiceDownloadUrl(placedOrderId)} target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <Button variant="outline" type="button" className="w-full">
                Download Invoice
              </Button>
            </a>
            <Button onClick={handleClose} type="button" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
