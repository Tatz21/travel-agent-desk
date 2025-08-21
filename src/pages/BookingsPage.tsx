import React from 'react';
import BookingsList from '@/components/booking/BookingsList';

const BookingsPage = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">All Bookings</h1>
        <BookingsList />
      </div>
    </div>
  );
};

export default BookingsPage;