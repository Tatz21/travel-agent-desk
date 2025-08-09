import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useAgent } from '@/hooks/useAgent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Bus, Hotel, User, LogOut, Plus } from 'lucide-react';
import FlightBooking from '@/components/booking/FlightBooking';
import BusBooking from '@/components/booking/BusBooking';
import HotelBooking from '@/components/booking/HotelBooking';
import BookingsList from '@/components/booking/BookingsList';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const { agent } = useAgent();
  const [activeTab, setActiveTab] = useState('overview');

  const handleSignOut = async () => {
    await signOut();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-primary" />
              <h1 className="text-xl font-bold ml-2">Travelopedia</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{agent?.contact_person}</span>
                <Badge variant="secondary" className={getStatusColor(agent?.status || 'pending')}>
                  {agent?.status}
                </Badge>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="flights">Flights</TabsTrigger>
            <TabsTrigger value="buses">Buses</TabsTrigger>
            <TabsTrigger value="hotels">Hotels</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Agent Code</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{agent?.agent_code}</div>
                  <p className="text-xs text-muted-foreground">
                    Your unique agent identifier
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
                  <span className="h-4 w-4 text-muted-foreground">%</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{agent?.commission_rate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Your earning percentage
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">
                    Bookings this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <span className="h-4 w-4 text-muted-foreground">₹</span>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹0</div>
                  <p className="text-xs text-muted-foreground">
                    Commission earned
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('flights')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plane className="h-5 w-5 mr-2" />
                    Flight Booking
                  </CardTitle>
                  <CardDescription>
                    Book domestic and international flights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Book Flight</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('buses')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bus className="h-5 w-5 mr-2" />
                    Bus Booking
                  </CardTitle>
                  <CardDescription>
                    Book bus tickets across cities
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Book Bus</Button>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveTab('hotels')}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Hotel className="h-5 w-5 mr-2" />
                    Hotel Booking
                  </CardTitle>
                  <CardDescription>
                    Book hotels and accommodations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Book Hotel</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="flights">
            <FlightBooking />
          </TabsContent>

          <TabsContent value="buses">
            <BusBooking />
          </TabsContent>

          <TabsContent value="hotels">
            <HotelBooking />
          </TabsContent>

          <TabsContent value="bookings">
            <BookingsList />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;