import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDashboard } from "../services/api";
import CarbonScoreCard from "../components/CarbonScoreCard";
import EmissionChart from "../components/EmissionChart";
import RecommendationCard from "../components/RecommendationCard";
import DashboardSkeleton from "../components/DashboardSkeleton";
import GoalsSection from "../components/GoalsSection";
import { showError } from "../utils/toast";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Wait for auth to finish — don't fetch until we have a real userId
    if (authLoading) return;
    if (!userId) return;

    let cancelled = false;
    async function fetchDashboard() {
      setLoading(true);
      setError("");
      try {
        const result = await getDashboard();
        if (!cancelled) setData(result.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (!cancelled) {
          setError("Failed to load dashboard data.");
          showError("Failed to load dashboard", "Please try again or check your connection.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDashboard();
    return () => { cancelled = true; };
  }, [authLoading, userId]);

  // Auth is still resolving — show skeleton
  if (authLoading) return <DashboardSkeleton />;

  // Auth done, fetching data — show skeleton
  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <span className="text-4xl block mb-4">😕</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!data?.hasAssessment) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <span className="text-5xl block mb-4">🌱</span>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Assessments Yet</h2>
          <p className="text-gray-500 mb-6">
            Take your first carbon footprint assessment to see your dashboard.
          </p>
          <Link to="/assessment" className="btn-primary">
            Take Assessment
          </Link>
        </div>
      </div>
    );
  }

  const { latestAssessment, recommendations, history, progress } = data;

  const trendUp = progress.reduction > 0;
  const trendColor = trendUp ? "text-green-600" : "text-red-600";
  const trendBg = trendUp ? "bg-green-50" : "bg-red-50";
  const trendIcon = trendUp ? "📉" : "📈";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
          <p className="text-gray-500 mt-1">Track your carbon footprint and sustainability progress.</p>
        </div>
        <Link to="/assessment" className="btn-primary !py-2.5 !px-5 text-sm whitespace-nowrap">
          + New Assessment
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        <CarbonScoreCard
          score={latestAssessment.carbon_score}
          level={latestAssessment.level}
          breakdown={latestAssessment.breakdown}
        />

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{trendIcon}</span>
            <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Last Month</span>
              <span className="font-semibold text-gray-900">{progress.lastMonth} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Current Month</span>
              <span className="font-semibold text-gray-900">{progress.currentMonth} kg</span>
            </div>
            <div className={`flex justify-between items-center p-3 rounded-xl ${trendBg}`}>
              <span className="text-sm font-medium">Reduction</span>
              <span className={`font-bold text-lg ${trendColor}`}>
                {progress.reduction.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">🏆</span>
            <h3 className="text-lg font-semibold text-gray-900">Quick Stats</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Assessments Taken</span>
              <span className="font-semibold text-gray-900">{history?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Carbon Level</span>
              <span className={`font-semibold ${
                latestAssessment.level === "Low" ? "text-green-600" :
                latestAssessment.level === "Moderate" ? "text-yellow-600" : "text-red-600"
              }`}>
                {latestAssessment.level}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Transport</span>
              <span className="font-semibold text-gray-900">{latestAssessment.transport} km/wk</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Diet</span>
              <span className="font-semibold text-gray-900 capitalize">{latestAssessment.diet}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <EmissionChart breakdown={latestAssessment.breakdown} />
        <RecommendationCard analysis={recommendations} />
      </div>

      {/* Goals Section */}
      <div className="mb-6">
        <GoalsSection latestAssessment={latestAssessment} />
      </div>

      {history && history.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Score History</h3>
          <div className="space-y-3">
            {history.map((entry, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    entry.carbon_score < 200 ? "bg-green-500" :
                    entry.carbon_score < 500 ? "bg-yellow-500" : "bg-red-500"
                  }`} />
                  <span className="text-sm text-gray-600">
                    {new Date(entry.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <span className="font-semibold text-gray-900">{entry.carbon_score} kg</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
