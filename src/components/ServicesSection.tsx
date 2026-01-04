import { Plane, Bus, Hotel, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Plane,
    title: "Flight Bookings",
    description: "Access real-time domestic flight fares with instant ticketing and reliable airline partners.",
    features: ["Domestic & International", "Real-time Availability", "Instant Confirmation", "24/7 Support"],
    color: "from-primary/20 to-accent/20",
    iconBg: "bg-primary",    
    gradient: "from-emerald-50 to-teal-100",
  },
  {
    icon: Bus,
    title: "Bus Tickets",
    description: "Book bus tickets across major routes in India with live seat availability and instant confirmation.",
    features: ["Pan-India Coverage", "Multiple Operators", "Live Tracking", "Easy Cancellation"],
    color: "from-primary/20 to-accent/20",
    iconBg: "bg-primary",
    gradient: "from-amber-100 to-orange-300",
  },
  {
    icon: Hotel,
    title: "Hotel Reservations",
    description: " From budget hotels to luxury resorts, book accommodations across India with ease. Access exclusive hotel deals, best rate guarantees, and maximize profits on every booking.",
    features: ["50,000+ Properties", "Best Rate Guarantee", "Free Cancellation", "Verified Reviews"],
    color: "from-primary/20 to-accent/20",
    iconBg: "bg-primary",
    gradient: "from-white to-teal-500",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-3 animate-fade-in-down">
            Our Services
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-foreground mb-6">
            Complete Travel Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to run a successful travel business. Book, manage, and earn with our comprehensive platform.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card 
              key={service.title}
              className="group relative overflow-hidden border-border/50 bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} transition-opacity duration-500 group-hover:opacity-0`} />
              <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              
              <CardContent className="relative p-8">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl ${service.iconBg} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-8 h-8 text-primary-foreground" />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold font-serif text-card-foreground mb-4">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button 
                  variant="ghost" 
                  className="group/btn p-0 h-auto text-primary hover:text-primary/80 hover:bg-transparent"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-white mb-6">
            Want to see all our services in action?
          </p>
          <Button variant="default" size="lg">
            Explore All Services
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
