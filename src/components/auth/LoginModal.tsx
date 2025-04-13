import { useEffect } from "react";
import { MdClose } from "react-icons/md";
import { Link } from "react-router-dom";

import LoginForm from "./LoginForm";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLoginSuccess,
}: LoginModalProps) {
  // Effect to prevent scrolling when modal is open
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm 
    bg-black/30 z-50 flex items-center justify-center p-4"
    >
      <div
        className="bg-white rounded-lg shadow-xl 
      w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">
              Sign In Required
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close form"
            >
              <MdClose size={24} className="text-gray-600" />
            </button>
          </div>
          <p className="text-gray-600 mb-6">
            You need to sign in to write a review.
          </p>

          <LoginForm onSuccess={onLoginSuccess} redirectAfterLogin={false} />

          <p className="mt-4 text-sm text-gray-500 text-center">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 
            hover:text-blue-800"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
