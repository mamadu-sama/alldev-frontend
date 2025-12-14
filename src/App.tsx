import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ModeratorLayout } from "@/components/moderator/ModeratorLayout";
import Feed from "@/pages/Feed";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import PostDetails from "@/pages/PostDetails";
import CreatePost from "@/pages/CreatePost";
import EditPost from "@/pages/EditPost";
import UserProfile from "@/pages/UserProfile";
import Tags from "@/pages/Tags";
import TagDetails from "@/pages/TagDetails";
import Search from "@/pages/Search";
import NotFound from "@/pages/NotFound";
import ContributionGuide from "@/pages/ContributionGuide";
import TermsOfUse from "@/pages/TermsOfUse";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookiePolicy from "@/pages/CookiePolicy";
import Contact from "@/pages/Contact";
import FAQ from "@/pages/FAQ";
import FeatureContribution from "@/pages/FeatureContribution";
import FeatureRequestDetails from "@/pages/FeatureRequestDetails";
import CookieConsentBanner from "@/components/common/CookieConsentBanner";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import EditProfile from "@/pages/EditProfile";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminPosts from "@/pages/admin/AdminPosts";
import AdminComments from "@/pages/admin/AdminComments";
import AdminTags from "@/pages/admin/AdminTags";
import AdminReports from "@/pages/admin/AdminReports";
import AdminSettings from "@/pages/admin/AdminSettings";
import AdminNotifications from "@/pages/admin/AdminNotifications";
import AdminFeatures from "@/pages/admin/AdminFeatures";
import AdminMessages from "@/pages/admin/AdminMessages";
import ModeratorDashboard from "@/pages/moderator/ModeratorDashboard";
import ModeratorQueue from "@/pages/moderator/ModeratorQueue";
import ModeratorPosts from "@/pages/moderator/ModeratorPosts";
import ModeratorComments from "@/pages/moderator/ModeratorComments";
import ModeratorReports from "@/pages/moderator/ModeratorReports";
import ModeratorHistory from "@/pages/moderator/ModeratorHistory";
import ModeratorProfile from "@/pages/moderator/ModeratorProfile";
import AdminProfile from "@/pages/admin/AdminProfile";
import { MaintenancePage } from "@/pages/MaintenancePage";
import { useMaintenanceStore } from "@/stores/maintenanceStore";
import { useAuthStore } from "@/stores/authStore";

const queryClient = new QueryClient();

function MaintenanceWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { isMaintenanceMode } = useMaintenanceStore();
  const { user } = useAuthStore();

  // Allow admin and moderator routes even in maintenance mode
  const isPrivilegedRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/moderator");

  // Check if user has admin or moderator role
  const isAdminOrModerator = user?.roles?.some(
    (role) => role === "ADMIN" || role === "MODERATOR"
  );

  // Show maintenance page only if:
  // 1. Maintenance mode is ON
  // 2. NOT a privileged route (/admin, /moderator)
  // 3. User is NOT admin or moderator
  if (isMaintenanceMode && !isPrivilegedRoute && !isAdminOrModerator) {
    return <MaintenancePage />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <MaintenanceWrapper>
      <Routes>
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Route>

        {/* Admin routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
          <Route path="/admin/comments" element={<AdminComments />} />
          <Route path="/admin/tags" element={<AdminTags />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/notifications" element={<AdminNotifications />} />
          <Route path="/admin/features" element={<AdminFeatures />} />
          <Route path="/admin/messages" element={<AdminMessages />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
        </Route>

        {/* Moderator routes */}
        <Route element={<ModeratorLayout />}>
          <Route path="/moderator" element={<ModeratorDashboard />} />
          <Route path="/moderator/queue" element={<ModeratorQueue />} />
          <Route path="/moderator/posts" element={<ModeratorPosts />} />
          <Route path="/moderator/comments" element={<ModeratorComments />} />
          <Route path="/moderator/reports" element={<ModeratorReports />} />
          <Route path="/moderator/history" element={<ModeratorHistory />} />
          <Route path="/moderator/profile" element={<ModeratorProfile />} />
        </Route>

        {/* Main routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Feed />} />
          <Route path="/posts/new" element={<CreatePost />} />
          <Route path="/posts/:slug/edit" element={<EditPost />} />
          <Route path="/posts/:slug" element={<PostDetails />} />
          <Route path="/users/:username" element={<UserProfile />} />
          <Route path="/profile/edit" element={<EditProfile />} />
          <Route path="/tags" element={<Tags />} />
          <Route path="/tags/:slug" element={<TagDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/contribution-guide" element={<ContributionGuide />} />
          <Route path="/terms" element={<TermsOfUse />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/cookies" element={<CookiePolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route
            path="/feature-contribution"
            element={<FeatureContribution />}
          />
          <Route
            path="/feature-requests/:id"
            element={<FeatureRequestDetails />}
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MaintenanceWrapper>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppRoutes />
        <CookieConsentBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
