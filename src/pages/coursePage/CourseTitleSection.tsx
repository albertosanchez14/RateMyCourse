import { useState } from "react";
import { useUser } from "../../hooks/useUser";
import {
  useIsCourseLiked,
  useLikeCourse,
  useUnlikeCourse,
} from "../../hooks/useUser";
import { IoMdHeart } from "react-icons/io";
import { IoMdHeartEmpty } from "react-icons/io";
import LoginModal from "../../components/auth/LoginModal";

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
  const { data: isLiked = false } = useIsCourseLiked(id);

  // Get the mutation functions from hooks
  const likeMutation = useLikeCourse();
  const unlikeMutation = useUnlikeCourse();
  const isLoading = likeMutation.isPending || unlikeMutation.isPending;
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
  };

  const handleLikeCourse = async () => {
    if (isLoading) return;

    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!isLiked) {
      likeMutation.mutate(id);
    } else {
      unlikeMutation.mutate(id);
    }
  };

return (
    <div className="flex flex-col self-start mt-4 px-4 sm:px-0">
      <div className="flex flex-row items-end gap-2 flex-wrap sm:flex-nowrap">
        <h1 className="text-3xl sm:text-5xl font-semibold mb-0 leading-tight">{title}</h1>
        <p className="text-lg sm:text-2xl mb-0 whitespace-nowrap">({course})</p>
        <div
          onClick={handleLikeCourse}
          className="cursor-pointer transition-transform hover:scale-110 ml-auto sm:ml-0"
        >
          {isLiked ? (
            <IoMdHeart size={28} className="text-red-500 hover:text-red-600 sm:w-8 sm:h-8" />
          ) : (
            <IoMdHeartEmpty size={28} className="hover:text-gray-700 sm:w-8 sm:h-8" />
          )}
        </div>
      </div>
      <span className="mt-2 text-sm sm:text-base">{degree.title}</span>
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
