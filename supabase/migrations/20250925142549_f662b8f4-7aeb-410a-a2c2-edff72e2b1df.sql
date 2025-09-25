-- Remove the overly permissive policy
DROP POLICY "Allow agent lookup for authentication" ON public.agents;

-- Create a security definer function for agent authentication lookup
CREATE OR REPLACE FUNCTION public.get_agent_for_auth(agent_email text)
RETURNS TABLE(phone text, user_id uuid, email text)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.phone, a.user_id, a.email 
  FROM public.agents a 
  WHERE LOWER(a.email) = LOWER(agent_email)
  ORDER BY a.created_at DESC
  LIMIT 1;
$$;