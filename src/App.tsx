import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import { EtheralShadow } from "@/components/ui/etheral-shadow";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import VerifyEmail from "./pages/VerifyEmail";
import AccountExists from "./pages/AccountExists";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        {/* Fixed animated background behind all pages */}
        <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
          <EtheralShadow
            color="hsla(258, 90%, 66%, 0.5)"
            animation={{ scale: 100, speed: 90 }}
            noise={{ opacity: 0.6, scale: 1.2 }}
            sizing="fill"
            style={{ opacity: 0.45 }}
          />
        </div>

        <BrowserRouter>
          <div className="relative z-10">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/account-exists" element={<AccountExists />} />
              <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
