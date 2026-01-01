-- Update deduct_credits function to skip deduction for admins
CREATE OR REPLACE FUNCTION public.deduct_credits(p_user_id uuid, p_amount integer, p_tool text, p_description text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_balance INTEGER;
  is_admin BOOLEAN;
BEGIN
  -- Check if user is admin - admins don't need credits
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = p_user_id AND role = 'admin'
  ) INTO is_admin;
  
  -- If admin, always return true without deducting
  IF is_admin THEN
    -- Still log the transaction but with 0 amount
    INSERT INTO public.credit_transactions (user_id, amount, type, tool_used, description)
    VALUES (p_user_id, 0, 'admin_usage', p_tool, p_description);
    RETURN TRUE;
  END IF;
  
  -- For regular users, check balance
  SELECT balance INTO current_balance FROM public.user_credits WHERE user_id = p_user_id FOR UPDATE;
  
  IF current_balance IS NULL OR current_balance < p_amount THEN
    RETURN FALSE;
  END IF;
  
  UPDATE public.user_credits SET balance = balance - p_amount, updated_at = now() WHERE user_id = p_user_id;
  
  INSERT INTO public.credit_transactions (user_id, amount, type, tool_used, description)
  VALUES (p_user_id, -p_amount, 'usage', p_tool, p_description);
  
  RETURN TRUE;
END;
$$;

-- Update handle_new_user to give 300 credits instead of 100
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'full_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  -- Give 300 free credits to new users
  INSERT INTO public.user_credits (user_id, balance, total_purchased)
  VALUES (NEW.id, 300, 0);
  
  RETURN NEW;
END;
$$;

-- Create subscriptions table for tracking user plans
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  payment_method TEXT,
  payment_reference TEXT,
  amount DECIMAL(10,2),
  currency TEXT DEFAULT 'NPR',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS policies for subscriptions
CREATE POLICY "Users can view own subscriptions"
ON public.subscriptions
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subscriptions"
ON public.subscriptions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
ON public.subscriptions
FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();