import React, { useState, useRef } from "react";
import { Shield, ArrowRight, CheckCircle, User } from "lucide-react";
import Button from "./Button";
import { motion } from "motion/react";

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [Exists, setExists] = useState(false);
  const [Message, setMessage] = useState("");
  const VerifyRef = useRef();
  const VerificationCodeRef = useRef();
  const ResendCodeRef = useRef();
  const EmergencyContactsRef = useRef();
  const UserEmail = useRef("");
  const step1ContinueRef = useRef();
  const step2ContinueRef = useRef();
  const step3ContinueRef = useRef();
  const [Verified, setVerified] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    password: "",
    confirmPassword: "",
    idFront: null,
    idBack: null,
    phone: "",
    emergencyContact: [
      {
        name: "",
        relation: "",
        phone: "",
        email: "",
      },
    ],
    route: [
      {
        name: "",
        frequency: "",
        from: "",
        to: "",
      },
    ],
  });

  const token = localStorage.getItem("token");

  const handleChange = (e, index = null, arrayName = null) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    } else if (name.includes(".")) {
      const [parent, child] = name.split(".");

      if (arrayName && index !== null) {
        const updatedArray = [...formData[arrayName]];
        updatedArray[index][child] = value;

        setFormData((prev) => ({
          ...prev,
          [arrayName]: updatedArray,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: value,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const addEmergencyContact = () => {
    if (formData.emergencyContact.length < 2) {
      setFormData((prev) => ({
        ...prev,
        emergencyContact: [
          ...prev.emergencyContact,
          { name: "", relation: "", phone: "", email: "" },
        ],
      }));
    }
  };

  const addRoute = () => {
    if (formData.route.length < 2) {
      setFormData((prev) => ({
        ...prev,
        route: [
          ...prev.route,
          {
            name: "",
            frequency: "",
            from: "",
            to: "",
          },
        ],
      }));
    }
  };

  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const postData = async (firstName, lastName, email, password, gender) => {
    try {
      const response = await fetch(
        "https://safejourney-backend-production.up.railway.app/signup",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            password,
            gender,
          }),
        }
      );

      const data = await response.json(); // Convert response to JSON
      console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Error:", error);
      return error;
    }
  };

  const handleStep1 = async (e) => {
    e.preventDefault();
    step1ContinueRef.current.disabled = true;
    step1ContinueRef.current.textContent = "...";
    const response = await postData(
      formData.firstName,
      formData.lastName,
      formData.email,
      formData.password,
      formData.gender
    );
    if (response.success) {
      nextStep();
    } else {
      setExists(true);
      setMessage(response.message);
    }
    step1ContinueRef.current.disabled = false;
    step1ContinueRef.current.textContent = "Continue";
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

  const postContacts = async (email, contacts) => {
    try {
      const response = await fetch(
        "https://safejourney-backend-production.up.railway.app/verification/postContacts",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            contacts,
          }),
        }
      );

      const data = await response.json(); // Convert response to JSON
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const postRoutes = async (email, routes) => {
    try {
      const response = await fetch(
        "https://safejourney-backend-production.up.railway.app/verification/postRoutes",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            routes,
          }),
        }
      );

      const data = await response.json(); // Convert response to JSON
      console.log("Success:", data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const postID = async (email, front, back) => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      if (front) formData.append("front", front);
      if (back) formData.append("back", back);

      const response = await fetch(
        "https://safejourney-backend-production.up.railway.app/verification/postID",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log("Success:", data);
      return data;
    } catch (error) {
      console.error("Error uploading Student ID:", error);
      return error;
    }
  };

  const handleStep2 = async (e) => {
    e.preventDefault();
    step2ContinueRef.current.disabled = true;
    step2ContinueRef.current.textContent = "...";
    UserEmail.current =
      VerificationCodeRef.current.previousElementSibling.value;
    const res = await postID(
      VerificationCodeRef.current.previousElementSibling.value,
      formData.idFront,
      formData.idBack
    );
    if (res) {
      if (res.success) {
        nextStep();
      }
    }
    step2ContinueRef.current.disabled = false;
    step2ContinueRef.current.textContent = "Continue";
  };

  const handleStep3 = async (e) => {
    e.preventDefault();
    step3ContinueRef.current.disabled = true;
    step3ContinueRef.current.textContent = "...";
    try {
      await postContacts(UserEmail.current, formData.emergencyContact);
      await postRoutes(UserEmail.current, formData.route);
      nextStep();
    } catch (err) {
      console.error("Error submitting data:", err);
    }
    step3ContinueRef.current.disabled = false;
    step3ContinueRef.current.textContent = "Complete Setup";
  };

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
        ResendCodeRef.current.disabled = true;
        setVerified(true);
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
      <div className="flex flex-1 items-center justify-center py-2.5">
        <div className="mx-auto w-full max-w-3xl px-4 md:px-6">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold">
              Create your SafeJourney account
            </h1>
            <p className="mt-2 text-muted-foreground">
              Join our community of university students traveling safely
              together
            </p>
          </div>

          <div className="mb-8">
            <div className="relative">
              <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted"></div>
              <ol className="relative z-10 flex justify-between">
                <li className="flex items-center justify-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step >= 1
                        ? "bg-rose-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    1
                  </div>
                  <span
                    className={`absolute mt-10 text-sm font-medium ${
                      step >= 1 ? "" : "text-muted-foreground"
                    }`}
                  >
                    Account
                  </span>
                </li>
                <li className="flex items-center justify-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step >= 2
                        ? "bg-rose-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    2
                  </div>
                  <span
                    className={`absolute mt-10 text-sm font-medium ${
                      step >= 2 ? "" : "text-muted-foreground"
                    }`}
                  >
                    Verification
                  </span>
                </li>
                <li className="flex items-center justify-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step >= 3
                        ? "bg-rose-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    3
                  </div>
                  <span
                    className={`absolute mt-10 text-sm font-medium ${
                      step >= 3 ? "" : "text-muted-foreground"
                    }`}
                  >
                    Safety
                  </span>
                </li>
                <li className="flex items-center justify-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step >= 4
                        ? "bg-rose-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    4
                  </div>
                  <span
                    className={`absolute mt-10 text-sm font-medium ${
                      step >= 4 ? "" : "text-muted-foreground"
                    }`}
                  >
                    Complete
                  </span>
                </li>
              </ol>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{
              opacity: 1,
              scale: 1,
              transition: { duration: 0.8, ease: "easeOut" },
            }}
            className="rounded-lg border bg-card text-card-foreground shadow-sm"
          >
            {step === 1 && (
              <>
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Step 1: Basic Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Let&apos;s start with your personal details
                  </p>
                </div>
                <form onSubmit={handleStep1}>
                  <div className="p-6 space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="first-name"
                          className="text-sm font-medium leading-none"
                        >
                          First Name
                        </label>
                        <input
                          id="first-name"
                          name="firstName"
                          placeholder="Enter your first name"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="last-name"
                          className="text-sm font-medium leading-none"
                        >
                          Last Name
                        </label>
                        <input
                          id="last-name"
                          name="lastName"
                          placeholder="Enter your last name"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="gender"
                          className="text-sm font-medium leading-none"
                        >
                          Gender
                        </label>
                        <select
                          id="gender"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="" disabled>
                            Select your Gender
                          </option>
                          <option value="MALE">MALE</option>
                          <option value="FEMALE">FEMALE</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
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
                      <p className="text-xs text-muted-foreground">
                        You must use your university email address for
                        verification purposes
                      </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="password"
                          className="text-sm font-medium leading-none"
                        >
                          Password
                        </label>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={formData.password}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="confirm-password"
                          className="text-sm font-medium leading-none"
                        >
                          Confirm Password
                        </label>
                        <input
                          id="confirm-password"
                          name="confirmPassword"
                          type="password"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      {formData.password !== formData.confirmPassword && (
                        <p className="text-red-500">
                          Password and Confirm Password Should've same value
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center p-6 pt-0 justify-between">
                      <Button
                        variant="outline"
                        onClick={() => (window.location.href = "/")}
                        className="cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="gap-1 cursor-pointer"
                        disabled={
                          formData.password !== formData.confirmPassword
                        }
                        ref={step1ContinueRef}
                      >
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    {Exists && <p className="text-red-500">{Message}</p>}
                  </div>
                </form>
              </>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.8, ease: "easeOut" },
                }}
              >
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Step 2: Verification
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Verify your identity as a university student
                  </p>
                </div>
                <form onSubmit={handleStep2}>
                  <div className="p-6 space-y-6">
                    <div className="rounded-lg border bg-amber-50 p-4 text-amber-800">
                      <p className="text-sm">
                        To ensure the safety of all users, we require
                        verification of your university student status. This
                        helps create a trusted community of verified students.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4 rounded-lg border p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
                          <CheckCircle className="h-5 w-5 text-rose-500" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <h3 className="font-medium">Email Verification</h3>
                            <p className="text-sm text-muted-foreground">
                              We&apos;ll send a verification code to your
                              university email address
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex gap-2 flex-col sm:flex-row">
                              <input
                                type="email"
                                placeholder="your.name@university.edu"
                                className="flex h-10 flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.email}
                                disabled
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.target.textContent = "Sent";
                                  e.target.disabled = true;
                                  postVCode(
                                    e.target.previousElementSibling.value
                                  );
                                }}
                                ref={VerificationCodeRef}
                              >
                                Send Code
                              </Button>
                            </div>
                            <div className="flex gap-2 flex-col sm:flex-row">
                              <input
                                id="verification-code"
                                name="verificationCode"
                                placeholder="Enter 6-digit code"
                                maxLength="6"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.verificationCode || ""}
                                onChange={handleChange}
                              />

                              <Button
                                variant="outline"
                                size="sm"
                                type="button"
                                className="cursor-pointer"
                                onClick={(e) => {
                                  verifyCode(
                                    e.target.previousElementSibling.value
                                  );
                                }}
                                ref={VerifyRef}
                              >
                                Verify
                              </Button>
                            </div>
                            {Verified && (
                              <p className="text-green-500">
                                Email Verified Successfully.
                              </p>
                            )}
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>Didn&apos;t receive the code?</span>
                              <button
                                type="button"
                                className="text-rose-500 hover:underline cursor-pointer"
                                ref={ResendCodeRef}
                              >
                                Resend code
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 rounded-lg border p-4">
                        {/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                          <span className="text-sm font-medium">2</span>
                        </div> */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-100">
                          <CheckCircle className="h-5 w-5 text-rose-500" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-medium">
                            Student ID Verification
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Upload a photo of your student ID card (you can blur
                            out sensitive information)
                          </p>
                          <div className="grid gap-4 pt-2 md:grid-cols-2">
                            <div>
                              <label
                                htmlFor="id-front"
                                className="text-xs font-medium"
                              >
                                Front of ID
                              </label>
                              <input
                                id="id-front"
                                name="idFront"
                                type="file"
                                required={true}
                                className="mt-1 flex cursor-pointer w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={handleChange}
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="id-back"
                                className="text-xs font-medium"
                              >
                                Back of ID (optional)
                              </label>
                              <input
                                id="id-back"
                                name="idBack"
                                type="file"
                                required={true}
                                className="mt-1 flex w-full cursor-pointer rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <div className="flex items-start gap-4 rounded-lg border p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                          <span className="text-sm font-medium">3</span>
                        </div>
                        <div>
                          <h3 className="font-medium">Phone Verification</h3>
                          <p className="text-sm text-muted-foreground">
                            Add and verify your phone number for additional
                            security
                          </p>
                          <div className="mt-2 space-y-2">
                            <input
                              placeholder="Enter your phone number"
                              name="phone"
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                            <Button variant="outline" size="sm">
                              Send Verification Code
                            </Button>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div className="flex items-center p-6 pt-0 justify-end">
                    {/* <Button variant="outline" onClick={prevStep}>
                      Back
                    </Button> */}
                    <Button
                      type="submit"
                      className="gap-1 cursor-pointer"
                      disabled={!Verified}
                      ref={step2ContinueRef}
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Step 3: Safety Setup
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Set up safety features for your account
                  </p>
                </div>
                <form onSubmit={handleStep3}>
                  <div className="p-6 space-y-6">
                    <div className="rounded-lg border bg-green-50 p-4 text-green-800">
                      <p className="text-sm">
                        Safety is our top priority. Setting up these features
                        now will help ensure your security when using
                        SafeJourney.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2" ref={EmergencyContactsRef}>
                        <h3 className="font-medium">Emergency Contacts</h3>
                        <p className="text-sm text-muted-foreground">
                          Add at least one emergency contact who can be notified
                          during your journeys
                        </p>
                        {formData.emergencyContact.map((contact, index) => (
                          <div key={index} className="rounded-lg border p-4">
                            <div className="grid gap-4 md:grid-cols-2">
                              {/* Name */}
                              <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                  Contact Name
                                </label>
                                <input
                                  name="emergencyContact.name"
                                  placeholder="Full name"
                                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                                  value={contact.name}
                                  required={true}
                                  onChange={(e) =>
                                    handleChange(e, index, "emergencyContact")
                                  }
                                />
                              </div>

                              {/* Relation */}
                              <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                  Relationship
                                </label>
                                <input
                                  name="emergencyContact.relation"
                                  placeholder="e.g., Parent, Friend"
                                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                                  value={contact.relation}
                                  required={true}
                                  onChange={(e) =>
                                    handleChange(e, index, "emergencyContact")
                                  }
                                />
                              </div>

                              {/* Phone */}
                              <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                  Phone Number (Optional)
                                </label>
                                <input
                                  name="emergencyContact.phone"
                                  placeholder="Emergency contact number"
                                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                                  value={contact.phone}
                                  onChange={(e) =>
                                    handleChange(e, index, "emergencyContact")
                                  }
                                />
                              </div>

                              {/* Email */}
                              <div className="space-y-2">
                                <label className="text-sm font-medium leading-none">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  name="emergencyContact.email"
                                  placeholder="Email address"
                                  required={true}
                                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                                  value={contact.email}
                                  onChange={(e) =>
                                    handleChange(e, index, "emergencyContact")
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addEmergencyContact}
                          disabled={formData.emergencyContact.length >= 2}
                        >
                          + Add Another Emergency Contact
                        </Button>
                      </div>

                      <div className="space-y-2 pt-4">
                        <h3 className="font-medium">Common Routes</h3>
                        <p className="text-sm text-muted-foreground">
                          Add your most frequent routes for quicker journey
                          setup
                        </p>
                        <div className="mt-2 space-y-4">
                          {formData.route.map((route, index) => (
                            <div key={index} className="rounded-lg border p-4">
                              <div className="grid gap-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <label
                                      htmlFor={`route-name-${index}`}
                                      className="text-sm font-medium leading-none"
                                    >
                                      Route Name
                                    </label>
                                    <input
                                      id={`route-name-${index}`}
                                      name="route.name"
                                      placeholder="e.g., Campus to Home"
                                      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                                      value={route.name}
                                      required={true}
                                      onChange={(e) =>
                                        handleChange(e, index, "route")
                                      }
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label
                                      htmlFor={`route-frequency-${index}`}
                                      className="text-sm font-medium leading-none"
                                    >
                                      Typical Frequency
                                    </label>
                                    <select
                                      id={`route-frequency-${index}`}
                                      name="route.frequency"
                                      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                                      value={route.frequency}
                                      required={true}
                                      onChange={(e) =>
                                        handleChange(e, index, "route")
                                      }
                                    >
                                      <option value="" disabled>
                                        Select frequency
                                      </option>
                                      <option value="daily">Daily</option>
                                      <option value="weekdays">Weekdays</option>
                                      <option value="weekends">Weekends</option>
                                      <option value="occasionally">
                                        Occasionally
                                      </option>
                                    </select>
                                  </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                  <div className="space-y-2">
                                    <label
                                      htmlFor={`route-from-${index}`}
                                      className="text-sm font-medium leading-none"
                                    >
                                      From
                                    </label>
                                    <input
                                      id={`route-from-${index}`}
                                      name="route.from"
                                      placeholder="Starting location"
                                      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                                      value={route.from}
                                      required={true}
                                      onChange={(e) =>
                                        handleChange(e, index, "route")
                                      }
                                    />
                                  </div>

                                  <div className="space-y-2">
                                    <label
                                      htmlFor={`route-to-${index}`}
                                      className="text-sm font-medium leading-none"
                                    >
                                      To
                                    </label>
                                    <input
                                      id={`route-to-${index}`}
                                      name="route.to"
                                      placeholder="Destination"
                                      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                                      value={route.to}
                                      required={true}
                                      onChange={(e) =>
                                        handleChange(e, index, "route")
                                      }
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={addRoute}
                            disabled={formData.route.length >= 2}
                          >
                            + Add Another Route
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center p-6 pt-0 justify-end">
                    <Button
                      type="submit"
                      className="gap-1 cursor-pointer"
                      ref={step3ContinueRef}
                    >
                      Complete Setup
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.8, ease: "easeOut" },
                }}
              >
                <div className="flex flex-col space-y-1.5 p-6 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-semibold leading-none tracking-tight">
                    Registration Complete!
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Your SafeJourney account has been created successfully
                  </p>
                </div>
                <div className="p-6 space-y-4 text-center">
                  <p>
                    We&apos;ve sent a verification email to your university
                    email address. Please check your inbox and click the
                    verification link to activate your account.
                  </p>
                  <div className="rounded-lg border bg-muted p-4">
                    <h3 className="font-medium">Next Steps:</h3>
                    <ul className="mt-2 space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Verify your email address</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>Complete your profile with a photo and bio</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>
                          Set up your preferred routes and travel times
                        </span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span>
                          Find travel companions for your next journey
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="flex items-center p-6 pt-0 justify-center">
                  <Button
                    className="bg-rose-500 hover:bg-rose-600 cursor-pointer"
                    onClick={() => (window.location.href = "/login")}
                  >
                    Go to Login
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-rose-500 underline-offset-4 hover:underline cursor-pointer"
            >
              Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
