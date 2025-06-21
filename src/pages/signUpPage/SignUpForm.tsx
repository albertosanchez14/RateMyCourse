import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";
import { MdExpandMore } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";

export interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  courseYear: string;
  university: string;
  degree: string;
}

export interface FormErrors {
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

interface SignUpFormProps {
  formData: FormData;
  errors: FormErrors;
  isSubmitting: boolean;
  isGoogleAuth: boolean;
  isLoadingDegrees: boolean;
  degrees?: string[];
  currentStep: number;
  totalSteps: number;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  onPrevStep: () => void;
  onNextStep: () => void;
  onStepClick: (step: number) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onGoogleSignUp: () => void;
}

export default function SignUpForm({
  formData,
  errors,
  isSubmitting,
  isGoogleAuth,
  isLoadingDegrees,
  degrees = [],
  currentStep,
  totalSteps,
  onChange,
  onPrevStep,
  onStepClick,
  onSubmit,
  onGoogleSignUp,
}: SignUpFormProps) {
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
                            onChange={onChange}
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
                            onChange={onChange}
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
                          onChange={onChange}
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
                    <div className="space-y-4 py-2">
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
                          onChange={onChange}
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
                          onChange={onChange}
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
                          onChange={onChange}
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
                          onChange={onChange}
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
                          onChange={onChange}
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
                  onClick={() => onStepClick(i + 1)}
                  role="button"
                  aria-label={`Go to step ${i + 1}`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={onSubmit}
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
              onClick={onPrevStep}
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
                onClick={onGoogleSignUp}
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
  );
}
