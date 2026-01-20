import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';

export interface AccountManager {
  account_manager_name: string;
  phone: string;
  email: string;
}

export interface Agent {
  trade_licence: string;
  pan: string;
  trade_licence_file: any;
  pan_file: any;
  aadhaar: number;
  aadhaar_front_file?: any;
  aadhaar_back_file?: any;
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
  account_manager_code?: string;
  account_manager?: AccountManager | null;
  created_at: string;
  updated_at: string;
}

export const useAgent = () => {
  const { user } = useAuth();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const fetchedOnce = useRef(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!fetchedOnce.current) {
      fetchedOnce.current = true;
      fetchAgent();
    }
  }, [user]);

  const fetchAgent = async () => {
    setLoading(true);
    try {
      const { data: agentData, error: agentError } = await supabase
        .from('agents')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (!agentError || agentData) {
        setAgent(agentData);
      }

      let accountManager: AccountManager | null = null;

      if (agentData.account_manager_code) {
        const { data: managerData, error: managerError } = await supabase
          .from("account_manager")
          .select("*")
          .eq("account_manager_code", agentData.account_manager_code)
          .maybeSingle();

        if (!managerError && managerData) {
          accountManager = managerData;
        }
        
      }
      setAgent({
        ...agentData,
        account_manager: accountManager,
      });

    setLoading(false);
    } catch (error) {
      console.error(error);
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
