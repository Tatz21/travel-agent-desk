import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import BookingsList from '@/components/booking/BookingsList';
import AgentHeader from '@/components/AgentHeader';

const BookingsPage = () => {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <AppSidebar />
        
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <AgentHeader />

          {/* Main Content */}
          <div className="p-3 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground">All Bookings</h1>
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
