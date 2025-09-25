import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Plane, Mail } from 'lucide-react';

const AuthPage = () => {
  const { user, signInWithPasswordAndOtp, verifyLoginOtp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [needsOtp, setNeedsOtp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    otp: ''
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
      const { error, needsOtp: requiresOtp } = await signInWithPasswordAndOtp(formData.email, formData.password);
      
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else if (requiresOtp) {
        setNeedsOtp(true);
        toast({
          title: "OTP Sent",
          description: "OTP has been sent to your registered email and phone number"
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

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await verifyLoginOtp(formData.otp);

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
        setNeedsOtp(false);
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary p-3 md:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex items-center justify-center mb-4">
            <Plane className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold ml-2">Travelopedia</h1>
          </div>
          <p className="text-sm md:text-base text-muted-foreground">Agent Portal</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Agent Sign In</CardTitle>
            <CardDescription>
              {needsOtp ? 'Enter the OTP sent to your registered email and phone' : 'Enter your credentials to sign in'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!needsOtp ? (
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
                  {loading ? 'Verifying...' : 'Continue'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="text-center mb-4 p-4 bg-muted rounded-lg">
                  <Mail className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    We've sent a verification code to your registered email and phone number
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otp">Enter Verification Code</Label>
                  <Input
                    id="otp"
                    name="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={formData.otp}
                    onChange={handleInputChange}
                    maxLength={6}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 h-11 md:h-10" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Sign In'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="h-11 md:h-10"
                    onClick={() => {setNeedsOtp(false); setFormData({...formData, otp: ''})}}
                  >
                    Back
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;