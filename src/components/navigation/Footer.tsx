import { Link } from "react-router-dom";
import "./Footer.css";

import {
  ABOUT_PAGE_ROUTE,
  PRIVACY_PAGE_ROUTE,
  EXPLORE_PAGE_ROUTE,
} from "../../Routes";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>RateMyCourse</h3>
          <p>Help students make informed decisions about their education journey.</p>
          <div className="social-links">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
          </div>
        </div>

        <div className="footer-section">
          <h4>Explore</h4>
          <ul>
            <li><Link to={EXPLORE_PAGE_ROUTE}>Browse Courses</Link></li>
            <li><Link to="/professors">Find Professors</Link></li>
            <li><Link to="/departments">Departments</Link></li>
            <li><Link to="/degrees">Degree Programs</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
            <li><Link to="/feedback">Submit Feedback</Link></li>
            <li><Link to="/guidelines">Community Guidelines</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li><Link to={PRIVACY_PAGE_ROUTE}>Privacy Policy</Link></li>
            <li><Link to="/terms">Terms of Service</Link></li>
            <li><Link to={ABOUT_PAGE_ROUTE}>About Us</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} RateMyCourse. All rights reserved.</p>
      </div>
    </footer>
  );
}
