import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Plane, Hotel, Car, Ship, Building2, Calendar, MapPin, Ticket, Briefcase, Globe2 } from 'lucide-react';
import logo from '@/assets/logo.gif';

const AuthPage = () => {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

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
      const { error } = await signIn(formData.email, formData.password);
      
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


  const floatingIcons = [
    { Icon: Plane, delay: '0s', duration: '20s', left: '10%', top: '15%' },
    { Icon: Hotel, delay: '2s', duration: '25s', left: '20%', top: '25%' },
    { Icon: Car, delay: '4s', duration: '22s', left: '80%', top: '20%' },
    { Icon: Ship, delay: '1s', duration: '28s', left: '15%', top: '60%' },
    { Icon: Building2, delay: '3s', duration: '24s', left: '85%', top: '50%' },
    { Icon: Calendar, delay: '5s', duration: '26s', left: '25%', top: '80%' },
    { Icon: MapPin, delay: '2.5s', duration: '23s', left: '70%', top: '70%' },
    { Icon: Ticket, delay: '4.5s', duration: '27s', left: '90%', top: '35%' },
    { Icon: Briefcase, delay: '1.5s', duration: '21s', left: '5%', top: '40%' },
    { Icon: Globe2, delay: '3.5s', duration: '29s', left: '75%', top: '85%' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-pink-50 via-red-50 to-orange-50">
      {/* Floating Travel Icons */}
      {floatingIcons.map(({ Icon, delay, duration, left, top }, index) => (
        <Icon
          key={index}
          className="absolute text-primary/10 pointer-events-none"
          size={48}
          style={{
            left,
            top,
            animation: `float ${duration} ease-in-out ${delay} infinite`,
          }}
        />
      ))}

      {/* Geometric Triangle Pattern at Bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-48 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-full"
          viewBox="0 0 1200 150"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="triangles" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="0,0 30,60 60,0" fill="hsl(var(--primary) / 0.1)" />
              <polygon points="0,60 30,0 60,60" fill="hsl(var(--primary) / 0.15)" />
            </pattern>
          </defs>
          <rect width="1200" height="150" fill="url(#triangles)" />
        </svg>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md mx-4 relative z-10 animate-fade-in">
        <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-primary/80 p-8 text-center">
            <img 
              src={logo} 
              alt="Travelopedia" 
              className="h-24 w-24 mx-auto mb-4 object-contain"
            />
            <h1 className="text-3xl font-bold text-white">
              Sign In <span className="font-normal">to</span>
            </h1>
            <p className="text-white/90 text-xl mt-1">Travelopedia Connect</p>
          </div>
          
          <CardContent className="p-8">
            <form onSubmit={handleSignIn} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email / Username
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="h-12 px-4 border-2 focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="h-12 px-4 border-2 focus:border-primary"
                />
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

              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all" 
                disabled={loading}
              >
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
    </div>
  );
};

export default AuthPage;