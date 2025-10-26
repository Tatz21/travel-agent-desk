import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Plane, Hotel, Car, Ship, Building2, Calendar, MapPin, Ticket, Briefcase, Globe2, Check, Users, Award, Shield, Headphones, TrendingUp, Mail, Phone, MapPinned } from 'lucide-react';
import logo from '@/assets/logo.gif';
import watermark from '@/assets/watermark-logo.png';
const AuthPage = () => {
  const {
    user,
    signIn
  } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const sections = ['login', 'why-choose', 'products', 'features', 'contact'];
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  useEffect(() => {
    const handleScroll = () => {
      const pageYOffset = window.pageYOffset;
      let newActiveSection = 0;
      sectionRefs.current.forEach((section, index) => {
        if (section) {
          const sectionTop = section.offsetTop - 100;
          if (pageYOffset >= sectionTop) {
            newActiveSection = index;
          }
        }
      });
      setActiveSection(newActiveSection);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await signIn(formData.email, formData.password);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Success",
          description: "Signed in successfully!"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const floatingIcons = [{
    Icon: Plane,
    delay: '0s',
    duration: '20s',
    left: '10%',
    top: '15%'
  }, {
    Icon: Hotel,
    delay: '2s',
    duration: '25s',
    left: '20%',
    top: '25%'
  }, {
    Icon: Car,
    delay: '4s',
    duration: '22s',
    left: '80%',
    top: '20%'
  }, {
    Icon: Ship,
    delay: '1s',
    duration: '28s',
    left: '15%',
    top: '60%'
  }, {
    Icon: Building2,
    delay: '3s',
    duration: '24s',
    left: '85%',
    top: '50%'
  }, {
    Icon: Calendar,
    delay: '5s',
    duration: '26s',
    left: '25%',
    top: '80%'
  }, {
    Icon: MapPin,
    delay: '2.5s',
    duration: '23s',
    left: '70%',
    top: '70%'
  }, {
    Icon: Ticket,
    delay: '4.5s',
    duration: '27s',
    left: '90%',
    top: '35%'
  }, {
    Icon: Briefcase,
    delay: '1.5s',
    duration: '21s',
    left: '5%',
    top: '40%'
  }, {
    Icon: Globe2,
    delay: '3.5s',
    duration: '29s',
    left: '75%',
    top: '85%'
  }];
  const whyChooseFeatures = [{
    icon: Users,
    title: '50,000+ Travel Agents',
    description: 'Join thousands of successful agents on our B2B platform'
  }, {
    icon: Award,
    title: '16+ Travel Products',
    description: 'All travel services in one comprehensive platform'
  }, {
    icon: Shield,
    title: 'Trusted Globally',
    description: 'Partnerships with the biggest industry players'
  }, {
    icon: Headphones,
    title: '24/7 Support',
    description: 'Regional language support for your convenience'
  }, {
    icon: TrendingUp,
    title: 'Excellent Returns',
    description: 'Best commission structure in the industry'
  }, {
    icon: Globe2,
    title: '55+ Branches',
    description: 'Physical presence across India for your support'
  }];
  const products = [{
    icon: Plane,
    name: 'Flights',
    color: 'from-blue-500 to-blue-600'
  }, {
    icon: Hotel,
    name: 'Hotels',
    color: 'from-purple-500 to-purple-600'
  }, {
    icon: Car,
    name: 'Car Rental',
    color: 'from-green-500 to-green-600'
  }, {
    icon: Ship,
    name: 'Cruise',
    color: 'from-cyan-500 to-cyan-600'
  }, {
    icon: Ticket,
    name: 'Bus',
    color: 'from-orange-500 to-orange-600'
  }, {
    icon: Building2,
    name: 'Rail',
    color: 'from-red-500 to-red-600'
  }, {
    icon: MapPin,
    name: 'Theme Parks',
    color: 'from-pink-500 to-pink-600'
  }, {
    icon: Briefcase,
    name: 'Insurance',
    color: 'from-indigo-500 to-indigo-600'
  }];
  return <div className="relative bg-gradient-to-br from-pink-50 via-red-50 to-orange-50">
      {/* Scroll Indicator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {sections.map((_, index) => <button key={index} onClick={() => scrollToSection(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${activeSection === index ? 'bg-primary scale-150 shadow-lg' : 'bg-primary/30 hover:bg-primary/50'}`} aria-label={`Go to section ${index + 1}`} />)}
      </div>

      {/* Section 1: Login */}
      <section ref={el => sectionRefs.current[0] = el} className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Watermark Logo Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.06]" style={{
          backgroundImage: `url(${watermark})`,
          backgroundSize: '250px',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          transform: 'rotate(45deg)',
          transformOrigin: 'center'
        }} />
        
        {/* Floating Travel Icons */}
        {floatingIcons.map(({
        Icon,
        delay,
        duration,
        left,
        top
      }, index) => <Icon key={index} className="absolute text-primary/10 pointer-events-none" size={48} style={{
        left,
        top,
        animation: `float ${duration} ease-in-out ${delay} infinite`
      }} />)}

        <div className="w-full max-w-md mx-4 relative z-10 animate-fade-in">
          <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
            <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-center">
              <img src={logo} alt="Travelopedia" className="h-52 w-52 mx-auto mb-4 object-contain" />
              <h1 className="text-3xl font-bold text-white">
                Sign In <span className="font-normal">to</span>
              </h1>
              <p className="text-white/90 text-xl mt-1">Travelopedia Portal</p>
            </div>
            
            <CardContent className="p-8">
              <form onSubmit={handleSignIn} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email / Username
                  </Label>
                  <Input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleInputChange} required className="h-12 px-4 border-2 focus:border-primary" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Input id="password" name="password" type="password" placeholder="Enter your password" value={formData.password} onChange={handleInputChange} required className="h-12 px-4 border-2 focus:border-primary" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <a href="#" className="text-primary hover:underline font-medium">
                    Forgot Password?
                  </a>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all" disabled={loading}>
                  {loading ? 'Signing in...' : 'LOG IN'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a href="#" className="text-primary hover:underline font-medium">
              Register Now
            </a>
          </p>
        </div>
      </section>

      {/* Section 2: Why Choose Us */}
      <section ref={el => sectionRefs.current[1] = el} className="min-h-screen py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Why Choose <span className="text-primary">Travelopedia</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join India's most trusted B2B travel platform with unmatched benefits
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseFeatures.map((feature, index) => <Card key={index} className="p-8 hover:shadow-xl transition-all duration-300 animate-fade-in border-2 hover:border-primary/50" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                  <feature.icon className="text-primary" size={32} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Section 3: Our Products */}
      <section ref={el => sectionRefs.current[2] = el} className="min-h-screen py-20 px-4 bg-white/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our <span className="text-primary">Products</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              16+ travel products and services in one comprehensive platform
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product, index) => <Card key={index} className="p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer group animate-scale-in border-0" style={{
            animationDelay: `${index * 80}ms`
          }}>
                <div className={`bg-gradient-to-br ${product.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                  <product.icon className="text-white" size={32} />
                </div>
                <h3 className="text-lg font-bold text-center">{product.name}</h3>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Section 4: Features */}
      <section ref={el => sectionRefs.current[3] = el} className="min-h-screen py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Platform <span className="text-primary">Features</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to run a successful travel business
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {['Real-time inventory management', 'Instant booking confirmations', 'Automated invoicing system', 'Multi-currency support', 'Advanced reporting & analytics', 'Mobile-responsive design', 'Secure payment gateway', 'API integration available'].map((feature, index) => <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-xl hover:shadow-lg transition-all animate-slide-in-left" style={{
            animationDelay: `${index * 100}ms`
          }}>
                <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
                  <Check className="text-primary" size={24} />
                </div>
                <p className="text-lg font-medium">{feature}</p>
              </div>)}
          </div>
        </div>
      </section>

      {/* Section 5: Contact Us */}
      <section ref={el => sectionRefs.current[4] = el} className="min-h-screen py-20 px-4 bg-white/50 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Get In <span className="text-primary">Touch</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We're here to help you grow your travel business
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-8 animate-slide-in-left">
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Phone className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">24/7 Helpline</h3>
                  <p className="text-muted-foreground">022 7120 0900</p>
                  <p className="text-muted-foreground">022 6120 0900</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Email Us</h3>
                  <p className="text-muted-foreground">support@travelopedia.com</p>
                  <p className="text-muted-foreground">sales@travelopedia.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-4 rounded-full">
                  <MapPinned className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Visit Us</h3>
                  <p className="text-muted-foreground">55+ Branches Across India</p>
                  <p className="text-muted-foreground">Find your nearest branch</p>
                </div>
              </div>
            </div>

            <Card className="p-8 animate-scale-in border-2">
              <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="contact-name">Name</Label>
                  <Input id="contact-name" placeholder="Your name" className="h-12" />
                </div>
                <div>
                  <Label htmlFor="contact-email">Email</Label>
                  <Input id="contact-email" type="email" placeholder="your@email.com" className="h-12" />
                </div>
                <div>
                  <Label htmlFor="contact-message">Message</Label>
                  <textarea id="contact-message" placeholder="How can we help you?" className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background" />
                </div>
                <Button className="w-full h-12 bg-gradient-to-r from-primary to-primary/80">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>

      </section>
    </div>;
};
export default AuthPage;