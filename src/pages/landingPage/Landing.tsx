import { useEffect, useState, useRef } from "react";

import SearchBar from "../../components/common/SearchBar";

export default function Landing() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const isAnimatingRef = useRef(false);
  const [hasClickedArrow, setHasClickedArrow] = useState(false);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      if (isAnimatingRef.current) {
        e.preventDefault();
        return;
      }
      const currentScrollY = window.scrollY;
      const featuresSection = document.getElementById("features");
      if (featuresSection && currentScrollY < lastScrollY && hasClickedArrow) {
        const featuresSectionTop = featuresSection.offsetTop;
        const tolerance = 200;
        if (Math.abs(currentScrollY - featuresSectionTop) < tolerance) {
          scrollToTop();
          setHasClickedArrow(false);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: false });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const scrollToFeatures = () => {
    setHasClickedArrow(true);
    const featuresSection = document.getElementById("features");
    if (featuresSection) {
      const start = window.scrollY;
      const end = featuresSection.offsetTop;
      const duration = 1000; // Duration in milliseconds

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
        }
      };

      requestAnimationFrame(animate);
    }
  };

  const scrollToTop = () => {
    if (isAnimatingRef.current) return;

    isAnimatingRef.current = true;
    const start = window.scrollY;
    const end = 0;
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
        isAnimatingRef.current = false;
      }
    };

    requestAnimationFrame(animate);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center pb-30">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Rate My Course
          </h1>
          <p className="text-lg mb-8">
            Find detailed information about university courses, share your
            experience, and help others make informed decisions.
          </p>
          <SearchBar placeholder="Search for courses..." />
          <span className="block mt-1 ml-1 opacity-50">
            Read course and professor reviews
          </span>
        </div>
        {/* Scroll Arrow */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-3">Course Calendar</h3>
            <p className="text-gray-600">
              View course schedules and important dates at a glance.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-12 mb-12">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="font-semibold mb-2">Search Courses</h3>
            <p className="text-gray-600">
              Find courses by name, code, or university
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">2</span>
            </div>
            <h3 className="font-semibold mb-2">Read Reviews</h3>
            <p className="text-gray-600">
              Get insights from student experiences
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">3</span>
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
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="mb-6">
            Join our community and start exploring courses today!
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Sign Up Now
          </button>
        </div>
      </section>
    </div>
  );
}
