"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, Shield, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { registerFormSchema, type RegisterFormValues } from "@/lib/validators/auth.schema";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: { value: RegisterFormValues["role"]; label: string; description: string; emoji: string }[] = [
  { value: "buyer", label: "Buyer", description: "Shop & book services", emoji: "🛍️" },
  { value: "seller", label: "Seller", description: "Sell your products", emoji: "📦" },
  { value: "provider", label: "Provider", description: "Offer your services", emoji: "🔧" },
];

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RegisterFormValues["role"]>("buyer");
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { role: "buyer" },
  });

  function handleRoleSelect(role: RegisterFormValues["role"]) {
    setSelectedRole(role);
    setValue("role", role);
  }

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerUser(values);
      router.push("/");
    } catch {
      // AuthContext already surfaces a toast on failure.
    }
  }

  return (
    <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border shadow-2xl bg-card">
      {/* Left Branding Panel */}
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-primary/90 via-primary to-primary/70 p-10 text-ink">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-btn bg-ink/20 text-sm font-bold text-ink">N</span>
          <span className="text-xl font-bold">Nexora</span>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold leading-tight">Join thousands of<br />creators & buyers.</h2>
            <p className="mt-3 text-ink/80 text-sm leading-relaxed">
              Start your journey on the most trusted marketplace. It's free to join.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "Free account, no credit card needed",
              "List your first product in minutes",
              "Secure & fast payments",
            ].map((feat) => (
              <div key={feat} className="flex items-center gap-2 text-sm text-ink/90">
                <Sparkles className="h-4 w-4 shrink-0 text-ink/60" />
                {feat}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-ink/50">© {new Date().getFullYear()} Nexora. All rights reserved.</p>
      </div>

      {/* Right Form Panel */}
      <div className="flex flex-col justify-center px-8 py-10 sm:px-12 overflow-y-auto max-h-screen">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4 md:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-btn bg-primary text-sm font-bold text-ink">N</span>
            <span className="text-lg font-semibold text-text-primary">Nexora</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Create your account</h1>
          <p className="mt-1.5 text-sm text-text-secondary">Join the Nexora community today.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium text-text-primary">Full name</label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id="name"
                autoComplete="name"
                placeholder="Jane Doe"
                className={cn(
                  "h-11 w-full rounded-input border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary transition-colors",
                  errors.name ? "border-danger focus:ring-danger" : "border-border"
                )}
                {...register("name")}
              />
            </div>
            {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-text-primary">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={cn(
                  "h-11 w-full rounded-input border bg-surface pl-10 pr-4 text-sm text-text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary transition-colors",
                  errors.email ? "border-danger focus:ring-danger" : "border-border"
                )}
                {...register("email")}
              />
            </div>
            {errors.email && <p className="text-xs text-danger">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-text-primary">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                className={cn(
                  "h-11 w-full rounded-input border bg-surface pl-10 pr-10 text-sm text-text-primary placeholder:text-placeholder focus:outline-none focus:ring-2 focus:ring-primary transition-colors",
                  errors.password ? "border-danger focus:ring-danger" : "border-border"
                )}
                {...register("password")}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-danger">{errors.password.message}</p>}
          </div>

          {/* Role Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">I'm joining as</label>
            <input type="hidden" {...register("role")} value={selectedRole} />
            <div className="grid grid-cols-3 gap-2">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleRoleSelect(opt.value)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-input border p-3 text-center transition-all",
                    selectedRole === opt.value
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-surface text-text-secondary hover:border-primary/50 hover:bg-elevated"
                  )}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-xs font-semibold">{opt.label}</span>
                  <span className="text-[10px] text-text-muted leading-tight">{opt.description}</span>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full h-11" isLoading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-text-secondary">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
        </p>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-text-muted">
          <Shield className="h-3.5 w-3.5" />
          Your data is secured with end-to-end encryption
        </p>
      </div>
    </div>
  );
}
