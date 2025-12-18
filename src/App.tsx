import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAgenda from "./pages/admin/AdminAgenda";
import AdminAdvisors from "./pages/admin/AdminAdvisors";
import AdminClients from "./pages/admin/AdminClients";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminVideoCalls from "./pages/admin/AdminVideoCalls";
import AdminTours from "./pages/admin/AdminTours";

// Advisor Pages
import AdvisorDashboard from "./pages/advisor/AdvisorDashboard";
import AdvisorQuotes from "./pages/advisor/AdvisorQuotes";
import AdvisorVideoCalls from "./pages/advisor/AdvisorVideoCalls";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole: 'admin' | 'advisor' }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== allowedRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/advisor'} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute allowedRole="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/agenda" element={<ProtectedRoute allowedRole="admin"><AdminAgenda /></ProtectedRoute>} />
      <Route path="/admin/advisors" element={<ProtectedRoute allowedRole="admin"><AdminAdvisors /></ProtectedRoute>} />
      <Route path="/admin/clients" element={<ProtectedRoute allowedRole="admin"><AdminClients /></ProtectedRoute>} />
      <Route path="/admin/reservations" element={<ProtectedRoute allowedRole="admin"><AdminReservations /></ProtectedRoute>} />
      <Route path="/admin/videocalls" element={<ProtectedRoute allowedRole="admin"><AdminVideoCalls /></ProtectedRoute>} />
      <Route path="/admin/tours" element={<ProtectedRoute allowedRole="admin"><AdminTours /></ProtectedRoute>} />
      
      {/* Advisor Routes */}
      <Route path="/advisor" element={<ProtectedRoute allowedRole="advisor"><AdvisorDashboard /></ProtectedRoute>} />
      <Route path="/advisor/quotes" element={<ProtectedRoute allowedRole="advisor"><AdvisorQuotes /></ProtectedRoute>} />
      <Route path="/advisor/videocalls" element={<ProtectedRoute allowedRole="advisor"><AdvisorVideoCalls /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
