import React, { useState, useEffect } from "react";
import {
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdExpandMore,
} from "react-icons/md";

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
      <div className="flex flex-col flex-[3] gap-6">
        {/* Review Type Section */}
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
        {/* Course Reviews */}
        <div className="flex flex-col gap-2 rounded-lg">
          {courseComments.data.length !== 0 && (
            <div className="flex flex-row items-center gap-4">
              <button
                onClick={handleButtonSort("date")}
                className="flex items-center gap-1 p-0 text-gray-700 hover:text-blue-500
                         transition-all duration-200 text-sm font-medium"
              >
                Date
                {sortDirection.date ? (
                  <MdKeyboardArrowDown className="w-5 h-5" />
                ) : (
                  <MdKeyboardArrowUp className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={handleButtonSort("rating")}
                className="flex items-center gap-1 p-0 text-gray-700 hover:text-blue-500
                          transition-all duration-200 text-sm font-medium"
              >
                <span>Rating</span>
                {sortDirection.rating === undefined ? (
                  <span className="w-5 h-5" />
                ) : sortDirection.rating ? (
                  <MdKeyboardArrowDown className="w-5 h-5" />
                ) : (
                  <MdKeyboardArrowUp className="w-5 h-5" />
                )}
              </button>

              <div className="relative">
                <select
                  name="professor"
                  defaultValue=""
                  onChange={handleProfFilter}
                  className="appearance-none w-full px-4 py-2 pr-10 text-gray-700 bg-white border 
              border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 
              transition-all duration-200 text-sm font-medium cursor-pointer 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:border-transparent"
                >
                  <option value="" className="text-gray-700">All Professors</option>
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
                <MdExpandMore className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
              </div>
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
              {/* Write Form */}
              <div className="flex flex-col h-fit w-80 gap-6 p-6 rounded-xl border border-[#e0e0e0] bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
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
                  className="w-full py-3 px-4 bg-blue-500 text-white font-semibold 
                     rounded-lg hover:bg-blue-600 active:bg-blue-700 
                     transition-colors duration-200 shadow-sm"
                >
                  Write a Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
