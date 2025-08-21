import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, Plane, Bus, Hotel, Percent, ArrowLeft } from 'lucide-react';

const ServiceCharge = () => {
  const navigate = useNavigate();

  const serviceCharges = [
    {
      service: 'Flight Booking',
      icon: Plane,
      domesticCharge: '₹150 + GST',
      internationalCharge: '₹300 + GST',
      description: 'Per passenger, per booking'
    },
    {
      service: 'Bus Booking',
      icon: Bus,
      domesticCharge: '₹50 + GST',
      internationalCharge: 'N/A',
      description: 'Per passenger, per booking'
    },
    {
      service: 'Hotel Booking',
      icon: Hotel,
      domesticCharge: '₹100 + GST',
      internationalCharge: '₹200 + GST',
      description: 'Per room, per night'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/dashboard')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Service Charges</h1>
            <p className="text-muted-foreground">View current service charges for different booking types</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceCharges.map((item) => (
          <Card key={item.service}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <item.icon className="h-5 w-5 mr-2" />
                {item.service}
              </CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Domestic</span>
                  <Badge variant="secondary">{item.domesticCharge}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">International</span>
                  <Badge variant={item.internationalCharge === 'N/A' ? 'outline' : 'secondary'}>
                    {item.internationalCharge}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Percent className="h-5 w-5 mr-2" />
            Commission Structure
          </CardTitle>
          <CardDescription>
            Your earnings from successful bookings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">5%</div>
              <div className="text-sm text-muted-foreground">Standard Commission</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">7%</div>
              <div className="text-sm text-muted-foreground">Premium Agents</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">10%</div>
              <div className="text-sm text-muted-foreground">Group Bookings</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Important Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Service charges are applicable on all bookings and are non-refundable</li>
            <li>• GST will be calculated as per current government rates</li>
            <li>• Commission is paid after successful completion of travel</li>
            <li>• Special rates may apply for corporate and group bookings</li>
            <li>• Service charges are subject to change with prior notice</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceCharge;