import React from "react";
import Button from "./Button";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-10 px-4 md:px-8 border border-gray-300 bg-white/80 backdrop-blur-md w-[100vw]">
      <div className="container flex h-16 items-center justify-between w-full mx-auto">
        <a href="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8">
            <div className="absolute inset-0 rounded-full bg-rose-500" />
            <img
              src="/shield.svg"
              alt="SafeJourney Logo"
              className="absolute inset-0 h-8 w-8 text-white"
            />
          </div>
          <span className="text-xl font-bold tracking-tight">SafeJourney</span>
        </a>
        <nav className="hidden gap-6 md:flex">
          <span
            className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() =>
              document
                .getElementById("features")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Features
          </span>
          <span
            className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() =>
              document
                .getElementById("how-it-works")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            How It Works
          </span>
          <span
            className="cursor-pointer text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            onClick={() =>
              document
                .getElementById("safety")
                .scrollIntoView({ behavior: "smooth" })
            }
          >
            Safety
          </span>
        </nav>
        <div className="flex items-center gap-2 md:gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => (window.location.href = "/login")}
            className="cursor-pointer"
          >
            Log In
          </Button>
          <Button
            size="sm"
            onClick={() => (window.location.href = "/signup")}
            className="cursor-pointer"
          >
            Sign Up
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
