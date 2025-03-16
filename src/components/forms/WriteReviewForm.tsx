import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { MdClose } from "react-icons/md";

import { addCourseReview, editCourseReview } from "../../hooks/useReviews";
import {
  CourseReviewsType,
  FormCourseReviewType,
  RatingType,
} from "../../types/reviews";

interface WriteReviewFormProps {
  courseId: string;
  professors: string[];
  onSuccess: () => void;
  onClose: () => void; 
  initialData?: CourseReviewsType | null;
}

export default function WriteReviewForm({
  courseId,
  professors,
  onSuccess,
  onClose,
  initialData,
}: WriteReviewFormProps) {
  const { getToken } = useAuth();
  const [rating, setRating] = useState<RatingType>(
    initialData?.rating || {
      easy: 0,
      useful: 0,
      workload: 0,
      overall: 0,
    }
  );
  const [title, setTitle] = useState<string>(initialData?.title || "");
  const [comment, setComment] = useState<string>(initialData?.review || "");
  const [professor, setProfessor] = useState<string>(
    initialData?.professor || ""
  );
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [showProfError, setShowProfError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleRating =
    (field: keyof RatingType) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setRating((prev) => ({
        ...prev,
        [field]: parseInt(e.target.value),
      }));
    };

  const handleComment = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  const handleProfessor = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setProfessor(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (professor === "" && professors.length > 0) {
      setShowProfError(true);
    } else if (rating.overall === 0 || comment === "") {
      setErrorMessage("Please fill in all fields");
    } else {
      try {
        const token = await getToken();
        const review: FormCourseReviewType = {
          professor: professor,
          rating: rating,
          title: title,
          review: comment,
          date: new Date().toISOString(),
        };

        if (initialData?._id) {
          // Update existing review
          await editCourseReview(courseId, initialData._id, review, token);
        } else {
          // Add new review
          await addCourseReview(courseId, review, token);
        }

        setShowSuccess(true);
        setErrorMessage("");

        // Reset the form
        setRating({
          easy: 0,
          useful: 0,
          workload: 0,
          overall: 0,
        });
        setTitle("");
        setComment("");
        setProfessor("");

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error("Failed to submit review:", error);
        if (error instanceof Error) {
          setErrorMessage(
            error.message ===
              "You have already submitted a review for this course"
              ? "You have already submitted a review for this course"
              : "Failed to submit review. Please try again later."
          );
        }
        setShowSuccess(false);
      }
    }
  };

  return (
    <div className="w-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {initialData ? "Edit Review" : "Write a Review"}
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close form"
        >
          <MdClose size={24} className="text-gray-600" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Give your review a title"
            className="w-full p-3 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-gray-50 hover:bg-white transition-colors duration-200"
          />
        </div>

        {["easy", "useful", "workload", "overall"].map((field) => (
          <div key={field} className="space-y-2">
            <label
              htmlFor={field}
              className="block text-sm font-medium text-gray-700 capitalize"
            >
              {field}
            </label>
            <div className="flex space-x-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={`${field}-${num}`} className="relative">
                  <input
                    type="radio"
                    id={`${field}-${num}`}
                    name={field}
                    value={num}
                    checked={rating[field as keyof RatingType] === num}
                    onChange={handleRating(field as keyof RatingType)}
                    className="hidden peer"
                  />
                  <label
                    htmlFor={`${field}-${num}`}
                    className="flex items-center justify-center w-10 h-10 rounded-full 
                     bg-gray-100 hover:bg-gray-200 cursor-pointer
                     peer-checked:bg-blue-500 peer-checked:text-white
                     transition-all duration-200 font-medium
                     border-2 border-transparent peer-checked:border-blue-600
                     shadow-sm hover:shadow-md"
                  >
                    {num}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Professor Select */}
        {professors.length > 0 && (
          <div className="space-y-2">
            <label
              htmlFor="professor"
              className="block text-sm font-semibold text-gray-700"
            >
              Professor
            </label>
            <select
              id="professor"
              name="professor"
              value={professor}
              onChange={handleProfessor}
              className="w-full p-3 border border-gray-300 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                bg-gray-50 hover:bg-white transition-colors duration-200"
            >
              <option value="">Select a professor</option>
              {professors.map((prof) => (
                <option key={prof} value={prof}>
                  {prof}
                </option>
              ))}
            </select>
            {showProfError && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <span className="mr-1">⚠️</span> Please select a professor
              </p>
            )}
          </div>
        )}

        {/* Comment Textarea */}
        <div className="space-y-2">
          <label
            htmlFor="comment"
            className="block text-sm font-semibold text-gray-700"
          >
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            value={comment}
            onChange={handleComment}
            placeholder="Share your experience..."
            className="w-full p-4 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                     bg-gray-50 hover:bg-white transition-colors duration-200
                     h-40 resize-none"
          />
        </div>

        {errorMessage && (
          <p className="text-red-500 text-sm flex items-center justify-center">
            <span className="mr-1">⚠️</span> {errorMessage}
          </p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg
                   hover:bg-blue-700 focus:outline-none focus:ring-2 
                   focus:ring-blue-500 focus:ring-offset-2
                   transition-all duration-200 font-semibold
                   hover:shadow-lg active:scale-95"
        >
          {initialData ? "Update Review" : "Submit Review"}
        </button>

        {showSuccess && (
          <div className="flex items-center justify-center text-green-500 font-medium">
            <span className="mr-2">✅</span>
            {initialData
              ? "Review updated successfully!"
              : "Review submitted successfully!"}
          </div>
        )}
      </form>
    </div>
  );
}
