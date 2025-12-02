import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { useAgent } from '@/hooks/useAgent';
import { supabase } from '@/integrations/supabase/client';


const AgentRegister = () => {
  const navigate = useNavigate();  
  const { createAgent } = useAgent();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);  
  const [emailTimer, setEmailTimer] = useState(0);  
  const [otpPhone, setOtpPhone] = useState("");
  const [otpEmail, setOtpEmail] = useState("");

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

  const startTimer = (type: "phone" | "email") => {
    if (type === "phone") setTimer(60);
    if (type === "email") setEmailTimer(60);

    const interval = setInterval(() => {
      if (type === "phone") {
        setTimer((t) => {
          if (t <= 1) clearInterval(interval);
          return t - 1;
        });
      }
      if (type === "email") {
        setEmailTimer((t) => {
          if (t <= 1) clearInterval(interval);
          return t - 1;
        });
      }
    }, 1000);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // sanitize aadhaar to digits only and limit to 12 chars
    if (name === 'aadhaar') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 12);
      setFormData({ ...formData, aadhaar: digitsOnly });
      return;
    }
    // force PAN to uppercase and limit to 10 chars
    if (name === 'pan') {
      const up = value.toUpperCase().slice(0, 10);
      setFormData({ ...formData, pan: up });
      return;
    }
    // sanitize pincode to digits only and limit to 6 chars
    if (name === 'pincode') {
      const digit = value.replace(/\D/g, '').slice(0, 10);
      setFormData({ ...formData, pincode: digit });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;

    if (!files || files.length === 0) return;

    const file = files[0];

    // 2 MB limit (2 * 1024 * 1024)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 2 MB",
        variant: "destructive",
      });
      e.target.value = ""; // reset input
      return;
    }

    // Save actual file object in formData
    setFormData({ ...formData, [name]: file });
  };

  const sendPhoneOtp = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('sms-otp', {
        body: { action: 'send', phone: formData.phone }
      });

      if (error) throw error;

      if (data.success) {
        toast({ title: "OTP Sent", description: "Mobile OTP sent successfully" });
        startTimer("phone");
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

  const sendEmailOtp = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('email-otp', {
        body: { action: 'send', email: formData.email }
      });

      if (error) throw error;

      if (data.success) {
        toast({ title: "OTP Sent", description: "Email OTP sent successfully" });
        startTimer("email");
      } else {
        toast({ title: "Error", description: data.message || "Failed to send OTP", variant: "destructive" });
      }
    } catch (err: any) {
      console.error('Send email OTP error:', err);
      toast({ title: "Error", description: "Failed to send Email OTP", variant: "destructive" });
    }
  };

  const verifyEmailOtp = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('email-otp', {
        body: { action: 'verify', email: formData.email, otp: otpEmail }
      });

      if (error) throw error;

      if (data.success) {
        setEmailVerified(true);
        toast({ title: "Verified", description: "Email verified" });
      } else {
        toast({ title: "Invalid OTP", description: data.message, variant: "destructive" });
      }
    } catch (err: any) {
      console.error('Verify email OTP error:', err);
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
      focus();
    }
  };

  const handleAadhaarBlur = () => {
    if (!formData.aadhaar) return;
    if (!validateAadhaar(formData.aadhaar)) {
      toast({ title: "Invalid Aadhaar", description: "Aadhaar must be exactly 12 digits", variant: "destructive" });
    }
  };

  // Upload helper: uploads file to SUPABASE_STORAGE bucket and returns public url (string) or null
  const uploadFile = async (file: File) => {
    try {
      const timestamp = Date.now();
      // sanitize file name
      const safeName = encodeURIComponent(file.name.replace(/\s+/g, '_'));
      const filePath = `${timestamp}_${safeName}`;

      const { data, error: uploadError } = await supabase
        .storage
        .from('agent-documents')
        .upload(filePath, file);

      if (uploadError) {
        // If file exists, you could consider using upsert: true — but here we treat as failure
        console.error("Supabase upload error:", uploadError);
        toast({ title: "Upload failed", description: uploadError.message || "Failed to upload file", variant: "destructive" });
        return null;
      }

      // get public URL
      // getPublicUrl returns { data: { publicUrl } } in supabase-js v2
      const { data: urlData } = supabase.storage.from('agent-documents').getPublicUrl(filePath) as any;
      const publicUrl = urlData?.publicUrl ?? null;

      if (!publicUrl) {
        toast({ title: "Upload failed", description: "Could not get public URL for uploaded file", variant: "destructive" });
        return null;
      }

      return publicUrl;
    } catch (err: any) {
      console.error("Unexpected upload error:", err);
      toast({ title: "Upload error", description: err?.message || "Unexpected error during file upload", variant: "destructive" });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phoneVerified || !emailVerified) {
      toast({ title: "Verification Required", description: "Please verify mobile & email before submitting", variant: "destructive" });
      return;
    }    
    
    // validate PAN & Aadhaar before submission
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
                  onBlur={handleAadhaarBlur}
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
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter Your Email Address"
                  required
                />
              </div>
              <div className="space-y-2 flex items-end">
                <Button type="button" onClick={sendEmailOtp} disabled={emailVerified || emailTimer > 0}> 
                  {emailVerified ? "Verified" : emailTimer > 0 ? `Retry in ${emailTimer}`: "Send OTP"}
                </Button>
              </div>
              {!emailVerified && (
                <div className="space-y-2 md:col-span-2">
                  <Label>Enter Email OTP</Label>
                  <div className="flex gap-2">
                    <Input value={otpEmail} onChange={(e) => setOtpEmail(e.target.value)} placeholder="Enter OTP" />
                    <Button type="button" onClick={verifyEmailOtp}>Verify</Button>
                  </div>
                </div>
              )}
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

