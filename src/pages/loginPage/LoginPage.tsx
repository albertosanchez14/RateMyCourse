import { Link } from "react-router-dom";
import LoginForm from "../../components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Welcome Back</h1>
        <p className="text-lg text-gray-600">
          Sign in to access your CourseWise account
        </p>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <LoginForm redirectAfterLogin={true} />
      </div>

      <p className="mt-8 text-sm text-gray-500">
        Don't have an account?{" "}
        <Link to="/signup" 
        className="text-blue-600 hover:text-blue-800">
          Sign up
        </Link>
      </p>
    </div>
  );
}