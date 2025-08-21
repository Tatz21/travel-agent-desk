import React from 'react';
import HotelBooking from '@/components/booking/HotelBooking';

const HotelBookingPage = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Hotel Booking</h1>
        <HotelBooking />
      </div>
    </div>
  );
};

export default HotelBookingPage;