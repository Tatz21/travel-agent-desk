import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FLIGHT_API_URL = 'https://omairiq.azurewebsites.net';

// Token cache (in production, use a proper cache like Redis)
let cachedToken: string | null = null;
let tokenExpiry: number = 0;

// Use provided credentials for authentication
function getCredentials(): { username: string; password: string } {
  return {
    username: '9330102817',
    password: '309371'
  };
}

// Function to get or refresh token
async function getAuthToken(apiKey: string): Promise<string> {
  // Check if cached token is still valid (with 5 minute buffer)
  if (cachedToken && Date.now() < tokenExpiry - 300000) {
    return cachedToken;
  }

  const credentials = getCredentials();
  console.log('Logging in to get new token...');
  
  const loginResponse = await fetch(`${FLIGHT_API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      Username: credentials.username,
      Password: credentials.password,
    }),
  });

  if (!loginResponse.ok) {
    const errorText = await loginResponse.text();
    console.error('Login failed:', loginResponse.status, errorText);
    throw new Error(`Login failed: ${loginResponse.status}`);
  }

  const loginData = await loginResponse.json();
  cachedToken = loginData.token;
  tokenExpiry = Date.now() + (loginData.expiration * 1000);
  
  console.log('Token obtained successfully');
  return cachedToken;
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

    // Handle different actions
    let response;
    let endpoint = '';
    
    switch (action) {
      case 'login':
        endpoint = '/login';
        const loginCreds = params.username && params.password 
          ? { username: params.username, password: params.password }
          : getCredentials();
        
        response = await fetch(`${FLIGHT_API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
          },
          body: JSON.stringify({
            Username: loginCreds.username,
            Password: loginCreds.password,
          }),
        });
        break;

      case 'sectors':
        endpoint = '/sectors';
        const token = await getAuthToken(apiKey);
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
        const availToken = await getAuthToken(apiKey);
        response = await fetch(`${FLIGHT_API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
            'Authorization': availToken,
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
        // Try different possible endpoint names
        endpoint = '/search'; // Changed from /searchtickets
        const searchToken = await getAuthToken(apiKey);
        console.log('Searching flights with params:', JSON.stringify(params.searchData, null, 2));
        response = await fetch(`${FLIGHT_API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
            'Authorization': searchToken,
          },
          body: JSON.stringify(params.searchData),
        });
        break;

      case 'book':
        endpoint = '/ticketbooking';
        const bookToken = await getAuthToken(apiKey);
        response = await fetch(`${FLIGHT_API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey,
            'Authorization': bookToken,
          },
          body: JSON.stringify(params.bookingData),
        });
        break;

      case 'ticket-details':
        endpoint = `/ticketdetails?BookingId=${params.bookingId}`;
        const detailsToken = await getAuthToken(apiKey);
        response = await fetch(`${FLIGHT_API_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'api-key': apiKey,
            'Authorization': detailsToken,
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
