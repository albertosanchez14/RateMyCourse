export default function TermsOfServicePage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By accessing and using CourseWise, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.",
        "We reserve the right to update these terms at any time without notice. Your continued use of the platform following any changes constitutes acceptance of those changes."
      ]
    },
    {
      title: "2. User Accounts",
      content: [
        "You must provide accurate and complete information when creating an account.",
        "You are responsible for maintaining the security of your account and password.",
        "You must be a current or former student to create reviews.",
        "One account per person; multiple accounts are not permitted."
      ]
    },
    {
      title: "3. Content Guidelines",
      content: [
        "All reviews must be based on actual course experiences.",
        "Reviews must not contain harassment, hate speech, or personal attacks.",
        "You retain ownership of your content but grant us a license to use, modify, and display it.",
        "We reserve the right to remove content that violates our guidelines.",
        "False, misleading, or manipulated reviews are prohibited."
      ]
    },
    {
      title: "4. Privacy",
      content: [
        "Your use of CourseWise is also governed by our Privacy Policy.",
        "We collect and use information as described in our Privacy Policy.",
        "We do not sell personal information to third parties."
      ]
    },
    {
      title: "5. Prohibited Activities",
      content: [
        "Attempting to manipulate ratings or reviews",
        "Posting spam or promotional content",
        "Harassing other users or course instructors",
        "Attempting to access accounts or data you're not authorized to access",
        "Using automated systems to access or scrape data"
      ]
    },
    {
      title: "6. Intellectual Property",
      content: [
        "CourseWise and its original content are protected by copyright and other laws.",
        "Our name, logo, and trademarks may not be used without written permission."
      ]
    },
    {
      title: "7. Termination",
      content: [
        "We may suspend or terminate your account for violations of these terms.",
        "You may terminate your account at any time.",
        "Upon termination, your right to use the service immediately ceases."
      ]
    },
    {
      title: "8. Disclaimer",
      content: [
        "The service is provided 'as is' without warranties of any kind.",
        "We are not responsible for the accuracy of user-submitted reviews.",
        "We do not endorse any opinions expressed in reviews."
      ]
    },
    {
      title: "9. Limitation of Liability",
      content: [
        "We shall not be liable for any indirect, incidental, or consequential damages.",
        "Our total liability shall not exceed the amount you paid us, if any, in the past six months."
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="text-gray-600 mb-8">
          Last updated: March 16, 2024
        </p>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 mb-12 text-gray-600 text-sm">
          <p>
            If you have any questions about these Terms of Service, please contact
            us at legal@coursewise.com
          </p>
        </div>
      </div>
    </div>
  );
}