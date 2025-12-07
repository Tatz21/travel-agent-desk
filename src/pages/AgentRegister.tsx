import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAgent } from '@/hooks/useAgent';
import { supabase } from '@/integrations/supabase/client';
import PhoneEmailVerify from '@/components/PhoneEmailVerify';

const AgentRegister = () => {
  const navigate = useNavigate();  
  const { createAgent } = useAgent();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);  
  const [otpPhone, setOtpPhone] = useState("");

  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    phone: '',
    email: '',
    trade_licence: '',
    trade_licence_file: '',
    pan: '',
    pan_file: '',
    aadhaar: '',
    aadhaar_file: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    status: 'pending' as const,
    commission_rate: 5.00
  });

  const startTimer = () => {
    setTimer(60);
    const interval = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) clearInterval(interval);
        return t - 1;
      });
    }, 1000);
  };

  const handleEmailVerified = useCallback((verifiedEmail: string) => {
    setFormData(prev => ({ ...prev, email: verifiedEmail }));
    setEmailVerified(true);
    toast({ title: "Email Verified", description: `Email ${verifiedEmail} verified successfully` });
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'aadhaar') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 12);
      setFormData({ ...formData, aadhaar: digitsOnly });
      return;
    }
    if (name === 'pan') {
      const up = value.toUpperCase().slice(0, 10);
      setFormData({ ...formData, pan: up });
      return;
    }
    if (name === 'pincode') {
      const digit = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, pincode: digit });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const uploadDocument = async (file: File, fieldName: string) => {
    const form = new FormData();
    form.append("file", file);
    form.append("field", fieldName);

    const { data, error } = await supabase.functions.invoke('upload-agent-documents', {
      method: "POST",
      body: form,
      headers: { 
        Authorization:`Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`
      },
    });

    if (error || !data?.url) {
      console.error(error);
      toast({
        title: "File Upload failed",
        description: error?.message || "Could not upload file",
        variant: "destructive",
      });
      return null;
    }

    return data.url;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (!files || files.length === 0) return;

    const file = files[0];

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 2 MB",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    const url = await uploadDocument(file, name);
    if (url) {
      toast({ title: "Uploaded", description: `${name} uploaded successfully.` });
      setFormData({ ...formData, [name]: url });
    }
  };

  const sendPhoneOtp = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('sms-otp', {
        body: { action: 'send', phone: formData.phone }
      });

      if (error) throw error;

      if (data.success) {
        toast({ title: "OTP Sent", description: "Mobile OTP sent successfully" });
        startTimer();
      } else {
        toast({ title: "Error", description: data.message || "Failed to send OTP", variant: "destructive" });
      }
    } catch (err: any) {
      console.error('Send phone OTP error:', err);
      toast({ title: "Error", description: "Failed to send Mobile OTP", variant: "destructive" });
    }
  };

  const verifyPhoneOtp = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('sms-otp', {
        body: { action: 'verify', phone: formData.phone, otp: otpPhone }
      });

      if (error) throw error;

      if (data.success) {
        setPhoneVerified(true);
        toast({ title: "Verified", description: "Mobile number verified" });
      } else {
        toast({ title: "Invalid OTP", description: data.message, variant: "destructive" });
      }
    } catch (err: any) {
      console.error('Verify phone OTP error:', err);
      toast({ title: "Error", description: "OTP verification failed", variant: "destructive" });
    }
  };

  const panRegex = /^[A-Z]{5}\d{4}[A-Z]$/;
  const aadhaarRegex = /^\d{12}$/;  
  const validatePAN = (pan: string) => panRegex.test(pan);
  const validateAadhaar = (aadhaar: string) => aadhaarRegex.test(aadhaar);
  
  const handlePANBlur = () => {
    if (!formData.pan) return;
    if (!validatePAN(formData.pan)) {
      toast({ title: "Invalid PAN", description: "PAN must be in format ABCDE1234F", variant: "destructive" });
    }
  };

  const handleAadhaarBlur = () => {
    if (!formData.aadhaar) return;
    if (!validateAadhaar(formData.aadhaar)) {
      toast({ title: "Invalid Aadhaar", description: "Aadhaar must be exactly 12 digits", variant: "destructive" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneVerified || !emailVerified) {
      toast({ title: "Verification Required", description: "Please verify mobile & email before submitting", variant: "destructive" });
      return;
    }    
    
    if (!validatePAN(formData.pan)) {
      toast({ title: "Invalid PAN", description: "PAN must be in format ABCDE1234F", variant: "destructive" });
      return;
    }

    if (!validateAadhaar(formData.aadhaar)) {
      toast({ title: "Invalid Aadhaar", description: "Aadhaar must be exactly 12 digits", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {      
      const { error } = await createAgent(formData);
      
      if (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Agent profile created successfully!" });
        navigate('/dashboard');
      }
    } catch (error) {
      toast({ title: "Error", description: "Unexpected error occurred", variant: "destructive" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Complete Your Agent Profile</CardTitle>
          <CardDescription>
            Please provide your business details to get started with the booking platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6" method="post" encType="multipart/form-data">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name *</Label>
                <Input
                  id="company_name"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  placeholder="Enter Your Company Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_person">Contact Person *</Label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleInputChange}
                  placeholder="Enter Your Full Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Mobile Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter Your Mobile Number"
                  required
                  maxLength={10}
                  onKeyPress={(event) => { if (!/[0-9]/.test(event.key)) { event.preventDefault(); } }}
                />
              </div>
              <div className="space-y-2 flex items-end">
                <Button type="button" onClick={sendPhoneOtp} disabled={timer > 0 || phoneVerified}>
                  {phoneVerified ? "Verified" : timer > 0 ? `Retry in ${timer}` : "Send OTP"}
                </Button>
              </div>
              {!phoneVerified && (
                <div className="md:col-span-2 space-y-2">
                  <Label>Enter Mobile OTP</Label>
                  <div className="flex gap-2">
                    <Input value={otpPhone} onChange={(e) => setOtpPhone(e.target.value)} placeholder="Enter OTP" />
                    <Button type="button" onClick={verifyPhoneOtp}>Verify</Button>
                  </div>
                </div>
              )}
              <div className="space-y-2 md:col-span-2">
                <Label>Email Verification *</Label>
                {emailVerified ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                    <span className="text-green-600 font-medium">✓ Email Verified: {formData.email}</span>
                  </div>
                ) : (
                  <div className="border rounded-md p-4 bg-muted/30">
                    <PhoneEmailVerify onVerified={handleEmailVerified} />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="trade">Trade Licence Number *</Label>
                <Input
                  id="trade_licence"
                  name="trade_licence"
                  value={formData.trade_licence}
                  onChange={handleInputChange}
                  placeholder="Enter Your Trade Licence Number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trade_licence_file">Trade Licence File *</Label>
                <Input 
                  type="file"
                  id="trade_licence_file"
                  name="trade_licence_file"
                  onChange={handleFileChange}
                  placeholder="Upload Your Trade Licence File"
                  required
                  accept="image/*"
                />
                <span className="text-xs text-bold" style={{color:'#bf1212'}}>
                  Please upload a clear image of your Trade Licence. File size must be less than 2 MB.
                </span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN *</Label>
                <Input
                  id="pan"
                  name="pan"
                  value={formData.pan}
                  onChange={handleInputChange}
                  onBlur={handlePANBlur}
                  placeholder="Enter Your PAN Number e.g. ABCDE1234F"
                  required
                  style={{ textTransform: "uppercase" }}
                />                
                <span className="text-xs text-bold" style={{color:'#bf1212'}}>
                  PAN must be in format ABCDE1234F.
                </span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan_file">PAN File *</Label>
                <Input
                  id="pan_file"
                  name="pan_file"
                  type="file"
                  onChange={handleFileChange}
                  placeholder="Upload Your PAN File"
                  required
                  accept="image/*"
                />
                <span className="text-xs text-bold" style={{color:'#bf1212'}}>
                  Please upload a clear image of your PAN card. File size must be less than 2 MB.
                </span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                <Input
                  type="tel"
                  id="aadhaar"
                  name="aadhaar"
                  value={formData.aadhaar}
                  onChange={handleInputChange}
                  onBlur={handleAadhaarBlur}
                  placeholder="Enter Your Aadhaar Number"
                  required
                />
                <span className="text-xs text-bold" style={{color:'#bf1212'}}>
                  Only 12 digits are allowed.
                </span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="aadhaar_file">Aadhaar File *</Label>
                <Input
                  type="file"
                  id="aadhaar_file"
                  name="aadhaar_file"
                  onChange={handleFileChange}
                  placeholder="Upload Your Aadhaar File"
                  required
                  accept="image/*"
                />
                <span className="text-xs text-bold" style={{color:'#bf1212'}}>
                  Please upload a clear image of your Aadhaar card. File size must be less than 2 MB.
                </span>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter Your Full Address"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter Your City"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter Your State"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  value="INDIA"
                  onChange={handleInputChange}
                  placeholder="Enter Your Country"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  type="tel"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter Your Area Pincode"
                  required
                  maxLength={6}
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Setting up...' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentRegister;
