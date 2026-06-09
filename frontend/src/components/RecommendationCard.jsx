import { useState } from "react";

export default function RecommendationCard({ analysis }) {
  const [expanded, setExpanded] = useState(false);

  if (!analysis) {
    return (
      <div className="card text-center py-8">
        <span className="text-3xl mb-3 block">🤖</span>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Recommendations</h3>
        <p className="text-gray-500 text-sm">
          Complete an assessment to get personalized AI recommendations.
        </p>
      </div>
    );
  }

  // Check if analysis is a string (Gemini markdown) or object
  const isString = typeof analysis === "string";
  const content = isString ? analysis : analysis.text || JSON.stringify(analysis);

  return (
    <div className="card">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
          <span className="text-xl">🤖</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AI Sustainability Coach</h3>
          <p className="text-xs text-gray-400">Powered by Gemini</p>
        </div>
      </div>
      <div className={`prose prose-sm max-w-none text-gray-600 leading-relaxed ${!expanded ? "line-clamp-6" : ""}`}>
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
