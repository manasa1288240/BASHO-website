import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useAppEffects } from "./AppEffects";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Philosophy from "./components/Philosophy";
import ProductScroll from "./components/ProductScroll";
import Workshops from "./components/Workshops";
import Journey from "./components/Journey";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import ProductsPage from "./pages/ProductsPage";
import WorkshopsPage from "./pages/WorkshopsPage";
import BashoAbout from "./pages/BashoAbout/About";
import CareGuide from "./pages/CareGuide";
import WishlistPage from "./pages/WishlistPage";
import CartPage from "./pages/CartPage";
import GalleryPage from "./pages/GalleryPage";
import ActionSection from "./components/ActionSection";
import Chatbot from "./components/Chatbot"; // ✅ ADD THIS
import "./index.css";

// Home Page Component
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

// Routes Component
function AppRoutes() {
  const location = useLocation();

  return (
    <div key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/care-guide" element={<CareGuide />} />
        <Route path="/about-basho" element={<BashoAbout />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </div>
  );
}

// Main App
function App() {
  useAppEffects();

  return (
    <Router>
      <Navbar />
      <ScrollToTop />
      <AppRoutes />

      {/* 🤖 AI Chatbot – global */}
      <Chatbot />
    </Router>
  );
}

export default App;
