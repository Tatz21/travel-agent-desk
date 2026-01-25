import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Plane, Hotel, Check, Users, ChartLine, Shield, Headphones, TrendingUp, Mail, Phone, MapPinned, Eye, EyeOff, Globe, LayoutDashboard, CloudCog, Bus, ShieldCheck } from 'lucide-react';
import logo from '@/assets/logo.gif';
import { supabase } from '@/integrations/supabase/client';
import loginVideo from "@/assets/login-bg.mp4";
import loginBg from "@/assets/login-bg.jpg";

const AuthPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);

  const [activeSection, setActiveSection] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set([0]));
  const [formData, setFormData] = useState({ agent_code: '', password: '', });
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const sections = ['login', 'why-choose', 'products', 'features', 'contact'];

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoReady, setVideoReady] = useState(false);

  const startTimer = () => {
    setTimer(60);

    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) clearInterval(interval);
        return t - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (videoReady && videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  }, [videoReady]);

  useEffect(() => {
    // Always start auth page at login section
    window.scrollTo({ top: 0, behavior: "instant" });
    setStep(1); // ensure login form (not OTP)
  }, []);

  useEffect(() => {
    if (!loading && user && location.pathname === "/auth") {
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionIndex = sectionRefs.current.indexOf(entry.target as HTMLElement);
          if (sectionIndex !== -1) {
            setVisibleSections(prev => new Set(prev).add(sectionIndex));
          }
        }
      });
    }, observerOptions);

    const timeoutId = setTimeout(() => {
      sectionRefs.current.forEach(section => {
        if (section) {
          observer.observe(section);
        }
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, []);

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

  const sendOtp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('login-otp', {
        body: { action: 'send', agent_code: formData.agent_code, password: formData.password }
      });

      if (error) throw error;

      /* if (data.no_otp) {
        // Already verified today - sign in with Supabase Auth
        const agentEmail = String((data as any)?.agent_email ?? (data as any)?.email ?? "").trim();
        if (!agentEmail) {
          toast({ title: "Login Error", description: "Server response missing agent email.", variant: "destructive" });
          return;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: agentEmail,
          password: formData.password,
        });

        if (signInError) {
          toast({ title: "Login Error", description: signInError.message, variant: "destructive" });
          return;
        }

        navigate("/dashboard", { replace: true });
        return;
      } */

      if (data.success) {
        toast({ title: "OTP Sent", description: "OTP sent successfully" });
        setStep(2);
        startTimer();
      } else {
        toast({ title: "Error", description: data.message || "Failed to send OTP", variant: "destructive" });
      }
    } catch (err: any) {
      console.error('Send OTP error:', err);
      toast({ title: "Error", description: "Failed to send OTP", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('login-otp', {
        body: { action: 'verify', agent_code: formData.agent_code, otp: otp.trim(), password: formData.password }
      });

      if (error) throw error;

      if (data.success) {
        // Sign in with Supabase Auth to create a persistent session
        const agentEmail = String((data as any)?.agent_email ?? (data as any)?.email ?? "").trim();
        if (!agentEmail) {
          toast({ title: "Login Error", description: "Server response missing agent email.", variant: "destructive" });
          return;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: agentEmail,
          password: formData.password,
        });

        if (signInError) {
          toast({ title: "Login Error", description: signInError.message, variant: "destructive" });
          return;
        }

        toast({ title: "OTP Verified", description: "Login successful!" });
        navigate("/dashboard", { replace: true });
      } else {
        toast({ title: "Invalid OTP", description: data.message, variant: "destructive" });
      }
    } catch (err: any) {
      console.error('Verify error:', err);
      toast({ title: "Error", description: "OTP verification failed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const whyChooseFeatures = [{
    icon: Users,
    title: 'Trusted Agent Network',
    description: 'Join a professionally vetted community of travel agents using a secure and scalable B2B travel platform built for long-term partnerships.'
  }, {
    icon: Globe,
    title: 'Complete Travel Solutions',
    description: 'Manage all essential travel services through a unified B2B portal designed to simplify bookings and improve operational efficiency.'
  }, {
    icon: Shield,
    title: 'Industry Credibility',
    description: 'Partner with a trusted B2B travel platform supported by strong industry relationships and dependable global supply networks.'
  }, {
    icon: Headphones,
    title: '24/7 Partner Support',
    description: 'Ensure uninterrupted business operations with round-the-clock assistance, including regional language support.'
  }, {
    icon: TrendingUp,
    title: 'Higher Profit Potential',
    description: 'Benefit from a transparent and performance-driven commission structure that supports sustainable business growth.'
  }, {
    icon: LayoutDashboard,
    title: 'Centralized Agent Dashboard',
    description: 'Manage bookings, payments, and reports from a single, easy-to-use dashboard designed for professional travel businesses.'
  }, {
    icon: CloudCog,
    title: 'Enterprise Booking Technology',
    description: 'Operate faster with a secure, intuitive B2B booking engine built for accuracy, control, and high-volume transactions.'
  }, {
    icon: ChartLine,
    title: 'Advanced Reporting Tools',
    description: 'Gain better business insights with detailed reports that help track performance and improve decision-making.'
  }];

  const products = [{
    id: "flight-bookings",
    icon: Plane,
    name: 'Flights',
    color: 'from-blue-500 to-blue-600',
    shadow: "rgba(59,130,246,.80)"
  }, {
    id: "hotel-reservations",
    icon: Hotel,
    name: 'Hotels',
    color: 'from-purple-500 to-purple-600',
    shadow: "rgba(147,51,234,0.8)"
  }, {
    id: "bus-tickets",
    icon: Bus,
    name: 'Bus',
    color: 'from-orange-500 to-orange-600',
    shadow: "rgba(249,115,22,0.8)"
  }, {
    id: "travel-insurance",
    icon: ShieldCheck,
    name: 'Travel Insurance',
    color: 'from-indigo-500 to-indigo-600',
    shadow: "rgba(99,102,241,0.8)"
  }];

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.id.replace("contact-", "")]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.functions.invoke("send-contact-message", {
        body: {
          ...contactForm,
        },
      });

      if (error) throw error;

      toast({
        title: "Message Sent",
        description: "Our team will contact you shortly",
      });

      // Reset form
      setContactForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed",
        description: "Could not send message. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-red-50 to-orange-50">
    {/* Section 1: Login */}

    <section
      ref={el => sectionRefs.current[0] = el}
      className="min-h-screen flex items-center justify-center relative overflow-hidden bg-cover bg-center">
        
      {/* IMAGE fallback (always visible) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${loginBg})` }}
      />

      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onCanPlayThrough={() => setVideoReady(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700
        ${videoReady ? "opacity-100" : "opacity-0"}`}
      >
        <source src={loginVideo} type="video/mp4" />
      </video>

      <div className="w-full max-w-md mx-4 relative z-10 animate-fade-in">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden bg-white/95 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-center">
            <img src={logo} alt="Travelopedia" className="bg-white inline-flex items-center justify-center rounded-md p-3 mb-4 shadow-md" />
            <h1 className="text-3xl font-bold text-white">
              Sign In <span className="font-normal">to</span>
            </h1>
            <p className="text-white/90 text-xl mt-1">Phoenix Travelopedia Portal</p>
          </div>

          <CardContent className="p-8">
            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); sendOtp(); }} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="agent_code" className="text-sm font-medium">
                    Agent Code
                  </Label>
                  <Input id="agent_code" name="agent_code" type="text" placeholder="Enter your agent code" value={formData.agent_code} onChange={handleInputChange} required className="h-12 px-4 border-2 focus:border-primary" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <div className="relative">
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formData.password} onChange={handleInputChange} required className="h-12 px-4 border-2 focus:border-primary" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span className="text-muted-foreground">Remember me</span>
                  </label>
                  <a onClick={() => navigate("/forgot-password")} className="text-primary hover:underline font-medium">
                    Forgot Password?
                  </a>
                </div>

                <Button type="submit" className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all" disabled={loading}>
                  {loading ? "Checking..." : "Login"}
                </Button>

                {/* Security Note */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Secured with 256-bit SSL encryption
                  </span>
                </div>
              </form>
            )}
            {step === 2 && (
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium">
                  Enter OTP
                </Label>
                <Input id="otp" name="otp" type="text" placeholder="Enter 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required className="h-12 px-4 border-2 focus:border-primary" />
                <Button onClick={verifyOtp} className="w-full h-12" disabled={loading}>
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
                {timer > 0 ? (
                  <p className="text-center text-muted-foreground">Resend OTP in {timer}s</p>
                ) : (
                  <button className="text-primary underline" onClick={sendOtp}>
                    Resend OTP
                  </button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-center mt-6 mb-4 text-sm text-white">
          Don't have an account?{' '}
          <a onClick={() => navigate('/register')} className="text-white hover:underline font-medium">
            Register Now
          </a>
        </p>
      </div>
    </section>

    {/* Section 2: Why Choose Us */}
    <section ref={el => sectionRefs.current[1] = el} className={`min-h-screen py-20 px-4 relative transition-all duration-1000 ease-out ${visibleSections.has(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Why Choose <span className="text-primary">Phoenix Travelopedia</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            India’s Most Trusted B2B Travel Platform for Travel Agents
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
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
    <section ref={el => sectionRefs.current[2] = el} className={`py-20 md:py-20 px-4 bg-white/50 relative transition-all duration-1000 ease-out ${visibleSections.has(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
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
            animationDelay: `${index * 80}ms`,
            boxShadow: `0 10px 30px ${product.shadow}`
          }}>
            <Link to={`/services/${product.id}`}>
              <div className={`bg-gradient-to-br ${product.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                <product.icon className="text-white" size={32} />
              </div>
              <h3 className="text-lg font-bold text-center">{product.name}</h3>
            </Link>
          </Card>)}
        </div>
      </div>
    </section>

    {/* Section 4: Features */}
    <section ref={el => sectionRefs.current[3] = el} className={`min-h-screen py-20 px-4 relative transition-all duration-1000 ease-out ${visibleSections.has(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
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
          {['Real-time inventory management', 'Centralized booking dashboard', 'Supplier management system', 'Credit limit & wallet management', 'Cancellation & refund management', 'Secure login for authorized agents', 'Booking history & audit logs', 'Dedicated account support', 'Scalable cloud-based infrastructure', 'Instant booking confirmations', 'Automated invoicing system', 'Secure payment gateway'].map((feature, index) => <div key={index} className="flex items-start gap-4 p-6 bg-white rounded-xl animate-slide-in-left group hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_22px_45px_rgba(59,130,246,0.35)]" style={{
            animationDelay: `${index * 100}ms`,
            boxShadow: "0 10px 25px rgba(25, 33, 44, 0.12)"
          }}>
            <div className="bg-primary/60 p-2 rounded-full flex-shrink-0">
              <Check className="text-white" size={24} />
            </div>
            <p className="text-lg font-medium">{feature}</p>
          </div>)}
        </div>
      </div>
    </section>

    {/* Section 5: Contact Us */}
    <section ref={el => sectionRefs.current[4] = el} className={`min-h-screen py-20 px-4 bg-white/50 relative transition-all duration-1000 ease-out ${visibleSections.has(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
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
                <p className="text-muted-foreground"><a href="tel:9147711694">+91 9147711694</a></p>
                <p className="text-muted-foreground"><a href="tel:9831208102">+91 9831208102</a></p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <Mail className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Email Us</h3>
                <p className="text-muted-foreground"><a href="mailto:info@phoenixtravelopedia.com">info@phoenixtravelopedia.com</a></p>
                <p className="text-muted-foreground"><a href="mailto:support@phoenixtravelopedia.com">support@phoenixtravelopedia.com</a></p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-primary/10 p-4 rounded-full">
                <MapPinned className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Visit Us</h3>
                <p className="text-muted-foreground">Globsyn Crystals, EP Block, Sector V, Bidhannagar, Kolkata, West Bengal, 700091, India</p>
              </div>
            </div>
          </div>

          <Card className="p-8 animate-scale-in border-2">
            <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-4" method="post">
              <div>
                <Label htmlFor="contact-name">Name</Label>
                <Input id="contact-name" placeholder="Your name" className="h-12" value={contactForm.name} onChange={handleContactChange} />
              </div>
              <div>
                <Label htmlFor="contact-email">Email</Label>
                <Input id="contact-email" type="email" placeholder="your@email.com" className="h-12" value={contactForm.email} onChange={handleContactChange} />
              </div>
              <div>
                <Label htmlFor="contact-phone">Phone Number</Label>
                <Input id="contact-phone" type="tel" placeholder="your phone number" className="h-12" value={contactForm.phone} onChange={handleContactChange} />
              </div>
              <div>
                <Label htmlFor="contact-subject">Subject</Label>
                <Input id="contact-subject" type="text" placeholder="subject" className="h-12" value={contactForm.subject} onChange={handleContactChange} />
              </div>
              <div>
                <Label htmlFor="contact-message">Message</Label>
                <textarea id="contact-message" placeholder="How can we help you?" className="w-full min-h-[120px] px-3 py-2 rounded-md border border-input bg-background" value={contactForm.message} onChange={handleContactChange} />
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
