import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plane, User, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/components/AuthProvider';
import { useAgent } from '@/hooks/useAgent';
import WalletComponent from '@/components/Wallet';
import BookingsList from '@/components/booking/BookingsList';

const BookingsPage = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { agent } = useAgent();

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
            <div className="flex items-center justify-between h-16 px-6">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div className="flex items-center">
                  <Plane className="h-8 w-8 text-primary" />
                  <h1 className="text-xl font-bold ml-2">Travelopedia</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <WalletComponent />
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
          </header>

          {/* Main Content */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <h1 className="text-3xl font-bold text-foreground">All Bookings</h1>
              </div>
            </div>
            <BookingsList />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default BookingsPage;