import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "./pages/NotFound.tsx";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

import AttendeeDashboard from "./pages/attendee/Dashboard";
import ProfilePage from "./pages/attendee/Profile";
import ConnectPage from "./pages/attendee/Connect";
import ConnectionsPage from "./pages/attendee/Connections";
import DiscoverPage from "./pages/attendee/Discover";
import GamificationPage from "./pages/attendee/Gamification";
import NotificationsPage from "./pages/attendee/Notifications";
import EventsPage from "./pages/attendee/Events";
import EventDetailPage from "./pages/attendee/EventDetail";
import ApplyCardPage from "./pages/attendee/ApplyCard";

import OrganizerDashboard from "./pages/organizer/Dashboard";
import CreateEventPage from "./pages/organizer/CreateEvent";
import LeadsPage from "./pages/organizer/Leads";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsersPage from "./pages/admin/Users";
import AdminSettingsPage from "./pages/admin/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Attendee */}
          <Route path="/dashboard" element={<AttendeeDashboard />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/connect" element={<ConnectPage />} />
          <Route path="/connections" element={<ConnectionsPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/gamification" element={<GamificationPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/event/:id" element={<EventDetailPage />} />
          <Route path="/apply-card" element={<ApplyCardPage />} />

          {/* Organizer */}
          <Route path="/organizer/dashboard" element={<OrganizerDashboard />} />
          <Route path="/organizer/events/create" element={<CreateEventPage />} />
          <Route path="/organizer/leads" element={<LeadsPage />} />

          {/* Admin */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
