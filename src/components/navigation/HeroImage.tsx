import { useEffect, useState } from "react";

import { useAuth } from "../../hooks/useAuth";

import { downloadProfilePicture } from "../../utils/downloadProfilePic";

export default function HeroImage() {
  const user = useAuth();
  const [profilePic, setProfilePic] = useState<string>(() => {
    if (!user.user?.userId) return "";
    return localStorage.getItem(`profilePic_${user.user.userId}`) || "";
  });

  // Download the profile picture if we don't have it in state
  useEffect(() => {
    async function checkAndDownloadImage() {
      if (!user?.user?.userId || !user.user?.imageUrl) return;
      const localStorageKey = `profilePic_${user.user.userId}`;
      // Only download if we don't have the image in state
      if (!profilePic) {
        const base64Image = await downloadProfilePicture(user.user.imageUrl);
        if (base64Image) {
          localStorage.setItem(localStorageKey, base64Image);
          setProfilePic(base64Image);
        }
      }
    }

    checkAndDownloadImage();
  }, [user, profilePic]);

  return (
    <div className="flex justify-center items-center">
      {profilePic ? (
        <img
          src={profilePic}
          alt="Profile"
          className="h-[40px] w-[40px] rounded-full"
          loading="eager"
        />
      ) : (
        <div className="h-[40px] w-[40px] bg-gray-300 rounded-full" />
      )}
    </div>
  );
}
