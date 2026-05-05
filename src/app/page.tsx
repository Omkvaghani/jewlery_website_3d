import Hero from "@/components/sections/Hero";
import Products from "@/components/sections/Products";
import Craftsmanship from "@/components/sections/Craftsmanship";
import About from "@/components/sections/About";
import Featured from "@/components/sections/Featured";
import Testimonials from "@/components/sections/Testimonials";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main id="top" className="relative">
      <Hero />
      <About />
      <Products />
      <Craftsmanship />
      <Featured />
      <Testimonials />
      <Footer />
    </main>
  );
}
