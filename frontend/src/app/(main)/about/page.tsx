import { 
  Building2, 
  CheckCircle2, 
  Globe2, 
  HeartHandshake, 
  Image as ImageIcon,
  Lock, 
  MessageSquare, 
  Moon, 
  MonitorSmartphone, 
  Package, 
  ShieldCheck, 
  ShoppingBag, 
  Star, 
  UserCircle,
  Users
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About | Nexora",
  description: "Learn more about Nexora, the unified product and service marketplace platform.",
};

const MISSION_CARDS = [
  {
    title: "Empowering Commerce",
    description: "Connecting buyers and sellers in a seamless, unified marketplace tailored for modern needs.",
    icon: ShoppingBag,
  },
  {
    title: "Enabling Professionals",
    description: "Bridging the gap between talented service providers and clients seeking quality work.",
    icon: Building2,
  },
  {
    title: "Building Trust",
    description: "Fostering secure, transparent relationships and making online commerce simple and reliable.",
    icon: ShieldCheck,
  },
];

const FEATURES = [
  { label: "Product Marketplace", icon: Package },
  { label: "Service Marketplace", icon: HeartHandshake },
  { label: "Real-time Messaging", icon: MessageSquare },
  { label: "Secure Authentication", icon: Lock },
  { label: "Reviews & Ratings", icon: Star },
  { label: "Smart Profiles", icon: UserCircle },
  { label: "Cloud Image Storage", icon: ImageIcon },
  { label: "Live Notifications", icon: Globe2 },
  { label: "Responsive Design", icon: MonitorSmartphone },
  { label: "Dark Mode Support", icon: Moon },
];

const STATS = [
  { value: "15K+", label: "Users" },
  { value: "8K+", label: "Products" },
  { value: "3K+", label: "Services" },
  { value: "50K+", label: "Transactions" },
];

const TIMELINE = [
  { step: 1, title: "Create account", description: "Sign up in seconds to join the community." },
  { step: 2, title: "Complete profile", description: "Add your details, avatar, and social links." },
  { step: 3, title: "Explore products & services", description: "Browse thousands of quality listings." },
  { step: 4, title: "Connect with people", description: "Chat directly using real-time messaging." },
  { step: 5, title: "Buy, Sell or Book", description: "Complete secure transactions with ease." },
  { step: 6, title: "Leave Reviews", description: "Help others by sharing your experience." },
];

const CORE_VALUES = [
  { title: "Trust", description: "We prioritize safety and reliability above all else." },
  { title: "Security", description: "Your data and transactions are protected." },
  { title: "Community", description: "We build features that bring people together." },
  { title: "Quality", description: "We maintain high standards for all listings." },
  { title: "Innovation", description: "Continuously improving the platform experience." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* 1. Hero Section */}
      <section className="flex flex-col items-center text-center py-12 sm:py-20">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-6xl mb-6">
          Nexora
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mb-10">
          One ecosystem for products, services, communication and trusted communities.
          Discover a premium unified marketplace built for the modern internet.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/products">
            <Button size="lg" className="px-8">Explore Marketplace</Button>
          </Link>
          <Link href="/services">
            <Button size="lg" variant="outline" className="px-8">Browse Services</Button>
          </Link>
        </div>
      </section>

      {/* 2. Our Mission */}
      <section className="py-16">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Our Mission</h2>
          <p className="mt-4 text-text-secondary">What drives us every day.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          {MISSION_CARDS.map((card, i) => (
            <div key={i} className="rounded-card border border-border bg-card p-8 flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-btn bg-primary/15 text-primary mb-6">
                <card.icon className="h-6 w-6" />
              </span>
              <h3 className="text-lg font-semibold text-text-primary mb-3">{card.title}</h3>
              <p className="text-sm text-text-secondary">{card.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Why Nexora */}
      <section className="py-16">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Why Nexora</h2>
          <p className="mt-4 text-text-secondary max-w-2xl">
            A comprehensive suite of tools and features designed to provide the best experience for everyone.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {FEATURES.map((feature, i) => (
            <div key={i} className="flex items-center gap-3 rounded-card border border-border bg-card p-4">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              <span className="text-sm font-medium text-text-primary">{feature.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Platform Statistics */}
      <section className="py-16">
        <div className="rounded-card bg-elevated border border-border p-10 sm:p-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 text-center">
            {STATS.map((stat, i) => (
              <div key={i}>
                <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-text-secondary">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How Nexora Works */}
      <section className="py-16">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">How Nexora Works</h2>
          <p className="mt-4 text-text-secondary">Your journey on our platform.</p>
        </div>
        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
          
          <div className="grid gap-8 md:grid-cols-6 relative z-10">
            {TIMELINE.map((item, i) => (
              <div key={i} className="flex flex-col md:items-center relative">
                {/* Mobile connecting line */}
                {i !== TIMELINE.length - 1 && (
                  <div className="md:hidden absolute top-10 left-6 w-0.5 h-full bg-border -z-10" />
                )}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-card border-2 border-primary text-primary font-bold text-lg mb-4 shrink-0 shadow-sm">
                  {item.step}
                </div>
                <div className="md:text-center pl-16 md:pl-0 -mt-12 md:mt-0">
                  <h3 className="text-base font-semibold text-text-primary mb-2 md:mt-2">{item.title}</h3>
                  <p className="text-xs text-text-secondary">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Core Values */}
      <section className="py-16">
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl">Core Values</h2>
          <p className="mt-4 text-text-secondary">The principles that guide our development.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CORE_VALUES.map((value, i) => (
            <div key={i} className="rounded-card border border-border bg-card p-6 hover:border-primary/50 transition-colors">
              <h3 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {value.title}
              </h3>
              <p className="text-sm text-text-secondary ml-3.5">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-16">
        <div className="flex flex-col items-center justify-center text-center rounded-card bg-primary/5 border border-primary/20 p-10 sm:p-16">
          <Users className="h-12 w-12 text-primary mb-6" />
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl mb-4">Ready to get started?</h2>
          <p className="text-text-secondary mb-8 max-w-md">
            Join thousands of users already buying, selling, and connecting on Nexora.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="bg-surface">Browse Services</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
