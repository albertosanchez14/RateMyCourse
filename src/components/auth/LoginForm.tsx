import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import supabase from "../../utils/supabaseClient";

import ForgotPasswordModal from "./ForgotPasswordModal";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface LoginFormProps {
  onSuccess?: () => void;
  redirectAfterLogin?: boolean;
  className?: string;
}

export default function LoginForm({
  onSuccess,
  redirectAfterLogin = true,
  className = "",
}: LoginFormProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof LoginFormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validate = (): LoginFormErrors => {
    const newErrors: LoginFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        // Handle specific error messages
        if (error.message.includes("Invalid login")) {
          setErrors({
            general: "Invalid email or password. Please try again.",
          });
        } else if (error.message.includes("Email not confirmed")) {
          setErrors({
            general: "Please verify your email address before logging in.",
          });
        } else {
          setErrors({ general: error.message });
        }
        return;
      }

      if (data?.user) {
        setSuccessMessage("Login successful!");

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }

        // Redirect to dashboard if redirectAfterLogin is true
        if (redirectAfterLogin) {
          setTimeout(() => {
            navigate("/");
          }, 1000);
        }
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      setErrors({
        general: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    setIsForgotPasswordModalOpen(true);
  };

  const handleGoogleSignIn = async () => {
    try {
      const redirectBaseUrl = 
        import.meta.env.VITE_ENV === "production"
          ? import.meta.env.VITE_URL_PROD
          : import.meta.env.VITE_URL_DEV;
      console.error("Redirect Base URL:", redirectBaseUrl);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectBaseUrl}/auth/callback`,
          queryParams: {
            intent: "login",
          },
        },
      });

      if (error) {
        console.error("Google sign-in error:", error);
        setErrors({ general: "Failed to sign in with Google" });
      } else {
        // Show loading message while user completes OAuth flow
        setIsSubmitting(true);
        setSuccessMessage("Redirecting to Google for authentication...");
      }
    } catch (err) {
      console.error("Unexpected error during Google sign-in:", err);
      setErrors({ general: "An unexpected error occurred" });
    }
  };

  return (
    <div className={`bg-white rounded-lg ${className}`}>
      <ForgotPasswordModal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}
        initialEmail={formData.email}
      />
      {successMessage ? (
        <div className="text-center">
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
            {successMessage}
          </div>
          {successMessage.includes("reset") ? (
            <p className="mt-4 text-gray-600">
              Please check your email for instructions.
            </p>
          ) : (
            <p className="mt-4 text-gray-600">
              {redirectAfterLogin ? "Redirecting you to the home" : ""}
            </p>
          )}
        </div>
      ) : (
        <>
          {errors.general && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={handleForgotPassword}
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 flex items-center">
            <div className="flex-grow h-px bg-gray-300"></div>
            <span className="mx-4 text-sm text-gray-500">or</span>
            <div className="flex-grow h-px bg-gray-300"></div>
          </div>

          <div className="mt-6 w-full flex justify-center">
            <button
              type="button"
              className="flex justify-center items-center w-full py-2 px-4 
              border border-gray-300 rounded-md shadow-sm bg-white 
              text-sm font-medium text-gray-700 hover:bg-gray-50 gap-2"
              onClick={handleGoogleSignIn}
            >
              <FcGoogle size={25} />
              Continue with Google
            </button>
          </div>
        </>
      )}
    </div>
  );
}
