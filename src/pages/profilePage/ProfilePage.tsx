import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { MdEdit, MdSchool, MdEmail, MdDateRange } from "react-icons/md";

import { useUserCourseReviews } from "../../hooks/useReviews";
import { useUpdateProfile, useUser } from "../../hooks/useUser";

import { SIGN_IN_PAGE_ROUTE } from "../../Routes";

import LoadingSpinnerScreen from "../../components/loading/LoadingSpinnerScreen";
import EditProfileModal from "./EditProfileModal";
import ProfileCalendarSection from "./ProfileCalendarSection";
import { useAuth } from "../../hooks/useAuth";

export default function ProfilePage() {
  const navigate = useNavigate();
  const {
    data: reviews,
    isLoading: isLoadingRev,
    error: errorRev,
  } = useUserCourseReviews();
  const { 
    data: user, 
    isLoading: isLoadingUser, 
    error: errorUser,
  } = useUser();
  const { isLoading: isLoadingAuth, isAuthenticated } = useAuth();
  const { mutate: updateProfile, isPending: isUpdatingProfile } =
    useUpdateProfile();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string>(() => {
    if (!user?.user_id) return "";
    return localStorage.getItem(`profilePic_${user.user_id}`) || "";
  });

  useEffect(() => {
    if (isLoadingAuth) return;

    if (!isAuthenticated) { //TODO: CHeck flow when logged out dont go to sign up page
      // User is not authenticated
      navigate(SIGN_IN_PAGE_ROUTE, {
        replace: true,
        state: {
          from: location.pathname,
          error: "Please log in to view your profile",
        },
      });
    }
  }, [isAuthenticated, isLoadingUser, navigate]);

  // Set the profile picture when the user data is loaded
  useEffect(() => {
    if (!user?.user_id) return;
    setProfilePic(localStorage.getItem(`profilePic_${user.user_id}`) || "");
  }, [localStorage, user]);

  // Navigate when the hash changes
  useLayoutEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          element.classList.add("highlight");
          setTimeout(() => element.classList.remove("highlight"), 2000);
        }
      }, 100);
    }
  }, [location.hash, document]);

  const handleSaveProfile = async (userData: {
    yearOfStudy: number;
    degree: string;
    university: string;
  }) => {
    updateProfile(userData, {
      onSuccess: () => {
        setIsEditModalOpen(false);
      },
      onError: (error) => {
        const errorMsg =
          error instanceof Error ? error.message : "Failed to update profile";
        setErrorMessage(errorMsg);
      },
    });
  };

  if (isLoadingRev || isLoadingUser) return <LoadingSpinnerScreen />;
  if (errorRev || errorUser)
    return (
      <div className="min-h-screen">
        Error: {errorRev?.message || errorUser?.message}
      </div>
    );
  if (!user) return <div className="min-h-screen">No data</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={profilePic || "/defaultProfilePic.png"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-gray-200"
                />
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                  <MdEdit className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">{user.full_name}</h1>
                <div className="flex flex-col gap-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MdEmail className="w-5 h-5" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdSchool className="w-5 h-5" />
                    <span>{user.university}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MdDateRange className="w-5 h-5" />
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Edit Profile
            </button>

            <EditProfileModal
              user={{
                full_name: user.full_name,
                yearOfStudy: user.course_year ? Number(user.course_year) : 0,
                degree: user.degree ?? "",
                university: user.university ?? "",
              }}
              isOpen={isEditModalOpen}
              onClose={() => {
                setErrorMessage(null);
                setIsEditModalOpen(false);
              }}
              onSave={handleSaveProfile}
              isLoading={isUpdatingProfile}
              error={errorMessage}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Reviews Written</h3>
            <p className="text-3xl font-bold text-blue-500">
              {user.reviews_count}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Academic Year</h3>
            <p className="text-3xl font-bold text-blue-500">
              {user.course_year}rd Year
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Degree Program</h3>
            <p className="text-base text-gray-600">{user.degree}</p>
          </div>
        </div>

        {/* Calendar Section */}
        <ProfileCalendarSection />

        <div className="flex flex-row gap-8">
          {/* Reviews Section */}
          <div
            className="bg-white rounded-xl shadow-sm p-8 flex-1"
            id="reviews"
          >
            <h2 className="text-xl font-bold mb-6">My Reviews</h2>
            <div className="space-y-6">
              {reviews?.map((review) => (
                <div
                  key={review.id}
                  className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link
                        to={`/course/${review.course_id.id}#reviews`}
                        className="font-medium text-[#646cff] hover:text-[#535bf2] 
                      no-underline"
                      >
                        <h3 className="font-semibold text-lg hover:underline">
                          {review.course_id.code} - {review.course_id.title}
                        </h3>
                      </Link>
                      <p className="text-sm text-gray-500">
                        Posted on {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">
                      {review.rating?.overall}/5
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-800 mt-2">
                    {review.title}
                  </h4>
                  <p className="text-gray-600">{review.review}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Liked Courses Section */}
          <div
            className="bg-white rounded-xl shadow-sm p-8 flex-1"
            id="fav-courses"
          >
            <h2 className="text-xl font-bold mb-6">Liked Courses</h2>
            <div className="space-y-6">
              {user.liked_courses &&
                user.liked_courses.map((course) => (
                  <div
                    key={course.id}
                    className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <Link
                          to={`/course/${course.id}`}
                          className="font-medium text-[#646cff] hover:text-[#535bf2] 
                        no-underline"
                        >
                          <h3 className="font-semibold text-lg hover:underline">
                            {course.code} - {course.title}
                          </h3>
                        </Link>
                      </div>
                      <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">
                        {course.rating.overall}/5
                      </div>
                    </div>
                    <span className="text-gray-600">{course.degree.title}</span>
                  </div>
                ))}
              {user.liked_courses && user.liked_courses.length === 0 && (
                <p className="text-gray-500 col-span-full text-center py-4">
                  You haven't liked any courses yet
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
