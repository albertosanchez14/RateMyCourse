import { useNavigate } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { GrConfigure } from "react-icons/gr";
import { MdOutlineRateReview } from "react-icons/md";
import { IoMdHeart } from "react-icons/io";
import { MdLogout } from "react-icons/md";

import { useAuth } from "../../hooks/useAuth";
import { PROFILE_PAGE_ROUTE } from "../../Routes";

interface HeroPopUpProps {
  onClose: () => void;
}

export default function HeroPopUp({ onClose }: HeroPopUpProps) {
  const { user, signOut } = useAuth();
  console.log(user);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    onClose();
  };

  const goToProfile = (extension: string) => {
    if (extension.startsWith('#')) {
      console.log('scrolling to', extension);
      navigate(PROFILE_PAGE_ROUTE);
      setTimeout(() => {
        const element = document.getElementById(extension.substring(1));
        element?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      navigate(PROFILE_PAGE_ROUTE + extension);
    }
    onClose();
  };

  return (
    <div className="absolute right-0 w-72 bg-white rounded-lg shadow-lg border 
    border-gray-200 transform transition-all duration-200 ease-out 
    opacity-100 scale-100 z-[9999]"
    >
      {/* User Info Section */}
      <div className="px-4 py-3 border-b border-gray-200">
        <p className="font-medium text-gray-900">{user?.username || "User"}</p>
        {user?.emailAddresses?.map((email, index) => (
          <p key={index} className="text-sm text-gray-500">
            {email.emailAddress}
          </p>
        ))}
      </div>

      {/* Menu Items */}
      <div className="">
        <button
          onClick={() => goToProfile("")}
          className="w-full text-left text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <CgProfile className="w-5 h-5 ml-2 mr-3" />
          Your Profile
        </button>

        <button
          onClick={() => goToProfile("#reviews")}
          className="w-full text-left text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <MdOutlineRateReview className="w-5 h-5 ml-2 mr-3" />
          Your Reviews
        </button>

        <button
          onClick={() => goToProfile("#fav-courses")}
          className="w-full text-left text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <IoMdHeart className="w-5 h-5 ml-2 mr-3"/>
          Favourite Courses
        </button>

        <button
          onClick={() => goToProfile("/settings")}
          className="w-full text-left text-gray-700 hover:bg-gray-100 flex items-center"
        >
          <GrConfigure className="w-5 h-5 ml-2 mr-3" />
          Settings
        </button>

        <div className="border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full text-left text-red-600 hover:bg-red-50 flex items-center"
          >
            <MdLogout className="w-5 h-5 ml-2 mr-3" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
