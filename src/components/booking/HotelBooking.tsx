import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Hotel, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { useAgent } from '@/hooks/useAgent';
import { supabase } from '@/integrations/supabase/client';

const HotelBooking = () => {
  const { agent } = useAgent();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    city: '',
    checkInDate: null as Date | null,
    checkOutDate: null as Date | null,
    rooms: 1,
    adults: 2,
    children: 0,
    roomType: 'standard',
    guestName: '',
    guestEmail: '',
    guestPhone: ''
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

    if (!formData.city || !formData.checkInDate || !formData.checkOutDate || !formData.guestName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.checkOutDate <= formData.checkInDate) {
      toast({
        title: "Error",
        description: "Check-out date must be after check-in date",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Generate booking reference
      const { data: bookingRef } = await supabase.rpc('generate_booking_reference');
      
      // Calculate nights
      const nights = Math.ceil((formData.checkOutDate.getTime() - formData.checkInDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Mock hotel price calculation
      const roomPrices = {
        standard: 2000,
        deluxe: 3500,
        suite: 5000,
        presidential: 10000
      };
      const basePrice = roomPrices[formData.roomType as keyof typeof roomPrices];
      const totalAmount = basePrice * formData.rooms * nights;
      const commissionAmount = totalAmount * (agent.commission_rate / 100);

      const bookingData = {
        agent_id: agent.id,
        booking_reference: bookingRef,
        booking_type: 'hotel' as const,
        passenger_name: formData.guestName,
        passenger_email: formData.guestEmail,
        passenger_phone: formData.guestPhone,
        from_location: formData.city,
        to_location: formData.city,
        departure_date: formData.checkInDate.toISOString().split('T')[0],
        return_date: formData.checkOutDate.toISOString().split('T')[0],
        adult_count: formData.adults,
        child_count: formData.children,
        total_amount: totalAmount,
        commission_amount: commissionAmount,
        booking_details: {
          check_in_date: formData.checkInDate?.toISOString(),
          check_out_date: formData.checkOutDate?.toISOString(),
          nights: nights,
          rooms: formData.rooms,
          room_type: formData.roomType
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
        description: `Hotel booking created successfully! Reference: ${bookingRef}`
      });

      // Reset form
      setFormData({
        city: '',
        checkInDate: null,
        checkOutDate: null,
        rooms: 1,
        adults: 2,
        children: 0,
        roomType: 'standard',
        guestName: '',
        guestEmail: '',
        guestPhone: ''
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
          <Hotel className="h-5 w-5 mr-2" />
          Hotel Booking
        </CardTitle>
        <CardDescription>
          Book hotels and accommodations for your customers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hotel Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City/Destination *</Label>
            <Input
              id="city"
              name="city"
              placeholder="Enter city name"
              value={formData.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="roomType">Room Type</Label>
            <Select value={formData.roomType} onValueChange={(value) => handleSelectChange('roomType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="deluxe">Deluxe</SelectItem>
                <SelectItem value="suite">Suite</SelectItem>
                <SelectItem value="presidential">Presidential Suite</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Check-in Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.checkInDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.checkInDate ? format(formData.checkInDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.checkInDate || undefined}
                  onSelect={(date) => setFormData({ ...formData, checkInDate: date || null })}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Check-out Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.checkOutDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.checkOutDate ? format(formData.checkOutDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.checkOutDate || undefined}
                  onSelect={(date) => setFormData({ ...formData, checkOutDate: date || null })}
                  disabled={(date) => date <= (formData.checkInDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rooms">Rooms</Label>
            <Select value={formData.rooms.toString()} onValueChange={(value) => handleSelectChange('rooms', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((num) => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
        </div>

        {/* Guest Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Guest Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">Guest Name *</Label>
              <Input
                id="guestName"
                name="guestName"
                placeholder="Full name"
                value={formData.guestName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestEmail">Email *</Label>
              <Input
                id="guestEmail"
                name="guestEmail"
                type="email"
                placeholder="Email address"
                value={formData.guestEmail}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="guestPhone">Phone *</Label>
              <Input
                id="guestPhone"
                name="guestPhone"
                type="tel"
                placeholder="Phone number"
                value={formData.guestPhone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <Button onClick={handleBooking} className="w-full" disabled={loading}>
          {loading ? 'Processing...' : 'Book Hotel'}
          <Search className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default HotelBooking;