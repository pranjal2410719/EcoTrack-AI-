import { useState } from "react";
import { simulateReduction } from "../services/api";
import CarbonScoreCard from "../components/CarbonScoreCard";

const DIET_OPTIONS = [
  { value: "vegan", label: "🌱 Vegan" },
  { value: "vegetarian", label: "🥦 Vegetarian" },
  { value: "non-veg", label: "🍖 Non-Veg" },
];

const INITIAL_STATE = { transport: "", electricity: "", diet: "vegetarian", flights: "", shopping: "" };

export default function Simulator() {
  const [current, setCurrent] = useState({ ...INITIAL_STATE });
  const [target, setTarget] = useState({ ...INITIAL_STATE });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function parseValues(data) {
    return {
      transport: parseFloat(data.transport) || 0,
      electricity: parseFloat(data.electricity) || 0,
      diet: data.diet,
      flights: parseInt(data.flights, 10) || 0,
      shopping: parseInt(data.shopping, 10) || 0,
    };
  }

  async function handleSimulate() {
    setError("");
    setLoading(true);
    try {
      const res = await simulateReduction(parseValues(current), parseValues(target));
      setResult(res.data);
    } catch (err) {
      setError("Failed to calculate. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 rounded-full px-4 py-1.5 text-sm font-medium mb-4">
          <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />🌍
          Carbon Reduction Simulator
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">
          What If You{" "}
          <span className="bg-gradient-to-r from-primary-500 to-emerald-500 bg-clip-text text-transparent">
            Changed?
          </span>
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Compare your current lifestyle with a greener alternative and see exactly how much CO₂
          you could save per year.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Current Lifestyle */}
        <div className="card border-red-200 border-2">
          <h2 className="text-lg font-bold text-red-700 mb-1">Current Lifestyle</h2>
          <p className="text-sm text-gray-500 mb-6">Your starting point</p>
          <Fields id="current" data={current} setData={setCurrent} />
        </div>

        {/* Target Lifestyle */}
        <div className="card border-green-300 border-2">
          <h2 className="text-lg font-bold text-green-700 mb-1">Target Lifestyle</h2>
          <p className="text-sm text-gray-500 mb-6">Your greener alternative</p>
          <Fields id="target" data={target} setData={setTarget} />
        </div>
      </div>

      {/* Simulate button */}
      <div className="text-center mb-8">
        <button
          onClick={handleSimulate}
          disabled={loading}
          className="btn-primary !px-10 !py-4 text-lg"
        >
          {loading ? "Calculating..." : "🔬 Compare & See Savings"}
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Comparison cards */}
          <div className="grid lg:grid-cols-2 gap-6">
            <CarbonScoreCard
              score={result.current.total}
              level={result.current.level}
              breakdown={result.current.breakdown}
            />
            <CarbonScoreCard
              score={result.target.total}
              level={result.target.level}
              breakdown={result.target.breakdown}
            />
          </div>

          {/* Savings summary */}
          <div className="card bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 border-2">
            <div className="text-center mb-6">
              <span className="text-4xl block mb-2">📉</span>
              <h3 className="text-2xl font-bold text-gray-900">Your Potential Savings</h3>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Monthly Reduction</p>
                <p className="text-2xl font-bold text-green-600">{result.monthlyReduction} kg</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Annual Reduction</p>
                <p className="text-2xl font-bold text-emerald-600">{result.annualReduction} kg</p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center">
                <p className="text-sm text-gray-500 mb-1">Percentage</p>
                <p className="text-2xl font-bold text-primary-600">{result.percentageReduction}%</p>
              </div>
            </div>

            {/* Category breakdown */}
            {Object.keys(result.categorySavings).length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-medium text-gray-500 mb-3">Savings by Category</p>
                <div className="space-y-2">
                  {Object.entries(result.categorySavings).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center bg-white rounded-lg px-4 py-2">
                      <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                      <span className="text-sm font-bold text-green-600">-{value} kg/mo</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Level change */}
          {result.current.level !== result.target.level && (
            <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-yellow-800 font-medium">
                🎉 Switching from <strong>{result.current.level}</strong> Impact →{" "}
                <strong>{result.target.level}</strong> Impact!
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/** Reusable field group for current/target forms */
function Fields({ id, data, setData }) {
  const update = (field) => (e) => setData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor={`${id}-transport`} className="label">Transport (km/week)</label>
        <input id={`${id}-transport`} type="number" min="0" value={data.transport} onChange={update("transport")} className="input-field" placeholder="e.g. 150" />
      </div>
      <div>
        <label htmlFor={`${id}-electricity`} className="label">Electricity (₹/month)</label>
        <input id={`${id}-electricity`} type="number" min="0" value={data.electricity} onChange={update("electricity")} className="input-field" placeholder="e.g. 2500" />
      </div>
      <div>
        <label htmlFor={`${id}-diet`} className="label">Diet</label>
        <select id={`${id}-diet`} value={data.diet} onChange={update("diet")} className="input-field">
          {DIET_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
        </select>
      </div>
      <div>
        <label htmlFor={`${id}-flights`} className="label">Flights (per year)</label>
        <input id={`${id}-flights`} type="number" min="0" value={data.flights} onChange={update("flights")} className="input-field" placeholder="e.g. 2" />
      </div>
      <div>
        <label htmlFor={`${id}-shopping`} className="label">Shopping (orders/month)</label>
        <input id={`${id}-shopping`} type="number" min="0" value={data.shopping} onChange={update("shopping")} className="input-field" placeholder="e.g. 5" />
      </div>
    </div>
  );
}
