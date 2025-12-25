import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import { useAgent } from "@/hooks/useAgent";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AgentRegister from "./pages/AgentRegister";
import AgentSetup from "./pages/AgentSetup";
import Dashboard from "./pages/Dashboard";
import FlightBookingPage from "./pages/FlightBookingPage";
import BusBookingPage from "./pages/BusBookingPage";
import HotelBookingPage from "./pages/HotelBookingPage";
import BookingsPage from "./pages/BookingsPage";
import GroupBooking from "./pages/GroupBooking";
import ServiceCharge from "./pages/ServiceCharge";
import BankDetails from "./pages/BankDetails";
import ContactRepresentative from "./pages/ContactRepresentative";
import ApiTest from "./pages/ApiTest";
import NotFound from "./pages/NotFound";
import Tawk from "./components/tawk";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { agent, loading: agentLoading } = useAgent();

  if (authLoading || agentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!agent) {
    return <Navigate to="/register" replace />;
  }

  return <>{children}</>;
};

const SetupRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading: authLoading } = useAuth();
  const { agent, loading: agentLoading } = useAgent();

  if (authLoading || agentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (agent) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/register" element={<AgentRegister />} />
              <Route path="/api-test" element={<ApiTest />} />
              {/*
              <Route path="/setup" element={
                <SetupRoute>
                  <AgentSetup />
                </SetupRoute>
              } />
              */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/flights" element={
                <ProtectedRoute>
                  <FlightBookingPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/buses" element={
                <ProtectedRoute>
                  <BusBookingPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/hotels" element={
                <ProtectedRoute>
                  <HotelBookingPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/bookings" element={
                <ProtectedRoute>
                  <BookingsPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/group-booking" element={
                <ProtectedRoute>
                  <GroupBooking />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/service-charge" element={
                <ProtectedRoute>
                  <ServiceCharge />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/bank-details" element={
                <ProtectedRoute>
                  <BankDetails />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/contact" element={
                <ProtectedRoute>
                  <ContactRepresentative />
                </ProtectedRoute>
              } />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
      <Tawk />
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
