import { useNavigate } from "react-router-dom";
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";

import { useUser } from "../../hooks/useUser";
import { useIsCourseLiked, useLikeCourse, useUnlikeCourse } from "../../hooks/useUser";

import { DegreeType } from "../../types/course";

interface CourseTitleSectionProps {
  id: string;
  title: string;
  course: number;
  degree: DegreeType;
}

export default function CourseTitleSection({
  id,
  title,
  course,
  degree,
}: CourseTitleSectionProps) {
  const { data: user } = useUser();
  const navigate = useNavigate();
  const { data: isLiked = false } = useIsCourseLiked(id);
  
  // Get the mutation functions from hooks
  const likeMutation = useLikeCourse();
  const unlikeMutation = useUnlikeCourse();
  const isLoading = likeMutation.isPending || unlikeMutation.isPending;

  const handleLikeCourse = async () => {
    if (isLoading) return;

    if (!user) {
      const wantsToLogin = window.confirm(
        "Please log in to like this course. Would you like to log in now?"
      );
      if (wantsToLogin) {
        navigate("/login");
      }
      return;
    }
    if (!isLiked) {
      likeMutation.mutate(id);
    } else {
      unlikeMutation.mutate(id);
    }
  };

  return (
    <div className="flex flex-col self-start mt-4">
      <div className="flex flex-row items-end gap-2">
        <h1 className="text-5xl font-semibold mb-0">{title}</h1>
        <p className="text-2xl mb-0">({course})</p>
        <div
          onClick={handleLikeCourse}
          className="cursor-pointer transition-transform hover:scale-110"
        >
          {isLiked ? (
            <IoMdHeart size={32} className="text-red-500 hover:text-red-600" />
          ) : (
            <IoMdHeartEmpty size={32} className="hover:text-gray-700" />
          )}
        </div>
      </div>
      <span className="mt-2">{degree.title}</span>
    </div>
  );
}
