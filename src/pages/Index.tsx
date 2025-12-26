import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useAgent } from '@/hooks/useAgent';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Hotel, Bus, Shield, Clock, Award, MapPin, Users, Star } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import logo from '@/assets/logo.gif';
import heroTajMahal from '@/assets/hero-taj-mahal.jpg';
import keralaBackwaters from '@/assets/kerala-backwaters.jpg';
import jaipurPalace from '@/assets/jaipur-palace.jpg';
import himalayanMountains from '@/assets/himalayan-mountains.jpg';
import goaBeach from '@/assets/goa-beach.jpg';
import amerFort from '@/assets/amer-fort.jpg';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { agent, loading: agentLoading } = useAgent();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && user) {
      if (!agentLoading) {
        if (agent) {
          navigate('/dashboard');
        } else {
          navigate('/setup');
        }
      }
    }
  }, [user, agent, authLoading, agentLoading, navigate]);

  if (authLoading || agentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 border-b border-white/20 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <img src={logo} alt="Phoenix Travelopedia" className="h-16 w-auto object-contain" />
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate('/auth')} className="hidden sm:inline-flex">
                Sign In
              </Button>
              <Button onClick={() => navigate('/register')} className="bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Carousel Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 4000,
            }),
          ]}
          className="absolute inset-0 w-full h-full"
        >
          <CarouselContent className="h-screen">
            {[
              { img: heroTajMahal, alt: "Taj Mahal" },
              { img: keralaBackwaters, alt: "Kerala Backwaters" },
              { img: jaipurPalace, alt: "Jaipur Palace" },
              { img: himalayanMountains, alt: "Himalayan Mountains" },
              { img: goaBeach, alt: "Goa Beach" },
            ].map((slide, index) => (
              <CarouselItem key={index} className="h-screen p-0">
                <div 
                  className="relative w-full h-full bg-cover bg-center transition-all duration-1000"
                  style={{ backgroundImage: `url(${slide.img})` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/70 to-background/60"></div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-primary text-lg md:text-xl mb-4 font-light tracking-wider animate-fade-in-down">WELCOME TO</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 text-foreground drop-shadow-lg animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              Phoenix Travelopedia
            </h1>
            <p className="text-3xl sm:text-4xl md:text-5xl font-script italic text-primary/90 mb-8 drop-shadow-md animate-fade-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              Discover Incredible India
            </p>
          </div>
          
          <p className="text-lg md:text-xl text-foreground/90 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'both' }}>
            Your trusted travel booking platform across India. Book flights, buses, and hotels effortlessly while earning competitive commissions as a verified travel agent. Grow your travel business with Phoenix Travelopedia.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'both' }}>
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg shadow-2xl hover:shadow-xl transition-all"
            >
              Start Your Journey
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary bg-background/80 backdrop-blur-sm text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg shadow-lg"
            >
              Learn More
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto bg-background/60 backdrop-blur-md p-6 rounded-lg shadow-2xl animate-scale-in" style={{ animationDelay: '1s', animationFillMode: 'both' }}>
            <div className="text-center hover:scale-110 transition-transform duration-300">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-pulse-slow">500+</p>
              <p className="text-sm text-foreground/80">Agents Network</p>
            </div>
            <div className="text-center hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.1s' }}>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-pulse-slow">10K+</p>
              <p className="text-sm text-foreground/80">Transactions Processed</p>
            </div>
            <div className="text-center hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.2s' }}>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-pulse-slow">50+</p>
              <p className="text-sm text-foreground/80">Service Destinations</p>
            </div>
            <div className="text-center hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.3s' }}>
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2 animate-pulse-slow">24/7</p>
              <p className="text-sm text-foreground/80">Dedicated Support</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
      </section>

      {/* Destinations Gallery */}
      <section id="destinations" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Explore Incredible India</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From majestic mountains to serene beaches, discover India's diverse beauty
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: keralaBackwaters, title: "Kerala Backwaters", desc: "Peaceful houseboat experiences" },
              { img: jaipurPalace, title: "Jaipur Heritage", desc: "Royal palaces and forts" },
              { img: himalayanMountains, title: "Himalayan Adventures", desc: "Mountain trekking and spirituality" },
              { img: goaBeach, title: "Goa Beaches", desc: "Tropical paradise and nightlife" },
              { img: amerFort, title: "Rajasthan Forts", desc: "Historic architectural marvels" },
              { img: heroTajMahal, title: "Taj Mahal", desc: "Wonder of the world" },
            ].map((destination, idx) => (
              <Card 
                key={idx} 
                className="group overflow-hidden border-primary/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'both' }}
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={destination.img} 
                    alt={destination.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{destination.title}</h3>
                    <p className="text-white/90 drop-shadow-md">{destination.desc}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Phoenix Travelopedia enables travel agents to book these high-demand routes instantly with real-time pricing and reliable airline partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-primary/20 bg-card/50 backdrop-blur animate-slide-in-left" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors group-hover:animate-float">
                  <Hotel className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Flight Booking for Travel Agents</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access real-time domestic flight fares with instant ticketing and reliable airline partners.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-primary/20 bg-card/50 backdrop-blur animate-scale-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors group-hover:animate-float">
                  <Plane className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Bus Booking Portal</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Book bus tickets across major routes in India with live seat availability and instant confirmation.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-primary/20 bg-card/50 backdrop-blur animate-slide-in-right" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/20 transition-colors group-hover:animate-float">
                  <Bus className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold mb-4">Hotel Booking System</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose from a wide range of hotels across India with competitive pricing and flexible booking options.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section with Background */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{ backgroundImage: `url(${keralaBackwaters})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Phoenix Travelopedia – India’s Trusted B2B Travel Portal</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Phoenix Travelopedia is a leading B2B travel portal in India, designed exclusively for travel agents and tour operators. We help agents grow their business with competitive pricing, reliable technology, and end-to-end travel solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Secure & Reliable B2B Travel Platform", desc: "Phoenix Travelopedia offers a secure, scalable, and reliable travel booking platform built with enterprise-grade security. All bookings, payments, and agent data are protected through encrypted systems, ensuring complete trust and transparency for travel agents." },
              { icon: Clock, title: "24/7 Travel Agent Support", desc: "Our dedicated support team is available 24/7 to assist travel agents with hotel bookings, holiday packages, cancellations, and customer queries. We ensure smooth operations for your business at every stage of the booking process." },
              { icon: Award, title: "High Commission & Exclusive B2B Rates", desc: "Earn higher margins with competitive commissions and exclusive B2B travel rates. Phoenix Travelopedia provides transparent pricing with no hidden charges, helping travel agents maximize profitability on every booking." },
              { icon: MapPin, title: "Pan-India Hotel & Destination Coverage", desc: "Access a wide network of hotels, holiday destinations, and travel services across Pan-India locations. From metro cities to popular tourist destinations, Phoenix Travelopedia covers the complete Indian travel market." },
              { icon: Users, title: "Trusted B2B Travel Partner for Agents", desc: "Phoenix Travelopedia is trusted by travel agents across India as a reliable B2B travel management company. We focus on long-term partnerships by delivering consistent service quality, accurate inventory, and timely support." },
              { icon: Star, title: "Dedicated Account Manager & Premium Service", desc: "Each registered agent receives personalized support with a dedicated account manager. Our premium service ensures faster issue resolution, better pricing assistance, and strategic support to grow your travel business." },
            ].map((feature, idx) => (
              <Card 
                key={idx} 
                className="border-primary/10 hover:border-primary/30 transition-all duration-300 bg-card/80 backdrop-blur-md hover:shadow-xl hover:scale-105 animate-fade-in"
                style={{ animationDelay: `${idx * 0.1}s`, animationFillMode: 'both' }}
              >
                <CardContent className="p-6">
                  <feature.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, fast, and profitable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { num: "01", title: "Create Account", desc: "Sign up and complete your agent profile to get verified" },
              { num: "02", title: "Start Booking", desc: "Access our platform to book flights, hotels, and buses" },
              { num: "03", title: "Earn & Grow", desc: "Receive commissions and grow your travel business" },
            ].map((step, idx) => (
              <div 
                key={idx} 
                className="text-center relative animate-fade-in-up"
                style={{ animationDelay: `${idx * 0.2}s`, animationFillMode: 'both' }}
              >
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mx-auto shadow-lg hover:shadow-2xl transition-shadow duration-300 hover:scale-110">
                    <span className="text-3xl font-bold text-white">{step.num}</span>
                  </div>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-full h-0.5 bg-primary/30"></div>
                  )}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Background */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${goaBeach})` }}
        >
          <div className="absolute inset-0 bg-background/85"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <Card className="border-primary/30 bg-card/90 backdrop-blur-lg shadow-2xl animate-scale-in"  style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Transform Your Travel Business?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join Phoenix Travelopedia today and start earning commissions on every booking. 
                Your journey to success starts here.
              </p>
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-6 text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Create Agent Account
              </Button>
              <p className="text-sm text-muted-foreground mt-6">
                No credit card required • Free to get started
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <img src={logo} alt="Phoenix Travelopedia" className="h-16 w-auto object-contain mx-auto mb-6" />
          <p className="text-muted-foreground mb-4">
            Your trusted partner in travel business across India
          </p>
          <p className="text-sm text-muted-foreground">
            © 2025 Phoenix Travelopedia. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
