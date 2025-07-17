import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import Dashboard from "./components/Dashboard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <HomePage />
        </>
      ),
    },
    {
      path: "/login",
      element: (
        <>
          <LoginPage />
        </>
      ),
    },
    {
      path: "/signup",
      element: (
        <>
          <SignupPage />
        </>
      ),
    },
    {
      path: "/forgot-password",
      element: (
        <>
          <ForgotPasswordPage />
        </>
      ),
    },
    {
      path: "/main",
      element: (
        <>
          <Dashboard />
        </>
      ),
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
