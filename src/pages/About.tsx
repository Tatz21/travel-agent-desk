import { Users, Target, Award, Heart, Globe, Shield, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import Header from "@/components/Header";

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "We believe in honest dealings and complete transparency in all our business operations.",
  },
  {
    icon: Heart,
    title: "Customer First",
    description: "Our partners' success is our priority. We go the extra mile to ensure satisfaction.",
  },
  {
    icon: Globe,
    title: "Innovation",
    description: "Continuously evolving our platform with cutting-edge technology and features.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Committed to delivering the highest quality service in every interaction.",
  },
];

const stats = [
  { number: "10,000+", label: "Travel Agents" },
  { number: "₹500Cr+", label: "Transactions" },
  { number: "1000+", label: "Destinations" },
  { number: "24/7", label: "Support" },
];

const team = [
  {
    name: "Rajesh Kumar",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  {
    name: "Priya Sharma",
    role: "Chief Operations Officer",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  {
    name: "Amit Patel",
    role: "Chief Technology Officer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  {
    name: "Sneha Reddy",
    role: "Head of Partnerships",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <ScrollToTop />
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url(./about.png)"
          }}
        />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-sm font-medium tracking-wider uppercase bg-primary-foreground/10 text-primary-foreground rounded-full border border-primary-foreground/20">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-primary-foreground mb-6">
            Empowering Travel Entrepreneurs
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto mb-8">
            Phoenix Travelopedia is India's leading B2B travel platform, connecting travel agents with the best deals on flights, hotels, and buses.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
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
      </section>

      {/* Story Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 2015, Phoenix Travelopedia began with a simple vision: to democratize travel business in India by providing small and medium travel agents access to the same inventory and pricing as large agencies.
                </p>
                <p>
                  What started as a small team of passionate travel enthusiasts has now grown into India's most trusted B2B travel platform, serving over 10,000 travel agents across the country.
                </p>
                <p>
                  Our journey has been marked by continuous innovation, unwavering commitment to our partners, and a deep understanding of the Indian travel landscape.
                </p>
              </div>
              <div className="mt-8 space-y-3">
                {["Pan-India Network of Travel Partners", "Direct Contracts with Airlines & Hotels", "Real-time Booking Technology", "Dedicated Relationship Managers"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
                alt="Team collaboration"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground rounded-2xl p-6 shadow-xl">
                <div className="text-4xl font-bold font-serif">9+</div>
                <p className="text-sm opacity-80">Years of Excellence</p>
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
                  <Target className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-card-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To empower every travel entrepreneur in India with world-class technology, competitive pricing, and unwavering support, enabling them to build successful and sustainable travel businesses.
                </p>
              </CardContent>
            </Card>
            <Card className="border-border/50 bg-card overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-accent flex items-center justify-center mb-6">
                  <Globe className="w-7 h-7 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold font-serif text-card-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  To be India's most trusted and innovative B2B travel platform, transforming how travel business is conducted across the nation and beyond.
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
              The principles that guide everything we do
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
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-foreground mb-4">
              Leadership Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the people driving innovation in travel technology
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="relative mb-6 mx-auto w-40 h-40 rounded-full overflow-hidden shadow-xl">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
            Join thousands of successful travel agents who trust Phoenix Travelopedia for their business growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                Get Started Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
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
