import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Users, Send } from 'lucide-react';

const GroupBooking = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Group Booking Enquiry</h1>
        <p className="text-muted-foreground">Submit enquiries for group bookings and corporate travel</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            New Group Booking Enquiry
          </CardTitle>
          <CardDescription>
            Fill out the form below to submit a group booking enquiry
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

          <Button className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Submit Enquiry
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupBooking;