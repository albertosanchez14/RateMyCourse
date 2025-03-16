import { useNavigate } from "react-router-dom";
import { LANDING_PAGE_ROUTE } from "../../Routes";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-extrabold text-blue-600 mb-4">404</h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-block bg-gray-200 text-gray-800 
            px-6 py-3 rounded-lg hover:bg-gray-300 
            transition-colors duration-200 shadow-sm font-medium"
          >
            Go Back
          </button>
          <button
            onClick={() => navigate(LANDING_PAGE_ROUTE)}
            className="px-6 py-3 bg-blue-500 text-white font-semibold 
          rounded-lg hover:bg-blue-600 active:bg-blue-700 
          transition-colors duration-200 shadow-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
