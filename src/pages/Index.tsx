import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useAgent } from '@/hooks/useAgent';
import HeroCarousel from '@/components/HeroCarousel';
import HeroContent from '@/components/HeroContent';
import CTASection from '@/components/CTASection';
import ServicesSection from '@/components/ServicesSection';
import HowItSection from '@/components/HowItSection';
import DestinationsSection from '@/components/DestinationsSection';
import WhyChooseUsSection from '@/components/WhyChooseUsSection';
import FAQSection from '@/components/FAQSection';
import ContactUsSection from '@/components/ContactUsSection';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import FeedbackSection from '@/components/FeedbackSection';
import Header from '@/components/Header';

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
          navigate('/register');
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
    <main className="min-h-screen bg-background">
      <Header />
      <HeroCarousel>
        <HeroContent />
        <CTASection transparent />
      </HeroCarousel>
      <ServicesSection />
      <HowItSection />
      <DestinationsSection />
      
      <WhyChooseUsSection />
      <FAQSection />
      <ContactUsSection />
      
      <Footer />
      <ScrollToTop />
      <FeedbackSection />
    </main>
  );
};

export default Index;
