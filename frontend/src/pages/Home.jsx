import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: "📊",
      title: "Track Your Carbon Footprint",
      desc: "Answer a simple 5-question assessment and get an instant carbon score with detailed category breakdowns.",
    },
    {
      icon: "🤖",
      title: "AI-Powered Insights",
      desc: "Gemini AI analyzes your lifestyle and generates personalized recommendations to reduce your environmental impact.",
    },
    {
      icon: "📈",
      title: "Visual Progress Dashboard",
      desc: "Interactive charts and progress tracking help you see your reduction journey over time.",
    },
    {
      icon: "🎯",
      title: "Actionable Weekly Plans",
      desc: "Get a practical 7-day sustainability plan with small, achievable actions that add up to real change.",
    },
  ];

  const steps = [
    {
      step: "1",
      title: "Take the Assessment",
      desc: "Answer 5 quick questions about your transportation, energy use, diet, travel, and shopping habits.",
    },
    {
      step: "2",
      title: "Get Your Score",
      desc: "Our calculator computes your carbon footprint and AI generates personalized recommendations just for you.",
    },
    {
      step: "3",
      title: "Track & Reduce",
      desc: "Monitor your progress on the dashboard, follow AI suggestions, and watch your carbon footprint shrink.",
    },
  ];

  // If already logged in, primary CTA goes to assessment; otherwise sign-up
  const primaryHref = user ? "/assessment" : "/sign-up";
  const primaryLabel = user ? "Go to Assessment →" : "Start Tracking →";

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-emerald-50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMmM1NWUiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              AI-Powered Sustainability
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
              Track Your Carbon{" "}
              <span className="bg-gradient-to-r from-primary-500 to-emerald-500 bg-clip-text text-transparent">
                Footprint
              </span>
              , Make a Difference
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
              Understand your environmental impact with AI-powered insights.
              Get personalized recommendations, track your progress, and join the
              movement toward a sustainable future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={primaryHref} className="btn-primary text-lg !px-8 !py-4">
                {primaryLabel}
              </Link>
              <a href="#how-it-works" className="btn-secondary text-lg !px-8 !py-4">
                Learn More
              </a>
            </div>

            {/* If logged in, show quick links to dashboard too */}
            {user && (
              <p className="mt-6 text-sm text-gray-500">
                or{" "}
                <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium underline underline-offset-2">
                  view your Dashboard
                </Link>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Make an Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              EcoTrack AI combines simple tracking with artificial intelligence to make sustainability personal and actionable.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card group hover:border-primary-200 hover:shadow-lg transition-all duration-300">
                <span className="text-3xl block mb-4 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to start your sustainability journey.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((s, idx) => (
              <div key={s.step} className="relative text-center">
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 border-t-2 border-dashed border-primary-200" />
                )}
                <div className="w-16 h-16 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold mx-auto mb-5">
                  {s.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-primary-600 to-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Know Your Carbon Footprint?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of people taking control of their environmental impact. Start your journey today.
          </p>
          <Link
            to={primaryHref}
            className="inline-flex items-center px-8 py-4 rounded-xl font-semibold text-primary-600 bg-white hover:bg-primary-50 transition-all duration-200 text-lg shadow-xl hover:shadow-2xl active:scale-[0.98]"
          >
            {user ? "Continue Assessment" : "Get Started Free"}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}
