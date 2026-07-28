import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import BrandsBar from "@/components/home/BrandsBar";
import FramesSection from "@/components/home/FramesSection";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />        {/* ← right after Hero */}
      <FeaturedProducts />
      <Testimonials />
      <BrandsBar />
      <FramesSection />
    </>
  );
}
