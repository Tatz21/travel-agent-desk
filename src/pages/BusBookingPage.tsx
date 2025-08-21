import React from 'react';
import BusBooking from '@/components/booking/BusBooking';

const BusBookingPage = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Bus Booking</h1>
        <BusBooking />
      </div>
    </div>
  );
};

export default BusBookingPage;