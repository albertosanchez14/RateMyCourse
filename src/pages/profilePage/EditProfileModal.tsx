import React, { useState } from "react";

import { MdClose, MdExpandMore } from "react-icons/md";

import useDegrees from "../../hooks/useDegrees";

interface EditProfileModalProps {
  user: {
    full_name: string;
    yearOfStudy: number;
    degree: string;
    university: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSave: (userData: {
    yearOfStudy: number;
    degree: string;
    university: string;
  }) => void;
  isLoading?: boolean;
  error?: string | null;
}

export default function EditProfileModal({
  user,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  error = null,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    yearOfStudy: user.yearOfStudy,
    degree: user.degree,
    university: user.university,
  });
  const { data: degrees, isLoading: isLoadingDegrees } = useDegrees(
    formData.university
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-sm bg-black/30 z-50 
    flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close form"
              disabled={isLoading}
            >
              <MdClose className="text-gray-600 text-xl" />
            </button>
          </div>
          {/* Display error message if present */}
          {error && (
            <div
              className="mt-4 p-3 bg-red-50 border border-red-200 
            text-red-700 rounded-md"
            >
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                University
              </label>
              <div className="relative">
                <select
                  name="university"
                  value={formData.university}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 appearance-none"
                  required
                >
                  <option value="">Select your university</option>
                  <option value="University Carlos III of Madrid">
                    University Carlos III of Madrid
                  </option>
                </select>
                <div
                  className="absolute inset-y-0 right-0 flex items-center 
                pr-2 pointer-events-none"
                >
                  <MdExpandMore className="text-gray-400" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Degree</label>
              <div className="relative">
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 appearance-none"
                  required
                >
                  <option value="">Select your degree</option>
                  {isLoadingDegrees ? (
                    <option>Loading degrees...</option>
                  ) : (
                    degrees?.map((degree, index) => (
                      <option key={index} value={degree}>
                        {degree}
                      </option>
                    ))
                  )}
                </select>
                <div
                  className="absolute inset-y-0 right-0 flex items-center 
                pr-2 pointer-events-none"
                >
                  <MdExpandMore className="text-gray-400" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Year of Study
              </label>
              <div className="relative">
                <select
                  name="yearOfStudy"
                  value={formData.yearOfStudy}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 appearance-none"
                  required
                >
                  <option value="">Select your year</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                  <option value="Graduate">Graduate</option>
                </select>
                <div
                  className="absolute inset-y-0 right-0 flex items-center 
                pr-2 pointer-events-none"
                >
                  <MdExpandMore className="text-gray-400" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-300 px-4 py-2 rounded-lg"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
                  isLoading
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
