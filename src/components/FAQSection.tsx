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
    answer: "We offer industry-leading commission rates ranging from 5% to 15% depending on the service type and booking volume. Flight bookings typically earn 5-8%, bus tickets 8-10%, and hotel reservations 10-15%. Higher volume partners enjoy enhanced rates.",
  },
  {
    question: "Is there any registration fee or subscription cost?",
    answer: "No, registration is completely free! There are no hidden fees, subscription costs, or minimum booking requirements. You only earn commissions on successful bookings with no upfront investment required.",
  },
  {
    question: "How and when do I receive my commission payments?",
    answer: "Commissions are calculated weekly and paid directly to your registered bank account. Payments are processed every Monday for the previous week's confirmed bookings. You can track all earnings in real-time through your dashboard.",
  },
  {
    question: "What support is available if I face booking issues?",
    answer: "Our dedicated support team is available 24/7 via phone, email, and live chat. Priority support is provided to registered agents with an average response time of under 5 minutes. We also offer a comprehensive knowledge base and video tutorials.",
  },
  {
    question: "Can I manage bookings for multiple customers simultaneously?",
    answer: "Absolutely! Our platform is designed for high-volume agents. You can manage unlimited customer profiles, handle multiple bookings simultaneously, and even set up sub-agent accounts for your team members.",
  },
  {
    question: "What documents are required for registration?",
    answer: "You'll need a valid government ID, business registration certificate (if applicable), GST certificate (optional), and a cancelled cheque or bank statement for payment processing. Individual agents can register with just their ID and PAN card.",
  },
  {
    question: "Do you provide marketing materials and training?",
    answer: "Yes! We provide comprehensive training through webinars and video tutorials. Partners also receive marketing materials including brochures, digital banners, and co-branded content to help grow their business.",
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
