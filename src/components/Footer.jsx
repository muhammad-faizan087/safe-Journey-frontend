import React from "react";

const Footer = () => {
  return (
    <footer className="border border-gray-300 bg-white py-4 md:py-6 w-[100vw] px-4 md:px-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row w-full mx-auto">
        <div className="flex items-center gap-2">
          <div className="relative h-6 w-6">
            <div className="absolute inset-0 rounded-full bg-rose-500" />
            <img
              src="/shield.svg"
              alt="SafeJourney Logo"
              className="absolute inset-0 h-6 w-6 text-white"
            />
          </div>
          <span className="text-sm font-semibold">SafeJourney</span>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {new Date().getFullYear()} SafeJourney. All rights reserved.
        </p>
        <div className="flex gap-4">
          <a
            href="#"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
