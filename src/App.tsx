import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import { useAgent } from "@/hooks/useAgent";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import AgentSetup from "./pages/AgentSetup";
import Dashboard from "./pages/Dashboard";
import GroupBooking from "./pages/GroupBooking";
import ServiceCharge from "./pages/ServiceCharge";
import BankDetails from "./pages/BankDetails";
import ContactRepresentative from "./pages/ContactRepresentative";
import NotFound from "./pages/NotFound";

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
    return <Navigate to="/setup" replace />;
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
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/setup" element={
              <SetupRoute>
                <AgentSetup />
              </SetupRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
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
  </QueryClientProvider>
);

export default App;
