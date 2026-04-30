'use client';

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import PracticeAreas from "@/components/PracticeAreas";
import Partners from "@/components/Partners";
import Team from "@/components/Team";
import BlogSection from "@/components/BlogSection";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <About />
      <PracticeAreas />
      <Partners />
      <Team />
      <BlogSection />
      <Contact />
      <Footer />
    </main>
  );
}

