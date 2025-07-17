import React, { useState } from "react";
import { Shield, ArrowLeft } from "lucide-react";
import Button from "../components/Button";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle password reset logic here
    console.log("Password reset requested for:", email);
    // Show success message or redirect
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex h-16 items-center px-4 md:px-6">
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
      </div>
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="mx-auto w-full max-w-md px-4 md:px-6">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <div className="flex items-center gap-1">
                <a
                  href="/login"
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </a>
              </div>
              <h3 className="text-2xl font-semibold leading-none tracking-tight">
                Reset your password
              </h3>
              <p className="text-sm text-muted-foreground">
                Enter your university email address and we&apos;ll send you a
                link to reset your password
              </p>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none"
                  >
                    University Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="your.name@university.edu"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="rounded-lg border bg-muted p-3 text-sm">
                  <p>
                    The password reset link will be sent to your university
                    email address. If you no longer have access to your
                    university email, please contact support.
                  </p>
                </div>
              </div>
              <div className="flex items-center p-6 pt-0">
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
              </div>
            </form>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Need help?{" "}
            <a
              href="/contact"
              className="font-medium text-rose-500 underline-offset-4 hover:underline"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
