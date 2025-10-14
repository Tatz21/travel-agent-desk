import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FLIGHT_API_URL = 'https://omairiq.azurewebsites.net';
const FLIGHT_API_LOGIN_ID = '9555202202';
const FLIGHT_API_PASSWORD = '112233344';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    const apiKey = Deno.env.get('BUS_API_KEY');

    console.log('Flight API request:', { action, params });

    // Test authentication
    const authResponse = await fetch(`${FLIGHT_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${apiKey}`,
      },
      body: JSON.stringify({
        loginId: FLIGHT_API_LOGIN_ID,
        password: FLIGHT_API_PASSWORD,
      }),
    });

    const authResponseText = await authResponse.text();
    console.log('Auth response status:', authResponse.status);
    console.log('Auth response:', authResponseText);

    if (!authResponse.ok) {
      console.error('Authentication failed');
      return new Response(
        JSON.stringify({ 
          error: 'Authentication failed', 
          status: authResponse.status,
          response: authResponseText 
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let authData;
    try {
      authData = JSON.parse(authResponseText);
    } catch (e) {
      authData = { token: authResponseText };
    }
    
    console.log('Authentication successful');

    // Handle different actions
    let response;
    let endpoint = '';
    
    switch (action) {
      case 'search':
        endpoint = '/api/flight/search';
        response = await fetch(`${FLIGHT_API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token || apiKey}`,
          },
          body: JSON.stringify({
            origin: params.from,
            destination: params.to,
            departureDate: params.date,
            returnDate: params.returnDate,
            adults: params.adults || 1,
            children: params.children || 0,
            infants: params.infants || 0,
            cabinClass: params.cabinClass || 'Economy',
          }),
        });
        break;

      case 'book':
        endpoint = '/api/flight/book';
        response = await fetch(`${FLIGHT_API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authData.token || apiKey}`,
          },
          body: JSON.stringify(params.bookingData),
        });
        break;

      case 'test':
        // Just return auth success for testing
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'API connection successful',
            authData 
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );

      default:
        throw new Error(`Unknown action: ${action}`);
    }

    const responseText = await response.text();
    console.log(`${action} response status:`, response.status);
    console.log(`${action} response:`, responseText);

    if (!response.ok) {
      console.error(`Flight API ${action} failed`);
      return new Response(
        JSON.stringify({ 
          error: `API request failed`, 
          status: response.status,
          response: responseText 
        }),
        {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      data = { response: responseText };
    }
    
    console.log('API response data:', data);

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in flight-api function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
