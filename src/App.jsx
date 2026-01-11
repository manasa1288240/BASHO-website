import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import { useAppEffects } from "./AppEffects";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Philosophy from "./components/Philosophy";
import ProductScroll from "./components/ProductScroll";
import Workshops from "./components/Workshops";
import Journey from "./components/Journey";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ActionSection from "./components/ActionSection";
import Chatbot from "./components/Chatbot";

import ProductsPage from "./pages/ProductsPage";
import WorkshopsPage from "./pages/WorkshopsPage";
import BashoAbout from "./pages/BashoAbout/About";
import CareGuide from "./pages/CareGuide";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import GalleryPage from "./pages/GalleryPage";
import AuthPage from "./pages/AuthPage";

// Admin imports
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminWorkshops from "./pages/admin/AdminWorkshops";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminCustomers from "./pages/admin/AdminCustomers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminGallery from "./pages/admin/AdminGallery";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminSettings from "./pages/admin/AdminSettings";

import "./index.css";

/* ---------------- HOME PAGE ---------------- */
function HomePage() {
  return (
    <>
      <Hero />
      <Philosophy />
      <ProductScroll />
      <Workshops />
      <ActionSection />
      <Journey />
      <Footer />
    </>
  );
}

/* ---------------- ROUTES ---------------- */
function AppRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} /> {/* ✅ LOGIN PAGE */}
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/care-guide" element={<CareGuide />} />
        <Route path="/about-basho" element={<BashoAbout />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* ✅ ADMIN ROUTES */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <Routes location={location}>
                <Route element={<AdminLayout />}>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="workshops" element={<AdminWorkshops />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="events" element={<AdminEvents />} />
                  <Route path="gallery" element={<AdminGallery />} />
                  <Route path="testimonials" element={<AdminTestimonials />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

/* ---------------- MAIN APP ---------------- */
export default function App() {
  useAppEffects();

  return (
    <Router>
      <Navbar />
      <ScrollToTop />
      <AppRoutes />
      <Chatbot />
    </Router>
  );
}
