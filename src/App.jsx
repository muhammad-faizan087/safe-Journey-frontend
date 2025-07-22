import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import Dashboard from "./components/Dashboard";
import GoMapsAutocomplete from "./components/Autocomplete api";
import AutoPlaceInput from "./components/api try";

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
    {
      path: "/autocomplete",
      element: (
        <>
          <AutoPlaceInput />
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
