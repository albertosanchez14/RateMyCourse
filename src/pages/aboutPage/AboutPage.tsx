export default function AboutPage() {
  return (
    <div className="min-h-screen pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Us</h1>
          <p className="text-xl text-gray-600">
            Welcome to CourseWise! We believe that finding the right course
            should be easy, transparent, and based on real student experiences.
          </p>
        </div>

        {/* What We Do Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What We Do</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <ul className="space-y-3">
              {[
                "Discover courses across various degrees",
                "Read honest reviews from real students",
                "Rate and review courses based on quality, content, and teaching style",
                "Make informed decisions before enrolling in a course",
              ].map((item, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✔</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Why Choose Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Authentic Reviews",
                description:
                  "Our community-driven platform ensures that all reviews are written by real students.",
              },
              {
                title: "Transparency & Trust",
                description:
                  "We enforce strict guidelines to prevent fake reviews and maintain integrity.",
              },
              {
                title: "User-Friendly Experience",
                description:
                  "Easily browse, search, and filter courses to find what suits you best.",
              },
              {
                title: "Community Support",
                description:
                  "Join a growing network of learners who help each other succeed.",
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-2">🔹 {item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              Our mission is to empower students to make informed decisions by
              providing honest, unbiased, and transparent course reviews.
            </p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Get Involved
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600">
              💬 Write a Review: Share your experience and help others.
            </p>
            <p className="text-gray-600">
              📢 Report Issues: Help us maintain a quality-driven platform by
              reporting inappropriate content.
            </p>
            <p className="text-gray-600">
              🌟 Rate Courses: Let instructors and learners know what works and
              what doesn't.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
            {[
              {
                question: "How do I write a review?",
                answer:
                  "You can write a review by navigating to any course page and clicking the 'Write Review' button. You'll need to be logged in to share your experience, rate different aspects of the course, and provide detailed feedback.",
              },
              {
                question: "Can I edit my review later?",
                answer:
                  "Yes! You can edit your reviews at any time by going to your profile and finding the review in your contributions section. Click the 'Edit' button to make changes to your review.",
              },
              {
                question: "How do you prevent fake reviews?",
                answer:
                  "We use a combination of automated systems and manual moderation to ensure review authenticity. Users must verify their student status, and we monitor for suspicious patterns or multiple reviews from the same source.",
              },
              {
                question:
                  "What happens if a review violates community guidelines?",
                answer:
                  "Reviews that violate our community guidelines are removed, and the user may receive a warning. Repeated violations can result in account suspension. Users can report inappropriate reviews using the 'Report' button.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="border-b border-gray-200 last:border-0 pb-4 last:pb-0"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 mb-4">
              Have questions, feedback, or suggestions? We'd love to hear from
              you!
            </p>
            <div className="space-y-2">
              <p className="flex items-center">
                <span className="mr-2">📧</span>
                <a
                  href="mailto:contact@coursewise.com"
                  className="text-blue-600 hover:text-blue-800"
                >
                  contact@coursewise.com
                </a>
              </p>
              <p className="flex items-center">
                <span className="mr-2">🌐</span>
                <a
                  href="https://coursewise.com"
                  className="text-blue-600 hover:text-blue-800"
                >
                  www.coursewise.com
                </a>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
