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

// Decode API key to extract credentials
function decodeApiKey(apiKey: string): { username: string; password: string } | null {
  try {
    // Decode base64
    const decoded = atob(apiKey);
    console.log('Decoded API key:', decoded);
    
    // Format appears to be: AgencyId:AgencyName:MobileNo:EncodedPassword
    const parts = decoded.split(':');
    if (parts.length >= 4) {
      const username = parts[2]; // Mobile number
      // Try the password as-is first (might not need additional decoding)
      const password = parts[3];
      console.log('Extracted credentials - username:', username, 'password length:', password.length);
      return { username, password };
    }
  } catch (e) {
    console.error('Failed to decode API key:', e);
  }
  return null;
}

// Function to get or refresh token
async function getAuthToken(apiKey: string): Promise<string> {
  // Check if cached token is still valid (with 5 minute buffer)
  if (cachedToken && Date.now() < tokenExpiry - 300000) {
    return cachedToken;
  }

  const credentials = decodeApiKey(apiKey);
  if (!credentials) {
    throw new Error('Could not extract credentials from API key');
  }

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
          : decodeApiKey(apiKey);
        
        if (!loginCreds) {
          throw new Error('No credentials provided');
        }
        
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
        endpoint = '/searchtickets';
        const searchToken = await getAuthToken(apiKey);
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
