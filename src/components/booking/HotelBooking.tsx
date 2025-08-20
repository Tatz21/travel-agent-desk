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
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Hotel className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-semibold text-foreground mb-2">Coming Soon</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Hotel booking functionality is under development. Stay tuned for updates!
        </p>
      </CardContent>
    </Card>
  );
};

export default HotelBooking;