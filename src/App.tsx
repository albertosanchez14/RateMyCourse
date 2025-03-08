import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import "./App.css";

import Header from "./components/navigation/Header";
import Course from "./components/course";
import Explore from "./components/search";
import Landing from "./components/landing";
import Footer from "./components/navigation/Footer";
import {
  LANDING_PAGE_ROUTE,
  PROFILE_PAGE_ROUTE,
  COURSE_PAGE_ROUTE,
  SHORT_PROF_PAGE_ROUTE,
  PROF_PAGE_ROUTE,
  EXPLORE_PAGE_ROUTE,
  ABOUT_PAGE_ROUTE,
  PRIVACY_PAGE_ROUTE,
  WELCOME_PAGE_ROUTE,
} from "./Routes";

const HeaderWrapper = () => {
  const location = useLocation();
  return location.pathname !== LANDING_PAGE_ROUTE ? <Header /> : null;
};

function App() {
  return (
    <>
      <Router>
        <HeaderWrapper />
        <Routes>
          <Route path={LANDING_PAGE_ROUTE} element={<Landing />} />
          <Route path={PROFILE_PAGE_ROUTE} element={<div>Profile Page</div>} />
          <Route path={COURSE_PAGE_ROUTE} element={<Course />} />
          <Route path={PROF_PAGE_ROUTE} element={<div>Prof Page</div>} />
          <Route path={SHORT_PROF_PAGE_ROUTE} element={<div>Prof Page</div>} />
          <Route path={EXPLORE_PAGE_ROUTE} element={<Explore />} />
          <Route path={ABOUT_PAGE_ROUTE} element={<div>About Page</div>} />
          <Route path={PRIVACY_PAGE_ROUTE} element={<div>Privacy Page</div>} />
          <Route path={WELCOME_PAGE_ROUTE} element={<div>Welcome Page</div>} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
