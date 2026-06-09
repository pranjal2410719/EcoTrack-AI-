import { useState, useRef, useEffect } from "react";
import { chatWithCoach } from "../services/api";

const WELCOME_MESSAGE = {
  role: "assistant",
  content:
    "👋 Hi! I'm your AI Sustainability Coach. I can help you understand your carbon footprint and find ways to reduce it. Ask me anything about sustainable living, or tell me about your habits and I'll give you personalized advice!",
};

const QUICK_SUGGESTIONS = [
  "How can I reduce emissions as a student?",
  "What's the impact of switching to public transport?",
  "Give me a 7-day sustainability plan",
  "How much CO₂ does eating meat cause?",
];

export default function Coach() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function sendMessage(text) {
    const message = text || input;
    if (!message.trim() || loading) return;

    setError("");
    setInput("");

    const userMessage = { role: "user", content: message.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const history = messages
        .filter((m) => m !== WELCOME_MESSAGE)
        .map((m) => ({ role: m.role, content: m.content }));

      const result = await chatWithCoach({ message: message.trim(), history });
      const aiResponse = result.data.response;

      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
    } catch (err) {
      const msg = err.response?.data?.error || "Failed to get response. Please try again.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `😕 ${msg}` },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
          AI Climate Coach
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          Ask EcoTrack{" "}
          <span className="bg-gradient-to-r from-primary-500 to-emerald-500 bg-clip-text text-transparent">
            AI
          </span>
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto">
          Get personalized sustainability advice, tips, and answers to all your
          eco-questions — powered by Gemini AI.
        </p>
      </div>

      {/* Chat container */}
      <div className="card !p-0 overflow-hidden">
        {/* Messages area */}
        <div
          className="h-[450px] overflow-y-auto p-4 sm:p-6 space-y-4"
          role="log"
          aria-label="Chat messages"
          aria-live="polite"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary-500 text-white rounded-br-md"
                    : "bg-gray-100 text-gray-800 rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && !loading && (
          <div className="px-4 sm:px-6 pb-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
              Try asking
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => sendMessage(suggestion)}
                  className="text-xs bg-gray-50 hover:bg-primary-50 text-gray-600 hover:text-primary-700 border border-gray-200 hover:border-primary-200 rounded-xl px-3 py-2 transition-all duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="border-t border-gray-100 p-4 sm:p-6">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about sustainability..."
              disabled={loading}
              className="input-field flex-1"
              aria-label="Message for AI coach"
            />
            <button
              type="button"
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="btn-primary !py-3 !px-5"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m0 0l-7 7m7-7l7 7" />
              </svg>
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Responses are generated by AI and may not be accurate. Always verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}
