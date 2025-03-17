import { useState } from "react";
import { MdNotifications, MdDarkMode, MdLock, MdDelete } from "react-icons/md";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: false,
    publicProfile: true,
  });

  const handleSettingChange = (setting: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  console.log(settings);

  return (
    <div className="min-h-screen pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Settings</h1>

        {/* Notifications Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MdNotifications className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Email notifications</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer h-6 w-11 cursor-pointer appearance-none rounded-full border border-gray-300 
                    bg-gray-200 transition-colors checked:border-blue-500 checked:bg-blue-500"
                  checked={settings.emailNotifications}
                  onChange={() => handleSettingChange("emailNotifications")}
                />
                <span
                  className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white 
                  transition-transform peer-checked:translate-x-5"
                />
              </div>
            </label>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MdDarkMode className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold">Appearance</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Dark mode</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer h-6 w-11 cursor-pointer appearance-none rounded-full border border-gray-300 
                    bg-gray-200 transition-colors checked:border-blue-500 checked:bg-blue-500"
                  checked={settings.darkMode}
                  onChange={() => handleSettingChange("darkMode")}
                />
                <span
                  className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white 
                  transition-transform peer-checked:translate-x-5"
                />
              </div>
            </label>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <MdLock className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold">Privacy</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-gray-700">Public profile</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="peer h-6 w-11 cursor-pointer appearance-none rounded-full border border-gray-300 
                    bg-gray-200 transition-colors checked:border-blue-500 checked:bg-blue-500"
                  checked={settings.publicProfile}
                  onChange={() => handleSettingChange("publicProfile")}
                />
                <span
                  className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white 
                  transition-transform peer-checked:translate-x-5"
                />
              </div>
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="flex items-center gap-3 mb-6">
            <MdDelete className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold text-red-500">Danger Zone</h2>
          </div>
          <div className="space-y-4">
            <button
              className="px-4 py-2 text-red-500 border border-red-500 rounded-lg 
                hover:bg-red-50 transition-colors duration-200"
              onClick={() => {
                // TODO: Implement account deletion
                console.log("Delete account clicked");
              }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
