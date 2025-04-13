import { useRef, useState, useEffect } from "react";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";

import { useAuth } from "../../hooks/useAuth";
import { RatingType } from "../../types/reviews";

import RectangleChart from "../charts/RectangleChart";
import ConfirmationModal from "../common/ConfirmationModal";
import ReviewActionsMenu from "./ReviewActionsMenu";
import { useReviewVote } from "../../hooks/useLike";

interface ReviewProps {
  id: string;
  title: string;
  date: string;
  description: string;
  rating: RatingType;
  by: string;
  userId: string;
  professor?: string;
  onEdit?: () => void;
  onDelete?: (id: string) => void;
}

export default function Review({
  id,
  title,
  date,
  description,
  rating,
  by,
  userId,
  professor,
  onEdit,
  onDelete,
}: ReviewProps) {
  const { user } = useAuth();
  const ratingContainerRef = useRef<HTMLDivElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  // State variables for like/dislike functionality
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [dislikeAnimating, setDislikeAnimating] = useState(false);
  // Use the voting hook
  const {
    likes: likeCount,
    dislikes: dislikeCount,
    isUserLiked,
    isUserDisliked,
    handleLike,
    handleDislike,
    isLoading: isLoadingVotes,
  } = useReviewVote(id);

  const printableDate = new Date(date)
    .toDateString()
    .split(" ")
    .slice(1)
    .join(" ");

  // useEffect hooks for handling animations
  useEffect(() => {
    if (likeAnimating) {
      const timer = setTimeout(() => setLikeAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [likeAnimating]);

  useEffect(() => {
    if (dislikeAnimating) {
      const timer = setTimeout(() => setDislikeAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [dislikeAnimating]);

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(id);
    }
    setShowDeleteModal(false);
  };

  const handleReportClick = () => {
    alert("Review reported!"); //TODO: Replace with actual report logic
  };

  const handleLikeClick = () => {
    if (!user || user.userId === userId) return;

    // Trigger animation
    setLikeAnimating(true);
    handleLike();
  };

  const handleDislikeClick = () => {
    if (!user || user.userId === userId) return;

    // Trigger animation
    setDislikeAnimating(true);
    handleDislike();
  };

  return (
    <div
      className="flex flex-col gap-6 p-4 pb-2 bg-white border border-gray-200 
      rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
      key={`review-${id}`}
      id={`review-${id}`}
    >
      {/* Profile Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={"/defaultProfilePic.png"}
              alt="profile"
              className="w-12 h-12 rounded-full border-2 
              border-gray-100 shadow-sm"
            />
            <div
              className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 
            rounded-full border-2 border-white"
            ></div>
          </div>
          <div className="flex flex-col">
            <span
              className="font-semibold text-gray-800 hover:text-blue-600 
            transition-colors cursor-pointer"
            >
              {by}
            </span>
            <span className="text-gray-400 text-sm">{printableDate}</span>
          </div>
        </div>
        {user && (
          <ReviewActionsMenu
            onEdit={onEdit || (() => {})}
            onDelete={handleDeleteClick}
            onReport={handleReportClick}
            isAuth={user.userId === userId}
          />
        )}
      </div>

      {/* Comment Section */}
      <div className="flex flex-col h-full flex-[2] space-y-3">
        <h3 className="font-bold text-xl text-gray-800 mb-0.5">{title}</h3>
        <div className="flex gap-2">
          <div className="flex flex-col h-full flex-[2] space-y-3">
            <p className="text-gray-600 leading-relaxed text-[0.95rem]">
              {description}
            </p>
          </div>
          <div
            className="flex flex-col flex-1 gap-4 rounded-lg"
            ref={ratingContainerRef}
          >
            {Object.keys(rating).map(
              (key) =>
                key !== "_id" && (
                  <div key={key} className="flex items-center gap-3 group">
                    <div className="flex flex-1 justify-end">
                      <h4
                        className="font-medium text-gray-700 
                      group-hover:text-blue-600 transition-colors"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </h4>
                    </div>
                    <div className="flex flex-[2]">
                      <RectangleChart
                        rating={rating[key as keyof RatingType] as number}
                      />
                    </div>
                  </div>
                )
            )}
          </div>
        </div>

        {/* Feedback Section */}
        <div className="flex items-center pt-2 border-t border-gray-100">
          <div className="flex gap-4 items-center">
            <button
              onClick={handleLikeClick}
              disabled={!user || user.userId === userId || isLoadingVotes}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full 
        transition-all duration-300 ${
          isUserLiked
            ? "text-blue-600 border border-blue-200"
            : "text-gray-500 hover:bg-gray-50 border border-transparent"
        } ${
                !user || user.userId === userId || isLoadingVotes
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer"
              } ${
                likeAnimating ? "transform scale-110" : "transform scale-100"
              }`}
            >
              <FaRegThumbsUp className="h-4 w-4" />
              <span className="text-sm font-medium w-1 text-center">
                {likeCount}
              </span>
            </button>

            <button
              onClick={handleDislikeClick}
              disabled={!user || user.userId === userId || isLoadingVotes}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full 
        transition-all duration-300 ${
          isUserDisliked
            ? "text-red-600 border border-red-200"
            : "text-gray-500 hover:bg-gray-50 border border-transparent"
        } ${
                !user || user.userId === userId || isLoadingVotes
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer"
              } ${
                dislikeAnimating ? "transform scale-110" : "transform scale-100"
              }`}
            >
              <FaRegThumbsDown className="h-4 w-4" />
              <span className="text-sm font-medium w-1 text-center">
                {dislikeCount}
              </span>
            </button>

            {!user && (
              <span className="text-xs text-gray-400">
                Sign in to provide feedback
              </span>
            )}
          </div>

          {professor && (
            <div className="flex items-center h-fit gap-2 ml-auto">
              <span className="text-gray-400 text-sm">Taught by</span>
              <a
                href=""
                className="text-blue-500 hover:text-blue-700 
                text-sm transition-colors"
              >
                {professor}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Delete Review"
        message="Are you sure you want to delete your review? 
        This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
