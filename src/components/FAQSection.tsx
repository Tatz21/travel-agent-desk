import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I register as a travel agent?",
    answer: "Registering is simple! Click the 'Register Now' button, fill in your business details, upload required documents, and our team will verify your account within 24-48 hours. Once approved, you'll have full access to our booking platform.",
  },
  {
    question: "What commission rates do you offer?",
    answer: "We offer competitive, industry-leading commission rates based on the type of service and overall booking volume. Flight bookings, bus ticketing, and hotel reservations each have different commission structures, with hotel bookings generally offering higher earning potential. Partners with higher booking volumes are eligible for enhanced commission benefits.",
  },
  {
    question: "Is there any registration fee or subscription cost?",
    answer: "No, registration is completely free! There are no hidden fees, subscription costs, or minimum booking requirements. You only earn commissions on successful bookings with no upfront investment required.",
  },
  {
    question: "How and when do I receive my commission payments?",
    answer: "We follow a structured and transparent commission process for all partners. Earnings from confirmed bookings are credited directly to your registered bank account, with complete tracking and reporting available through your partner dashboard.",
  },
  {
    question: "What support is available if I face booking issues?",
    answer: "Our dedicated support team is available 24/7 via phone, email, and live chat to assist with any booking-related issues. Registered agents receive priority support, along with access to a comprehensive knowledge base and helpful resources.",
  },
  {
    question: "Can I manage bookings for multiple customers simultaneously?",
    answer: "Yes. You can efficiently manage multiple customer bookings at the same time, with tools designed to support team operations and growing business needs..",
  },
  {
    question: "What documents are required for registration?",
    answer: "You'll need a valid government ID, business registration certificate (if applicable), GST certificate (optional), and a cancelled cheque or bank statement for payment processing. Individual agents can register with just their ID and PAN card.",
  },
  {
    question: "Do you offer dedicated account management for B2B partners?",
    answer: "Yes. Our B2B partners receive personalized account support to assist with onboarding, operational queries, and business growth. This ensures smoother coordination, faster issue resolution, and a more efficient partnership experience.",
  },
];

const FAQSection = () => {
  return (
    <section className="py-20 bg-section-alt">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Got Questions?
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary mt-3 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-primary text-lg max-w-2xl mx-auto">
            Find answers to common questions about partnering with us and growing your travel business.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors duration-300"
              >
                <AccordionTrigger className="text-left font-display text-lg font-medium text-foreground hover:text-primary py-5 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
