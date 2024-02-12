import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import React from "react";

function Home() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen flex-col items-center py-2 px-12">
        <div className="pt-36 mx-72 text-center">
          <h1 className="text-5xl font-bold">
            Revolutionize Your Financial Journey
          </h1>
          <p className="text-muted-foreground text-xs pt-2">
            Transforming Investing: Effortless Tracking, Informed Decisions,
            Limitless Growth
          </p>
        </div>
        <div className="flex pt-4 gap-4">
          <Button>Learn more</Button>
          <Button variant="secondary">About us</Button>
        </div>
      </main>
    </>
  );
}

export default Home;
