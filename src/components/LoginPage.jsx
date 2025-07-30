import React, { useState } from "react";
import { Shield, Eye, EyeOff } from "lucide-react";
import Button from "./Button";
import { motion } from "motion/react";

const LoginPage = () => {
  const [NotAllowed, setNotAllowed] = useState(false);
  const [NotAllowedMessage, setNotAllowedMessage] = useState("");
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateUser = async (email, password) => {
    try {
      const response = await fetch(
        "https://safejourney-backend-production.up.railway.app/login",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();
      console.log("Success:", data);
      if (data.success) {
        localStorage.setItem("token", data.token);
        window.location.href = "/main";
      } else {
        setNotAllowed(true);
        setNotAllowedMessage(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.disabled = true;
    e.target.textContent = "Signing In...";
    await validateUser(formData.email, formData.password);
    e.target.disabled = false;
    e.target.textContent = "Sign In";
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
      <div className="flex flex-1 items-center justify-center">
        <div className="grid w-full gap-6 md:grid-cols-2 lg:gap-12">
          <div className="hidden items-center justify-center rounded-lg bg-muted p-8 md:flex">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
              <motion.img
                initial={{ opacity: 0, translateX: "-100%" }}
                whileInView={{
                  opacity: 1,
                  translateX: "0",
                  transition: { duration: 1 },
                }}
                src="/students-reached.png"
                alt="Students walking together safely on campus"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex items-center justify-center p-8">
            <motion.div
              initial={{ opacity: 0, translateX: "100%" }}
              whileInView={{
                opacity: 1,
                translateX: "0",
                transition: { duration: 1 },
              }}
              className="mx-auto grid w-full max-w-sm gap-6"
            >
              <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </div>
              <form className="grid gap-4">
                <div className="grid gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium leading-none"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.name@gmail.com"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="grid gap-2 relative">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium leading-none"
                    >
                      Password
                    </label>
                    <a
                      href="/forgot-password"
                      className="text-sm text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-2 top-[45%] flex items-center text-muted-foreground hover:text-foreground"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    name="rememberMe"
                    className="h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember me
                  </label>
                </div> */}
                <Button
                  type="submit"
                  className="w-full"
                  onClick={(e) => {
                    handleSubmit(e);
                  }}
                >
                  Sign In
                </Button>
                {NotAllowed && (
                  <p className="text-red-500">{NotAllowedMessage}</p>
                )}
              </form>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a
                  href="/signup"
                  className="font-medium text-rose-500 underline-offset-4 hover:underline"
                >
                  Sign up
                </a>
              </div>
              <div className="flex items-center justify-center text-xs uppercase w-full">
                <div className="flex w-full max-w-md items-center justify-center gap-2 px-4">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="bg-white px-2 text-muted-foreground z-10">
                    Important
                  </span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p>
                  SafeJourney is exclusively for verified users only. You must
                  use your email to register and log in.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
