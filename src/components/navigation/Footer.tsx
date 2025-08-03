import { Link } from "react-router-dom";
import {
  // ABOUT_PAGE_ROUTE,
  PRIVACY_PAGE_ROUTE,
  EXPLORE_PAGE_ROUTE,
} from "../../Routes";

export default function Footer() {
  return (
<footer className="w-full bg-[#f8f9fa] pt-8 md:pt-12 pb-4 mt-16">
      <div
        className="max-w-[1200px] mx-auto grid 
        grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] 
        gap-8 px-8"
      >
        <div className="flex flex-col gap-3 md:gap-4 sm:col-span-2 lg:col-span-1">
          <h3 className="text-[#333] text-xl md:text-2xl m-0 font-semibold">CourseWise</h3>
          <p className="text-[#666] text-sm leading-6 m-0">
            Help students make informed decisions about their education journey.
          </p>
          <div className="flex gap-4">
            {/* <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors duration-200 
              font-medium text-[#646cff] hover:text-[#535bf2] 
              no-underline"
            >
              Twitter
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors duration-200 
              font-medium text-[#646cff] hover:text-[#535bf2] 
              no-underline"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm transition-colors duration-200 
              font-medium text-[#646cff] hover:text-[#535bf2] 
              no-underline"
            >
              GitHub
            </a> */}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-[#333] text-lg m-0">Explore</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            <li>
              <Link
                to={EXPLORE_PAGE_ROUTE + "?q=*&limit=1000"}
                className="text-sm transition-colors duration-200 
              font-medium text-[#646cff] hover:text-[#535bf2] 
              no-underline"
              >
                Browse Courses
              </Link>
            </li>
            <li>
              <span
                className="text-sm font-medium text-gray-400 cursor-not-allowed 
                flex flex-col gap-1"
              >
                Find Professors
                <span className="text-xs text-gray-500 rounded">
                  (Coming soon..)
                </span>
              </span>
            </li>
            <li>
              <span
                className="text-sm font-medium text-gray-400 cursor-not-allowed
                flex flex-col gap-1"
              >
                Departments
                <span className="text-xs text-gray-500 rounded">
                  (Coming soon..)
                </span>
              </span>
            </li>
            <li>
              <span
                className="text-sm font-medium text-gray-400 cursor-not-allowed
                flex flex-col gap-1"
              >
                Degree Programs
                <span className="text-xs text-gray-500 rounded">
                  (Coming soon..)
                </span>
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-[#333] text-lg m-0">Support</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            {/* <li>
              <Link
                to="/help"
                className="text-sm transition-colors duration-200 
                font-medium text-[#646cff] hover:text-[#535bf2] 
                no-underline"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-sm transition-colors duration-200 
                font-medium text-[#646cff] hover:text-[#535bf2] 
                no-underline"
              >
                Contact Us
              </Link>
            </li> */}
            <li>
              <Link
                to="/guidelines"
                className="text-sm transition-colors duration-200 
                font-medium text-[#646cff] hover:text-[#535bf2] 
                no-underline"
              >
                Community Guidelines
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-[#333] text-lg m-0">Legal</h4>
          <ul className="list-none p-0 m-0 flex flex-col gap-2">
            <li>
              <Link
                to={PRIVACY_PAGE_ROUTE}
                className="text-sm transition-colors duration-200 
                font-medium text-[#646cff] hover:text-[#535bf2] 
                no-underline"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-sm transition-colors duration-200 
                font-medium text-[#646cff] hover:text-[#535bf2] 
                no-underline"
              >
                Terms of Service
              </Link>
            </li>
            {/* <li>
              <Link
                to={ABOUT_PAGE_ROUTE}
                className="text-sm transition-colors duration-200 
                font-medium text-[#646cff] hover:text-[#535bf2] 
                no-underline"
              >
                About Us
              </Link>
            </li> */}
          </ul>
        </div>
      </div>

      <div
        className="max-w-[1200px] mx-auto px-8 text-center border-t 
      border-[#eee] mt-8 pt-8"
      >
        <p className="text-[#999] text-xs m-0">
          &copy; {new Date().getFullYear()} CourseWise. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
