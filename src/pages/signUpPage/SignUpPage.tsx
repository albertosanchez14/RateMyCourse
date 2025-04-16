import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";

import useDegrees from "../../hooks/useDegrees";
import supabase from "../../utils/supabaseClient";
import { SIGN_IN_PAGE_ROUTE } from "../../Routes";

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
          // Save additional user data to profiles table
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                user_id: session.user.id,
                first_name: formData.firstName,
                last_name: formData.lastName,
                full_name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                course_year: formData.courseYear,
                university: formData.university,
                degree: formData.degree,
              },
            ]);

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
        // Regular email/password sign-up flow
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              first_name: formData.firstName,
              last_name: formData.lastName,
            },
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
        } else if (data?.user) {
          // Save additional user data to profiles table
          const { error: profileError } = await supabase
            .from("profiles")
            .insert([
              {
                user_id: data.user.id,
                first_name: formData.firstName,
                last_name: formData.lastName,
                full_name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                course_year: formData.courseYear,
                university: formData.university,
                degree: formData.degree,
              },
            ]);

          if (profileError) {
            console.error("Error saving profile:", profileError);
          }

          setSuccessMessage(
            "Sign-up successful! Please check your email to verify your account."
          );
        }
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

  const renderStepContent = () => {
    const slideDirection = {
      initial: { x: 300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -300, opacity: 0 },
      transition: { type: "tween", ease: "easeInOut", duration: 0.3 },
    };

    return (
      <div className="relative overflow-hidden w-full h-full px-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={slideDirection}
          >
            {(() => {
              switch (currentStep) {
                case 1:
                  return (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold mb-4">
                        Personal Information
                      </h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="firstName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            First Name
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md text-sm font-medium
                              focus:outline-none focus:ring-2 focus:ring-blue-500 
                              transition-all duration-200 h-10 ${
                                errors.firstName
                                  ? "border-red-500"
                                  : "border-gray-200"
                              }`}
                            required
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.firstName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label
                            htmlFor="lastName"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Last Name
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`w-full px-4 py-2 border rounded-md text-sm font-medium
                              focus:outline-none focus:ring-2 focus:ring-blue-500 
                              transition-all duration-200 h-10 ${
                                errors.lastName
                                  ? "border-red-500"
                                  : "border-gray-200"
                              }`}
                            required
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-xs mt-1">
                              {errors.lastName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md text-sm font-medium
                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                            transition-all duration-200 h-10 ${
                              errors.email
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          required
                        />
                        {errors.email && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                case 2:
                  return (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold mb-4">
                        {isGoogleAuth
                          ? "Complete Your Profile"
                          : "Academic Information"}
                      </h2>
                      <div className="relative">
                        <label
                          htmlFor="university"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          University
                        </label>
                        <select
                          id="university"
                          name="university"
                          value={formData.university}
                          onChange={handleChange}
                          className="appearance-none w-full px-4 py-2 pr-10 h-10 text-sm font-medium text-gray-700 bg-white border 
                            border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 
                            transition-all duration-200 cursor-pointer 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                            focus:border-transparent"
                          required
                        >
                          <option value="">Select your university</option>
                          <option value="University Carlos III of Madrid">
                            University Carlos III of Madrid
                          </option>
                        </select>
                        <MdExpandMore className="absolute right-3 top-1/2 translate-y-[2px] w-5 h-5 text-gray-500 pointer-events-none" />
                        {errors.university && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.university}
                          </p>
                        )}
                      </div>

                      <div className="relative">
                        <label
                          htmlFor="degree"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Degree
                        </label>
                        <select
                          id="degree"
                          name="degree"
                          value={formData.degree}
                          onChange={handleChange}
                          className="appearance-none w-full px-4 py-2 pr-10 h-10 text-sm font-medium text-gray-700 bg-white border 
                            border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 
                            transition-all duration-200 cursor-pointer 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                            focus:border-transparent"
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
                        <MdExpandMore className="absolute right-3 top-1/2 translate-y-[2px] w-5 h-5 text-gray-500 pointer-events-none" />
                        {errors.degree && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.degree}
                          </p>
                        )}
                      </div>

                      <div className="relative">
                        <label
                          htmlFor="courseYear"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Course Year
                        </label>
                        <select
                          id="courseYear"
                          name="courseYear"
                          value={formData.courseYear}
                          onChange={handleChange}
                          className="appearance-none w-full px-4 py-2 pr-10 h-10 text-sm font-medium text-gray-700 bg-white border 
                            border-gray-200 rounded-md hover:bg-gray-50 hover:border-gray-300 
                            transition-all duration-200 cursor-pointer 
                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                            focus:border-transparent"
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
                        <MdExpandMore className="absolute right-3 top-1/2 translate-y-[2px] w-5 h-5 text-gray-500 pointer-events-none" />
                        {errors.courseYear && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.courseYear}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                case 3:
                  return (
                    <div className="space-y-4">
                      <h2 className="text-xl font-semibold mb-4">
                        Set Your Password
                      </h2>
                      <div>
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md text-sm font-medium
                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                            transition-all duration-200 h-10 ${
                              errors.password
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          required
                          minLength={8}
                        />
                        {errors.password && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="confirmPassword"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border rounded-md text-sm font-medium
                            focus:outline-none focus:ring-2 focus:ring-blue-500 
                            transition-all duration-200 h-10 ${
                              errors.confirmPassword
                                ? "border-red-500"
                                : "border-gray-200"
                            }`}
                          required
                        />
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                default:
                  return null;
              }
            })()}
          </motion.div>
        </AnimatePresence>
      </div>
    );
  };

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
          <>
            {errors.general && (
              <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-md">
                {errors.general}
              </div>
            )}

            {/* Step indicators - hide when using Google auth */}
            {!isGoogleAuth && (
              <div className="mb-2 px-2">
                <div className="flex justify-between items-center mb-4">
                  <div className="text-sm text-gray-500">
                    Step {currentStep} of {totalSteps}
                  </div>
                  <div className="flex space-x-1">
                    {Array.from({ length: totalSteps }, (_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-6 rounded-full ${
                          i + 1 <= currentStep ? "bg-blue-600" : "bg-gray-200"
                        } cursor-pointer`}
                        onClick={() => handleStepClick(i + 1)}
                        role="button"
                        aria-label={`Go to step ${i + 1}`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col h-full gap-4"
            >
              {renderStepContent()}

              {/* Different button layouts based on auth type and step */}
              {isGoogleAuth ? (
                <div className="flex justify-end mt-auto">
                  <button
                    type="submit"
                    className="flex items-center justify-center bg-blue-600 
                      text-white py-2 px-6 rounded-md hover:bg-blue-700
                      focus:outline-none focus:ring-2 focus:ring-blue-500 
                      focus:ring-offset-2 transition-colors disabled:opacity-70"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              ) : currentStep > 1 ? (
                <div className="flex justify-between mt-auto">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="flex items-center px-4 py-2 text-sm text-blue-600 
                      hover:text-blue-800 focus:outline-none"
                  >
                    <IoArrowBack className="mr-1" /> Back
                  </button>

                  <button
                    type="submit"
                    className="flex items-center justify-center bg-blue-600 
                      text-white py-2 px-4 rounded-md hover:bg-blue-700
                      focus:outline-none focus:ring-2 focus:ring-blue-500 
                      focus:ring-offset-2 transition-colors disabled:opacity-70 w-32"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Creating..."
                    ) : currentStep === totalSteps ? (
                      "Sign Up"
                    ) : (
                      <>
                        Next <IoArrowForward className="ml-1" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col justify-end h-fit">
                  <div className="mb-auto flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center justify-center bg-blue-600 
                        text-white py-2 px-4 rounded-md hover:bg-blue-700
                        focus:outline-none focus:ring-2 focus:ring-blue-500 
                        focus:ring-offset-2 transition-colors disabled:opacity-70"
                      disabled={isSubmitting}
                    >
                      Next <IoArrowForward className="ml-1" />
                    </button>
                  </div>

                  <div className="mt-6 flex items-center">
                    <div className="flex-grow h-px bg-gray-300"></div>
                    <span className="mx-4 text-sm text-gray-500">or</span>
                    <div className="flex-grow h-px bg-gray-300"></div>
                  </div>

                  <div className="mt-6 w-full flex justify-center">
                    <button
                      type="button"
                      onClick={handleGoogleSignUp}
                      className="flex justify-center items-center w-full py-2 px-4 
                        border border-gray-300 rounded-md shadow-sm bg-white 
                        text-sm font-medium text-gray-700 hover:bg-gray-50 gap-2"
                    >
                      <FcGoogle size={25} />
                      Continue with Google
                    </button>
                  </div>
                </div>
              )}
            </form>
          </>
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
