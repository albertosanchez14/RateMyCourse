import GuidelineSection from "./GuidelineSection";

export interface GuidelineItem {
  title: string;
  description: string[];
}

export default function GuidelinesPage() {
  const communityGuidelines: GuidelineItem[] = [
    {
      title: "Be Respectful",
      description: [
        "Treat instructors, students, and reviewers with respect.",
        "No harassment, hate speech, or personal attacks.",
        "Disagreements are welcome, but keep discussions civil and constructive.",
      ],
    },
    {
      title: "Be Honest & Constructive",
      description: [
        "Share genuine feedback based on your personal experience.",
        "Provide specific examples to support your ratings and comments.",
        "Include both positive aspects and areas for improvement when possible.",
      ],
    },
    {
      title: "Stay Relevant",
      description: [
        "Reviews should focus on course content, teaching methods, and learning experience.",
        "Do not include unrelated personal opinions, political views, or off-topic discussions.",
      ],
    },
    {
      title: "Maintain Professionalism",
      description: [
        "Use appropriate and professional language.",
        "Avoid profanity, threats, or any offensive content.",
      ],
    },
    {
      title: "Protect Privacy",
      description: [
        "Do not share personal information about yourself or others.",
        "Respect the privacy of instructors and students.",
      ],
    },
    {
      title: "No Spam or Self-Promotion",
      description: [
        "Do not post irrelevant links, advertisements, or promotions.",
        "Avoid duplicate reviews or artificially inflating ratings.",
        "Do not review courses you are affiliated with (as an instructor or staff).",
      ],
    },
    {
      title: "Verify Information",
      description: [
        "Ensure your review is for the correct course and instructor before posting.",
        "Do not spread misinformation or misleading claims.",
      ],
    },
    {
      title: "Recent Experience Matters",
      description: [
        "Write reviews based on recent course experiences for the most accurate and helpful feedback.",
      ],
    },
    {
      title: "Report Issues",
      description: [
        "Help maintain community standards by reporting inappropriate content or behavior.",
        "If you see a review that violates these guidelines, flag it for review.",
      ],
    },
  ];

  return (
    <div className="min-h-screen pt-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Community Guidelines</h1>
        <p className="text-gray-600 mb-8">
          Welcome to CourseWise! These guidelines help ensure our platform
          remains helpful and respectful for everyone.
        </p>

        <GuidelineSection
          guidelines={communityGuidelines}
        />
      </div>
    </div>
  );
}
