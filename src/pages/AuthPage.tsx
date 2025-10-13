import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Plane } from 'lucide-react';
import logo from '@/assets/logo.gif';
import watermarkLogo from '@/assets/watermark-logo.png';

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


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary p-3 md:p-6 relative overflow-hidden">
      {/* Angled Watermark Logos Throughout Page */}
      <img 
        src={watermarkLogo} 
        alt="" 
        className="absolute top-10 -left-20 w-80 opacity-15 pointer-events-none -rotate-12"
      />
      <img 
        src={watermarkLogo} 
        alt="" 
        className="absolute top-20 right-10 w-64 opacity-10 pointer-events-none rotate-6"
      />
      <img 
        src={watermarkLogo} 
        alt="" 
        className="absolute top-1/2 -translate-y-1/2 left-1/4 w-72 opacity-10 pointer-events-none -rotate-6"
      />
      <img 
        src={watermarkLogo} 
        alt="" 
        className="absolute top-1/3 right-1/4 w-72 opacity-8 pointer-events-none rotate-12"
      />
      <img 
        src={watermarkLogo} 
        alt="" 
        className="absolute bottom-10 -right-20 w-80 opacity-15 pointer-events-none rotate-12"
      />
      <img 
        src={watermarkLogo} 
        alt="" 
        className="absolute bottom-20 left-10 w-64 opacity-10 pointer-events-none -rotate-6"
      />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center">
            <img src={logo} alt="Travelopedia" className="h-48 w-48 md:h-64 md:w-64 object-contain" style={{ imageRendering: 'crisp-edges', filter: 'contrast(1.1) brightness(1.05)' }} />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agent Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to sign in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="agent@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full h-11 md:h-10" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;