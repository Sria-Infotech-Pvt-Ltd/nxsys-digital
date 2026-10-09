import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, Outlet } from 'react-router-dom';

// Layouts & Components
import ScrollToTop from '@/components/common/ScrollToTop';
import ToastNotification from '@/components/common/ToastNotification';
import PageLoader from '@/components/common/feedback/PageLoader';
import { useCanonicalUrl } from '@/hooks/useCanonicalUrl';
import { useMetaPixelPageView } from '@/hooks/useMetaPixelPageView';
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));

// Providers
import { CatalogProvider } from '@/context/CatalogProvider';
import { ProductProvider } from '@/context/ProductProvider';
import WishlistProvider from '@/context/WishlistProvider';

// Services
import { authService } from '@/services';

// Auth Pages
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const VerifyEmailOTP = lazy(() => import('@/pages/auth/VerifyEmailOTP'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const VerifyOTP = lazy(() => import('@/pages/auth/VerifyOTP'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));

// Admin Pages
const AdminCategoriesPage = lazy(() => import('@/pages/admin/AdminCategoriesPage'));
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage'));
const AdminInventoryPage = lazy(() => import('@/pages/admin/AdminInventoryPage'));
const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/AdminProductsPage'));
const AdminRFQPage = lazy(() => import('@/pages/admin/AdminRFQPage'));
const AdminReviewsPage = lazy(() => import('@/pages/admin/AdminReviewsPage'));

// Store Pages
const Home = lazy(() => import('@/pages/store/Home'));
const AboutUs = lazy(() => import('@/pages/store/AboutUs'));
const Products = lazy(() => import('@/pages/store/Products'));
const ProductDetails = lazy(() => import('@/pages/store/ProductDetails'));
const NotFound = lazy(() => import('@/pages/store/NotFound'));
const Contact = lazy(() => import('@/pages/store/Contact'));
const TermsConditions = lazy(() => import('@/pages/store/TermsConditions'));
const PrivacyPolicy = lazy(() => import('@/pages/store/PrivacyPolicy'));
const Wishlist = lazy(() => import('@/pages/store/Wishlist'));
const UserProfile = lazy(() => import('@/pages/store/UserProfile'));

// --- Helper Components ---

function StoreShell() {
  return (
    <CatalogProvider>
      <ProductProvider>
        <WishlistProvider>
          <MainLayout>
            <Outlet />
          </MainLayout>
        </WishlistProvider>
      </ProductProvider>
    </CatalogProvider>
  );
}

function AdminEntry() {
  if (!authService.isAuthenticated()) {
    return <AdminLoginPage />;
  }
  if (authService.isAdmin()) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Navigate to="/dashboard" replace />;
}

function AdminGuard() {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/admin" replace />;
  }
  if (!authService.isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  return <AdminLayout />;
}

// --- Main App Component ---

function App() {
  useCanonicalUrl();
  useMetaPixelPageView();

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader message="Loading experience..." />}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />
          <Route path="/verify-email-otp" element={<VerifyEmailOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route path="/admin">
            <Route index element={<AdminEntry />} />
            <Route element={<AdminGuard />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="products" element={<AdminProductsPage />} />
              <Route path="inventory" element={<AdminInventoryPage />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="rfq" element={<AdminRFQPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>

          {/* Store Routes */}
          <Route element={<StoreShell />}>
            <Route index element={<Home />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="products" element={<Products />} />
            <Route path="products/:category" element={<Products />} />
            <Route path="products/:category/:subcategory" element={<Products />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="contact" element={<Contact />} />
            <Route path="terms-conditions" element={<TermsConditions />} />
            <Route path="privacy-policy" element={<PrivacyPolicy />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Global Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      <ToastNotification />
    </>
  );
}

export default App;
