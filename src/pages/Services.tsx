import { useEffect } from "react";
import { Plane, Bus, Hotel, ArrowRight, CheckCircle, Headphones, CreditCard, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Header from "@/components/Header";
import FeedbackSection from "@/components/FeedbackSection";

const services = [
  {
    id: "flight-bookings",
    icon: Plane,
    title: "Flight Bookings",
    description: "Access competitive fares on domestic and international flights through a trusted airline network. Our flight booking platform enables seamless reservations with real-time availability, instant e-ticketing, integrated travel insurance, and 24/7 support for a smooth booking experience.",
    features: [
      {
        title: "Domestic & International Flight Bookings",
        description: "Book flights across major airlines with extensive global route coverage."
      },
      {
        title: "Instant E-Ticket Generation",
        description: "Receive instant booking confirmations and e-tickets without delays."
      },
      {
        title: "Group & Corporate Booking Support",
        description: "Easy management for group travel and corporate flight requirements."
      },
      {
        title: "Real-Time Seat Availability",
        description: "View live seat inventory and fare updates to secure the best options."
      },
      {
        title: "Multi-City & Round-Trip Options",
        description: "Plan and book one-way, round-trip, and multi-city journeys effortlessly."
      },
      {
        title:"Travel Insurance Add-On",
        description:"Enhance bookings with comprehensive travel insurance covering medical emergencies, trip delays, cancellations, and baggage protection."
      },
      {
        title: "24/7 Booking Support",
        description: "Reliable round-the-clock assistance for booking changes, queries, and support."
      }
    ],
    benefits: [
      {
        title: "Secure & Transparent Transactions",
        description: "All bookings and payments are protected with advanced security and clear pricing."
      },
      {
        title: "Efficient Settlement Process",
        description: "Fast and streamlined transaction handling for smooth operations."
      }
    ],
    gradient: "from-blue-500 to-cyan-600",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80",
  },
  {
    id: "bus-tickets",
    icon: Bus,
    title: "Bus Tickets",
    description: "Connect your customers to India’s largest bus network. From luxury coaches to budget bus tickets, provide the best travel options across all routes.",
    features: [
      {
        title: "Pan-India Bus Coverage",
        description: "Access buses across India with ease."
      },
      {
        title: "Secure Bus Booking with Verified Operators",
        description: "Enjoy reliable travel on every route."
      },
      {
        title: "Live GPS Bus Tracking",
        description: "Track buses in real-time for safe and timely journeys"
      },
      {
        title: "Seat Selection & Pick-up Point Flexibility",
        description: "Let passengers select their seats and convenient boarding points."
      },
      {
        title: "Easy Bus Ticket Cancellation & Refunds",
        description: "Hassle-free cancellations & refunds."
      },
      {
        title: "Instant Bus Ticket Confirmation",
        description: "Get e-tickets instantly upon booking."
      }
    ],
    benefits: [
      {
        title: "Safe & Transparent Payments",
        description: "Ensure secure transactions with clear and upfront pricing."
      },
      {
        title: "Streamlined Settlement Process",
        description: "Fast, hassle-free operations for travel agents and partners."
      }
    ],
    gradient: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
  },
  {
    id: "hotel-reservations",
    icon: Hotel,
    title: "Hotel Reservations",
    description: "From budget hotels to luxury resorts, book accommodations across India with ease. Access exclusive hotel deals, best rate guarantees, and maximize profits on every booking.",
    features: [
      {
        title: "Extensive Verified Properties",
        description: "Stay at trusted hotels, resorts, and guesthouses across India."
      },
      {
        title: "Best Rate Guarantee",
        description: "Get the lowest prices on all hotel bookings."
      },
      {
        title: "Verified Guest Reviews",    
        description: "Make informed choices based on real feedback."
      },
      {
        title: "Room Upgrades Available",
        description: "Enhance your stay with premium options."
      },
      {
        title: "Corporate Tie-ups",
        description: "Special rates and packages for business travelers."  
      },
      {
        title: "Pay at Hotel Options",
        description: "Convenient payment directly at the hotel."
      },
      {
        title: "Loyalty Rewards",
        description: "Earn rewards and benefits on every booking."
      }
    ],
    benefits: [
      {
        title: "Best Rate Advantage",
        description: "Offer competitive pricing with better margins."
      },
      {
        title: "Easy Booking Dashboard",
        description: "Manage searches, bookings, and cancellations from one place."
      }
    ],
    gradient: "from-violet-500 to-purple-600",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  },
];

const features = [
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Enterprise-grade security ensures safe, compliant, and reliable transactions across all bookings and payment processes.",
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description: "Access instant confirmations and live operational updates to manage bookings efficiently and reduce turnaround time.",
  },
  {
    icon: Headphones,
    title: "24/7 Partner Support",
    description: "Our dedicated partner support team operates 24/7, ensuring uninterrupted assistance for your business operations.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment Solutions",
    description: "Enable multiple payment options, including credit terms and digital payments, designed to support smooth B2B transactions.",
  },
];

const Services = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Header />
      <FeedbackSection />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url(./service-us.jpg)"
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider uppercase bg-primary text-primary-foreground rounded-full border border-primary-foreground/20">
            Our Services
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-primary mb-6">
            Complete Travel Solutions
          </h1>
          <p className="text-xl text-primary max-w-3xl mx-auto">
            Everything you need to run a successful travel business. Book, manage, and earn with our comprehensive platform.
          </p>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 mt-5 relative z-10">
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
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />

                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {feature.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Benefits */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {service.benefits.map((benefit, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium"
                      title={benefit.description}
                    >
                      {benefit.title}
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
            Ready to Transform Your Travel Business?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join Phoenix Travelopedia today and start earning commissions on every booking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Create Agent Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary hover:bg-primary-foreground/10">
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
