"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Briefcase, 
  Bug, 
  Building, 
  Clock, 
  HelpCircle, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Phone, 
  Twitter 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { contactFormSchema, type ContactFormValues } from "@/lib/validators/contact.schema";
import { Accordion, AccordionItem } from "@/components/ui/accordion";

const CONTACT_INFO = [
  { icon: Mail, title: "Email", value: "support@nexora.example.com", desc: "Our friendly team is here to help." },
  { icon: Phone, title: "Phone", value: "+1 (555) 000-0000", desc: "Mon-Fri from 8am to 5pm." },
  { icon: MapPin, title: "Office", value: "100 Nexora Way, Tech City", desc: "Come say hello at our HQ." },
  { icon: Clock, title: "Support Hours", value: "24/7 Online Support", desc: "We aim to reply within 2 hours." },
  { icon: Twitter, title: "Social Media", value: "@NexoraApp", desc: "Follow us for the latest updates." },
];

const FAQS = [
  { question: "How do I create a seller account?", answer: "You can upgrade to a seller account in your dashboard settings by completing your profile and verifying your identity." },
  { question: "What payment methods are supported?", answer: "We support all major credit cards, PayPal, and Apple Pay for secure transactions." },
  { question: "How does the review system work?", answer: "After a successful transaction, both buyers and sellers can leave a public rating and written review." },
  { question: "Can I offer both products and services?", answer: "Yes! A single Nexora account can manage both product listings and service packages." },
  { question: "Is my personal information secure?", answer: "We use industry-standard encryption and security practices to keep your data safe." },
];

const SUPPORT_CARDS = [
  { icon: HelpCircle, title: "General Inquiry", desc: "Have a question about how Nexora works?", action: "Read Guides" },
  { icon: Bug, title: "Report Issue", desc: "Found a bug or having technical problems?", action: "Submit Ticket" },
  { icon: Briefcase, title: "Business Partnership", desc: "Interested in partnering with Nexora?", action: "Contact Sales" },
];

export default function ContactPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({ 
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      category: "",
      message: ""
    }
  });

  async function onSubmit(values: ContactFormValues) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, send to API here.
    toast.success("Message sent successfully! We'll get back to you soon.");
    setIsSuccess(true);
    reset();
    
    setTimeout(() => setIsSuccess(false), 5000);
  }

  const handleMessagingClick = () => {
    if (user) {
      router.push("/dashboard/messages");
    } else {
      router.push("/login?redirect=/contact");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      {/* 1. Hero */}
      <section className="text-center py-12 sm:py-16">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl mb-4">
          Contact Nexora
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          We're always here to help. Get in touch and let us know how we can assist you.
        </p>
      </section>

      {/* Grid Layout for Info & Form */}
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 mb-20">
        
        {/* 2. Contact Information */}
        <div>
          <h2 className="text-2xl font-bold text-text-primary mb-6">Get in touch</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {CONTACT_INFO.map((info, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-card border border-border bg-card">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-primary/10 text-primary">
                  <info.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-text-primary">{info.title}</h3>
                  <p className="text-sm font-medium text-text-primary mt-1">{info.value}</p>
                  <p className="text-xs text-text-secondary mt-1">{info.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Contact Form */}
        <div className="rounded-card border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-text-primary mb-6">Send us a message</h2>
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center text-center py-12 px-4 rounded-card bg-success/10 border border-success/20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/20 text-success mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-text-primary mb-2">Message Sent!</h3>
              <p className="text-text-secondary">Thank you for reaching out. Our support team will get back to you within 24 hours.</p>
              <Button 
                variant="outline" 
                className="mt-6" 
                onClick={() => setIsSuccess(false)}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Jane Doe"
                    error={errors.fullName?.message}
                    {...register("fullName")}
                  />
                  {errors.fullName && <p className="mt-1 text-xs text-danger">{errors.fullName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    error={errors.email?.message}
                    {...register("email")}
                  />
                  {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  id="category"
                  error={errors.category?.message}
                  {...register("category")}
                >
                  <option value="">Select a category...</option>
                  <option value="support">General Support</option>
                  <option value="billing">Billing & Payments</option>
                  <option value="technical">Technical Issue</option>
                  <option value="feedback">Feedback & Suggestions</option>
                  <option value="other">Other</option>
                </Select>
                {errors.category && <p className="mt-1 text-xs text-danger">{errors.category.message}</p>}
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="How can we help you?"
                  error={errors.subject?.message}
                  {...register("subject")}
                />
                {errors.subject && <p className="mt-1 text-xs text-danger">{errors.subject.message}</p>}
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  placeholder="Tell us more about your inquiry..."
                  error={errors.message?.message}
                  {...register("message")}
                />
                {errors.message && <p className="mt-1 text-xs text-danger">{errors.message.message}</p>}
              </div>

              <Button type="submit" className="w-full" isLoading={isSubmitting} size="lg">
                Send Message
              </Button>
            </form>
          )}
        </div>
      </div>

      {/* 4. FAQ Preview */}
      <section className="py-16 border-t border-border">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-text-primary">Frequently asked questions</h2>
            <p className="mt-2 text-text-secondary">Find quick answers to common questions.</p>
          </div>
          <Button variant="outline">View All FAQs</Button>
        </div>
        
        <div className="max-w-3xl">
          <Accordion className="w-full">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} title={faq.question}>
                {faq.answer}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* 5. Office Location Placeholder Map */}
      <section className="py-16">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Our Headquarters</h2>
        <div className="w-full h-80 rounded-card border border-border bg-elevated flex flex-col items-center justify-center text-center overflow-hidden relative">
          {/* Subtle grid background to look like an unloaded map */}
          <div className="absolute inset-0 opacity-5" 
               style={{ backgroundImage: 'radial-gradient(var(--color-primary) 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
          </div>
          <Building className="h-12 w-12 text-primary/40 mb-4 relative z-10" />
          <h3 className="text-lg font-semibold text-text-primary relative z-10">Tech City, CA</h3>
          <p className="text-sm text-text-secondary max-w-sm mt-2 relative z-10">
            Interactive map placeholder. Can be integrated with Google Maps or Mapbox when ready.
          </p>
        </div>
      </section>

      {/* 6. Support Cards */}
      <section className="py-16">
        <div className="grid gap-6 sm:grid-cols-3">
          {SUPPORT_CARDS.map((card, i) => (
            <div key={i} className="rounded-card border border-border bg-card p-6 flex flex-col">
              <span className="flex h-12 w-12 items-center justify-center rounded-btn bg-surface border border-border mb-4">
                <card.icon className="h-5 w-5 text-text-primary" />
              </span>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{card.title}</h3>
              <p className="text-sm text-text-secondary mb-6 flex-grow">{card.desc}</p>
              <Button variant="outline" className="w-full">{card.action}</Button>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Final CTA */}
      <section className="py-16 mb-8">
        <div className="flex flex-col items-center justify-center text-center rounded-card border border-border bg-elevated p-10 sm:p-16">
          <MessageCircle className="h-10 w-10 text-primary mb-4" />
          <h2 className="text-2xl font-bold text-text-primary sm:text-3xl mb-3">Need immediate assistance?</h2>
          <p className="text-text-secondary mb-8 max-w-md">
            Our support agents are online and ready to help you resolve any issues instantly.
          </p>
          <Button size="lg" onClick={handleMessagingClick}>
            Start Messaging
          </Button>
        </div>
      </section>
    </div>
  );
}
