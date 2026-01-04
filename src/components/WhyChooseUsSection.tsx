import { Shield, TrendingUp, Clock, Users, Award, Headphones } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  {
    icon: TrendingUp,
    title: "Higher Commission Rates",
    description: "Phoenix Travelopedia offers a secure, scalable, and reliable travel booking platform built with enterprise-grade security. All bookings, payments, and agent data are protected through encrypted systems, ensuring complete trust and transparency for travel agents.",
  },
  {
    icon: Shield,
    title: "Trusted & Reliable",
    description: "Phoenix Travelopedia is trusted by travel agents across India as a reliable B2B travel management company. We focus on long-term partnerships by delivering consistent service quality, accurate inventory, and timely support.",
  },
  {
    icon: Clock,
    title: "Real-Time Availability",
    description: "Access a wide network of hotels, holiday destinations, and travel services across Pan-India locations. From metro cities to popular tourist destinations, Phoenix Travelopedia covers the complete Indian travel market.",
  },
  {
    icon: Users,
    title: "Dedicated Support Team",
    description: "Each registered agent receives personalized support with a dedicated account manager. Our premium service ensures faster issue resolution, better pricing assistance, and strategic support to grow your travel business.",
  },
  {
    icon: Award,
    title: "Exclusive Deals",
    description: "Unlock special rates and exclusive packages not available to the general public. Delight your customers with unbeatable offers.",
  },
  {
    icon: Headphones,
    title: "Easy Integration",
    description: "Seamless onboarding with our user-friendly platform. Start booking within minutes with minimal training required.",
  },
];

const WhyChooseUsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-primary/30 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div 
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="text-primary font-medium font - bold lg:text-5x1 text-sm uppercase tracking-wider">
            Why Partner With Us
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            Why Choose Phoenix Travelopedia
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Phoenix Travelopedia is a leading B2B travel portal in India, designed exclusively for travel agents and tour operators. We help agents grow their business with competitive pricing, reliable technology, and end-to-end travel solutions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group rounded-2xl p-8 border border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-primary/5 via-card to-accent/10 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ 
                transitionDelay: isVisible ? `${index * 100}ms` : '0ms',
              }}
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-6 group-hover:from-primary group-hover:to-primary group-hover:scale-110 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;
