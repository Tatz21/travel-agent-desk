import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import { useAgent } from '@/hooks/useAgent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Users, Shield, Clock } from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';
import logo from '@/assets/logo.gif';

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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary">
      {/* Header */}
      <header className="border-b border-border bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img src={logo} alt="Phoenix Travelopedia" className="h-20 w-auto object-contain" />
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button variant="outline" onClick={() => navigate('/auth')}>
                Sign In
              </Button>
              <Button onClick={() => navigate('/auth')}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Travel Business,
            <span className="text-primary"> Simplified</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Join thousands of travel agents using Phoenix Travelopedia to book flights, buses, and hotels 
            for their customers. Earn commissions on every booking with our easy-to-use platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/auth')}>
              Start Your Agent Journey
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plane className="h-6 w-6 mr-2 text-primary" />
                Multi-Service Booking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Book flights, buses, and hotels all from one platform. Everything your customers need in one place.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-2 text-primary" />
                Agent Dashboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Manage all your bookings, track commissions, and monitor your business performance with our intuitive dashboard.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-6 w-6 mr-2 text-primary" />
                Secure & Reliable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your data and transactions are protected with enterprise-grade security. Focus on growing your business.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up as Agent</h3>
              <p className="text-muted-foreground">
                Create your agent account and complete your business profile to get started.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Start Booking</h3>
              <p className="text-muted-foreground">
                Use our platform to book flights, buses, and hotels for your customers.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn Commission</h3>
              <p className="text-muted-foreground">
                Earn competitive commissions on every successful booking you make.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="text-center p-8">
          <CardHeader>
            <CardTitle className="text-2xl mb-4">Ready to Start Your Travel Business?</CardTitle>
            <CardDescription className="text-lg">
              Join Phoenix Travelopedia today and start earning commissions on travel bookings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={() => navigate('/auth')}>
              Create Agent Account
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Index;
