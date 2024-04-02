import React from "react";
import { Button } from "../ui/button";
import { Github } from "lucide-react";
import Link from "next/link";
import JaayedaadLogo from "@/public/branding/jaayedaadLogo";

function Footer() {
  return (
    <div className="text-center mt-36 mb-16">
      <div className="w-full flex justify-center">
        <JaayedaadLogo />
      </div>
      <div className="flex gap-6 justify-center my-8">
        <Button className="h-12 text-base px-6 bg-gradient-to-r from-violet-950 to-primary rounded-full">
          Sign Up
        </Button>
        <Button
          variant="outline"
          className="h-12 text-base px-6 rounded-full"
          asChild
        >
          <Link href="https://github.com/jaayedaad/jaayedaad">
            <Github className="h-4 w-4 mr-2" /> GitHub
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default Footer;
