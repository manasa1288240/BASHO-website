import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
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

/* -------- PAGES -------- */
import ProductsPage from "./pages/ProductsPage";
import WorkshopsPage from "./pages/WorkshopsPage";
import BashoAbout from "./pages/BashoAbout/About";
import CareGuide from "./pages/CareGuide";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import GalleryPage from "./pages/GalleryPage";
import AuthPage from "./pages/AuthPage";
import AdminDashboard from "./pages/AdminDashboard";

/* -------- CLIENT TALES -------- */
import ClientTales from "./components/ClientTales";

import "./index.css";

/* -------- PROTECTED ROUTE -------- */
function ProtectedAdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("basho_user") || "{}");
  const adminToken = localStorage.getItem("admin_token");
  
  if (!user.isAdmin || !adminToken) {
    return <Navigate to="/auth" replace />;
  }
  
  return children;
}

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
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/care-guide" element={<CareGuide />} />
        <Route path="/about-basho" element={<BashoAbout />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* ✅ CLIENT TALES PAGE */}
        <Route path="/client-tales" element={<ClientTales />} />

        {/* -------- ADMIN (Protected Route) -------- */}
        <Route 
          path="/admin" 
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
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
