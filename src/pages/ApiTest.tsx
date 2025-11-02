import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ApiTest = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Flight search params
  const [origin, setOrigin] = useState('DEL');
  const [destination, setDestination] = useState('BOM');
  const [departureDate, setDepartureDate] = useState('2025-12-01');
  const [adultCount, setAdultCount] = useState(1);

  const testSectors = async () => {
    setLoading(true);
    setResponse('Testing sectors...');
    
    try {
      const res = await fetch('https://votwokvmqroxidvokexh.supabase.co/functions/v1/flight-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'sectors',
        }),
      });

      const data = await res.text();
      setResponse(`Status: ${res.status}\n\n${data}`);
    } catch (error: any) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAvailability = async () => {
    setLoading(true);
    setResponse('Searching for flights...');
    
    try {
      const res = await fetch('https://votwokvmqroxidvokexh.supabase.co/functions/v1/flight-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'availability',
          origin: origin,
          destination: destination,
          departureDate: departureDate,
          adultCount: adultCount,
          childCount: 0,
          infantCount: 0,
          class: 'Economy',
        }),
      });

      const data = await res.text();
      setResponse(`Status: ${res.status}\n\n${data}`);
    } catch (error: any) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Flight API Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold">Test Sectors Endpoint</h3>
            <Button onClick={testSectors} disabled={loading}>
              Test Sectors
            </Button>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold">Test Flight Search</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Origin (Airport Code)</Label>
                <Input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value.toUpperCase())}
                  placeholder="e.g., DEL"
                />
              </div>
              <div className="space-y-2">
                <Label>Destination (Airport Code)</Label>
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value.toUpperCase())}
                  placeholder="e.g., BOM"
                />
              </div>
              <div className="space-y-2">
                <Label>Departure Date</Label>
                <Input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Adult Count</Label>
                <Input
                  type="number"
                  min="1"
                  value={adultCount}
                  onChange={(e) => setAdultCount(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            <Button onClick={testAvailability} disabled={loading}>
              Search Flights
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Response</Label>
            <Textarea
              value={response}
              readOnly
              className="min-h-[300px] font-mono text-sm"
              placeholder="Response will appear here..."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTest;
