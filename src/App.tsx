import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import "./App.css";

import Header from "./components/navigation/Header";
import Footer from "./components/navigation/Footer";
import CoursePage from "./pages/coursePage";
import ExplorePage from "./pages/explorePage";
import LandingPage from "./pages/landingPage";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signUpPage";
import AuthCallbackPage from "./pages/authCallBackPage";
import ProfilePage from "./pages/profilePage";
import GuidelinesPage from "./pages/guidelinesPage";
import PrivacyPage from "./pages/privacyPage";
import AboutPage from "./pages/aboutPage";
import HelpPage from "./pages/helpPage";
import ContactPage from "./pages/contactPage";
import NotFoundPage from "./pages/notFoundPage";
import TermsOfServicePage from "./pages/termsPage";
// import SettingsPage from "./pages/settingsPage";

import ScrollToTop from "./utils/ScrollToTop";

import {
  LANDING_PAGE_ROUTE,
  SIGN_IN_PAGE_ROUTE,
  SIGN_UP_PAGE_ROUTE,
  PROFILE_PAGE_ROUTE,
  COURSE_PAGE_ROUTE,
  SHORT_PROF_PAGE_ROUTE,
  PROF_PAGE_ROUTE,
  EXPLORE_PAGE_ROUTE,
  ABOUT_PAGE_ROUTE,
  PRIVACY_PAGE_ROUTE,
  WELCOME_PAGE_ROUTE,
  GUIDELINES_PAGE_ROUTE,
  HELP_PAGE_ROUTE,
  CONTACT_PAGE_ROUTE,
  TERMS_PAGE_ROUTE,
  AUTH_CALLBACK_PAGE_ROUTE,
  // SETTINGS_PAGE_ROUTE,
} from "./Routes";

const HeaderWrapper = () => {
  const location = useLocation();
  return location.pathname !== LANDING_PAGE_ROUTE &&
    location.pathname !== SIGN_IN_PAGE_ROUTE &&
    location.pathname !== SIGN_UP_PAGE_ROUTE ? (
    <Header />
  ) : null;
};

const FooterWrapper = () => {
  const location = useLocation();
  return location.pathname !== SIGN_IN_PAGE_ROUTE &&
    location.pathname !== SIGN_UP_PAGE_ROUTE ? (
    <Footer />
  ) : null;
};

function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <HeaderWrapper />
        <Routes>
          <Route path={LANDING_PAGE_ROUTE} element={<LandingPage />} />
          <Route path={SIGN_IN_PAGE_ROUTE} element={<LoginPage />} />
          <Route path={AUTH_CALLBACK_PAGE_ROUTE} element={<AuthCallbackPage />} />
          <Route path={SIGN_UP_PAGE_ROUTE} element={<SignUpPage />} />
          <Route path={PROFILE_PAGE_ROUTE} element={<ProfilePage />} />
          {/* <Route
            path={PROFILE_PAGE_ROUTE + SETTINGS_PAGE_ROUTE}
            element={<SettingsPage />}
          /> */}
          <Route path={COURSE_PAGE_ROUTE} element={<CoursePage />} />
          <Route path={PROF_PAGE_ROUTE} element={<div>Prof Page</div>} />
          <Route path={SHORT_PROF_PAGE_ROUTE} element={<div>Prof Page</div>} />
          <Route path={EXPLORE_PAGE_ROUTE} element={<ExplorePage />} />
          <Route path={ABOUT_PAGE_ROUTE} element={<AboutPage />} />
          <Route path={PRIVACY_PAGE_ROUTE} element={<PrivacyPage />} />
          <Route path={WELCOME_PAGE_ROUTE} element={<LandingPage />} />
          <Route path={GUIDELINES_PAGE_ROUTE} element={<GuidelinesPage />} />
          <Route path={HELP_PAGE_ROUTE} element={<HelpPage />} />
          <Route path={CONTACT_PAGE_ROUTE} element={<ContactPage />} />
          <Route path={TERMS_PAGE_ROUTE} element={<TermsOfServicePage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <FooterWrapper />
      </Router>
    </>
  );
}

export default App;
