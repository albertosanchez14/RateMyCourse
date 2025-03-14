import React, { useState, useEffect } from "react";

import { useCourseReviews } from "../../hooks/useReviews";
import { CourseReviewsType } from "../../types/reviews";

import Comment from "../../components/reviews/Comment";
import WriteReviewForm from "../../components/forms/WriteReviewForm";
import ReviewTypeSelector from "../../components/reviews/ReviewTypeSelector";
import ReviewControls from "../../components/reviews/ReviewControls";

interface CourseCommentSectionProps {
  courseId: string;
  professors: Set<{ id?: string; name?: string } | undefined>;
}

export default function CommentSection({
  courseId,
  professors,
}: CourseCommentSectionProps) {
  // Load comments data now from folder data
  const [commentsType, setCommentsType] = useState<"course" | "professor">(
    "course"
  );
  const [sortDirection, setSortDirection] = useState<{
    date: boolean;
    rating: boolean | undefined;
  }>({
    date: true, // Sort by date descending
    rating: undefined, // Initialize rating as undefined
  });
  const courseComments = useCourseReviews(courseId);
  const [filteredCourseReviews, setFilterdCourseReviews] = useState<
    Array<CourseReviewsType>
  >([]);
  const [showWriteForm, setShowWriteForm] = useState<boolean>(false);

  // Load the couse reviews
  useEffect(() => {
    if (courseComments.data) {
      // Sort by date descending when data initially loads
      const initialComments = [...courseComments.data].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setFilterdCourseReviews(initialComments);
    }
  }, [courseComments.data]);

  // Handle sort button
  const handleButtonSort = (sortType: string) => () => {
    if (!filteredCourseReviews) return;
    setSortDirection((prev) => ({
      ...prev,
      [sortType]:
        sortType === "rating" && prev.rating === undefined
          ? false
          : !prev[sortType as keyof typeof sortDirection],
    }));

    const sortFunctions = {
      date: (a: CourseReviewsType, b: CourseReviewsType) =>
        new Date(a.date).getTime() - new Date(b.date).getTime(),
      rating: (a: CourseReviewsType, b: CourseReviewsType) =>
        a.rating.overall - b.rating.overall,
    };

    const sortFn = sortFunctions[sortType as keyof typeof sortFunctions];
    const ascending =
      sortType === "rating" && sortDirection.rating === undefined
        ? false
        : !sortDirection[sortType as keyof typeof sortDirection];

    const sortedComments = [...filteredCourseReviews].sort((a, b) =>
      ascending ? -sortFn(a, b) : sortFn(a, b)
    );

    setFilterdCourseReviews(sortedComments);
  };

  if (courseComments.isLoading) return <div>Loading...</div>;
  if (courseComments.error)
    return <div>Error: {courseComments.error.message}</div>;
  if (!courseComments.data) return <div>No data</div>;

  return (
    <div className="flex flex-col flex-[3] gap-6 border-t border-[#f0f0f0]">
      <ReviewTypeSelector
        commentsType={commentsType}
        onTypeChange={setCommentsType}
      />

      {/* Course Reviews */}
      <div className="flex flex-col gap-2 rounded-lg">
        {courseComments.data.length !== 0 && (
          <ReviewControls
            sortDirection={sortDirection}
            onSort={handleButtonSort}
            professors={[
              ...new Set(
                courseComments.data.map((comment) => comment.professor)
              ),
            ]}
            onProfessorFilter={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const professor = e.target.value;
              if (professor === "") {
                setFilterdCourseReviews(courseComments.data);
              } else {
                setFilterdCourseReviews(
                  courseComments.data.filter(
                    (comment) => comment.professor === professor
                  )
                );
              }
            }}
          />
        )}

        {/* Course Reviews */}
        {commentsType === "course" && (
          <div className="flex flex-row gap-4">
            <div className="flex flex-col gap-4 flex-1 empty:flex-0">
              {filteredCourseReviews.map((comment: CourseReviewsType) => (
                <Comment
                  key={comment._id}
                  id={comment._id}
                  title={comment.title}
                  date={comment.date}
                  description={comment.review}
                  rating={comment.rating}
                  by={comment.userId}
                  professor={comment.professor}
                />
              ))}
            </div>
            {/* Write Form */}
            <div className="flex flex-col h-fit w-80">
              {showWriteForm ? (
                <WriteReviewForm
                  courseId={courseId}
                  professors={Array.from(
                    new Set(
                      Array.from(professors).map((prof) => prof?.name || "")
                    )
                  )}
                  onSuccess={() => {
                    setShowWriteForm(false);
                    courseComments.refetch();
                  }}
                />
              ) : (
                <div className="flex flex-col gap-6 p-6 rounded-xl border border-[#e0e0e0] bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xl font-bold text-gray-800 text-center">
                    Share Your Experience!
                  </h3>
                  <div className="flex flex-row justify-center items-center gap-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="relative">
                        <input
                          type="radio"
                          id={`rating-${value}`}
                          name="rating"
                          value={value}
                          className="hidden peer"
                          onClick={() => setShowWriteForm(true)}
                        />
                        <label
                          htmlFor={`rating-${value}`}
                          className="flex items-center justify-center w-10 h-10 rounded-full 
                bg-gray-100 hover:bg-gray-200 cursor-pointer
                peer-checked:bg-blue-500 peer-checked:text-white
                transition-all duration-200 font-medium"
                        >
                          {value}
                        </label>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowWriteForm(true)}
                    className="w-full py-3 px-4 bg-blue-500 text-white font-semibold 
          rounded-lg hover:bg-blue-600 active:bg-blue-700 
          transition-colors duration-200 shadow-sm"
                  >
                    Write a Review
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
