import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SignUpForm, { FormData, FormErrors } from "../signUpPage/SignUpForm";
import useDegrees from "../../hooks/useDegrees";
import supabase from "../../utils/supabaseClient";

export default function ProfileSetUpPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    courseYear: "",
    university: "",
    degree: "",
  });
  const { data: degrees, isLoading: isLoadingDegrees } = useDegrees(
    formData.university
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Always stay on step 2 for this page
  const currentStep = 2;
  const totalSteps = 2; // Only one step for this page

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateAcademicInfo = (): FormErrors => {
    const newErrors: FormErrors = {};
    if (!formData.university.trim())
      newErrors.university = "University is required";
    if (!formData.degree.trim()) newErrors.degree = "Degree is required";
    if (!formData.courseYear.trim())
      newErrors.courseYear = "Course year is required";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validateAcademicInfo();
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      // Get current user session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const fullName = session.user.user_metadata?.name || "";
        const nameParts = fullName.split(" ");
        const firstName =
          formData.firstName.trim() ||
          (nameParts.length > 0
            ? nameParts[0].charAt(0).toUpperCase() +
              nameParts[0].slice(1).toLowerCase()
            : "No First Name");
        const lastName =
          formData.lastName.trim() ||
          (nameParts.length > 1
            ? nameParts
                .slice(1)
                .map(
                  (word: string) =>
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                )
                .join(" ")
            : "No Last Name");
        // Update user profile with academic information
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`,
            user_id: session.user.id,
            email: session.user.email || "",
            university: formData.university,
            degree: formData.degree,
            course_year: formData.courseYear,
          })
          .eq("user_id", session.user.id);

        if (profileError) {
          console.error("Error saving profile:", profileError);
          setErrors({ general: "Failed to save your profile information." });
          return;
        }

        setSuccessMessage("Profile updated successfully!");
        // Redirect after successful update
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      } else {
        setErrors({
          general: "You need to be signed in to update your profile.",
        });
      }
    } catch (err) {
      console.error("Unexpected error during profile update:", err);
      setErrors({
        general: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // These are required by the SignUpForm component but not used in this context
  const handleNextStep = () => {};
  const handlePrevStep = () => {};
  const handleStepClick = () => {};
  const handleGoogleSignUp = () => {};

  // Load user data if available
  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // Get existing profile data
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single();

        if (profileData) {
          setFormData({
            firstName: profileData.first_name || "",
            lastName: profileData.last_name || "",
            email: session.user.email || "",
            password: "password-not-required",
            confirmPassword: "password-not-required",
            university: profileData.university || "",
            degree: profileData.degree || "",
            courseYear: profileData.course_year || "",
          });
        } else {
          // Pre-fill name and email from auth data if available
          setFormData({
            firstName: session.user.user_metadata?.first_name || "",
            lastName: session.user.user_metadata?.last_name || "",
            email: session.user.email || "",
            password: "password-not-required",
            confirmPassword: "password-not-required",
            university: "",
            degree: "",
            courseYear: "",
          });
        }
      } else {
        // Redirect to login if no session
        navigate("/login");
      }
    };

    loadUserData();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Complete Your Profile
        </h1>
        <p className="text-lg text-gray-600">
          Please provide your academic information
        </p>
      </div>

      <div className="flex flex-col bg-white py-8 px-6 rounded-lg shadow-md w-full max-w-md">
        {successMessage ? (
          <div className="text-center p-4">
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
              {successMessage}
            </div>
            <p className="text-gray-600">Redirecting you to the homepage...</p>
          </div>
        ) : (
          <SignUpForm
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            isGoogleAuth={false}
            isLoadingDegrees={isLoadingDegrees}
            degrees={degrees}
            currentStep={currentStep}
            totalSteps={totalSteps}
            onChange={handleChange}
            onPrevStep={handlePrevStep}
            onNextStep={handleNextStep}
            onStepClick={handleStepClick}
            onSubmit={handleSubmit}
            onGoogleSignUp={handleGoogleSignUp}
          />
        )}
      </div>
    </div>
  );
}
