import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import FlightBooking from '@/components/booking/FlightBooking';
import AgentHeader from '@/components/AgentHeader';

const FlightBookingPage = () => {

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AppSidebar />
        
        <main className="flex-1 overflow-auto min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
          {/* Header */}
          <AgentHeader />

          {/* Main Content */}
          <div className="p-3 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
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
