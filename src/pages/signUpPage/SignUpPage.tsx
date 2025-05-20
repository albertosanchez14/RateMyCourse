import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import useDegrees from "../../hooks/useDegrees";
import supabase from "../../utils/supabaseClient";
import { SIGN_IN_PAGE_ROUTE } from "../../Routes";
import SignUpForm from "./SignUpForm";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  courseYear: string;
  university: string;
  degree: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  courseYear?: string;
  university?: string;
  degree?: string;
  general?: string;
}

export default function SignUpPage() {
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
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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

  const validateStep = (step: number): FormErrors => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      // Personal information validation
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid";
      }
    } else if (step === 2) {
      // Academic information validation
      if (!formData.university.trim())
        newErrors.university = "University is required";
      if (!formData.degree.trim()) newErrors.degree = "Degree is required";
      if (!formData.courseYear.trim())
        newErrors.courseYear = "Course year is required";
    } else if (step === 3) {
      // Password validation
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    return newErrors;
  };

  const validate = (): FormErrors => {
    // Full validation for submission
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.university.trim())
      newErrors.university = "University is required";
    if (!formData.degree.trim()) newErrors.degree = "Degree is required";
    if (!formData.courseYear.trim())
      newErrors.courseYear = "Course year is required";

    return newErrors;
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

  const handleGoogleSignUp = async () => {
    try {
      const redirectBaseUrl =
        import.meta.env.VITE_ENV === "production"
          ? import.meta.env.VITE_URL_PROD
          : import.meta.env.VITE_URL_DEV;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${redirectBaseUrl}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });
      console.log("Google auth error:", error);
      if (error) {
        console.error("Google auth error:", error);
        setErrors({
          general: "Failed to authenticate with Google. Please try again.",
        });
      }
    } catch (err) {
      console.error("Unexpected error during Google sign-up:", err);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    }
  };

  const handleNextStep = () => {
    const validationErrors = validateStep(currentStep);
    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleStepClick = (step: number) => {
    // Allow going to previous steps freely
    if (step < currentStep) {
      setCurrentStep(step);
      return;
    }

    // For forward navigation, validate current step first
    const validationErrors = validateStep(currentStep);
    if (Object.keys(validationErrors).length === 0) {
      setCurrentStep(step);
    } else {
      setErrors(validationErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (currentStep !== totalSteps && !isGoogleAuth) {
      handleNextStep();
      return;
    }

    // For Google auth, we only need to validate academic information
    const validationErrors = isGoogleAuth ? validateAcademicInfo() : validate();

    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      if (isGoogleAuth) {
        // For Google auth, we just need to save profile info
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Update additional user data in profiles table
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              first_name: formData.firstName,
              last_name: formData.lastName,
              full_name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              course_year: formData.courseYear,
              university: formData.university,
              degree: formData.degree,
            })
            .eq("user_id", session.user.id);

          if (profileError) {
            console.error("Error saving profile:", profileError);
            setErrors({ general: "Failed to save your profile information." });
            return;
          }

          setSuccessMessage(
            "Sign-up successful! You can now use RateMyCourse."
          );
        } else {
          setErrors({
            general: "Session expired. Please try signing up again.",
          });
        }
      } else {
        // Get redirectUrl based on environment
        const redirectBaseUrl =
          import.meta.env.VITE_ENV === "production"
            ? import.meta.env.VITE_URL_PROD
            : import.meta.env.VITE_URL_DEV;
        // Regular email/password sign-up flow
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              full_name: `${formData.firstName} ${formData.lastName}`,
              course_year: formData.courseYear,
              university: formData.university,
              degree: formData.degree,
            },
            emailRedirectTo: `${redirectBaseUrl}/auth/callback`,
          },
        });

        if (error) {
          console.error("Detailed error:", error);
          if (error.message.includes("Database error")) {
            setErrors({
              general:
                "Unable to create account. Please try again later or contact tech@ratemycourse.com if the problem persists.",
            });
          } else {
            setErrors({ general: error.message });
          }
          return;
        }

        // Check if email confirmation is required
        if (data?.user?.identities?.length === 0) {
          setSuccessMessage(
            "This email is already registered. Please check your inbox for the confirmation link or try logging in."
          );
          return;
        }

        setSuccessMessage(
          "Sign-up successful! Please check your email to verify your account."
        );

        // if (data?.user) {
        //   // The trigger will have created a profile row, now update it with academic info
        //   const { data: updatedProfile, error: profileError } = await supabase
        //     .from("profiles")
        //     .update({
        //       first_name: formData.firstName,
        //       last_name: formData.lastName,
        //       full_name: `${formData.firstName} ${formData.lastName}`,
        //       course_year: formData.courseYear,
        //       university: formData.university,
        //       degree: formData.degree,
        //     })
        //     .eq("user_id", data.user.id)
        //     .select();

        //   console.log("Update result:", { updatedProfile, profileError }); // Detailed logging

        //   if (profileError) {
        //     console.error("Error updating profile:", profileError);
        //     setErrors({
        //       general:
        //         "Account created but we couldn't save your academic information. Please update your profile after login.",
        //     });
        //   }

        //   setSuccessMessage(
        //     "Sign-up successful! Please check your email to verify your account."
        //   );
        // }
      }
    } catch (err) {
      console.error("Unexpected error during sign-up:", err);
      setErrors({
        general: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkUserSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // If we have a session and it's from Google auth
      if (
        session?.provider_token &&
        session?.user?.app_metadata?.provider === "google"
      ) {
        setIsGoogleAuth(true);

        // Pre-fill form with data from Google account
        setFormData((prevData) => ({
          ...prevData,
          firstName:
            session.user.user_metadata.full_name?.split(" ")?.[0] || "",
          lastName: session.user.user_metadata.full_name?.split(" ")?.[1] || "",
          email: session.user.email || "",
          // Password fields not needed for Google auth
          password: "google-auth-not-required",
          confirmPassword: "google-auth-not-required",
        }));

        // Move to step 2 to collect academic information
        setCurrentStep(2);
      }
    };

    checkUserSession();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Join RateMyCourse
        </h1>
        <p className="text-lg text-gray-600">
          Create an account to rate courses and share your experiences
        </p>
      </div>

      <div className="flex flex-col bg-white py-8 px-6 rounded-lg shadow-md w-full max-w-md min-h-[500px]">
        {successMessage ? (
          <div className="text-center mt-auto mb-auto">
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
              {successMessage}
            </div>
            <Link
              to={SIGN_IN_PAGE_ROUTE}
              className="mt-4 inline-block text-blue-600 hover:text-blue-800"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <SignUpForm
            formData={formData}
            errors={errors}
            isSubmitting={isSubmitting}
            isGoogleAuth={isGoogleAuth}
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

      <p className="mt-8 text-sm text-gray-500">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:text-blue-800">
          Sign in
        </Link>
      </p>

      <p className="mt-4 text-sm text-gray-500">
        By signing up, you agree to our{" "}
        <Link to="/privacy" className="text-blue-600 hover:text-blue-800">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link to="/guidelines" className="text-blue-600 hover:text-blue-800">
          Community Guidelines
        </Link>
      </p>
    </div>
  );
}
