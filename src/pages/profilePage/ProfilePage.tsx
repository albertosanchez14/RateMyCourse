import { useState } from "react";
import { Link } from "react-router-dom";
import { MdEdit, MdSchool, MdEmail, MdDateRange } from "react-icons/md";

import { useUserCourseReviews } from "../../hooks/useReviews";
import { useUser } from "../../hooks/useUser";

import { EditProfileModal } from "./EditProfileModal";

export default function ProfilePage() {
  const {
    data: reviews,
    isLoading: isLoadingRev,
    error: errorRev,
  } = useUserCourseReviews();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { data: user, isLoading: isLoadingUser, error: errorUser } = useUser();

  const handleSaveProfile = async (userData: {
    name: string;
    yearOfStudy: number;
    degree: string;
    university: string;
  }) => {
    // TODO: Implement API call to update user data
    console.log("Saving user data:", userData);
    setIsEditModalOpen(false);
  };

  if (isLoadingRev || isLoadingUser) return <div>Loading...</div>;
  if (errorRev || errorUser)
    return <div>Error: {errorRev?.message || errorUser?.message}</div>;
  if (!reviews || !user) return <div>No data</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src="/blank-profile-picture.png"
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-gray-200"
                />
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                  <MdEdit className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">{user.name}</h1>
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
                    {new Date(user.joinDate).toLocaleDateString("en-US", {
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
              user={user}
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onSave={handleSaveProfile}
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Reviews Written</h3>
            <p className="text-3xl font-bold text-blue-500">
              {user.reviewsCount}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Academic Year</h3>
            <p className="text-3xl font-bold text-blue-500">
              {user.yearOfStudy}rd Year
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-2">Degree Program</h3>
            <p className="text-base text-gray-600">{user.degree}</p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <h2 className="text-xl font-bold mb-6">My Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Link
                      to={`/course/${review.course_id._id}#reviews`}
                    >
                      <h3 className="font-semibold text-lg">
                        {review.course_id.title}
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
      </div>
    </div>
  );
}
