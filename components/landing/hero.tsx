import React from "react";

function Hero() {
  return (
    <div className="flex mb-6 w-full">
      <div className="text-primary-foreground lg:px-4">
        <h1 className="text-2xl lg:text-5xl font-mona-sans">
          Track your Investment
          <br /> smartly with jaayedaad
        </h1>
        <p className="pt-3 text-sm font-mona-sans lg:text-base">
          Track your investments all at one place with detailed analysis of your
          outstanding
        </p>
      </div>
      {/* Sparkle Icon */}
      <div className="md:-mt-2 md:-ml-64 lg:-mt-10 lg:-ml-24">
        <svg
          className="h-8 lg:h-16"
          viewBox="0 0 51 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M25.754 2.32546C24.4524 13.8228 17.8794 36.8175 2 36.8175"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M25.754 61.8731C27.0555 49.2911 33.6286 24.1271 49.5079 24.1271"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M25.754 2.00003C27.0555 9.37569 33.6286 24.127 49.5079 24.127"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M25.754 61.8731C24.4524 53.6297 17.8794 37.1429 2 37.1429"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <svg
          className="ml-8 h-4 lg:h-10"
          viewBox="0 0 33 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.5 1.21236C15.6507 8.71464 11.3616 23.7192 1 23.7192"
            stroke="black"
            strokeWidth="1.95757"
            strokeLinecap="round"
          />
          <path
            d="M16.4999 40.0685C17.3492 31.8585 21.6383 15.4384 31.9999 15.4384"
            stroke="black"
            strokeWidth="1.95757"
            strokeLinecap="round"
          />
          <path
            d="M16.4999 1C17.3492 5.81279 21.6383 15.4384 31.9999 15.4384"
            stroke="black"
            strokeWidth="1.95757"
            strokeLinecap="round"
          />
          <path
            d="M16.5 40.0685C15.6507 34.6895 11.3616 23.9315 0.999999 23.9315"
            stroke="black"
            strokeWidth="1.95757"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}

export default Hero;
