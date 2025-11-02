import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FLIGHT_API_URL = 'https://omairiq.azurewebsites.net';

// Helper function to get auth token
async function getAuthToken(apiKey: string): Promise<string> {
  // Decode the API key to extract credentials
  const decoded = atob(apiKey);
  const parts = decoded.split(':');
  
  const username = parts[0]; // Agency ID
  const password = parts[3]; // The last part after the third colon
  
  console.log('Attempting login with username:', username);
  
  const loginResponse = await fetch(`${FLIGHT_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      Username: username,
      Password: password,
    }),
  });

  if (!loginResponse.ok) {
    const errorText = await loginResponse.text();
    console.error('Login failed:', errorText);
    throw new Error(`Login failed: ${errorText}`);
  }

  const loginData = await loginResponse.json();
  console.log('Login successful, got token');
  return loginData.token; // Returns "Bearer xyz..."
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, ...params } = await req.json();
    const apiKey = Deno.env.get('BUS_API_KEY');

    if (!apiKey) {
      console.error('BUS_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    console.log('Flight API request:', { action, params });

    // Get auth token for all actions except test
    let token = '';
    if (action !== 'test') {
      token = await getAuthToken(apiKey);
    }

    // Handle different actions - use both api-key and Authorization token
    let response;
    let endpoint = '';
    
    switch (action) {
      case 'sectors':
        endpoint = '/sectors';
        response = await fetch(`${FLIGHT_API_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'api-key': apiKey,
            'Authorization': token,
          },
        });
        break;

      case 'availability':
        endpoint = '/availability';
        response = await fetch(`${FLIGHT_API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
            'Authorization': token,
          },
          body: JSON.stringify({
            Origin: params.origin,
            Destination: params.destination,
            DepartureDate: params.departureDate,
            ReturnDate: params.returnDate,
            AdultCount: params.adultCount || 1,
            ChildCount: params.childCount || 0,
            InfantCount: params.infantCount || 0,
            Class: params.class || 'Economy',
          }),
        });
        break;

      case 'search':
        endpoint = '/searchtickets';
        response = await fetch(`${FLIGHT_API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
            'Authorization': token,
          },
          body: JSON.stringify(params.searchData),
        });
        break;

      case 'book':
        endpoint = '/ticketbooking';
        response = await fetch(`${FLIGHT_API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
            'Authorization': token,
          },
          body: JSON.stringify(params.bookingData),
        });
        break;

      case 'ticket-details':
        endpoint = `/ticketdetails?BookingId=${params.bookingId}`;
        response = await fetch(`${FLIGHT_API_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'api-key': apiKey,
            'Authorization': token,
          },
        });
        break;

      case 'test':
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'API key configured'
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
