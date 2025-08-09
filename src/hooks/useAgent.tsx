import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export interface Agent {
  id: string;
  user_id: string;
  agent_code: string;
  company_name: string;
  contact_person: string;
  phone: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  status: 'pending' | 'active' | 'suspended';
  commission_rate: number;
  created_at: string;
  updated_at: string;
}

export const useAgent = () => {
  const { user } = useAuth();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAgent();
    } else {
      setAgent(null);
      setLoading(false);
    }
  }, [user]);

  const fetchAgent = async () => {
    try {
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching agent:', error);
      } else {
        setAgent(data);
      }
    } catch (error) {
      console.error('Error fetching agent:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAgent = async (agentData: Omit<Agent, 'id' | 'user_id' | 'agent_code' | 'created_at' | 'updated_at'>) => {
    try {
      const agentCode = await generateAgentCode();
      const { data, error } = await supabase
        .from('agents')
        .insert({
          ...agentData,
          user_id: user?.id,
          agent_code: agentCode,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      setAgent(data);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const generateAgentCode = async () => {
    const { data, error } = await supabase.rpc('generate_agent_code');
    if (error) {
      throw error;
    }
    return data;
  };

  return {
    agent,
    loading,
    createAgent,
    refetch: fetchAgent
  };
};