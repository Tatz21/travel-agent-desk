import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const ApiTest = () => {
  const [apiKey, setApiKey] = useState('MTQ3MDM1MDA6UEhPRU5JWCBUUkFWRUxPUEVESUE6MTg0NzM2MDM1Nzc2Njpya2FaYS9OdWNMOS9YejBEcmVtdGp3PT0=');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setResponse('Testing...');
    
    try {
      const res = await fetch('https://omairiq.azurewebsites.net/login', {
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

      const data = await res.text();
      setResponse(`Status: ${res.status}\n\n${data}`);
    } catch (error: any) {
      setResponse(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testSectors = async () => {
    setLoading(true);
    setResponse('Testing sectors...');
    
    try {
      const res = await fetch('https://omairiq.azurewebsites.net/sectors', {
        method: 'GET',
        headers: {
          'api-key': apiKey,
        },
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
          <div className="space-y-2">
            <Label>API Key</Label>
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter API key"
            />
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold">Test Login Endpoint</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                />
              </div>
              <div className="space-y-2">
                <Label>Password</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                />
              </div>
            </div>
            <Button onClick={testLogin} disabled={loading}>
              Test Login
            </Button>
          </div>

          <div className="border-t pt-6 space-y-4">
            <h3 className="font-semibold">Test Sectors Endpoint (No Auth)</h3>
            <Button onClick={testSectors} disabled={loading}>
              Test Sectors
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
