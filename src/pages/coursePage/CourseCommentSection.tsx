import React, { useEffect, useState } from "react";

import {
  useCourseReviews,
  useProfessorsComments,
} from "../../hooks/useComents";
import {
  CourseReviewsType,
  CommentProfessorType,
  Professor,
} from "../../types/comments_type";

import Comment from "../../components/comments/Comment";
import ProfessorCommentCard from "../../components/comments/ProfessorCommentCard";

interface CourseCommentSectionProps {
  course_code: number;
  professors: Set<{ id?: string; name?: string } | undefined>;
}

export default function CommentSection({
  course_code,
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
  const courseComments = useCourseReviews(course_code);
  const [filteredCourseReviews, setFilterdCourseReviews] = useState<
    Array<CourseReviewsType>
  >([]);

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

  // Handle comments type
  const handleCommentsType = (e: React.MouseEvent<HTMLDivElement>) => {
    const types = document.getElementsByClassName("course-comments-type-title");
    for (let i = 0; i < types.length; i++) {
      types[i].id = "unselected";
    }
    e.currentTarget.id = "selected";
    e.currentTarget.textContent === "Course Reviews"
      ? setCommentsType("course")
      : setCommentsType("professor");
  };

  // Handle professor filter
  const handleProfFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const professor = e.target.value;
    if (courseComments.data) {
      if (professor === "") {
        setFilterdCourseReviews(courseComments.data);
      } else {
        const filteredComments = courseComments.data.filter(
          (comment) => comment.professor === professor
        );
        setFilterdCourseReviews(filteredComments);
      }
    }
  };

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
    <div className="flex flex-row gap-4 border-t border-[#f0f0f0]">
      <div className="flex flex-col flex-[3] gap-4">
        <div className="flex flex-row gap-6">
          <div>
            <h3
              className={`text-lg font-semibold m-2 cursor-pointer transition-opacity hover:opacity-100 ${
                commentsType === "course" ? "opacity-100" : "opacity-30"
              }`}
              onClick={handleCommentsType}
            >
              Course Reviews
            </h3>
          </div>
          <div>
            <h3
              className={`text-lg font-semibold m-2 cursor-pointer transition-opacity hover:opacity-100 ${
                commentsType === "professor" ? "opacity-100" : "opacity-30"
              }`}
              onClick={handleCommentsType}
            >
              Profesor Reviews
            </h3>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-lg">
          {courseComments.data.length !== 0 && (
            <div className="flex flex-row gap-4">
              <button onClick={handleButtonSort("date")}>
                Date {sortDirection.date ? "↓" : "↑"}
              </button>
              <button onClick={handleButtonSort("rating")}>
                Rating{" "}
                {sortDirection.rating === undefined
                  ? ""
                  : sortDirection.rating
                  ? "↓"
                  : "↑"}
              </button>
              <select
                name="professor"
                defaultValue=""
                onChange={handleProfFilter}
              >
                <option value="">All Professors</option>
                {[
                  ...new Set(
                    courseComments.data.map((comment) => comment.professor)
                  ),
                ].map((professor: string, index: number) => (
                  <option key={index} value={professor}>
                    {professor}
                  </option>
                ))}
              </select>
            </div>
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
                    by={comment.user_id}
                    professor={comment.professor}
                  />
                ))}
              </div>
              <div className="flex flex-col h-fit w-60 gap-4 p-4 rounded-lg border border-[#e0e0e0]">
                <h3 className="m-0">Share Your Experience!</h3>
                <div className="flex flex-row justify-center gap-4">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value}>
                      <label>
                        {value}
                        <input type="radio" name="rating" value={value} />
                      </label>
                    </div>
                  ))}
                </div>
                <button>Write a Review</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
