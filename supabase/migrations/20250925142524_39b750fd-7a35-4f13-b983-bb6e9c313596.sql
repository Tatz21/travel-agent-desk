-- Add policy to allow reading agent data for authentication purposes
CREATE POLICY "Allow agent lookup for authentication"
ON public.agents
FOR SELECT
TO anon
USING (true);