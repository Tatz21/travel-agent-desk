import { useEffect, useState } from "react";
import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import heroContactImage from "@/assets/c2.png";

const contactInfo = [
  {
    icon: Phone,
    title: "Phone",
    details: ["+91 9147711694", "+91 9831208102"],
    gradient: "from-sky-300 to-red-300",
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@phoenixtravelopedia.com", "support@phoenixtravelopedia.com"],
    gradient: "from-yellow-300 to-blue-300",
  },
  {
    icon: MapPin,
    title: "Address",
    details: ["Globsyn Crystals, EP Block, Sector V, Bidhannagar, Kolkata, West Bengal, 700091, India"],
    gradient: "from-green-300 via-teal-300 to-pink-300",
  },
  {
    icon: Clock,
    title: "Working Hours",
    details: ["24/7 Support Available"],
    gradient: "from-blue-300 via-teal-300 to-yellow-300",
  },
];

const Contact = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
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

    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error submitting the form. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 lg:py-40 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroContactImage})` }}
        />
        {/* Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <p className="text-primary text-sm font-serif font-bold italic tracking-[0.3em] animate-fade-in-down relative inline-block uppercase mb-4">

          </p>
          <h1 className="inline-block px-4 py-2 text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white mb-6  animate-fade-in-up">
            
          </h1>
          <p className="text-base sm:text-lg text-black max-w-2xl mx-auto animate-fade-in-up delay-100">
            <br></br><br></br><br></br><br></br><br></br>
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="border-border/50">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold font-serif text-card-foreground mb-6">
                    Send Us a Message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6" method="post">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={contactForm.name}
                          onChange={handleContactChange}
                          placeholder="Enter your name"
                          required
                          className="border-[#626d84] focus:border-[#626d84] focus:ring-[#626d84] focus-visible:ring-[#626d84]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={contactForm.email}
                          onChange={handleContactChange}
                          placeholder="Enter your email"
                          required
                          className="border-[#626d84] focus:border-[#626d84] focus:ring-[#626d84] focus-visible:ring-[#626d84]"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Mobile *</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={contactForm.phone}
                          onChange={handleContactChange}
                          placeholder="Enter your mobile number"
                          required
                          className="border-[#626d84] focus:border-[#626d84] focus:ring-[#626d84] focus-visible:ring-[#626d84]"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={contactForm.subject}
                          onChange={handleContactChange}
                          placeholder="Enter subject"
                          required
                          className="border-[#626d84] focus:border-[#626d84] focus:ring-[#626d84] focus-visible:ring-[#626d84]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={contactForm.message}
                        onChange={handleContactChange}
                        placeholder="How can we help you?"
                        rows={6}
                        required
                        className="border-[#626d84] focus:border-[#626d84] focus:ring-[#626d84] focus-visible:ring-[#626d84]"
                      />
                    </div>
                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? "Sending..." : "Send Message"}
                      <Send className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Info Sidebar */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold font-serif text-foreground mb-6">
                Contact Information
              </h2>
              {contactInfo.map((info) => (
                <Card
                  key={info.title}
                  className={`border-border/50 hover:shadow-lg hover:border-primary/30 transition-all duration-300  bg-gradient-to-br ${info.gradient}`}
                >
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-bold font-serif text-card-foreground mb-2">
                        {info.title}
                      </h3>
                      <div className="space-y-1">
                        {info.details.map((detail, i) => (
                          <p key={i} className="text-sm text-white">
                            {detail}
                          </p>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-serif text-foreground mb-4">
              Find Us on Map
            </h2>
            <p className="text-muted-foreground">
              Visit our office or reach out through any of the contact methods above.
            </p>
          </div>
          <Card className="overflow-hidden border-border/50">
            {/* Responsive Map Container */}
            <div className="relative w-full h-[250px] sm:h-[320px] lg:h-[380px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.19279168163!2d88.43323939999999!3d22.5718916!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02755159f4e117%3A0x40e3bebe07f10e30!2sGlobsyn%20Crystals!5e0!3m2!1sen!2sin!4v1767079972741!5m2!1sen!2sin"
                className="absolute inset-0 w-full h-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Phoenix Travelopedia Location"
              />
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Contact;
