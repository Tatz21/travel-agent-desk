import { Users, Target, Award, Heart, Globe, Shield, ArrowRight, CheckCircle, CreditCard, MapPin, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Header from "@/components/Header";
import { useEffect } from "react";
import FeedbackSection from "@/components/FeedbackSection";
import heroAboutImage from "@/assets/goa-beach.jpg";

const values = [
  {
    icon: Shield,
    title: "Integrity & Transparency",
    description: "We follow ethical business practices with complete transparency, building long-term trust with travel partners and real estate clients.",
  },
  {
    icon: Heart,
    title: "Customer-First Commitment",
    description: "Our partners’ success comes first. We deliver reliable support, personalized solutions, and seamless service at every stage.",
  },
  {
    icon: Globe,
    title: "Smart Innovation",
    description: "We leverage advanced technology and data-driven solutions to continuously improve performance, efficiency, and user experience.",
  },
  {
    icon: Award,
    title: "Excellence in Every Interaction",
    description: "From service quality to execution, we maintain the highest standards to deliver consistent value and lasting satisfaction.",
  },
];

const stats = [
  { icon: Users, label: "Extensive Agents Network" },
  { icon: CreditCard, label: "Fast & Reliable Transaction Processing" },
  { icon: MapPin, label: "Serving Multiple Destinations" },
  { icon: Headphones, label: "24/7 Dedicated Customer Support" },
];

const team = [
  {
    name: "Pankaj Mallick",
    role: "Founder",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "Prasenjit Mallick",
    role: "Chief Executive Officer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Dipa Singh",
    role: "Sales Manager",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "Mukteswar Mondal",
    role: "Chief Technology Officer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Koushik Ghosh",
    role: "Backend Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  }
];

const About = () => {
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
            backgroundImage: `url(${heroAboutImage})`
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="inline-block px-4 py-2 text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white mb-6 bg-black/40 backdrop-blur-sm rounded-lg animate-fade-in-up">
            Empowering Travel Entrepreneurs
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto mb-8">
            Phoenix Travelopedia is India's leading B2B travel platform, connecting travel agents with the best deals on flights, hotels, and buses.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 mt-5 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="bg-card rounded-2xl p-6 text-center shadow-xl border border-border/50 hover:scale-110 transition-transform duration-300 group"
              >
                <div className="text-3xl md:text-4xl font-bold font-serif text-primary mb-2">
                  {stat.icon && <stat.icon className="w-10 h-10 mx-auto group-hover:animate-bounce transition-transform" />}
                </div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-6">
                Our Founder's Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Our journey began in 1997 under the visionary leadership of <b>Late Mr. Pankaj Mallick</b>, the founder of our organization. What started as a small travel service initiative was built on strong core values—<b>trust, transparency, and long-term partnerships</b>. Through his dedication, integrity, and deep understanding of the travel industry, Late Mr. Mallick laid a strong foundation for a business focused on reliable travel solutions and ethical operations, earning the confidence of travel agents and industry partners.
                </p>
                <p>
                  Over the years, the company evolved into a <b>trusted B2B travel service provider</b>, supporting travel agents, tour operators, and corporate partners with consistent service delivery and dependable backend operations. Our reputation has been built on <b>accurate ticketing, smooth settlements, operational efficiency, and partner-first support</b>, enabling our associates to grow their businesses with confidence.
                </p>
                <p>
                  Although <b>Late Mr. Pankaj Mallick</b> is no longer with us, his vision and values continue to guide our business. His legacy lives on through our commitment to integrity, excellence, and long-term partnerships.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Team collaboration"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CEO Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Team collaboration"
                className="rounded-3xl shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-6">
                Our CEO Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  In <b>2018</b>, leadership was assumed by his son, <b>Mr. Prasenjit Mallick</b>, who carried the legacy forward with a technology-driven and scalable B2B approach. Under his direction, the company strengthened its <b>digital infrastructure, agent portal capabilities, and service automation</b>, ensuring faster bookings, transparent transactions, and improved partner experience.
                </p>
                <p>
                  Today, our <b>B2B travel portal</b> offers comprehensive services including <b>flight ticket booking, bus ticket booking, and hotel reservations</b>, designed specifically to meet the operational needs of travel agents and corporate partners. As a proud member of <b>TAAB (Travel Agents Association of Bengal)</b>, we strictly adhere to industry standards, compliance norms, and ethical business practices.
                </p>
                <p>
                  With decades of industry experience, a strong legacy of trust, and a future-focused mindset, we remain committed to empowering our partners with <b>reliable technology, competitive solutions, and long-term business support</b>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-border/50 bg-card overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6">
                  <Target className="w-7 h-7 text-primary-foreground group-hover:animate-lattoo" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-card-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our mission is to empower travel entrepreneurs and agents across India by providing world-class travel technology, competitive B2B pricing, and dedicated partner support. We strive to enable our partners to grow profitable, scalable, and sustainable travel businesses through seamless access to flights, hotels, buses, and complete travel solutions—all on a single, reliable platform.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-6">
                  <Globe className="w-7 h-7 text-accent-foreground group-hover:animate-lattoo" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-card-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our vision is to become India’s most trusted and innovative B2B travel platform, redefining how travel businesses operate in a digital-first world. By continuously investing in technology, transparency, and partner success, we aim to transform the travel trade ecosystem in India and expand our footprint globally.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that drive our growth and define our commitment
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card 
                key={value.title}
                className="border-border/50 bg-card text-center hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-serif text-card-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
              Leadership Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the people driving innovation in travel technology
            </p>
          </div>

          {/* 5 Column Responsive Grid */}
          <div className="
            grid 
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            xl:grid-cols-5
            gap-8
          ">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6 mx-auto w-36 h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden shadow-xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <h3 className="text-lg font-bold font-serif text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-primary text-sm">{member.role}</p>
              </div>
            ))}
          </div>
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
            Ready to Partner With Us?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of travel agents who rely on Phoenix Travelopedia’s secure and scalable B2B travel platform to accelerate business growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Get Started Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary hover:bg-primary-foreground/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
