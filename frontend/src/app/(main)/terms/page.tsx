import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Nexora",
  description: "Terms of Service for Nexora.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold text-text-primary">Terms of Service</h1>
      
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-text-secondary">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using Nexora, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, then you may not access our service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">2. User Accounts</h2>
          <p>
            When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
          </p>
          <p className="mt-2">
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">3. Intellectual Property</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Nexora and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Nexora.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">4. Content Guidelines</h2>
          <p>
            Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the content that you post to the Service, including its legality, reliability, and appropriateness.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-3">5. Governing Law</h2>
          <p>
            These Terms shall be governed and construed in accordance with the laws of the applicable jurisdiction, without regard to its conflict of law provisions.
          </p>
        </section>
      </div>
    </div>
  );
}
