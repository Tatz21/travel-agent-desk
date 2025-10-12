import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useAgent } from '@/hooks/useAgent';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plane, Bus, Hotel, User, LogOut, Plus, Menu } from 'lucide-react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import WalletComponent from '@/components/Wallet';
import ThemeToggle from '@/components/ThemeToggle';
import FlightBooking from '@/components/booking/FlightBooking';
import BusBooking from '@/components/booking/BusBooking';
import HotelBooking from '@/components/booking/HotelBooking';
import BookingsList from '@/components/booking/BookingsList';
import logo from '@/assets/logo.gif';

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
        return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
      case 'suspended':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AppSidebar />
        
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="border-b border-border sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between h-16 px-3 md:px-6">
              <div className="flex items-center space-x-2 md:space-x-4">
                <SidebarTrigger />
                <div className="flex items-center p-1 bg-white dark:bg-white rounded-md shadow-sm">
                  <img src={logo} alt="Travelopedia" className="h-20 w-20 object-contain" />
                </div>
              </div>
              
              <div className="flex items-center space-x-1 md:space-x-4">
                <div className="hidden sm:block">
                  <WalletComponent />
                </div>
                <div className="hidden md:block">
                  <ThemeToggle />
                </div>
                <div className="hidden lg:flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{agent?.contact_person}</span>
                  <Badge variant="secondary" className={getStatusColor(agent?.status || 'pending')}>
                    {agent?.status}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs md:text-sm">
                  <LogOut className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Sign Out</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-3 md:p-6 lg:p-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 md:space-y-6">
              <div className="overflow-x-auto">
                <TabsList className="grid w-full grid-cols-5 min-w-[500px] lg:min-w-0">
                  <TabsTrigger value="overview" className="text-xs md:text-sm">Overview</TabsTrigger>
                  <TabsTrigger value="flights" className="text-xs md:text-sm">Flights</TabsTrigger>
                  <TabsTrigger value="buses" className="text-xs md:text-sm">Buses</TabsTrigger>
                  <TabsTrigger value="hotels" className="text-xs md:text-sm">Hotels</TabsTrigger>
                  <TabsTrigger value="bookings" className="text-xs md:text-sm">Bookings</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
