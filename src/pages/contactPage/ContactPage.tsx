export default function ContactPage() {
  return (
    <div className="min-h-screen pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
        <p className="text-gray-600 mb-8">
          Have a question or feedback? We'd love to hear from you. Choose how you'd like to reach us below.
        </p>

        {/* Contact Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Email Support */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">📧</span>
              <h2 className="text-xl font-semibold">Email Support</h2>
            </div>
            <p className="text-gray-600 mb-4">
              For general inquiries and support requests.
            </p>
            <a
              href="mailto:support@coursewise.com"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              support@coursewise.com
            </a>
          </div>

          {/* Technical Help */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <span className="text-2xl mr-3">🛠️</span>
              <h2 className="text-xl font-semibold">Technical Help</h2>
            </div>
            <p className="text-gray-600 mb-4">
              Having technical issues with the platform?
            </p>
            <a
              href="mailto:tech@coursewise.com"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              tech@coursewise.com
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="bg-white rounded-lg shadow-md p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Common Questions</h2>
          <div className="space-y-6">
            {[
              {
                question: "What is the typical response time?",
                answer: "We aim to respond to all inquiries within 24-48 hours during business days."
              },
              {
                question: "How do I report inappropriate content?",
                answer: "Use the 'Report' button next to any review or comment, or email our support team directly."
              },
              {
                question: "Can I suggest a new feature?",
                answer: "Yes! We welcome feature suggestions. Please email them to support@coursewise.com."
              }
            ].map((item, index) => (
              <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                <h3 className="font-medium text-lg mb-2">{item.question}</h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Info */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Before Contacting Us</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✔</span>
              Check our <a href="/help" className="text-blue-600 hover:text-blue-800">Help Center</a> for detailed guides
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✔</span>
              Review our <a href="/guidelines" className="text-blue-600 hover:text-blue-800">Community Guidelines</a>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✔</span>
              Search our FAQ section for quick answers
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}