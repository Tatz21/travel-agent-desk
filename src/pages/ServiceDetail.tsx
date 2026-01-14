import { useParams, Link, Navigate } from "react-router-dom";
import { Plane, Bus, Hotel, ArrowRight, ArrowLeft, CheckCircle, Star, Users, Clock, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Header from "@/components/Header";
import { useEffect } from "react";
import FeedbackSection from "@/components/FeedbackSection";

  const servicesData = {
    "flight-bookings": {
      icon: Plane,
      title: "Flight Bookings",
      tagline: "Soar Higher with Better Deals",
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
    heroImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&q=80",
  },
  "bus-tickets": {
    icon: Bus,
    title: "Bus Tickets",
    tagline: "Connect India by Road",
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
    heroImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80",
  },
  "hotel-reservations": {
    icon: Hotel,
    title: "Hotel Reservations",
    tagline: "Stay Anywhere, Earn Everywhere",
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
    heroImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80",
  },
};

const ServiceDetail = () => {
  const { serviceId } = useParams();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [serviceId]);

  const service = servicesData[serviceId as keyof typeof servicesData];

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const IconComponent = service.icon;

  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Header />
      <FeedbackSection />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)`
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <Link 
            to="/services" 
            className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${service.gradient} text-white text-sm font-medium mb-6`}>
                <IconComponent className="w-4 h-4" />
                {service.title}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-primary-foreground mb-4">
                {service.tagline}
              </h1>
              <p className="text-xl text-primary-foreground/80 mb-8">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                    Get Started
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
            <div className="relative">
              <img 
                src={service.heroImage}
                alt={service.title}
                className="rounded-3xl shadow-2xl w-full aspect-[4/3] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {/* <section className="py-12 px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {service.stats.map((stat) => (
              <div 
                key={stat.label}
                className="bg-card rounded-2xl p-6 text-center shadow-xl border border-border/50"
              >
                <div className="text-3xl md:text-4xl font-bold font-serif text-primary mb-2">
                  {stat.number}
                </div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
              Why Choose Our {service.title}?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to deliver exceptional {service.title.toLowerCase()} experiences
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.features.map((feature, index) => (
              <Card 
                key={feature.title}
                className="border-border/50 bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${service.gradient} flex items-center justify-center flex-shrink-0`}>
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-card-foreground mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-10 text-center lg:text-left">
            Platform Benefits
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {service.benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-5 bg-card rounded-2xl 
                          border border-border/50 shadow-sm 
                          hover:shadow-lg hover:-translate-y-1 
                          transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.gradient}
                              flex items-center justify-center flex-shrink-0`}
                >
                  <Star className="w-6 h-6 text-white" />
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8"
        style={{
          background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)`
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary-foreground mb-6">
            Start Booking {service.title} Today
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of travel agents already earning with Phoenix Travelopedia's {service.title.toLowerCase()}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Create Free Account
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary hover:bg-primary-foreground/10">
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServiceDetail;
