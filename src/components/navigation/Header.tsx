import { Link } from "react-router-dom";
import { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { MdClose } from "react-icons/md";

import { useAuth } from "../../hooks/useAuth";

import SearchBar from "../common/SearchBar";
import UniversitySelector from "../common/UniversitySelector";
import HeroImage from "./HeroImage";

export default function Header() {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="min-h-[80px] border border-transparent">
      {/* Desktop Header */}
      <div className="hidden md:flex h-[80px] justify-between items-center px-4">
        <div className="w-[90px] flex justify-center">
          <Link to="/">
            <div className="w-full h-full relative">
              <img
                src="/rmc_logo_transparentbg.png"
                alt="RateMyCourse Logo"
                className="h-[55px] w-[60px]"
              />
            </div>
          </Link>
        </div>

        <div className="flex-1 flex justify-center items-center max-w-4xl mx-4">
          <div className="flex-1 max-w-lg">
            <SearchBar />
          </div>
          <div className="relative ml-4">
            <UniversitySelector />
          </div>
        </div>

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

      {/* Mobile Header */}
      <div className="md:hidden">
        {/* Top row with logo, hamburger menu, and sign in */}
        <div className="flex h-[80px] justify-between items-center px-4">
          <Link to="/" className="flex-shrink-0">
            <img
              src="/rmc_logo_transparentbg.png"
              alt="RateMyCourse Logo"
              className="h-[45px] w-[50px]"
            />
          </Link>

          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold 
                  rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Sign In
              </Link>
            ) : (
              <HeroImage />
            )}
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              
                {isMobileMenuOpen ? (
                  <MdClose size={24} className="text-gray-600" />
                ) : (
                  <RxHamburgerMenu size={24} />
                )}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="border-t bg-white shadow-lg">
            <div className="flex p-4 gap-2">
              <div className="w-full">
                <SearchBar />
              </div>
              <div>
                <UniversitySelector />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}