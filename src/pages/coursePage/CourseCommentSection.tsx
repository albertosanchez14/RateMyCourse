import React, { useState, useEffect } from "react";

import { useAuth } from "../../hooks/useAuth";
import { useCourseReviews } from "../../hooks/useReviews";
import { CourseReviewsType } from "../../types/reviews";

import WriteFormSection from "./WriteFormSection";
import Review from "../../components/reviews/Review";
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
  const { user } = useAuth();
  const [userHasReview, setUserHasReview] = useState(false);
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
  const [editingReview, setEditingReview] = useState<CourseReviewsType | null>(
    null
  );

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

  // Check if user has already reviewed the course
  useEffect(() => {
    if (courseComments.data && user) {
      const hasReview = courseComments.data.some(
        (comment) => comment.userId === user.userId
      );
      setUserHasReview(hasReview);
    }
  }, [courseComments.data, user]);

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
                <div key={comment._id} className="relative">
                  {user && comment.userId === user.userId && (
                    <div className="absolute -top-3 -right-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                      Your Review
                    </div>
                  )}
                  <Review
                    id={Number(comment._id)}
                    title={comment.title}
                    date={comment.date}
                    description={comment.review}
                    rating={comment.rating}
                    by={comment.username}
                    professor={comment.professor}
                    onEdit={() => {
                      setEditingReview(comment);
                      setShowWriteForm(true);
                    }}
                  />
                </div>
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
                  initialData={editingReview}
                />
              ) : userHasReview ? (
                <div className="flex flex-col gap-4 p-6 rounded-xl border border-[#e0e0e0] bg-white">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-800 mb-2">
                      Thanks for Your Review!
                    </div>
                    <p className="text-gray-600 text-sm">
                      You've already shared your experience with this course.
                      You can find your review at the top.
                    </p>
                  </div>
                </div>
              ) : (
                <WriteFormSection setShowWriteForm={setShowWriteForm} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
