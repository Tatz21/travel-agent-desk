import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Download, Plane, Bus, Hotel } from 'lucide-react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoiceData {
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
  status: string;
  created_at: string;
  agent: {
    agent_code: string;
    company_name: string;
    contact_person: string;
    phone: string;
    email: string;
    address?: string;
    commission_rate: number;
  };
}

interface InvoiceProps {
  bookingData: InvoiceData;
  onClose: () => void;
}

export const Invoice: React.FC<InvoiceProps> = ({ bookingData, onClose }) => {
  const getBookingIcon = (type: string) => {
    switch (type) {
      case 'flight':
        return <Plane className="h-5 w-5" />;
      case 'bus':
        return <Bus className="h-5 w-5" />;
      case 'hotel':
        return <Hotel className="h-5 w-5" />;
      default:
        return <Plane className="h-5 w-5" />;
    }
  };

  const getBookingTitle = (type: string) => {
    switch (type) {
      case 'flight':
        return 'Flight Booking';
      case 'bus':
        return 'Bus Booking';
      case 'hotel':
        return 'Hotel Booking';
      default:
        return 'Booking';
    }
  };

  const downloadPDF = async () => {
    const element = document.getElementById('invoice-content');
    if (!element) return;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${bookingData.booking_reference}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Invoice</h2>
          <div className="flex gap-2">
            <Button onClick={downloadPDF} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        <div id="invoice-content" className="p-8 bg-white text-black">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">INVOICE</h1>
              <div className="flex items-center gap-2 text-lg">
                {getBookingIcon(bookingData.booking_type)}
                <span className="font-semibold">{getBookingTitle(bookingData.booking_type)}</span>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-xl font-bold text-primary">Travelopedia</h2>
              <p className="text-sm text-gray-600">Travel Booking Platform</p>
              <p className="text-sm text-gray-600 mt-2">Invoice #: {bookingData.booking_reference}</p>
              <p className="text-sm text-gray-600">Date: {format(new Date(bookingData.created_at), 'dd MMM yyyy')}</p>
            </div>
          </div>

          {/* Agent and Customer Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Agent Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><span className="font-semibold">Agent Code:</span> {bookingData.agent.agent_code}</p>
                <p><span className="font-semibold">Company:</span> {bookingData.agent.company_name}</p>
                <p><span className="font-semibold">Contact Person:</span> {bookingData.agent.contact_person}</p>
                <p><span className="font-semibold">Phone:</span> {bookingData.agent.phone}</p>
                <p><span className="font-semibold">Email:</span> {bookingData.agent.email}</p>
                {bookingData.agent.address && (
                  <p><span className="font-semibold">Address:</span> {bookingData.agent.address}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><span className="font-semibold">Name:</span> {bookingData.passenger_name}</p>
                <p><span className="font-semibold">Email:</span> {bookingData.passenger_email}</p>
                <p><span className="font-semibold">Phone:</span> {bookingData.passenger_phone}</p>
                <p><span className="font-semibold">Adults:</span> {bookingData.adult_count}</p>
                <p><span className="font-semibold">Children:</span> {bookingData.child_count}</p>
              </CardContent>
            </Card>
          </div>

          {/* Booking Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p><span className="font-semibold">Booking Reference:</span> {bookingData.booking_reference}</p>
                  <p><span className="font-semibold">Booking Type:</span> {getBookingTitle(bookingData.booking_type)}</p>
                  <p><span className="font-semibold">Status:</span> <span className="capitalize">{bookingData.status}</span></p>
                </div>
                <div>
                  {bookingData.from_location && (
                    <p><span className="font-semibold">From:</span> {bookingData.from_location}</p>
                  )}
                  {bookingData.to_location && (
                    <p><span className="font-semibold">To:</span> {bookingData.to_location}</p>
                  )}
                  {bookingData.departure_date && (
                    <p><span className="font-semibold">Departure:</span> {format(new Date(bookingData.departure_date), 'dd MMM yyyy')}</p>
                  )}
                  {bookingData.return_date && (
                    <p><span className="font-semibold">Return:</span> {format(new Date(bookingData.return_date), 'dd MMM yyyy')}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Details */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Pricing Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Booking Amount:</span>
                  <span>₹{(bookingData.total_amount - bookingData.commission_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Commission ({bookingData.agent.commission_rate}%):</span>
                  <span>₹{bookingData.commission_amount.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total Amount:</span>
                  <span>₹{bookingData.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-600 mt-8 pt-4 border-t">
            <p>Thank you for choosing Travelopedia for your travel booking needs.</p>
            <p className="mt-2">This is a computer-generated invoice and does not require a signature.</p>
          </div>
        </div>
      </div>
    </div>
  );
};