import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { MdEdit, MdSchool, MdEmail, MdDateRange } from "react-icons/md";

import { useUserCourseReviews } from "../../hooks/useReviews";
import { useUpdateProfile, useUser } from "../../hooks/useUser";
import { useAuth } from "../../hooks/useAuth";

import { SIGN_IN_PAGE_ROUTE } from "../../Routes";

import LoadingSpinnerScreen from "../../components/loading/LoadingSpinnerScreen";
import EditProfileModal from "./EditProfileModal";
import ProfileCalendarSection from "./ProfileCalendarSection";

export default function ProfilePage() {
  const navigate = useNavigate();
  const {
    data: reviews,
    isLoading: isLoadingRev,
    error: errorRev,
  } = useUserCourseReviews();
  const { data: user, isLoading: isLoadingUser, error: errorUser } = useUser();
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

    if (!isAuthenticated) {
      //TODO: CHeck flow when logged out dont go to sign up page
      // User is not authenticated
      navigate(SIGN_IN_PAGE_ROUTE, {
        replace: true,
        state: {
          from: location.pathname,
          error: "Please log in to view your profile",
        },
      });
    }
  }, [isAuthenticated, isLoadingUser, isLoadingAuth, navigate]);

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
    <div className="min-h-screen p-3 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 mb-6 lg:mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 flex-1">
              <div className="relative">
                <img
                  src={profilePic || "/defaultProfilePic.png"}
                  alt="Profile"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-gray-200"
                />
                <button
                  className="absolute bottom-0 right-0 bg-blue-500 
                text-white p-1.5 sm:p-2 rounded-full hover:bg-blue-600 transition-colors"
                >
                  <MdEdit className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-xl sm:text-2xl font-bold mb-2">{user.full_name}</h1>
                <div className="flex flex-col gap-2 text-sm sm:text-base text-gray-600">
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <MdEmail className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="truncate max-w-[200px] sm:max-w-none">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <MdSchool className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="truncate max-w-[200px] sm:max-w-none">{user.university}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center sm:justify-start">
                    <MdDateRange className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>
                      {new Date(user.created_at).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-blue-500 text-white px-3 sm:px-4 py-2 rounded-lg 
              hover:bg-blue-600 transition-colors self-center sm:self-start
              border border-transparent text-sm sm:text-base font-medium w-full sm:w-auto"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 lg:mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Reviews Written</h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-500">
              {user.reviews_count}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Academic Year</h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-500">
              {user.course_year}rd Year
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Degree Program</h3>
            <p className="text-sm sm:text-base text-gray-600">{user.degree}</p>
          </div>
        </div>

        {/* Calendar Section */}
        <div id="schedule" className="mb-6 lg:mb-8">
          <ProfileCalendarSection />
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Reviews Section */}
          <div
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 flex-1"
            id="reviews"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">My Reviews</h2>
            <div className="space-y-4 sm:space-y-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-100 last:border-0 pb-4 sm:pb-6 last:pb-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/course/${review.course_id.id}#reviews`}
                          className="font-medium text-[#646cff] hover:text-[#535bf2] 
                          no-underline"
                        >
                          <h3 className="font-semibold text-base sm:text-lg hover:underline truncate">
                            {review.course_id.code} - {review.course_id.title}
                          </h3>
                        </Link>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Posted on {new Date(review.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div
                        className="bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-full 
                      font-semibold text-xs sm:text-sm self-start sm:self-auto flex-shrink-0"
                      >
                        {review.rating?.overall}/5
                      </div>
                    </div>
                    <h4 className="font-medium text-gray-800 mt-2 text-sm sm:text-base">
                      {review.title}
                    </h4>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                      {review.review}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8 text-sm sm:text-base">
                  You haven't written any reviews yet
                </p>
              )}
            </div>
          </div>

          {/* Liked Courses Section */}
          <div
            className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:p-8 flex-1"
            id="fav-courses"
          >
            <h2 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">Liked Courses</h2>
            <div className="space-y-4 sm:space-y-6">
              {user.liked_courses &&
                user.liked_courses.map((course) => (
                  <div
                    key={course.id}
                    className="border-b border-gray-100 last:border-0 pb-4 sm:pb-6 last:pb-0"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/course/${course.id}`}
                          className="font-medium text-[#646cff] hover:text-[#535bf2] 
                        no-underline"
                        >
                          <h3 className="font-semibold text-base sm:text-lg hover:underline truncate">
                            {course.code} - {course.title}
                          </h3>
                        </Link>
                        <span className="text-gray-600 text-sm sm:text-base">{course.degree.title}</span>
                      </div>
                      {course.rating && (
                        <div className="bg-blue-50 text-blue-700 px-2 sm:px-3 py-1 rounded-full font-semibold text-xs sm:text-sm self-start sm:self-auto flex-shrink-0">
                          {course.rating.overall.toFixed(2)}/5
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              {user.liked_courses && user.liked_courses.length === 0 && (
                <p className="text-gray-500 text-center py-8 text-sm sm:text-base">
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
