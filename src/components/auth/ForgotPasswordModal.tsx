import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import supabase from "../../utils/supabaseClient";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEmail: string;
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  initialEmail,
}: ForgotPasswordModalProps) {
  const [email, setEmail] = useState(initialEmail || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/reset-password",
      });

      if (error) {
        setError(error.message);
        return;
      }

      setSuccessMessage("Password reset instructions have been sent to your email.");
      // Auto close after 3 seconds on success
      setTimeout(() => onClose(), 3000);
    } catch (err) {
      console.error("Failed to send reset email:", err);
      setError("Failed to send reset email. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Reset Password</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <MdClose size={24} className="text-gray-600" />
            </button>
          </div>

          {successMessage ? (
            <div className="text-center">
              <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
                {successMessage}
              </div>
              <p className="mt-2 text-gray-600">Please check your email for instructions.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
                  {error}
                </div>
              )}
              
              <p className="text-gray-600 mb-4">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
              
              <div className="mb-4">
                <label
                  htmlFor="reset-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="your@email.com"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Instructions"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}