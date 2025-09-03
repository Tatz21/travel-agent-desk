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
import FlightBooking from '@/components/booking/FlightBooking';

const FlightBookingPage = () => {
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
        
        <main className="flex-1 overflow-auto min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          {/* Header */}
          <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-xl z-10">
            <div className="flex items-center justify-between h-16 px-3 md:px-6">
              <div className="flex items-center space-x-2 md:space-x-4">
                <SidebarTrigger />
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-primary to-purple-600 p-2 rounded-lg">
                    <Plane className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <h1 className="text-lg md:text-xl font-bold ml-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Travelopedia</h1>
                </div>
              </div>
              
              <div className="flex items-center space-x-1 md:space-x-4">
                <div className="hidden sm:block">
                  <WalletComponent />
                </div>
                <div className="hidden lg:flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{agent?.contact_person}</span>
                  <Badge variant="secondary" className={getStatusColor(agent?.status || 'pending')}>
                    {agent?.status}
                  </Badge>
                </div>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="text-xs md:text-sm border-0 shadow-sm">
                  <LogOut className="h-4 w-4 md:mr-2" />
                  <span className="hidden md:inline">Sign Out</span>
                </Button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="p-3 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/dashboard')}
                  className="flex items-center w-fit border-0 shadow-sm bg-card/50"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </div>
            </div>
            <FlightBooking />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default FlightBookingPage;