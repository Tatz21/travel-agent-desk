import { Plane, Bus, Hotel, ArrowRight, CheckCircle, Headphones, CreditCard, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Header from "@/components/Header";

const services = [
  {
    id: "flight-bookings",
    icon: Plane,
    title: "Flight Bookings",
    description: "Access real-time domestic flight fares with instant ticketing and reliable airline partners.",
    features: [
      "Domestic & International Flights",
      "Real-time Seat Availability",
      "Instant E-Ticket Generation",
      "Multi-city & Round Trip Options",
      "Group Booking Discounts",
      "24/7 Booking Support"
    ],
    benefits: ["Up to 8% Commission", "Same-day Settlements", "No Hidden Fees"],
    gradient: "from-blue-500 to-cyan-600",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  },
  {
    id: "bus-tickets",
    icon: Bus,
    title: "Bus Tickets",
    description: "Book bus tickets across major routes in India with live seat availability and instant confirmation.",
    features: [
      "Pan-India Coverage",
      "1000+ Bus Operators",
      "Live GPS Tracking",
      "Easy Cancellation & Refunds",
      "Seat Selection",
      "Pick-up Point Flexibility"
    ],
    benefits: ["Up to 15% Commission", "Instant Confirmation", "Zero Cancellation Charges"],
    gradient: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
  },
  {
    id: "hotel-reservations",
    icon: Hotel,
    title: "Hotel Reservations",
    description: "Choose from a wide range of hotels across India with competitive pricing and flexible booking options.",
    features: [
      "50,000+ Properties",
      "Best Rate Guarantee",
      "Free Cancellation Options",
      "Verified Guest Reviews",
      "Room Upgrades Available",
      "Corporate Tie-ups"
    ],
    benefits: ["Up to 20% Commission", "Pay at Hotel Options", "Loyalty Rewards"],
    gradient: "from-violet-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
];

const features = [
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Bank-grade security for all your bookings and payments",
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Instant confirmations and live status tracking",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Dedicated support team available round the clock",
  },
  {
    icon: CreditCard,
    title: "Flexible Payments",
    description: "Multiple payment options including credit and wallet",
  },
];

const Services = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(./service.jpg)"
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider uppercase bg-primary-foreground/10 text-primary-foreground rounded-full border border-primary-foreground/20">
            Our Services
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-primary-foreground mb-6">
            Complete Travel Solutions
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
            Everything you need to run a successful travel business. Book, manage, and earn with our comprehensive platform.
          </p>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="bg-card rounded-2xl p-6 text-center shadow-xl border border-border/50 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-muted-foreground text-xs">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-24">
          {services.map((service, index) => (
            <div 
              key={service.id}
              className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${service.gradient} text-white text-sm font-medium mb-6`}>
                  <service.icon className="w-4 h-4" />
                  {service.title}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-6">
                  {service.title}
                </h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  {service.description}
                </p>
                
                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 gap-3 mb-8">
                  {service.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Benefits */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {service.benefits.map((benefit) => (
                    <span 
                      key={benefit}
                      className="px-4 py-2 bg-accent/10 text-accent-foreground rounded-full text-sm font-medium"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>

                <Link to={`/services/${service.id}`}>
                  <Button size="lg" className="group">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="relative">
                  <img 
                    src={service.image}
                    alt={service.title}
                    className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover"
                  />
                  <div className={`absolute -bottom-6 ${index % 2 === 0 ? '-right-6' : '-left-6'} bg-gradient-to-r ${service.gradient} text-white rounded-2xl p-6 shadow-xl`}>
                    <div className="text-3xl font-bold font-serif">{service.benefits[0]}</div>
                    <p className="text-sm opacity-80">On Every Booking</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)'
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary-foreground mb-6">
            Ready to Grow Your Travel Business?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of successful travel agents and start earning more with Phoenix Travelopedia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
