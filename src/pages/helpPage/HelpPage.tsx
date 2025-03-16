export default function HelpPage() {
  return (
    <div className="max-w-4xl pt-12 px-4 sm:px-6 lg:px-8 mx-auto">
      <h1 className="text-4xl font-bold mb-8">Help Center</h1>

      {/* Search Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Finding Courses
        </h2>
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Using the Search Bar
            </h3>
            <p className="text-gray-600">
              You can search for courses by:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-600 space-y-1">
              <li>Course code (e.g., "13888")</li>
              <li>Course title (e.g., "Computer Architecture")</li>
              <li>Department name</li>
              <li>Professor name</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Explore Page
            </h3>
            <p className="text-gray-600">
              Use the Explore page to browse all courses. You can filter courses by:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-600 space-y-1">
              <li>Degree program</li>
              <li>Course type</li>
              <li>Year level</li>
              <li>Semester</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Rating & Reviews Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Rating & Reviews
        </h2>
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              How to Rate a Course
            </h3>
            <p className="text-gray-600">
              To submit a review:
            </p>
            <ol className="list-decimal ml-6 mt-2 text-gray-600 space-y-1">
              <li>Navigate to the course page</li>
              <li>Click on "Write a Review" or select a star rating</li>
              <li>Fill in the review form with:
                <ul className="list-disc ml-6 mt-1 mb-2">
                  <li>Overall rating (required)</li>
                  <li>Easy rating</li>
                  <li>Usefulness rating</li>
                  <li>Workload rating</li>
                  <li>Written review</li>
                  <li>Select the professor (if applicable)</li>
                </ul>
              </li>
              <li>Submit your review</li>
            </ol>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Review Guidelines
            </h3>
            <p className="text-gray-600">
              Please keep in mind:
            </p>
            <ul className="list-disc ml-6 mt-2 text-gray-600 space-y-1">
              <li>You can only submit one review per course</li>
              <li>Reviews should be respectful and constructive</li>
              <li>Focus on your academic experience</li>
              <li>You can edit your review later</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Account Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Account Management
        </h2>
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Your Account
            </h3>
            <ul className="list-disc ml-6 text-gray-600 space-y-1">
              <li>Login to access all features</li>
              <li>View your review history</li>
              <li>Edit or delete your reviews</li>
              <li>Update your profile information</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Additional Help */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Need More Help?
        </h2>
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600">
            If you have any questions or need assistance, please:
          </p>
          <ul className="list-disc ml-6 mt-2 text-gray-600 space-y-1">
            <li>Check our FAQ section</li>
            <li>Review our Community Guidelines</li>
            <li>Contact support at support@ratemycourse.com</li>
          </ul>
        </div>
      </section>
    </div>
  );
}