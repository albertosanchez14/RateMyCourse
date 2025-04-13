import { useEffect, useState, useRef } from "react";

import { useAuth } from "../../hooks/useAuth";

import { downloadProfilePicture } from "../../utils/downloadProfilePic";

import HeroPopUp from "./HeroPopUp";

export default function HeroImage() {
  const user = useAuth();
  const [profilePic, setProfilePic] = useState<string>(() => {
    if (!user.user?.userId) return "";
    return localStorage.getItem(`profilePic_${user.user.userId}`) || "";
  });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Download the profile picture if we don't have it in state
  useEffect(() => {
    async function checkAndDownloadImage() {
      if (!user?.id || !user?.avatar_url) {
        setProfilePic("/defaultProfilePic.png");
        return;
      }
      const localStorageKey = `profilePic_${user.id}`;
      // Only download if we don't have the image in state
      if (!profilePic) {
        const base64Image = await downloadProfilePicture(user.avatar_url);
        if (base64Image) {
          localStorage.setItem(localStorageKey, base64Image);
          setProfilePic(base64Image);
        }
      }
    }

    checkAndDownloadImage();
  }, [user, profilePic]);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsPopupOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-[19]" ref={popupRef}>
      <button
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className="flex justify-center items-center focus:outline-none"
      >
        {profilePic ? (
          <img
          src={profilePic}
            alt="Profile"
            className="h-[40px] w-[40px] rounded-full 
            hover:ring-2 hover:ring-blue-500 transition-all"
            loading="eager"
          />
        ) : (
          <div
            className="h-[40px] w-[40px] bg-gray-300 
          rounded-full hover:ring-2 hover:ring-blue-500 
          transition-all"
          />
        )}
      </button>

      <div
        className={`${
          isPopupOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        } 
        absolute right-0 top-14 transform transition-all duration-200 ease-out`}
      >
        {isPopupOpen && <HeroPopUp onClose={() => setIsPopupOpen(false)} />}
      </div>
    </div>
  );
}
