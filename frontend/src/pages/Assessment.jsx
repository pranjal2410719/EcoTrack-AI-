import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { saveAssessment, analyzeAssessment } from "../services/api";
import { showSuccess, showError, showWarning } from "../utils/toast";

/* ─── Question definitions ──────────────────────────────────── */
const STEPS = [
  {
    id: "transport",
    icon: "🚗",
    color: "#16a34a",
    colorLight: "#dcfce7",
    title: "How do you get around?",
    subtitle: "Enter the kilometres you drive or ride per week",
    type: "number",
    unit: "km / week",
    placeholder: "e.g. 150",
    min: 0,
    tip: "The average person drives ~200 km/week. Walking or cycling saves ~100 kg CO₂/month.",
    xp: 20,
  },
  {
    id: "electricity",
    icon: "⚡",
    color: "#d97706",
    colorLight: "#fef3c7",
    title: "How much electricity do you use?",
    subtitle: "Enter your average monthly electricity bill in ₹",
    type: "number",
    unit: "₹ / month",
    placeholder: "e.g. 2500",
    min: 0,
    tip: "Switching to LED bulbs and 5-star appliances can cut your bill by 30%.",
    xp: 20,
  },
  {
    id: "diet",
    icon: "🍽️",
    color: "#7c3aed",
    colorLight: "#ede9fe",
    title: "What's on your plate?",
    subtitle: "Pick the option that best describes your diet",
    type: "choice",
    choices: [
      { value: "vegan",      label: "Vegan",        icon: "🌱", desc: "Plant-based only", co2: "~20 kg CO₂/mo",  highlight: "text-green-600",  bg: "bg-green-50",  border: "border-green-400" },
      { value: "vegetarian", label: "Vegetarian",   icon: "🥦", desc: "No meat",          co2: "~50 kg CO₂/mo",  highlight: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-400" },
      { value: "non-veg",    label: "Meat Eater",   icon: "🍖", desc: "Includes meat",    co2: "~100 kg CO₂/mo", highlight: "text-red-600",    bg: "bg-red-50",    border: "border-red-400" },
    ],
    tip: "Going vegan reduces food-related emissions by up to 73%.",
    xp: 20,
  },
  {
    id: "flights",
    icon: "✈️",
    color: "#0891b2",
    colorLight: "#cffafe",
    title: "How often do you fly?",
    subtitle: "Total number of flights taken per year",
    type: "number",
    unit: "flights / year",
    placeholder: "e.g. 3",
    min: 0,
    tip: "One Delhi→Mumbai return flight emits ~90 kg CO₂ per passenger.",
    xp: 20,
  },
  {
    id: "shopping",
    icon: "🛍️",
    color: "#db2777",
    colorLight: "#fce7f3",
    title: "How much do you shop online?",
    subtitle: "Average number of online purchases per month",
    type: "number",
    unit: "orders / month",
    placeholder: "e.g. 8",
    min: 0,
    tip: "Consolidating shipments and choosing slower delivery cuts packaging waste by 40%.",
    xp: 20,
  },
];

/* ─── Live carbon scoring ───────────────────────────────────── */
function calcLiveScore(f) {
  const t = parseFloat(f.transport) || 0;
  const e = parseFloat(f.electricity) || 0;
  const fl = parseFloat(f.flights) || 0;
  const s = parseFloat(f.shopping) || 0;
  const diet = f.diet === "vegan" ? 20 : f.diet === "vegetarian" ? 50 : f.diet === "non-veg" ? 100 : 0;
  return Math.round(t * 0.21 + e * 0.0008 + fl * 90 + s * 5 + diet);
}

function getLevel(score) {
  if (score < 200) return { label: "Eco Hero",    badge: "🌿", barColor: "#16a34a", textColor: "text-green-700",  bg: "bg-green-100",  barBg: "bg-green-500" };
  if (score < 500) return { label: "Moderate",    badge: "⚡", barColor: "#d97706", textColor: "text-yellow-700", bg: "bg-yellow-100", barBg: "bg-yellow-500" };
  return             { label: "High Impact",  badge: "🔥", barColor: "#dc2626", textColor: "text-red-700",    bg: "bg-red-100",    barBg: "bg-red-500" };
}

/* ─── Animated number counter ───────────────────────────────── */
function AnimatedNumber({ value }) {
  const [display, setDisplay] = useState(value);
  const raf = useRef(null);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current;
    const to = value;
    prev.current = value;
    if (from === to) return;
    const start = performance.now();
    const dur = 500;
    const run = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (p < 1) raf.current = requestAnimationFrame(run);
    };
    raf.current = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf.current);
  }, [value]);
  return <>{display}</>;
}

/* ─── Main component ────────────────────────────────────────── */
export default function Assessment() {
  const { userId, userEmail, userName } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState("next");
  const [animKey, setAnimKey] = useState(0);
  const [formData, setFormData] = useState({ transport: "", electricity: "", diet: "", flights: "", shopping: "" });
  const [xp, setXp] = useState(0);
  const [xpFlash, setXpFlash] = useState(false);
  const [done, setDone] = useState(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitPhase, setSubmitPhase] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const totalSteps = STEPS.length;
  const current = STEPS[step];
  const currentValue = formData[current.id];
  const isValid = currentValue !== "" && currentValue !== undefined && currentValue !== null;
  const liveScore = calcLiveScore(formData);
  const level = getLevel(liveScore);
  const progressPct = Math.round((done.size / totalSteps) * 100);

  useEffect(() => {
    if (current.type === "number" && inputRef.current) inputRef.current.focus();
  }, [step, current.type]);

  function awardXP() {
    if (!done.has(step)) {
      setXp((x) => x + 20);
      setXpFlash(true);
      setTimeout(() => setXpFlash(false), 1000);
      setDone((d) => new Set([...d, step]));
    }
  }

  function advance(dir) {
    setDirection(dir);
    setAnimKey((k) => k + 1);
  }

  function goNext() {
    if (!isValid) { setError("Please fill in this field before continuing."); return; }
    setError("");
    awardXP();
    if (step < totalSteps - 1) { advance("next"); setTimeout(() => setStep((s) => s + 1), 10); }
  }

  function goBack() {
    if (step === 0) return;
    setError("");
    advance("back");
    setTimeout(() => setStep((s) => s - 1), 10);
  }

  async function handleSubmit() {
    if (!isValid) { setError("Please fill in this field before continuing."); return; }
    awardXP();
    setError("");
    setSubmitting(true);
    setSubmitPhase("saving");

    try {
      const payload = {
        transport: parseFloat(formData.transport),
        electricity: parseFloat(formData.electricity),
        diet: formData.diet,
        flights: parseInt(formData.flights, 10),
        shopping: parseInt(formData.shopping, 10),
        userId,
        name: userName,
        email: userEmail || "",
      };
      const result = await saveAssessment(payload);
      const assessmentId = result?.data?.assessment?.id;

      showSuccess("Assessment saved! 🎉", "Calculating your carbon footprint...");
      setSubmitPhase("analyzing");

      if (assessmentId) {
        try {
          await analyzeAssessment(assessmentId);
          showSuccess("AI analysis complete!", "Your personalized recommendations are ready.");
        } catch (_) {
          showWarning("AI insights unavailable", "Your score is saved. You can retry analysis later.");
        }
      }

      setSubmitPhase("done");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const msg = err.response?.data?.error || "Something went wrong. Please try again.";
      setError(msg);
      showError("Submission failed", msg);
      setSubmitting(false);
      setSubmitPhase("");
    }
  }

  /* ── Submitting screen ── */
  if (submitting) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="card max-w-md w-full text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-3xl mx-auto">
            {submitPhase === "done" ? "🎉" : submitPhase === "analyzing" ? "🤖" : "💾"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {submitPhase === "done" ? "All done!" : submitPhase === "analyzing" ? "Analysing your footprint…" : "Saving your assessment…"}
            </h2>
            <p className="text-gray-500 text-sm">
              {submitPhase === "done" ? "Redirecting to your dashboard…" : "This will only take a moment."}
            </p>
          </div>

          <div className="space-y-3 text-left">
            {[
              { key: "saving",    icon: "💾", text: "Saving your answers" },
              { key: "analyzing", icon: "🤖", text: "Running AI analysis" },
              { key: "done",      icon: "✅", text: "Complete!" },
            ].map((ph) => {
              const isDone = (ph.key === "saving" && (submitPhase === "analyzing" || submitPhase === "done")) || (ph.key === "analyzing" && submitPhase === "done") || (ph.key === "done" && submitPhase === "done");
              const isActive = submitPhase === ph.key;
              return (
                <div key={ph.key} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isActive ? "border-primary-300 bg-primary-50" : isDone ? "border-gray-100 bg-gray-50" : "border-gray-100 opacity-40"}`}>
                  <span className="text-lg">{ph.icon}</span>
                  <span className={`text-sm font-medium ${isActive ? "text-primary-700" : "text-gray-600"}`}>{ph.text}</span>
                  {isDone && <span className="ml-auto text-green-500 font-bold text-sm">✓</span>}
                  {isActive && <span className="ml-auto w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10 sm:py-14">

        {/* ── Page header ── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            Carbon Footprint Assessment
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
            Know Your <span className="bg-gradient-to-r from-primary-500 to-emerald-500 bg-clip-text text-transparent">Impact</span>
          </h1>
          <p className="text-gray-500">Answer {totalSteps} quick questions and earn up to <span className="font-semibold text-primary-600">100 XP</span></p>
        </div>

        {/* ── XP + Progress bar ── */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <span className={`font-bold text-sm transition-colors ${xpFlash ? "text-yellow-500" : "text-gray-700"}`}>
                <AnimatedNumber value={xp} /> XP earned
              </span>
            </div>
            <span className="text-sm font-medium text-gray-500">{done.size}/{totalSteps} completed</span>
          </div>
          {/* Progress bar */}
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {/* Step dots */}                <nav className="flex gap-2" aria-label="Assessment progress">
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                title={s.title}
                className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${i === step ? "bg-primary-500" : done.has(i) ? "bg-primary-300" : "bg-gray-100"}`}
                role="progressbar"
                aria-valuenow={i <= step ? 100 : 0}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Step ${i + 1}: ${s.title}`}
              />
            ))}
          </nav>
        </div>

        {/* ── Live score pill ── */}
        <div className={`flex items-center gap-3 ${level.bg} rounded-xl px-4 py-3 mb-6 border border-transparent`}>
          <span className="text-xl">{level.badge}</span>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <span className={`text-sm font-semibold ${level.textColor}`}>{level.label}</span>
              <span className={`text-sm font-bold ${level.textColor}`}>
                <AnimatedNumber value={liveScore} /> kg CO₂
              </span>
            </div>
            <div className="h-1.5 bg-white rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${level.barBg}`}
                style={{ width: `${Math.min((liveScore / 1000) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* ── Question card ── */}
        <div
          key={animKey}
          className={`card mb-4 ${direction === "next" ? "anim-slide-next" : "anim-slide-back"}`}
        >
          {/* Step icon + number */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
              style={{ background: current.colorLight }}
            >
              {current.icon}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                Step {step + 1} of {totalSteps}
              </p>
              <h2 className="text-xl font-bold text-gray-900 leading-tight">{current.title}</h2>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-5">{current.subtitle}</p>

          {/* Number input */}
          {current.type === "number" && (
            <div className="relative mb-2">
              <label htmlFor={current.id} className="sr-only">{current.title}</label>
              <input
                ref={inputRef}
                id={current.id}
                type="number"
                min={current.min}
                placeholder={current.placeholder}
                value={currentValue}
                onChange={(e) => { setError(""); setFormData((p) => ({ ...p, [current.id]: e.target.value })); }}
                onKeyDown={(e) => e.key === "Enter" && goNext()}
                className="input-field text-lg font-semibold pr-32"
                aria-describedby={`tip-${current.id}`}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 pointer-events-none">
                {current.unit}
              </span>
            </div>
          )}

          {/* Choice input */}
          {current.type === "choice" && (
            <div className="grid grid-cols-3 gap-3 mb-2" role="radiogroup" aria-label={current.title}>
              {current.choices.map((c) => {
                const sel = currentValue === c.value;
                return (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => { setError(""); setFormData((p) => ({ ...p, [current.id]: c.value })); }}
                    role="radio"
                    aria-checked={sel}
                    aria-label={`${c.label}: ${c.desc}`}
                    className={`group flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all duration-200 focus:outline-none ${
                      sel ? `${c.border} ${c.bg}` : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <span className={`text-3xl transition-transform duration-200 ${sel ? "scale-110" : "group-hover:scale-105"}`}>{c.icon}</span>
                    <span className={`text-sm font-semibold ${sel ? c.highlight : "text-gray-700"}`}>{c.label}</span>
                    <span className="text-xs text-gray-400">{c.desc}</span>
                    <span className={`text-xs font-bold ${sel ? c.highlight : "text-gray-400"}`}>{c.co2}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-2">
              <span className="text-red-500 text-sm">⚠️</span>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Eco tip */}
          <div className="flex items-start gap-2 bg-primary-50 border border-primary-100 rounded-xl px-4 py-3 mt-4" id={`tip-${current.id}`}>
            <span className="text-sm mt-0.5" aria-hidden="true">💡</span>
            <p className="text-sm text-primary-700 leading-relaxed">{current.tip}</p>
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={goBack}
              className="btn-secondary !py-3.5 !px-6"
              aria-label="Go to previous question"
            >
              ← Back
            </button>
          )}

          {step < totalSteps - 1 ? (
            <button
              type="button"
              onClick={goNext}
              disabled={!isValid}
              className="btn-primary flex-1 !py-3.5 text-base"
              aria-label="Go to next question"
            >
              Next →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!isValid}
              className="btn-primary flex-1 !py-3.5 text-base"
              aria-label="Calculate my carbon footprint"
            >
              🌍 Calculate My Footprint
            </button>
          )}
        </div>

        {/* ── Skip to dashboard link ── */}
        <p className="text-center text-sm text-gray-400 mt-4">
          Already assessed?{" "}
          <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 font-medium">
            View Dashboard
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes slideNext {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes slideBack {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        .anim-slide-next { animation: slideNext 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
        .anim-slide-back { animation: slideBack 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }
      `}</style>
    </div>
  );
}
