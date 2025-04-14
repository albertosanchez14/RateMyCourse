import { Link } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";

import SearchBar from "../common/SearchBar";
import HeroImage from "./HeroImage";

export default function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <div
      className="min-h-[80px] h-[80px] flex justify-between items-center 
    border border-transparent"
    >
      <div className="w-[90px] flex justify-center">
        <Link to="/">
          <div className="w-full h-full relative">
            <img
              src="/rmc_logo_transparentbg.png"
              alt="RateMyCouse Logo"
              className="h-[50px] w-[50px] object-contain"
            />
          </div>
        </Link>
      </div>

      <SearchBar />

      <div className="w-[90px] flex justify-center">
        {!isAuthenticated ? (
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 text-white font-semibold 
              rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 
              focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 
              shadow-sm"
          >
            Sign In
          </Link>
        ) : (
          <HeroImage />
        )}
      </div>
    </div>
  );
}
