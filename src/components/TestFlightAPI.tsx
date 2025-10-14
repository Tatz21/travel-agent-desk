import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plane } from 'lucide-react';

const TestFlightAPI = () => {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const testAPI = async () => {
    setTesting(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('flight-api', {
        body: { action: 'test' }
      });

      if (error) throw error;

      setResult(data);
      toast.success('API connection successful!');
    } catch (error: any) {
      console.error('API test error:', error);
      setResult({ error: error.message });
      toast.error('API connection failed: ' + error.message);
    } finally {
      setTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plane className="h-5 w-5" />
          Test Flight API Connection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testAPI} 
          disabled={testing}
          className="w-full"
        >
          {testing ? 'Testing...' : 'Test API Connection'}
        </Button>

        {result && (
          <div className="p-4 bg-muted rounded-lg">
            <pre className="text-xs overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestFlightAPI;
