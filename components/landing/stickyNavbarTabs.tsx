"use client";
import React, { useEffect, useState } from "react";
import FlashyButton from "../ui/flashy-button";
import { AppWindow, LayoutGrid, Wand2 } from "lucide-react";

function StickyNavbarTabs() {
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const stickyNav = document.getElementById("sticky-Nav");
    const stickyLinks = document.querySelectorAll(".sticky-links");
    const sections = document.querySelectorAll(".section");

    let currentSection = "home";

    window.addEventListener("scroll", () => {
      sections.forEach((section) => {
        const htmlSection = section as HTMLElement;
        if (window.scrollY >= htmlSection.offsetTop) {
          currentSection = section.id;
        }
      });

      stickyLinks.forEach((stickyLink) => {
        const anchor = stickyLink as HTMLAnchorElement;
        if (anchor.href.includes(currentSection)) {
          setActiveTab(currentSection);
        }

        if (stickyNav) {
          if (currentSection !== "home") {
            stickyNav.classList.add("md:fixed");
            stickyNav.classList.remove("md:absolute");
          } else {
            stickyNav.classList.add("md:absolute");
            stickyNav.classList.remove("md:fixed");
          }
        }
      });
    });
  }, []);
  return (
    <div className="z-10 w-fit flex gap-2 border border-zinc-600 p-0.5 rounded-full bg-gradient-to-r from-[#1a1a1a] to-[#292929] opacity-90">
      <FlashyButton notActive={activeTab !== "home"}>
        <a href="#home" className="sticky-links flex items-center">
          <LayoutGrid className="h-4 w-4 mr-2" />
          Home
        </a>
      </FlashyButton>
      <FlashyButton notActive={activeTab !== "preview"}>
        <a href="#preview" className="sticky-links flex items-center">
          <AppWindow className="h-4 w-4 mr-2" />
          Preview
        </a>
      </FlashyButton>
      <FlashyButton notActive={activeTab !== "features"}>
        <a href="#features" className="sticky-links flex items-center">
          <Wand2 className="h-4 w-4 mr-2" />
          Features
        </a>
      </FlashyButton>
    </div>
  );
}

export default StickyNavbarTabs;
