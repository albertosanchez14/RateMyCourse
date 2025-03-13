import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome Back</h1>
        <p className="text-lg text-gray-600">
          Sign in to access your account and continue rating courses
        </p>
      </div>

      <SignIn
        appearance={{
          elements: {
            rootBox: {
              width: "100%",
              maxWidth: "28rem",
              fontFamily: "Poppins, sans-serif",
            },
            card: {
              backgroundColor: "white",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              borderRadius: "0.5rem",
              padding: "1.5rem",
              fontFamily: "Poppins, sans-serif",
            },
            formButtonPrimary: {
              backgroundColor: "#2563eb",
              "&:hover": {
                backgroundColor: "#1d4ed8",
              },
              borderRadius: "0.375rem",
              padding: "0.625rem 1.25rem",
              fontFamily: "Poppins, sans-serif",
            },
            headerTitle: {
              fontSize: "1.875rem",
              fontWeight: "600",
              color: "#1f2937",
              fontFamily: "Poppins, sans-serif",
            },
            headerSubtitle: {
              color: "#4b5563",
              fontFamily: "Poppins, sans-serif",
            },
            socialButtonsBlockButton: {
              padding: "0.625rem 1.25rem",
              borderRadius: "0.375rem",
              "&:hover": {
                backgroundColor: "#f9fafb",
              },
              fontFamily: "Poppins, sans-serif",
            },
            formFieldInput: {
              borderRadius: "0.375rem",
              border: "1px solid #e5e7eb",
              "&:focus": {
                borderColor: "#2563eb",
                boxShadow: "0 0 0 1px #2563eb",
              },
              fontFamily: "Poppins, sans-serif",
            },
          },
        }}
      />

      <p className="mt-8 text-sm text-gray-500">
        By signing in, you agree to our{" "}
        <a href="/privacy" className="text-blue-600 hover:text-blue-800">
          Privacy Policy
        </a>{" "}
        and{" "}
        <a href="/guidelines" className="text-blue-600 hover:text-blue-800">
          Community Guidelines
        </a>
      </p>
    </div>
  );
}
