import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { SIGN_IN_PAGE_ROUTE } from "../../Routes";

import supabase from "../../utils/supabaseClient";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check for error parameters in the URL hash
  useEffect(() => {
    const checkForErrors = () => {
      // Remove the # from the hash
      const hash = location.hash.substring(1);

      if (hash) {
        // Parse hash params like error=access_denied&error_code=otp_expired
        const params = new URLSearchParams(hash);
        const errorCode = params.get("error_code");
        const errorDescription = params.get("error_description");

        if (errorCode === "otp_expired") {
          setIsExpired(true);
          setError(
            "Your password reset link has expired. Please request a new one."
          );
        } else if (params.get("error")) {
          setError(
            errorDescription || "An error occurred with your reset link."
          );
        }
      }
    };

    checkForErrors();
  }, [location.hash]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Form validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Update the password using Supabase
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      // Password updated successfully
      setSuccess(true);

      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate(SIGN_IN_PAGE_ROUTE);
      }, 3000);
    } catch (err) {
      console.error("Error updating password:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If the link is expired, show a different UI
  if (isExpired) {
    return (
      <div
        className="min-h-screen flex items-center justify-center 
      py-12 px-4 sm:px-6 lg:px-8"
      >
        <div
          className="max-w-md w-full space-y-8 bg-white p-8 
        rounded-lg shadow-md"
        >
          <div>
            <h2 className="text-center text-2xl font-bold text-gray-900">
              Password Reset Link Expired
            </h2>
            <div className="mt-4 p-4 bg-red-100 text-red-800 rounded-md">
              {error}
            </div>

            <div className="mt-6 text-center">
              <p className="mb-4 text-gray-600">
                You'll need to request a new password reset link.
              </p>

              <button
                onClick={() => navigate(SIGN_IN_PAGE_ROUTE)}
                className="inline-flex justify-center py-2 px-4 border 
                border-transparent shadow-sm text-sm font-medium rounded-md 
                text-white bg-blue-600 hover:bg-blue-700 focus:outline-none 
                focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center
    py-12 px-4 sm:px-6 lg:px-8"
    >
      <div
        className="max-w-md w-full space-y-8 bg-white 
      p-8 rounded-lg shadow-md"
      >
        <div>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Please enter your new password below
          </p>
        </div>

        {success ? (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
              Your password has been reset successfully!
            </div>
            <p className="text-gray-600">
              Redirecting you to the login page...
            </p>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="p-4 bg-red-100 text-red-800 rounded-md">
                {error}
              </div>
            )}

            <div className="rounded-md -space-y-px">
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter new password"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Password must be at least 8 characters long
                </p>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirm new password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
              >
                {isSubmitting ? "Resetting Password..." : "Reset Password"}
              </button>
            </div>

            <div className="text-sm text-center">
              <a
                href={SIGN_IN_PAGE_ROUTE}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Back to Login
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
