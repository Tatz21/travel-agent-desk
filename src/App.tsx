import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "@/components/AuthProvider";
import { useAgent } from "@/hooks/useAgent";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import AgentRegister from "./pages/AgentRegister";
import AgentStatus from "./pages/AgentStatus";
import AuthPage from "./pages/AuthPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import FlightBookingPage from "./pages/FlightBookingPage";
import BusBookingPage from "./pages/BusBookingPage";
import HotelBookingPage from "./pages/HotelBookingPage";
import BookingsPage from "./pages/BookingsPage";
import GroupBooking from "./pages/GroupBooking";
import ServiceCharge from "./pages/ServiceCharge";
import BankDetails from "./pages/BankDetails";
import ContactRepresentative from "./pages/ContactRepresentative";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import { IdleTimerProvider } from "./components/IdleTimerProvider";
import ApiTest from "./pages/ApiTest";
import NotFound from "./pages/NotFound";
import Tawk from "./components/tawk";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

/* ---------- PUBLIC ROUTE ---------- */
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

/* ---------- PROTECTED ROUTE ---------- */
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
    return null; {/* <Navigate to="/register" replace /> */}
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <IdleTimerProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/services/:serviceId" element={<ServiceDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blogs" element={<Blog />} />
              <Route path="/blog/:blogId" element={<BlogDetail />} />
              <Route path="/auth" element={<PublicRoute><AuthPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><AgentRegister /></PublicRoute>} />
              <Route path="/check-status" element={<AgentStatus />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/api-test" element={<ApiTest />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/change-password" element={
                <ProtectedRoute>
                  <ChangePassword />
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
          </IdleTimerProvider>
        </AuthProvider>
      </TooltipProvider>
      <Tawk />
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
