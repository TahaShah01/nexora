"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { loginFormSchema, type LoginFormValues } from "@/lib/validators/auth.schema";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginFormSchema) });

  async function onSubmit(values: LoginFormValues) {
    try {
      const authUser = await login(values);
      if (authUser && authUser.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch {
      // AuthContext already surfaces a toast on failure.
    }
  }

  return (
    <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border shadow-2xl bg-card">
      {/* Left Panel — Branding */}
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-primary/90 via-primary to-primary/70 p-10 text-ink">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-btn bg-ink/20 text-sm font-bold text-ink">
            N
          </span>
          <span className="text-xl font-bold">Nexora</span>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold leading-tight">
              Your marketplace,<br />your terms.
            </h2>
            <p className="mt-3 text-ink/80 text-sm leading-relaxed">
              Buy products, book services, or sell your own — all in one trusted platform.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "Verified sellers & providers",
              "Secure payments with buyer protection",
              "Real-time messaging & support",
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

      {/* Right Panel — Form */}
      <div className="flex flex-col justify-center px-8 py-10 sm:px-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6 md:hidden">
            <span className="flex h-8 w-8 items-center justify-center rounded-btn bg-primary text-sm font-bold text-ink">N</span>
            <span className="text-lg font-semibold text-text-primary">Nexora</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Welcome back</h1>
          <p className="mt-1.5 text-sm text-text-secondary">Sign in to continue to your account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium text-text-primary">
              Email address
            </label>
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-text-primary">
                Password
              </label>
              <Link href="#" className="text-xs font-medium text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
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

          <Button type="submit" className="w-full h-11" isLoading={isSubmitting}>
            Sign in
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex-1 border-t border-border" />
          <span className="text-xs text-text-muted">New to Nexora?</span>
          <div className="flex-1 border-t border-border" />
        </div>

        <Link
          href="/register"
          className="mt-4 flex h-11 items-center justify-center rounded-btn border border-border text-sm font-medium text-text-primary hover:bg-elevated transition-colors"
        >
          Create an account
        </Link>

        <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-text-muted">
          <Shield className="h-3.5 w-3.5" />
          Your data is secured with end-to-end encryption
        </p>
      </div>
    </div>
  );
}
