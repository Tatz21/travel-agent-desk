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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center w-fit"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Hero Section */}
          <div className="text-center space-y-4 py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Service Charges</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transparent pricing for all booking types with competitive commission rates
            </p>
          </div>

          {/* Service Charges Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCharges.map((item) => (
              <Card key={item.service} className="shadow-lg border-0 bg-card/50 backdrop-blur hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3 mx-auto">
                    <item.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{item.service}</CardTitle>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">Domestic</span>
                      <Badge variant="secondary" className="font-semibold">{item.domesticCharge}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                      <span className="font-medium">International</span>
                      <Badge variant={item.internationalCharge === 'N/A' ? 'outline' : 'secondary'} className="font-semibold">
                        {item.internationalCharge}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Commission Structure */}
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-3 mx-auto">
                <Percent className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Commission Structure</CardTitle>
              <CardDescription className="text-base">
                Your earnings from successful bookings
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                  <div className="text-3xl font-bold text-primary mb-2">5%</div>
                  <div className="font-medium">Standard Commission</div>
                  <div className="text-sm text-muted-foreground mt-1">Regular bookings</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                  <div className="text-3xl font-bold text-primary mb-2">7%</div>
                  <div className="font-medium">Premium Agents</div>
                  <div className="text-sm text-muted-foreground mt-1">High volume agents</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                  <div className="text-3xl font-bold text-primary mb-2">10%</div>
                  <div className="font-medium">Group Bookings</div>
                  <div className="text-sm text-muted-foreground mt-1">Corporate & groups</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl">Important Notes & Terms</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-sm">Service charges are applicable on all bookings and are non-refundable</div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-sm">GST will be calculated as per current government rates</div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-sm">Commission is paid after successful completion of travel</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-sm">Special rates may apply for corporate and group bookings</div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <div className="text-sm">Service charges are subject to change with prior notice</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceCharge;