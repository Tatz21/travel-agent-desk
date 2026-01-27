import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const contactInfo = [
  {
    icon: Phone,
    title: "Call Us",
    details: ["+91 9147711694", "+91 9831208102"],
    color: "bg-primary",
    gradient: "from-sky-300 to-red-300",
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["info@phoenixtravelopedia.com", "support@phoenixtravelopedia.com"],
    color: "bg-primary",
    gradient: "from-yellow-300 to-blue-300",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["Globsyn Crystals Bulding, Street Number 17, EP Block, Sector V, Bidhannagar, Kolkata, West Bengal, 700091, India"],
    color: "bg-primary",
    gradient: "from-pink-300 to-teal-300",
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["24/7 Support Available"],
    color: "bg-primary",
    gradient: "from-teal-300 to-yellow-300",
  },
];

const ContactUsSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-3 animate-fade-in-down">
              Get In Touch
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-serif text-foreground mb-6">
              We're Here to Help
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Have questions about our services or need assistance with your bookings?
              Our dedicated support team is available to help you succeed in your travel business.
            </p>

            <Link to="/contact">
              <Button variant="default" size="lg">
                Contact Us
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Right - Contact Cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {contactInfo.map((info, index) => (
              <Card
                key={info.title}
                className={`
                  group relative overflow-hidden border border-border/50 bg-gradient-to-br ${info.gradient}
                  transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
                  transform-gpu
                  hover:-translate-y-2 hover:scale-[1.02]
                  hover:shadow-2xl hover:border-primary/40
                  active:scale-[0.97] active:translate-y-0
                `} style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span
                  className="
                  pointer-events-none absolute inset-0
                  bg-gradient-to-r from-white/0 via-white/25 to-white/0
                  opacity-0 group-hover:opacity-100
                  transition-opacity duration-700
                  "
                />
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center mb-4 transition-all duration-500 ease-out transform-gpu group-hover:scale-110 group-hover:rotate-3 group-active:scale-95`}>
                    <info.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold font-serif text-card-foreground mb-3 transition-colors duration-300 group-hover:text-primary-foreground">
                    {info.title}
                  </h3>
                  <div className="space-y-1">
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-sm text-white/90 transition-colors duration-300 group-hover:text-primary">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUsSection;
