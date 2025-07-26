import React, { useState, useRef } from "react";
import { Shield, ArrowLeft } from "lucide-react";
import Button from "../components/Button";
import { div } from "motion/react-client";

const ForgotPasswordPage = () => {
  // const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    verificationCode: "",
  });
  const [Verified, setVerified] = useState(false);
  const [resMessage, setresMessage] = useState(false);
  const [response, setresponse] = useState("");

  const VerifyRef = useRef();
  const VerificationCodeRef = useRef();
  const ChangePassRef = useRef();
  const token = localStorage.getItem("token");

  const verifyCode = async (code) => {
    try {
      const response = await fetch(
        "https://safejourney-backend-production.up.railway.app/verification/verfiyCode",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code,
          }),
        }
      );

      const data = await response.json(); // Convert response to JSON
      console.log("Success:", data);
      if (data.success) {
        VerifyRef.current.disabled = true;
        // VerificationCodeRef.current.disabled = true;
        setVerified(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const postVCode = async (email) => {
    try {
      const response = await fetch(
        "https://safejourney-backend-production.up.railway.app/verification",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json(); // Convert response to JSON
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const ChangePass = async (email, newPassword) => {
    try {
      const res = await fetch(
        "https://safejourney-backend-production.up.railway.app/login/changePassword",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            newPassword,
          }),
        }
      );

      const data = await res.json();
      console.log("Success:", data);
      setresponse(data);
    } catch (error) {
      console.log("Error Changing Password", error);
      setresponse(error);
    }
    setresMessage(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    ChangePassRef.current.disabled = true;
    ChangePassRef.current.textContent = "Updating...";
    await ChangePass(formData.email, formData.password);
    ChangePassRef.current.disabled = false;
    ChangePassRef.current.textContent = "Change Password";
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
            <form
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <div className="p-6 space-y-4">
                {/* <div className="space-y-2">
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
                </div> */}
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your.name@university.edu"
                    name="email"
                    className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.email}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.target.textContent = "Sent";
                      e.target.disabled = true;
                      postVCode(e.target.previousElementSibling.value);
                    }}
                    ref={VerificationCodeRef}
                  >
                    Send Code
                  </Button>
                </div>
                <div className="flex gap-2">
                  <input
                    id="verification-code"
                    name="verificationCode"
                    placeholder="Enter 6-digit code"
                    maxLength="6"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.verificationCode || ""}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />

                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    className="cursor-pointer"
                    onClick={(e) => {
                      verifyCode(e.target.previousElementSibling.value);
                    }}
                    ref={VerifyRef}
                  >
                    Verify
                  </Button>
                </div>
                {Verified && (
                  <p className="text-green-500">Email Verified Successfully.</p>
                )}
                {Verified && (
                  <input
                    id="password"
                    name="password"
                    placeholder="Enter new password"
                    required={true}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.password || ""}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                )}
              </div>
              <div className="flex items-center px-6 py-3 pt-0">
                <Button type="submit" className="w-full" ref={ChangePassRef}>
                  Change Password
                </Button>
              </div>
              {resMessage && (
                <p
                  className={`px-6 py-3 ${
                    response.success ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {response.message}
                </p>
              )}
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
