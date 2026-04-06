"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import QuickNav from "@/components/QuickNav";
import HeroSection from "@/components/HeroSection";
import TheProjectSection from "@/components/TheProjectSection";
import MegaCitiesSection from "@/components/MegaCitiesSection";
import HexFocusPointsSection from "@/components/HexFocusPointsSection";
import CityStructureSection from "@/components/CityStructureSection";
import ProjectFlowSection from "@/components/ProjectFlowSection";
import HowWeBuildSection from "@/components/HowWeBuildSection";
import WhyItMattersSection from "@/components/WhyItMattersSection";
import Footer from "@/components/Footer";

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="relative bg-black">
      {/* Scroll progress bar */}
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      <Navbar />
      <HeroSection />
      <QuickNav />

      <div className="section-divider" />
      <TheProjectSection />

      <div className="section-divider" />
      <HexFocusPointsSection />

      <div className="section-divider" />
      <MegaCitiesSection />

      <div className="section-divider" />
      <CityStructureSection />

      <div className="section-divider" />
      <ProjectFlowSection />

      <div className="section-divider" />
      <HowWeBuildSection />

      <div className="section-divider" />
      <WhyItMattersSection />

      <Footer />
    </main>
  );
}
