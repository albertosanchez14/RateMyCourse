import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  SIGN_IN_PAGE_ROUTE,
  PROFILE_SETUP_PAGE_ROUTE,
  LANDING_PAGE_ROUTE,
} from "../../Routes";
import supabase from "../../utils/supabaseClient";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("Completing authentication...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get session after OAuth redirect
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const user = session.user;
        console.log("User authenticated:", user.user_metadata);
        // Check if user has a profile data in the database
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("university, course_year, degree")
          .eq("user_id", session.user.id)
          .single();
        if (profileError ||
          !profileData ||
          !profileData.university ||
          !profileData.course_year ||
          !profileData.degree) {
          // No profile, redirect to signup to complete registration
          setMessage("Redirecting to complete your profile...");
          setTimeout(() => navigate(PROFILE_SETUP_PAGE_ROUTE), 1000);
        } else {
          // Profile exists, go to home page
          setMessage("Redirecting to your dashboard...");
          setTimeout(() => navigate(LANDING_PAGE_ROUTE), 1000);
        }
      } else {
        // No session, go back to login
        setMessage("Authentication failed. Please try again.");
        setTimeout(() => navigate(SIGN_IN_PAGE_ROUTE), 2000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <div
          className="animate-spin mb-4 h-12 w-12 border-4 
        border-blue-500 border-t-transparent rounded-full mx-auto"
        ></div>
        <h2 className="text-xl font-semibold mb-2">
          Authentication in Progress
        </h2>
        <p>{message}</p>
      </div>
    </div>
  );
}
