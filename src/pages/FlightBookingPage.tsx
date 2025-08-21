import React from 'react';
import FlightBooking from '@/components/booking/FlightBooking';

const FlightBookingPage = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Flight Booking</h1>
        <FlightBooking />
      </div>
    </div>
  );
};

export default FlightBookingPage;