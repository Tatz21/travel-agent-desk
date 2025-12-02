-- Create OTP storage table
CREATE TABLE public.otp_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('phone', 'email')),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for quick lookups
CREATE INDEX idx_otp_identifier_type ON public.otp_verifications(identifier, type);

-- Enable RLS
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous access for OTP operations (edge functions use service role)
CREATE POLICY "Allow all for service role" ON public.otp_verifications FOR ALL USING (true);