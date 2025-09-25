import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Plane, Mail, Phone } from 'lucide-react';

const AuthPage = () => {
  const { user, signIn, signInWithOtp, verifyOtp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpType, setOtpType] = useState<'email' | 'sms'>('email');
  const [currentContact, setCurrentContact] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
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

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signInWithOtp(
        otpType === 'email' ? formData.email : undefined,
        otpType === 'sms' ? formData.phone : undefined
      );

      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setOtpSent(true);
        setCurrentContact(otpType === 'email' ? formData.email : formData.phone);
        toast({
          title: "OTP Sent",
          description: `OTP has been sent to your ${otpType === 'email' ? 'email' : 'phone number'}`
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
      const { error } = await verifyOtp(
        otpType === 'email' ? currentContact : undefined,
        otpType === 'sms' ? currentContact : undefined,
        formData.otp,
        otpType
      );

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
              Sign in using password or receive an OTP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="password" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="otp">OTP</TabsTrigger>
              </TabsList>
              
              <TabsContent value="password">
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
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 md:h-10" disabled={loading}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="otp">
                {!otpSent ? (
                  <div className="space-y-4">
                    <Tabs value={otpType} onValueChange={(value) => setOtpType(value as 'email' | 'sms')} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="email" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email OTP
                        </TabsTrigger>
                        <TabsTrigger value="sms" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          SMS OTP
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="email">
                        <form onSubmit={handleSendOtp} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="otp-email">Email Address</Label>
                            <Input
                              id="otp-email"
                              name="email"
                              type="email"
                              placeholder="agent@example.com"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full h-11 md:h-10" disabled={loading}>
                            {loading ? 'Sending OTP...' : 'Send Email OTP'}
                          </Button>
                        </form>
                      </TabsContent>
                      
                      <TabsContent value="sms">
                        <form onSubmit={handleSendOtp} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="otp-phone">Phone Number</Label>
                            <Input
                              id="otp-phone"
                              name="phone"
                              type="tel"
                              placeholder="+1234567890"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          <Button type="submit" className="w-full h-11 md:h-10" disabled={loading}>
                            {loading ? 'Sending OTP...' : 'Send SMS OTP'}
                          </Button>
                        </form>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground">
                        OTP sent to {currentContact}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        name="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={formData.otp}
                        onChange={handleInputChange}
                        maxLength={6}
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" className="flex-1 h-11 md:h-10" disabled={loading}>
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="h-11 md:h-10"
                        onClick={() => {setOtpSent(false); setFormData({...formData, otp: ''})}}
                      >
                        Back
                      </Button>
                    </div>
                  </form>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;