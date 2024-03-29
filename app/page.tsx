import Navbar from "@/components/landing/navbar";
import Tracked from "@/components/landing/tracked";
import Hero from "@/components/landing/hero";
import ClaimUsername from "@/components/landing/claim-username";
import MarqueeBottomBar from "@/components/landing/marquee-bottom-bar";
import React from "react";

function Home() {
  return (
    <div className="h-screen bg-primary">
      <div className="p-6 md:p-8">
        <Navbar />
        <Tracked />
        <Hero />
        <ClaimUsername />
      </div>
      <MarqueeBottomBar />
    </div>
  );
}

export default Home;
