import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plane, Bus, Hotel, User, MapPin, Calendar, Users, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';

interface Booking {
  id: string;
  booking_reference: string;
  booking_type: 'flight' | 'bus' | 'hotel';
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  from_location?: string;
  to_location?: string;
  departure_date?: string;
  return_date?: string;
  adult_count: number;
  child_count: number;
  total_amount: number;
  commission_amount: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booking_details: any;
  created_at: string;
}

interface BookingDetailsProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
}

const BookingDetails: React.FC<BookingDetailsProps> = ({ booking, isOpen, onClose }) => {
  const getBookingIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="h-5 w-5" />;
      case 'bus':
        return <Bus className="h-5 w-5" />;
      case 'hotel':
        return <Hotel className="h-5 w-5" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getBookingIcon(booking.booking_type)}
            Booking Details - {booking.booking_reference}
          </DialogTitle>
          <DialogDescription>
            View complete details for this {booking.booking_type} booking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getBookingIcon(booking.booking_type)}
              <span className="font-medium capitalize">{booking.booking_type} Booking</span>
            </div>
            <Badge variant="secondary" className={getStatusColor(booking.status)}>
              {booking.status}
            </Badge>
          </div>

          <Separator />

          {/* Passenger Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              Passenger Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="font-medium">{booking.passenger_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p>{booking.passenger_email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p>{booking.passenger_phone}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Passengers</label>
                <p>
                  {booking.adult_count} Adult{booking.adult_count > 1 ? 's' : ''}
                  {booking.child_count > 0 && `, ${booking.child_count} Child${booking.child_count > 1 ? 'ren' : ''}`}
                  {booking.booking_details?.infant_count > 0 && `, ${booking.booking_details.infant_count} Infant${booking.booking_details.infant_count > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Travel Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Travel Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {booking.booking_type === 'hotel' ? 'Location' : 'From'}
                </label>
                <p className="font-medium">{booking.from_location}</p>
              </div>
              {booking.booking_type !== 'hotel' && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">To</label>
                  <p className="font-medium">{booking.to_location}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  {booking.booking_type === 'hotel' ? 'Check-in Date' : 'Departure Date'}
                </label>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {booking.departure_date ? format(new Date(booking.departure_date), 'PPP') : 'Not specified'}
                </p>
              </div>
              {booking.return_date && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    {booking.booking_type === 'hotel' ? 'Check-out Date' : 'Return Date'}
                  </label>
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(booking.return_date), 'PPP')}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Financial Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <IndianRupee className="h-4 w-4" />
              Financial Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <label className="text-sm font-medium text-muted-foreground">Total Amount</label>
                <p className="text-2xl font-bold text-primary">₹{booking.total_amount.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <label className="text-sm font-medium text-muted-foreground">Commission</label>
                <p className="text-2xl font-bold text-green-600">₹{booking.commission_amount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          {booking.booking_details && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Additional Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {booking.booking_details.class && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Class</label>
                      <p className="capitalize">{booking.booking_details.class.replace('-', ' ')}</p>
                    </div>
                  )}
                  {booking.booking_details.meal_preference && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Meal Preference</label>
                      <p className="capitalize">{booking.booking_details.meal_preference}</p>
                    </div>
                  )}
                  {booking.booking_details.extra_baggage && booking.booking_details.extra_baggage !== 'none' && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Extra Baggage</label>
                      <p className="capitalize">+{booking.booking_details.extra_baggage}</p>
                    </div>
                  )}
                  {booking.booking_details.special_requests && (
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium text-muted-foreground">Special Requests</label>
                      <p>{booking.booking_details.special_requests}</p>
                    </div>
                  )}
                </div>
                
                {(booking.booking_details.children_dob?.length > 0 || booking.booking_details.infants_dob?.length > 0) && (
                  <>
                    <Separator className="my-4" />
                    <div className="space-y-3">
                      <h4 className="font-medium">Age Details</h4>
                      {booking.booking_details.children_dob?.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Children DOB:</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {booking.booking_details.children_dob.map((dob: string, idx: number) => (
                              dob && <Badge key={idx} variant="outline">Child {idx + 1}: {format(new Date(dob), 'PP')}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {booking.booking_details.infants_dob?.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Infants DOB:</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {booking.booking_details.infants_dob.map((dob: string, idx: number) => (
                              dob && <Badge key={idx} variant="outline">Infant {idx + 1}: {format(new Date(dob), 'PP')}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </>
          )}

          {/* Booking Metadata */}
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Booking Created:</span>
              <span>{format(new Date(booking.created_at), 'PPP p')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Booking Reference:</span>
              <span className="font-mono">{booking.booking_reference}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDetails;