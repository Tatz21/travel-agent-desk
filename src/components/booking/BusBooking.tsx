import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Bus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useAgent } from '@/hooks/useAgent';
import { supabase } from '@/integrations/supabase/client';

const BusBooking = () => {
  const { agent } = useAgent();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDate: null as Date | null,
    passengers: 1,
    busType: 'ac',
    passengerName: '',
    passengerEmail: '',
    passengerPhone: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleBooking = async () => {
    if (!agent) {
      toast({
        title: "Error",
        description: "Agent profile not found",
        variant: "destructive"
      });
      return;
    }

    if (!formData.from || !formData.to || !formData.departureDate || !formData.passengerName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Generate booking reference
      const { data: bookingRef } = await supabase.rpc('generate_booking_reference');
      
      // Mock bus price calculation
      const basePrice = formData.busType === 'ac' ? 800 : 500;
      const totalAmount = basePrice * formData.passengers;
      const commissionAmount = totalAmount * (agent.commission_rate / 100);

      const bookingData = {
        agent_id: agent.id,
        booking_reference: bookingRef,
        booking_type: 'bus' as const,
        passenger_name: formData.passengerName,
        passenger_email: formData.passengerEmail,
        passenger_phone: formData.passengerPhone,
        from_location: formData.from,
        to_location: formData.to,
        departure_date: formData.departureDate.toISOString().split('T')[0],
        adult_count: formData.passengers,
        child_count: 0,
        total_amount: totalAmount,
        commission_amount: commissionAmount,
        booking_details: {
          bus_type: formData.busType,
          departure_date: formData.departureDate?.toISOString()
        }
      };

      const { error } = await supabase
        .from('bookings')
        .insert(bookingData);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: `Bus booking created successfully! Reference: ${bookingRef}`
      });

      // Reset form
      setFormData({
        from: '',
        to: '',
        departureDate: null,
        passengers: 1,
        busType: 'ac',
        passengerName: '',
        passengerEmail: '',
        passengerPhone: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bus className="h-5 w-5 mr-2" />
          Bus Booking
        </CardTitle>
        <CardDescription>
          Book bus tickets across different cities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <Input
              id="from"
              name="from"
              placeholder="Departure City"
              value={formData.from}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To</Label>
            <Input
              id="to"
              name="to"
              placeholder="Arrival City"
              value={formData.to}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Departure Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.departureDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.departureDate ? format(formData.departureDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.departureDate || undefined}
                  onSelect={(date) => setFormData({ ...formData, departureDate: date || null })}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="passengers">Number of Passengers</Label>
            <Input
              id="passengers"
              name="passengers"
              type="number"
              min="1"
              max="9"
              value={formData.passengers}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="busType">Bus Type</Label>
            <Select
              value={formData.busType}
              onValueChange={(value) => handleSelectChange('busType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ac">AC</SelectItem>
                <SelectItem value="non-ac">Non-AC</SelectItem>
                <SelectItem value="sleeper">Sleeper</SelectItem>
                <SelectItem value="semi-sleeper">Semi-Sleeper</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Passenger Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passengerName">Passenger Name *</Label>
              <Input
                id="passengerName"
                name="passengerName"
                placeholder="Full Name"
                value={formData.passengerName}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengerEmail">Email</Label>
              <Input
                id="passengerEmail"
                name="passengerEmail"
                type="email"
                placeholder="email@example.com"
                value={formData.passengerEmail}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passengerPhone">Phone</Label>
              <Input
                id="passengerPhone"
                name="passengerPhone"
                type="tel"
                placeholder="Phone Number"
                value={formData.passengerPhone}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <Button 
          onClick={handleBooking} 
          disabled={loading}
          className="w-full"
        >
          <Search className="h-4 w-4 mr-2" />
          {loading ? 'Processing...' : 'Search & Book'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BusBooking;