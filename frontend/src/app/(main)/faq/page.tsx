import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Nexora",
  description: "Frequently asked questions about Nexora.",
};

export default function FAQPage() {
  const faqs = [
    {
      question: "What is Nexora?",
      answer: "Nexora is a premium community marketplace where you can securely buy products, hire service providers, and sell your own offerings.",
    },
    {
      question: "How do I make a purchase?",
      answer: "Simply browse our marketplace, find a product or service you love, and proceed through our secure checkout process. You can pay via Cash on Delivery or use our safe Online Payment portal.",
    },
    {
      question: "Is it free to sell on Nexora?",
      answer: "Creating an account and listing your products or services is completely free. We take a small platform fee only when you successfully complete a transaction.",
    },
    {
      question: "How do I become a verified provider?",
      answer: "Providers who have successfully completed 10+ jobs with an average rating of 4.5+ stars are automatically eligible for the 'Verified' badge. This helps build trust with potential clients.",
    },
    {
      question: "What if I have an issue with an order?",
      answer: "If you run into any problems, please contact our support team via the Contact page or use our dispute resolution center available in your dashboard under the specific order details.",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="mb-4 text-3xl font-bold text-text-primary">Frequently Asked Questions</h1>
      <p className="mb-10 text-text-secondary">
        Can't find the answer you're looking for? Reach out to our support team.
      </p>

      <div className="space-y-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="rounded-card border border-border bg-card p-6">
            <h3 className="text-lg font-semibold text-text-primary">{faq.question}</h3>
            <p className="mt-2 text-text-secondary">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
