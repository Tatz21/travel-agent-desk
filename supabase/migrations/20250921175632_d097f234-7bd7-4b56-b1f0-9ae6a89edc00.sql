-- Create wallet balances table for agents
CREATE TABLE public.wallet_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL,
  balance DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(agent_id)
);

-- Enable Row Level Security
ALTER TABLE public.wallet_balances ENABLE ROW LEVEL SECURITY;

-- Create policies for wallet access
CREATE POLICY "Admins can view all wallet balances" 
ON public.wallet_balances 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can update all wallet balances" 
ON public.wallet_balances 
FOR UPDATE 
USING (is_admin());

CREATE POLICY "Agents can view their own wallet balance" 
ON public.wallet_balances 
FOR SELECT 
USING (agent_id IN (
  SELECT agents.id 
  FROM agents 
  WHERE agents.user_id = auth.uid()
));

CREATE POLICY "Agents can insert their own wallet balance" 
ON public.wallet_balances 
FOR INSERT 
WITH CHECK (agent_id IN (
  SELECT agents.id 
  FROM agents 
  WHERE agents.user_id = auth.uid()
));

CREATE POLICY "Agents can update their own wallet balance" 
ON public.wallet_balances 
FOR UPDATE 
USING (agent_id IN (
  SELECT agents.id 
  FROM agents 
  WHERE agents.user_id = auth.uid()
));

-- Create wallet transactions table to track all wallet activities
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agent_id UUID NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
  amount DECIMAL(10,2) NOT NULL,
  description TEXT NOT NULL,
  reference_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for wallet transactions
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for wallet transactions
CREATE POLICY "Admins can view all wallet transactions" 
ON public.wallet_transactions 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Agents can view their own wallet transactions" 
ON public.wallet_transactions 
FOR SELECT 
USING (agent_id IN (
  SELECT agents.id 
  FROM agents 
  WHERE agents.user_id = auth.uid()
));

CREATE POLICY "Agents can create their own wallet transactions" 
ON public.wallet_transactions 
FOR INSERT 
WITH CHECK (agent_id IN (
  SELECT agents.id 
  FROM agents 
  WHERE agents.user_id = auth.uid()
));

-- Create trigger for wallet balance updates
CREATE TRIGGER update_wallet_balances_updated_at
BEFORE UPDATE ON public.wallet_balances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update wallet balance after transaction
CREATE OR REPLACE FUNCTION public.update_wallet_balance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    -- Only update balance when transaction status changes to completed
    IF NEW.transaction_type = 'credit' THEN
      INSERT INTO public.wallet_balances (agent_id, balance)
      VALUES (NEW.agent_id, NEW.amount)
      ON CONFLICT (agent_id) 
      DO UPDATE SET 
        balance = wallet_balances.balance + NEW.amount,
        updated_at = now();
    ELSIF NEW.transaction_type = 'debit' THEN
      INSERT INTO public.wallet_balances (agent_id, balance)
      VALUES (NEW.agent_id, -NEW.amount)
      ON CONFLICT (agent_id) 
      DO UPDATE SET 
        balance = wallet_balances.balance - NEW.amount,
        updated_at = now();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to update wallet balance when transaction status changes
CREATE TRIGGER update_wallet_balance_trigger
AFTER INSERT OR UPDATE ON public.wallet_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_wallet_balance();