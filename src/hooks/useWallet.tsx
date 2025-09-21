import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';

interface WalletBalance {
  id: string;
  agent_id: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

interface WalletTransaction {
  id: string;
  agent_id: string;
  transaction_type: 'credit' | 'debit';
  amount: number;
  description: string;
  reference_id?: string;
  razorpay_payment_id?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
}

export const useWallet = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch wallet balance and transactions
  const fetchWalletData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Get agent ID first
      const { data: agent } = await supabase
        .from('agents')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!agent) {
        console.log('No agent found for user');
        return;
      }

      // Fetch wallet balance
      const { data: walletData } = await supabase
        .from('wallet_balances')
        .select('*')
        .eq('agent_id', agent.id)
        .maybeSingle();

      if (walletData) {
        setBalance(Number(walletData.balance));
      } else {
        setBalance(0);
      }

      // Fetch recent transactions
      const { data: transactionsData } = await supabase
        .from('wallet_transactions')
        .select('*')
        .eq('agent_id', agent.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsData) {
        setTransactions(transactionsData as WalletTransaction[]);
      }

    } catch (error) {
      console.error('Error fetching wallet data:', error);
      toast({
        title: "Error",
        description: "Failed to load wallet data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Add money via Razorpay
  const addMoney = async (amount: number): Promise<boolean> => {
    try {
      // Create Razorpay order
      const { data: orderData, error } = await supabase.functions.invoke('create-razorpay-order', {
        body: { amount }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Initialize Razorpay payment
      return new Promise((resolve) => {
        const options = {
          key: orderData.key_id,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: 'Wallet Top-up',
          description: `Add ₹${amount} to wallet`,
          order_id: orderData.order.id,
          handler: async (response: any) => {
            try {
              // Verify payment
              const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  transaction_id: orderData.transaction_id
                }
              });

              if (verifyError) {
                throw new Error(verifyError.message);
              }

              toast({
                title: "Payment Successful",
                description: `₹${amount} added to your wallet`,
              });

              // Refresh wallet data
              await fetchWalletData();
              resolve(true);

            } catch (error) {
              console.error('Payment verification error:', error);
              toast({
                title: "Payment Failed",
                description: "Payment verification failed",
                variant: "destructive"
              });
              resolve(false);
            }
          },
          modal: {
            ondismiss: () => {
              toast({
                title: "Payment Cancelled",
                description: "Payment was cancelled by user",
                variant: "destructive"
              });
              resolve(false);
            }
          },
          theme: {
            color: '#8B5CF6'
          }
        };

        // Load Razorpay script if not already loaded
        if (!(window as any).Razorpay) {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => {
            const rzp = new (window as any).Razorpay(options);
            rzp.open();
          };
          document.body.appendChild(script);
        } else {
          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        }
      });

    } catch (error) {
      console.error('Error adding money:', error);
      toast({
        title: "Error",
        description: "Failed to initiate payment",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchWalletData();
    }
  }, [user]);

  return {
    balance,
    transactions,
    loading,
    addMoney,
    refetch: fetchWalletData
  };
};