import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Plane, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useAgent } from '@/hooks/useAgent';
import { supabase } from '@/integrations/supabase/client';

const FlightBooking = () => {
  const { agent } = useAgent();
  const [loading, setLoading] = useState(false);
  const [tripType, setTripType] = useState('one-way');
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDate: null as Date | null,
    returnDate: null as Date | null,
    adults: 1,
    children: 0,
    class: 'economy',
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
      
      // Mock flight price calculation
      const basePrice = 5000;
      const totalAmount = basePrice * formData.adults + (basePrice * 0.75 * formData.children);
      const commissionAmount = totalAmount * (agent.commission_rate / 100);

      const bookingData = {
        agent_id: agent.id,
        booking_reference: bookingRef,
        booking_type: 'flight' as const,
        passenger_name: formData.passengerName,
        passenger_email: formData.passengerEmail,
        passenger_phone: formData.passengerPhone,
        from_location: formData.from,
        to_location: formData.to,
        departure_date: formData.departureDate.toISOString().split('T')[0],
        return_date: formData.returnDate ? formData.returnDate.toISOString().split('T')[0] : null,
        adult_count: formData.adults,
        child_count: formData.children,
        total_amount: totalAmount,
        commission_amount: commissionAmount,
        booking_details: {
          trip_type: tripType,
          class: formData.class,
          departure_date: formData.departureDate?.toISOString(),
          return_date: formData.returnDate?.toISOString()
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
        description: `Flight booking created successfully! Reference: ${bookingRef}`
      });

      // Reset form
      setFormData({
        from: '',
        to: '',
        departureDate: null,
        returnDate: null,
        adults: 1,
        children: 0,
        class: 'economy',
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
          <Plane className="h-5 w-5 mr-2" />
          Flight Booking
        </CardTitle>
        <CardDescription>
          Book domestic and international flights for your customers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trip Type */}
        <div className="space-y-3">
          <Label>Trip Type</Label>
          <RadioGroup value={tripType} onValueChange={setTripType} className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="one-way" id="one-way" />
              <Label htmlFor="one-way">One Way</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="round-trip" id="round-trip" />
              <Label htmlFor="round-trip">Round Trip</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Flight Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="from">From *</Label>
            <Input
              id="from"
              name="from"
              placeholder="Departure city"
              value={formData.from}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">To *</Label>
            <Input
              id="to"
              name="to"
              placeholder="Destination city"
              value={formData.to}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Departure Date *</Label>
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

          {tripType === 'round-trip' && (
            <div className="space-y-2">
              <Label>Return Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.returnDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.returnDate ? format(formData.returnDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.returnDate || undefined}
                    onSelect={(date) => setFormData({ ...formData, returnDate: date || null })}
                    disabled={(date) => date < (formData.departureDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adults">Adults</Label>
            <Select value={formData.adults.toString()} onValueChange={(value) => handleSelectChange('adults', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="children">Children</Label>
            <Select value={formData.children.toString()} onValueChange={(value) => handleSelectChange('children', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4].map((num) => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="class">Class</Label>
            <Select value={formData.class} onValueChange={(value) => handleSelectChange('class', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="first">First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Passenger Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passengerName">Passenger Name *</Label>
              <Input
                id="passengerName"
                name="passengerName"
                placeholder="Full name"
                value={formData.passengerName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passengerEmail">Email *</Label>
              <Input
                id="passengerEmail"
                name="passengerEmail"
                type="email"
                placeholder="Email address"
                value={formData.passengerEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passengerPhone">Phone *</Label>
              <Input
                id="passengerPhone"
                name="passengerPhone"
                type="tel"
                placeholder="Phone number"
                value={formData.passengerPhone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <Button onClick={handleBooking} className="w-full" disabled={loading}>
          {loading ? 'Processing...' : 'Book Flight'}
          <Search className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default FlightBooking;