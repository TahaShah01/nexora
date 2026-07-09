import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Nexora",
  description: "Privacy Policy for Nexora.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-text-primary">Privacy Policy</h1>
      
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-text-secondary">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us when you create or modify your account, request services, contact customer support, or otherwise communicate with us. This information may include your name, email address, phone number, postal address, profile picture, payment method, items requested (for delivery services), delivery notes, and other information you choose to provide.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">2. How We Use Information</h2>
          <p>We use the information we collect about you to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Provide, maintain, and improve our Services.</li>
            <li>Process transactions and send related information.</li>
            <li>Send technical notices, updates, security alerts, and support messages.</li>
            <li>Respond to your comments, questions, and customer service requests.</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our Services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">3. Sharing of Information</h2>
          <p>
            We may share the information we collect about you with third parties such as service providers, business partners, or other users as needed to fulfill your requests for our Services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">4. Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">5. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us via the Contact page.
          </p>
        </section>
      </div>
    </div>
  );
}
