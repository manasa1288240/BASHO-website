import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import "./index.css";

// Home Page Component
function HomePage() {
  return (
    <>
      <Hero />
      <Philosophy />
      <ProductScroll />
      <Workshops />
      <Journey />
      <Footer />
    </>
  );
}

// Main App with Routing
function App() {
  return (
    <Router>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/workshops" element={<WorkshopsPage />} />
        <Route path="/care-guide" element={<CareGuide />} />
        <Route path="/about-basho" element={<BashoAbout />} />
      </Routes>
    </Router>
  );
}

export default App;
