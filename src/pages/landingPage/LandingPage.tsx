import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

import SearchBar from "../../components/common/SearchBar";
import UniversitySelector from "../../components/common/UniversitySelector";
import { FaArrowLeft } from "react-icons/fa";
import { GENERATE_SCHEDULE_PAGE_ROUTE } from "../../Routes";

export default function LandingPage() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const isScrollingRef = useRef(false);

  const scrollToFeatures = () => {
    if (isScrollingRef.current) return;

    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      isScrollingRef.current = true;
      const start = window.scrollY;
      const end = featuresSection.offsetTop;
      const duration = 1000;

      const easeOutCubic = (t: number): number => {
        return 1 - Math.pow(1 - t, 3);
      };

      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easedProgress = easeOutCubic(progress);
        const currentPosition = start + (end - start) * easedProgress;

        window.scrollTo(0, currentPosition);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isScrollingRef.current = false;
        }
      };

      requestAnimationFrame(animate);
    }
  };

  const scrollToTop = useCallback(() => {
    if (isScrollingRef.current) return;

    isScrollingRef.current = true;
    const start = window.scrollY;
    const end = 0;
    const duration = 1000; // Increased duration for smoother animation

    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easeOutCubic(progress);
      const currentPosition = start + (end - start) * easedProgress;

      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        isScrollingRef.current = false;
      }
    };

    requestAnimationFrame(animate);
  }, []); // Empty dependencies since we don't use any external values

  const handleScroll = useCallback(() => {
    if (isScrollingRef.current) return;

    const currentScrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    if (
      currentScrollY < lastScrollY &&
      currentScrollY < viewportHeight * (3 / 4) &&
      currentScrollY < viewportHeight
    ) {
      scrollToTop();
    }
    setLastScrollY(currentScrollY);
  }, [lastScrollY, scrollToTop]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: false });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]); // Add handleScroll as dependency

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center pb-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-row items-center gap-2 mb-2">
            <img
              src="/rmc_logo_transparentbg.png"
              alt="CourseWise Logo"
              className="h-[85px] w-[90px]"
            />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              CourseWise
            </h1>
          </div>

          <p className="text-lg mb-2">
            Find detailed information about university courses, share your
            experience and build your schedule.
          </p>
          <div className="flex flex-col md:flex-row items-start gap-4 mt-4">
            <div className="flex flex-col flex-1 min-w-0 max-w-lg w-full">
              <SearchBar placeholder="Search for courses..." />
              <span className="block mt-1 ml-1 opacity-50 w-fit">
                Read course and professor reviews
              </span>
            </div>
            <div className="flex shrink-0 gap-2">
              <UniversitySelector />
              <span className="flex items-center gap-1 opacity-50">
                <FaArrowLeft /> Select your university
              </span>
            </div>
          </div>
        </div>
        {/* Scroll Arrow */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 
          animate-bounce cursor-pointer"
          onClick={scrollToFeatures}
        >
          <svg
            className="w-10 h-10 text-gray-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-12 mb-12">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Course Information</h3>
            <p className="text-gray-600">
              Access detailed course objectives, schedules, and prerequisites.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Student Reviews</h3>
            <p className="text-gray-600">
              Read honest reviews and ratings from fellow students.
            </p>
          </div>
          {/* Update to highlight Schedule Generator */}
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-200 relative">
            <div className="absolute -top-3 -right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
              NEW
            </div>
            <h3 className="text-xl font-semibold mb-3">Schedule Generator</h3>
            <p className="text-gray-600 mb-4">
              Create conflict-free schedules based on your course selections and
              time preferences.
            </p>
            <Link
              to={GENERATE_SCHEDULE_PAGE_ROUTE}
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-2 rounded-md transition-colors"
            >
              Generate Schedule
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-12 mb-12">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div
              className="bg-blue-100 rounded-full w-16 h-16 flex 
            items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-semibold mb-2">Search Courses</h3>
            <p className="text-gray-600">
              Find courses by name, code, or university
            </p>
          </div>
          <div className="text-center">
            <div
              className="bg-blue-100 rounded-full w-16 h-16 flex 
            items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="font-semibold mb-2">Read Reviews</h3>
            <p className="text-gray-600">
              Get insights from student experiences
            </p>
          </div>
          <div className="text-center">
            <div
              className="bg-blue-100 rounded-full w-16 h-16 flex 
            items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl font-bold text-blue-600">3</span>
            </div>
            <h3 className="font-semibold mb-2">Generate Schedules</h3>
            <p className="text-gray-600">
              Build conflict-free timetables that match your preferences
            </p>
          </div>
          <div className="text-center">
            <div
              className="bg-blue-100 rounded-full w-16 h-16 flex 
            items-center justify-center mx-auto mb-4"
            >
              <span className="text-2xl font-bold text-blue-600">4</span>
            </div>
            <h3 className="font-semibold mb-2">Share Your Experience</h3>
            <p className="text-gray-600">
              Help others by rating and reviewing courses
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section>
        <div className="container mx-auto px-4 py-12 text-center">
          <img
            src="/rmc_logo_transparentbg.png"
            alt="CourseWise Logo"
            className="h-[100px] w-[100px] mx-auto mb-4"
          />
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-6">
            Join our community and start exploring courses today!
          </p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg 
            font-semibold hover:bg-blue-50 transition-colors"
          >
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
}
