import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plane, Bus, Hotel, Eye, FileText } from 'lucide-react';
import { useAgent } from '@/hooks/useAgent';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Invoice } from './Invoice';

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

const BookingsList = () => {
  const { agent } = useAgent();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    if (agent) {
      fetchBookings();
    }
  }, [agent]);

  const fetchBookings = async () => {
    if (!agent) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('agent_id', agent.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error);
      } else {
        setBookings(data || []);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateInvoice = async (booking: Booking) => {
    if (!agent) return;

    const invoiceData = {
      ...booking,
      agent: {
        agent_code: agent.agent_code,
        company_name: agent.company_name,
        contact_person: agent.contact_person,
        phone: agent.phone,
        email: agent.email,
        address: agent.address,
        commission_rate: agent.commission_rate,
      },
    };

    setSelectedBooking(invoiceData);
    setShowInvoice(true);
  };

  const getBookingIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="h-4 w-4" />;
      case 'bus':
        return <Bus className="h-4 w-4" />;
      case 'hotel':
        return <Hotel className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>Loading your bookings...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Bookings</CardTitle>
        <CardDescription>
          Manage and track all your customer bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        {bookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No bookings found. Start by creating your first booking!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Passenger</TableHead>
                  <TableHead>Route/Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Commission</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium">{booking.booking_reference}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getBookingIcon(booking.booking_type)}
                        <span className="capitalize">{booking.booking_type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{booking.passenger_name}</p>
                        <p className="text-sm text-muted-foreground">{booking.passenger_email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {booking.booking_type === 'hotel' ? (
                        <span>{booking.from_location}</span>
                      ) : (
                        <span>{booking.from_location} → {booking.to_location}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p>{booking.departure_date ? format(new Date(booking.departure_date), 'MMM dd, yyyy') : '-'}</p>
                        {booking.return_date && (
                          <p className="text-sm text-muted-foreground">
                            Return: {format(new Date(booking.return_date), 'MMM dd, yyyy')}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>₹{booking.total_amount.toLocaleString()}</TableCell>
                    <TableCell>₹{booking.commission_amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleGenerateInvoice(booking)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Invoice
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
      {showInvoice && selectedBooking && (
        <Invoice 
          bookingData={selectedBooking} 
          onClose={() => {
            setShowInvoice(false);
            setSelectedBooking(null);
          }} 
        />
      )}
    </Card>
  );
};

export default BookingsList;