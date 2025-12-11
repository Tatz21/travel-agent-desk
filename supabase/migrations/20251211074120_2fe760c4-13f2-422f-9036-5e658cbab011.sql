-- Allow authenticated users to insert their own agent record
CREATE POLICY "Users can create their own agent"
ON public.agents
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);