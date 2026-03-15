import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProtectedRoute } from "@/components/ProtectedRoute";
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
import AttendeeDirectoryPage from "./pages/organizer/AttendeeDirectory";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsersPage from "./pages/admin/Users";
import AdminSettingsPage from "./pages/admin/Settings";
import AdminEventsPage from "./pages/admin/Events";
import AdminAnalyticsPage from "./pages/admin/Analytics";
import AdminPermissionsPage from "./pages/admin/Permissions";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Attendee — protected */}
          <Route path="/dashboard" element={<ProtectedRoute allowedRoles={['attendee']}><AttendeeDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute allowedRoles={['attendee']}><ProfilePage /></ProtectedRoute>} />
          <Route path="/connect" element={<ProtectedRoute allowedRoles={['attendee']}><ConnectPage /></ProtectedRoute>} />
          <Route path="/connections" element={<ProtectedRoute allowedRoles={['attendee']}><ConnectionsPage /></ProtectedRoute>} />
          <Route path="/discover" element={<ProtectedRoute allowedRoles={['attendee']}><DiscoverPage /></ProtectedRoute>} />
          <Route path="/gamification" element={<ProtectedRoute allowedRoles={['attendee']}><GamificationPage /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute allowedRoles={['attendee']}><NotificationsPage /></ProtectedRoute>} />
          <Route path="/events" element={<ProtectedRoute allowedRoles={['attendee']}><EventsPage /></ProtectedRoute>} />
          <Route path="/event/:id" element={<ProtectedRoute allowedRoles={['attendee']}><EventDetailPage /></ProtectedRoute>} />
          <Route path="/apply-card" element={<ProtectedRoute allowedRoles={['attendee']}><ApplyCardPage /></ProtectedRoute>} />

          {/* Organizer — protected */}
          <Route path="/organizer/dashboard" element={<ProtectedRoute allowedRoles={['organizer']}><OrganizerDashboard /></ProtectedRoute>} />
          <Route path="/organizer/events/create" element={<ProtectedRoute allowedRoles={['organizer']}><CreateEventPage /></ProtectedRoute>} />
          <Route path="/organizer/attendees" element={<ProtectedRoute allowedRoles={['organizer']}><AttendeeDirectoryPage /></ProtectedRoute>} />
          <Route path="/organizer/leads" element={<ProtectedRoute allowedRoles={['organizer']}><LeadsPage /></ProtectedRoute>} />

          {/* Admin — protected */}
          <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><AdminUsersPage /></ProtectedRoute>} />
          <Route path="/admin/events" element={<ProtectedRoute allowedRoles={['admin']}><AdminEventsPage /></ProtectedRoute>} />
          <Route path="/admin/analytics" element={<ProtectedRoute allowedRoles={['admin']}><AdminAnalyticsPage /></ProtectedRoute>} />
          <Route path="/admin/permissions" element={<ProtectedRoute allowedRoles={['admin']}><AdminPermissionsPage /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><AdminSettingsPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
