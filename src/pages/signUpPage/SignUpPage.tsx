import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { FcGoogle } from "react-icons/fc";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

import supabase from "../../utils/supabaseClient";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  courseYear: string;
  university: string;
  degree: string; // Added degree field
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [direction, setDirection] = useState(1);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
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
      if (!formData.university.trim()) {
        newErrors.university = "University is required";
      }
      if (!formData.degree.trim()) {
        newErrors.degree = "Degree is required";
      }
      if (!formData.courseYear.trim()) {
        newErrors.courseYear = "Course year is required";
      }
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

    if (!formData.university.trim()) {
      newErrors.university = "University is required";
    }

    if (!formData.degree.trim()) {
      newErrors.degree = "Degree is required";
    }

    if (!formData.courseYear.trim()) {
      newErrors.courseYear = "Course year is required";
    }

    return newErrors;
  };

  // Modify handleNextStep
  const handleNextStep = () => {
    const validationErrors = validateStep(currentStep);

    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    }

    if (currentStep < totalSteps) {
      setDirection(1); // Going forward
      setCurrentStep(currentStep + 1);
      setErrors({});
    }
  };

  // Modify handlePrevStep
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setDirection(-1); // Going backward
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleStepClick = (step: number) => {
    // Set direction based on which way we're moving
    setDirection(step > currentStep ? 1 : -1);

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
    if (currentStep !== totalSteps) {
      handleNextStep();
      return;
    }

    const validationErrors = validate();

    if (Object.keys(validationErrors).length !== 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      // Sign up with Supabase
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
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            user_id: data.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            full_name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            course_year: formData.courseYear,
            university: formData.university,
            degree: formData.degree, // Add degree to the profile data
          },
        ]);

        if (profileError) {
          console.error("Error saving profile:", profileError);
        }

        setSuccessMessage(
          "Sign-up successful! Please check your email to verify your account."
        );
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

  const renderStepContent = () => {
    const slideVariants = {
      initial: {
        x: direction > 0 ? 300 : -300,
        opacity: 0,
      },
      animate: {
        x: 0,
        opacity: 1,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      },
      exit: {
        x: direction > 0 ? -300 : 300,
        opacity: 0,
        transition: { type: "spring", stiffness: 300, damping: 30 },
      },
    };

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideVariants}
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
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none 
                    focus:ring-2 focus:ring-blue-500 
                    ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
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
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none 
                    focus:ring-2 focus:ring-blue-500 
                    ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 
                  ${errors.email ? "border-red-500" : "border-gray-300"}`}
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
                      Academic Information
                    </h2>
                    <div>
                      <label
                        htmlFor="university"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        University
                      </label>
                      <input
                        type="text"
                        id="university"
                        name="university"
                        value={formData.university}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 
                  ${errors.university ? "border-red-500" : "border-gray-300"}`}
                        required
                      />
                      {errors.university && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.university}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="degree"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Degree
                      </label>
                      <input
                        type="text"
                        id="degree"
                        name="degree"
                        value={formData.degree}
                        onChange={handleChange}
                        placeholder="e.g., Computer Science, Business Administration"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 
                  ${errors.degree ? "border-red-500" : "border-gray-300"}`}
                        required
                      />
                      {errors.degree && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.degree}
                        </p>
                      )}
                    </div>

                    <div>
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
                        onChange={
                          handleChange as React.ChangeEventHandler<HTMLSelectElement>
                        }
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 
                  ${errors.courseYear ? "border-red-500" : "border-gray-300"}`}
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 
                  ${errors.password ? "border-red-500" : "border-gray-300"}`}
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
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none 
                  focus:ring-2 focus:ring-blue-500 
                  ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
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

      <div
        className="flex flex-col bg-white p-8 rounded-lg shadow-md 
        w-full max-w-md min-h-[500px]"
      >
        {successMessage ? (
          <div className="text-center">
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-md">
              {successMessage}
            </div>
            <Link
              to="/login"
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

            <div className="mb-2">
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

            <form
              onSubmit={handleSubmit}
              noValidate
              className="flex flex-col h-full gap-4"
            >
              {renderStepContent()}

              {currentStep > 1 ? (
                <div className="flex justify-between mt-auto">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="flex items-center px-4 py-2 text-sm text-blue-600 
                      hover:text-blue-800 focus:outline-none"
                    >
                      <IoArrowBack className="mr-1" /> Back
                    </button>
                  ) : (
                    <div></div> // Empty div to maintain the flex spacing
                  )}

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
                <div className="flex flex-col justify-end h-full">
                  <div className="mb-auto flex justify-end">
                    <button
                      type="submit"
                      className="flex items-center justify-center bg-blue-600 
                      text-white py-2 px-4 rounded-md hover:bg-blue-700
                        focus:outline-none focus:ring-2 focus:ring-blue-500 
                        focus:ring-offset-2 transition-colors disabled:opacity-70 w-30"
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
