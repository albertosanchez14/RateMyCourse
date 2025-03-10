import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function PrivacyPage() {
  const [markdownContent, setMarkdownContent] = useState("");

  useEffect(() => {
    fetch("/src/data/privacy_policy.md")
      .then((response) => response.text())
      .then((content) => {
        // Remove the filepath comment if present
        const cleanContent = content.replace(/\/\/ filepath:.*\n/, "");
        setMarkdownContent(cleanContent);
      })
      .catch((error) => {
        console.error("Error loading privacy policy:", error);
        setMarkdownContent("Error loading privacy policy content.");
      });
  }, []);

  return (
    <div className="min-h-screen pt-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-4xl font-bold mb-6">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mt-8 mb-4">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-6 mb-3">{children}</h3>
          ),
          p: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
          ul: ({ children }) => (
            <ul className="list-disc ml-6 mb-4">{children}</ul>
          ),
          li: ({ children }) => <li className="mb-2">{children}</li>,
          em: ({ children }) => <em className="italic">{children}</em>,
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  );
}
