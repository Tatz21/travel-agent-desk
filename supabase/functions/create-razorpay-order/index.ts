import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount } = await req.json();
    
    if (!amount || amount <= 0) {
      throw new Error('Invalid amount provided');
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get current user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabaseClient.auth.getUser(token);
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Get agent ID for the current user
    const { data: agent } = await supabaseClient
      .from('agents')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (!agent) {
      throw new Error('Agent not found');
    }

    // Create Razorpay order
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID');
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET');
    
    if (!razorpayKeyId) {
      throw new Error('Razorpay key ID not configured');
    }
    
    if (!razorpayKeySecret) {
      throw new Error('Razorpay key secret not configured');
    }

    const orderData = {
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      receipt: `wallet_${agent.id}_${Date.now()}`,
      notes: {
        agent_id: agent.id,
        user_id: user.id
      }
    };

    console.log('Creating Razorpay order:', orderData);

    // Verify credentials are available
    console.log('Razorpay Key ID:', razorpayKeyId);
    console.log('Razorpay Key Secret exists:', !!razorpayKeySecret);
    console.log('Razorpay Key Secret length:', razorpayKeySecret?.length || 0);
    console.log('Razorpay Key Secret prefix:', razorpayKeySecret?.substring(0, 8) + '...');

    if (!razorpayKeyId || !razorpayKeySecret) {
      throw new Error(`Missing credentials - Key ID: ${!!razorpayKeyId}, Key Secret: ${!!razorpayKeySecret}`);
    }

    // Create order with Razorpay
    const authString = btoa(`${razorpayKeyId}:${razorpayKeySecret}`);
    
    console.log('Making Razorpay API call with order data:', orderData);
    console.log('Auth string length:', authString.length);
    
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${authString}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    console.log('Razorpay API response status:', razorpayResponse.status);
    console.log('Razorpay API response headers:', Object.fromEntries(razorpayResponse.headers.entries()));

    if (!razorpayResponse.ok) {
      const errorData = await razorpayResponse.text();
      console.error('Razorpay API error response:', errorData);
      console.error('Razorpay API error status:', razorpayResponse.status);
      throw new Error(`Razorpay API error: ${razorpayResponse.status} - ${errorData}`);
    }

    const order = await razorpayResponse.json();
    console.log('Razorpay order created:', order);

    // Create pending wallet transaction
    const { data: transaction, error: transactionError } = await supabaseClient
      .from('wallet_transactions')
      .insert({
        agent_id: agent.id,
        transaction_type: 'credit',
        amount: amount,
        description: `Wallet top-up via Razorpay`,
        reference_id: order.id,
        status: 'pending'
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Transaction creation error:', transactionError);
      throw new Error('Failed to create transaction record');
    }

    return new Response(JSON.stringify({ 
      order,
      transaction_id: transaction.id,
      key_id: razorpayKeyId
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-razorpay-order:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});