import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AgentRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);  
  const [emailTimer, setEmailTimer] = useState(0);  
  const [otpPhone, setOtpPhone] = useState("");
  const [otpEmail, setOtpEmail] = useState("");

  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [aadhaarExists, setAadhaarExists] = useState(false);
  const [panExists, setPanExists] = useState(false);

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
    country: 'India',
    pincode: '',
    status: 'pending' as const,
    commission_rate: 5.00
  });

  const INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Delhi",
    "Jammu & Kashmir",
    "Ladakh",
    "Puducherry",
    "Chandigarh",
    "Dadra & Nagar Haveli and Daman & Diu",
    "Lakshadweep",
    "Andaman & Nicobar Islands",
  ];

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

    const url = await uploadDocument(file, name);
    if (url) {
      toast({ title: "Uploaded", description: `${name} uploaded successfully.` });
      setFormData({ ...formData, [name]: url }); // SAVE URL ONLY
    }

  };

  const checkPhoneExists = async (phone: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("agents")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Phone check error:", error);
      return false;
    }

    return !!data;
  };

  const sendPhoneOtp = async () => {
    const phoneExists = await checkPhoneExists(formData.phone);
    if (phoneExists) {
      toast({
        title: "Already Registered",
        description: "This mobile number is already registered",
        variant: "destructive",
      });
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke('sms-otp', {
        body: { action: 'send', phone: formData.phone }
      });

      if (error || !data?.success) {
        toast({
          title: "Mobile OTP Failed",
          description: data?.message || "Failed to send Mobile OTP",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "OTP Sent", description: "Mobile OTP sent successfully" });
      startTimer("phone");
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

  const checkEmailExists = async (email: string): Promise<boolean> => {
    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase
      .from("agents")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("Email check error:", error);
      return false;
    }

    return !!data;
  };
  
  const sendEmailOtp = async () => {  
    const emailExists = await checkEmailExists(formData.email);
    if (emailExists) {
      toast({
        title: "Already Registered",
        description: "This email is already registered",
        variant: "destructive",
      });
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke('email-otp', {
        body: { action: 'send', email: formData.email.trim().toLowerCase() }
      });

      if (error || !data?.success) {
        toast({
          title: "Email OTP Failed",
          description: data?.message || "Failed to send Email OTP",
          variant: "destructive",
        });
        return;
      }

      toast({ title: "OTP Sent", description: "Email OTP sent successfully" });
      startTimer("email");
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
      const digit = value.replace(/\D/g, '').slice(0, 6);
      setFormData({ ...formData, pincode: digit });
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  /* ------------------ Aadhaar Exists Check ------------------ */
  const checkAadhaarExists = async (aadhaar: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from("agents")
      .select("id")
      .eq("aadhaar", Number(aadhaar))
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error(error);
      return false;
    }

    return !!data;
  };

  const handleAadhaarBlur = async () => {
    if (!formData.aadhaar) return;

    if (!validateAadhaar(formData.aadhaar)) {
      toast({ title: "Invalid Aadhaar", description: "Aadhaar must be exactly 12 digits", variant: "destructive" });
      setAadhaarExists(false);
      return;
    }

    const exists = await checkAadhaarExists(formData.aadhaar);

    if (exists) {
      setAadhaarExists(true);
      toast({ title: "Already Registered", description: "This Aadhaar number is already registered", variant: "destructive" });
    } else {
      setAadhaarExists(false);
    }
  };

  /* ---------------- PAN VALIDATION ---------------- */

  const checkPanExists = async (pan: string) => {
    const { data, error } = await supabase
      .from("agents")
      .select("id")
      .eq("pan", pan)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      console.error("PAN check error:", error);
      return;
    }

    if (data) {
      setPanExists(true);
      toast({ title: "PAN Already Registered", description: "This PAN is already associated with an agent account", variant: "destructive" });
    } else {
      setPanExists(false);
    }
  };

  const handlePANBlur = async () => {
    if (!formData.pan) return;

    if (!panRegex.test(formData.pan)) {
      toast({ title: "Invalid PAN", description: "PAN must be in format ABCDE1234F",variant: "destructive" });
      return;
    }

    await checkPanExists(formData.pan);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ensure phone & email are verified
    if (!phoneVerified || !emailVerified) {
      toast({ title: "Verification Required", description: "Please verify mobile & email before submitting", variant: "destructive" });
      return;
    }   
    
    // validate PAN before submission
    if (panExists) {
      toast({ title: "Cannot Proceed", description: "PAN already exists. Registration blocked.", variant: "destructive" });
      return;
    }
    
    if (!validatePAN(formData.pan)) {
      toast({ title: "Invalid PAN", description: "PAN must be in format ABCDE1234F", variant: "destructive" });
      return;
    }

    // validate Aadhaar before submission
    if (aadhaarExists) {
      toast({ title: "Submission Blocked", description: "Aadhaar already registered", variant: "destructive" });
      return;
    }

    if (!validateAadhaar(formData.aadhaar)) {
      toast({ title: "Invalid Aadhaar", description: "Aadhaar must be exactly 12 digits", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      // Create the agent record
      const { error: agentError } = await supabase
        .from('agents')
        .insert({
          company_name: formData.company_name,
          contact_person: formData.contact_person,
          phone: formData.phone,
          email: formData.email.toLowerCase(),
          trade_licence: formData.trade_licence || null,
          trade_licence_file: formData.trade_licence_file || null,
          pan: formData.pan,
          pan_file: formData.pan_file,
          aadhaar: formData.aadhaar ? Number(formData.aadhaar) : null,
          aadhaar_file: formData.aadhaar_file,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
          status: formData.status,
          commission_rate: formData.commission_rate || 5.00,
        });

      if (agentError) {
        toast({
          title: "Error",
          description: agentError.message,
          variant: "destructive",
        });
        return;
      } else {
      /* SEND EMAIL AFTER SUCCESSFUL INSERT */
        const { error: mailError } = await supabase.functions.invoke("send-thankyou-email",
          {
            body: {
              email: formData.email,
              name: formData.contact_person,
            },
          }
        );

        if (mailError) {
          console.error("Mail error:", mailError);
        }

        toast({ title: "Success", description: "Agent profile created successfully!" });
        navigate('/');
      }
    } catch (agentError: any) {
      console.error("Agent creation error:", agentError);
      toast({ title: "Error", description: "Failed to create agent profile", variant: "destructive" });
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
                    <Input value={otpPhone} onChange={(e) => setOtpPhone(e.target.value)} placeholder="Enter Mobile OTP" />
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
                    <Input value={otpEmail} onChange={(e) => setOtpEmail(e.target.value)} placeholder="Enter Email OTP" />
                    <Button type="button" onClick={verifyEmailOtp}>Verify</Button>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="trade">Trade Licence Number </Label>
                <Input
                  id="trade_licence"
                  name="trade_licence"
                  value={formData.trade_licence}
                  onChange={handleInputChange}
                  placeholder="Enter Your Trade Licence Number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trade_licence_file">Trade Licence File </Label>
                <Input 
                  type="file"
                  id="trade_licence_file"
                  name="trade_licence_file"
                  onChange={handleFileChange}
                  placeholder="Upload Your Trade Licence File"
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
                  maxLength={12}
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
                <Select
                  value={formData.state}
                  onValueChange={(value) =>
                    setFormData({ ...formData, state: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {INDIAN_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  name="country"
                  value="India"
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
          <div className="text-center text-sm mt-4 space-y-2">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <a onClick={() => navigate("/auth")}
                className="text-primary font-medium hover:underline"
              >
                Sign in here
              </a>
            </p>

            <p className="text-muted-foreground">
              Already registered?{" "}
              <a onClick={() => navigate("/check-status")}
                className="text-primary font-medium hover:underline"
              >
                Check your status
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentRegister;
