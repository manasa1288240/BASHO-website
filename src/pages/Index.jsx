import Hero from "../components/Hero";
import Philosophy from "../components/Philosophy";
import ProductScroll from "../components/ProductScroll";
import Workshops from "../components/Workshops";
import Journey from "../components/Journey";
import Footer from "../components/Footer";

export default function Index() {
  return (
    <main className="page">
      <Hero />
      <Philosophy />
      <ProductScroll />
      <Workshops />
      <Journey />
      <Footer />
    </main>
  );
}
