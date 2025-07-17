import { motion } from "motion/react";
import React from "react";
import {
  ArrowRight,
  UserPlus,
  MapPin,
  Shield,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Button from "../components/Button";
import FeatureCard from "../components/FeatureCard";
import StepItem from "../components/StepItem";
import SafetyFeature from "../components/SafetyFeature";

const HomePage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex flex-col items-center">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-rose-50 py-10 md:py-15 w-[100vw] flex justify-center items-center">
          <div className="container relative flex justify-between items-center gap-20 p-8 md:p-6 m-5 w-full">
            <motion.div
              initial={{ opacity: 0, translateX: "-100%" }}
              whileInView={{
                opacity: 1,
                translateX: "0",
                transition: { duration: 1 },
              }}
              className="space-y-6 w-[50%]"
            >
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Travel safely with trusted university peers
              </h1>
              <p className="text-xl text-muted-foreground">
                Find verified students traveling to the same destination and
                journey together safely.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  onClick={() => (window.location.href = "/signup")}
                  className="cursor-pointer"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() =>
                    document
                      .getElementById("how-it-works")
                      .scrollIntoView({ behavior: "smooth" })
                  }
                  className="cursor-pointer"
                >
                  Learn More
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, translateX: "100%" }}
              whileInView={{
                opacity: 1,
                translateX: "0",
                transition: { duration: 1 },
              }}
              className="relative mx-auto aspect-video max-w-md overflow-hidden rounded-2xl shadow-2xl md:mx-0 md:aspect-square"
            >
              <img
                src="/students-walking.png"
                alt="Students traveling together safely"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-24">
          <motion.div
            initial={{ opacity: 0, rotateY: "90deg" }}
            whileInView={{
              opacity: 1,
              rotateY: "0deg",
              transition: { duration: 1 },
            }}
            className="container px-4 md:px-6"
          >
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Designed for your safety
              </h2>
              <p className="mt-4 text-xl text-muted-foreground">
                Features built specifically for university students who want to
                travel with confidence.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
              <FeatureCard
                icon={UserPlus}
                title="Verified Profiles"
                description="Every user is verified using their university email and student ID."
              />
              <FeatureCard
                icon={MapPin}
                title="Area Matching"
                description="Find students traveling to and from the same areas as you."
              />
              <FeatureCard
                icon={Shield}
                title="Safety Features"
                description="Emergency contacts, journey sharing, and real-time check-ins."
              />
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section
          id="how-it-works"
          className="bg-rose-50 p-15 md:p-20 w-[100vw] flex flex-col items-center"
        >
          <div className="container px-4 md:px-6">
            <motion.h2
              initial={{ opacity: 0, translateX: "100%" }}
              whileInView={{
                opacity: 1,
                translateX: "0",
                transition: { duration: 1 },
              }}
              className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl"
            >
              How it works
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, translateX: "-100%" }}
              whileInView={{
                opacity: 1,
                translateX: "0",
                transition: { duration: 1 },
              }}
              className="mx-auto mt-16 grid gap-12 md:grid-cols-3 px-4 md:px-0"
            >
              <StepItem
                number="1"
                title="Create a verified account"
                description="Sign up with your university email and verify your student ID to create a trusted profile."
              />
              <StepItem
                number="2"
                title="Set your journey details"
                description="Tap the Active Now button and enter your start and end locations when you need to travel."
              />
              <StepItem
                number="3"
                title="Connect with travel partners"
                description="Browse other active users going your way, check their profiles, and arrange to travel together."
              />
            </motion.div>
          </div>
        </section>

        {/* Safety Section */}
        <section id="safety" className="py-20 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col gap-20 lg:flex-row justify-center items-center">
              <motion.div
                initial={{ opacity: 0, translateX: "-100%" }}
                whileInView={{
                  opacity: 1,
                  translateX: "0",
                  transition: { duration: 1 },
                }}
              >
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Your safety is our priority
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  We've built SafeJourney with multiple layers of security to
                  ensure you can travel with confidence.
                </p>
                <div className="mt-8 space-y-4">
                  <SafetyFeature
                    title="Verified University Students Only"
                    description="Every user must verify their university email and student ID."
                  />
                  <SafetyFeature
                    title="Journey Sharing"
                    description="Share your trip details with trusted emergency contacts."
                  />
                  <SafetyFeature
                    title="In-app Messaging"
                    description="Connect with potential travel companions without sharing personal contact details."
                  />
                  <SafetyFeature
                    title="Rating System"
                    description="Review your experience to help build a trusted community."
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, translateX: "100%" }}
                whileInView={{
                  opacity: 1,
                  translateX: "0",
                  transition: { duration: 1 },
                }}
                className="relative mx-auto aspect-video max-w-md overflow-hidden rounded-2xl shadow-2xl md:mx-0 "
              >
                <img
                  src="/safety-features.png"
                  alt="SafeJourney safety features"
                  className="h-full w-full object-cover"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* <section className="bg-rose-500 py-20 text-white md:py-24">
          <div className="container px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to travel safely?
              </h2>
              <p className="mt-4 text-xl text-rose-100">
                Join thousands of university students who are already using
                SafeJourney.
              </p>
              <Button
                className="mt-8 bg-white text-blue-700 hover:bg-rose-100"
                size="lg"
                onClick={() => (window.location.href = "/signup")}
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section> */}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
