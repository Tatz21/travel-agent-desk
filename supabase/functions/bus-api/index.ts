import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const BUS_API_URL = 'https://omairiq.azurewebsites.net';
const BUS_API_LOGIN_ID = '9555202202';
const BUS_API_PASSWORD = '112233344';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    const apiKey = Deno.env.get('BUS_API_KEY');

    console.log('Bus API request:', { action, params });

    // Authenticate with the bus API
    const authResponse = await fetch(`${BUS_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        loginId: BUS_API_LOGIN_ID,
        password: BUS_API_PASSWORD,
      }),
    });

    if (!authResponse.ok) {
      console.error('Authentication failed:', await authResponse.text());
      throw new Error('Failed to authenticate with bus API');
    }

    const authData = await authResponse.json();
    console.log('Authentication successful');

    // Handle different actions
    let response;
    switch (action) {
      case 'search':
        response = await fetch(`${BUS_API_URL}/api/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token || apiKey}`,
          },
          body: JSON.stringify({
            from: params.from,
            to: params.to,
            date: params.date,
          }),
        });
        break;

      case 'book':
        response = await fetch(`${BUS_API_URL}/api/book`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token || apiKey}`,
          },
          body: JSON.stringify(params.bookingData),
        });
        break;

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Bus API ${action} failed:`, errorText);
      throw new Error(`Bus API request failed: ${errorText}`);
    }

    const data = await response.json();
    console.log('Bus API response:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in bus-api function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
