import { GuidelineItem } from "./GuidelinesPage";

export interface GuidelineSectionProps {
  guidelines: GuidelineItem[];
}

export default function GuidelineSection({
  guidelines,
}: GuidelineSectionProps) {
  return (
    <div className="mb-8">
      <div className="space-y-4">
        {guidelines.map((guideline, index) => (
          <div key={index} className="">
            <h3 className="font-medium text-lg mb-0.5">
              {index + 1}. {guideline.title}
            </h3>
            {guideline.description.map((desc, index) => (
              <p key={index} className="text-gray-600 pl-4">
                - {desc}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
