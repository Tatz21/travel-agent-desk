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
      <CardContent className="flex flex-col items-center justify-center py-16">
        <Bus className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-2xl font-semibold text-foreground mb-2">Coming Soon</h3>
        <p className="text-muted-foreground text-center max-w-md">
          Bus booking functionality is under development. Stay tuned for updates!
        </p>
      </CardContent>
    </Card>
  );
};

export default BusBooking;