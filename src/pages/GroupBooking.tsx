import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Send, ArrowLeft } from 'lucide-react';

const GroupBooking = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
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
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">Group Booking Enquiry</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Submit enquiries for group bookings and corporate travel with our dedicated team
            </p>
          </div>

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Submit Your Enquiry</CardTitle>
              <CardDescription className="text-base">
                Fill out the form below and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company/Organization Name *</Label>
              <Input id="companyName" placeholder="Enter company name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input id="contactPerson" placeholder="Enter contact person name" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" placeholder="Enter phone number" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="travelType">Travel Type *</Label>
              <Input id="travelType" placeholder="Flight/Bus/Hotel" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupSize">Group Size *</Label>
              <Input id="groupSize" type="number" placeholder="Number of travelers" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="travelDate">Preferred Travel Date</Label>
              <Input id="travelDate" type="date" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Special Requirements</Label>
            <Textarea 
              id="requirements" 
              placeholder="Please mention any special requirements, destinations, budget range, etc."
              rows={4}
            />
          </div>

              <Button className="w-full h-12 text-lg font-medium">
                <Send className="h-5 w-5 mr-2" />
                Submit Enquiry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroupBooking;