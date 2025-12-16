import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminLayout } from "./components/layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Organizations from "./pages/Organizations";
import Members from "./pages/Members";
import Events from "./pages/Events";
import Donations from "./pages/Donations";
import Sponsorships from "./pages/Sponsorships";
import Volunteering from "./pages/Volunteering";
import EventSponsorships from "./pages/EventSponsorships";
import Relationships from "./pages/Relationships";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import SOPLibrary from "./pages/SOPLibrary";
import SOPView from "./pages/SOPView";
import SOPUpload from "./pages/SOPUpload";
import Collaboration from "./pages/Collaboration";
import ChannelView from "./pages/ChannelView";
import RolesPermissions from "./pages/RolesPermissions";
import Departments from "./pages/Departments";
import Moderation from "./pages/Moderation";
import ChannelManagement from "./pages/ChannelManagement";
import LegalDisclaimers from "./pages/LegalDisclaimers";
import UserPreferences from "./pages/UserPreferences";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<AdminLayout><Dashboard /></AdminLayout>} />
          <Route path="/organizations" element={<AdminLayout><Organizations /></AdminLayout>} />
          <Route path="/members" element={<AdminLayout><Members /></AdminLayout>} />
          <Route path="/events" element={<AdminLayout><Events /></AdminLayout>} />
          <Route path="/event-sponsorships" element={<AdminLayout><EventSponsorships /></AdminLayout>} />
          <Route path="/donations" element={<AdminLayout><Donations /></AdminLayout>} />
          <Route path="/sponsorships" element={<AdminLayout><Sponsorships /></AdminLayout>} />
          <Route path="/volunteering" element={<AdminLayout><Volunteering /></AdminLayout>} />
          <Route path="/relationships" element={<AdminLayout><Relationships /></AdminLayout>} />
          <Route path="/reports" element={<AdminLayout><Reports /></AdminLayout>} />
          <Route path="/settings" element={<AdminLayout><Settings /></AdminLayout>} />
          <Route path="/sop-library" element={<AdminLayout><SOPLibrary /></AdminLayout>} />
          <Route path="/sop/:id" element={<AdminLayout><SOPView /></AdminLayout>} />
          <Route path="/sop/upload" element={<AdminLayout><SOPUpload /></AdminLayout>} />
          <Route path="/collaboration" element={<AdminLayout><Collaboration /></AdminLayout>} />
          <Route path="/collaboration/:id" element={<AdminLayout><ChannelView /></AdminLayout>} />
          <Route path="/roles-permissions" element={<AdminLayout><RolesPermissions /></AdminLayout>} />
          <Route path="/departments" element={<AdminLayout><Departments /></AdminLayout>} />
          <Route path="/moderation" element={<AdminLayout><Moderation /></AdminLayout>} />
          <Route path="/channels" element={<AdminLayout><ChannelManagement /></AdminLayout>} />
          <Route path="/legal-disclaimers" element={<AdminLayout><LegalDisclaimers /></AdminLayout>} />
          <Route path="/user-preferences" element={<AdminLayout><UserPreferences /></AdminLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
