const levelConfig = {
  Low: {
    color: "text-green-700",
    bg: "bg-green-100",
    border: "border-green-300",
    icon: "🎉",
    label: "Low Impact",
    barColor: "bg-green-500",
    barWidth: "25%",
  },
  Moderate: {
    color: "text-yellow-700",
    bg: "bg-yellow-100",
    border: "border-yellow-300",
    icon: "🌿",
    label: "Moderate Impact",
    barColor: "bg-yellow-500",
    barWidth: "55%",
  },
  High: {
    color: "text-red-700",
    bg: "bg-red-100",
    border: "border-red-300",
    icon: "⚠️",
    label: "High Impact",
    barColor: "bg-red-500",
    barWidth: "85%",
  },
};

export default function CarbonScoreCard({ score, level, breakdown }) {
  const config = levelConfig[level] || levelConfig.Moderate;

  return (
    <div className={`card ${config.bg} ${config.border} border-2`} role="region" aria-label={`Carbon score: ${level} impact`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">Carbon Score</p>
          <h3 className="text-4xl font-bold text-gray-900">
            {Math.round(score)}
            <span className="text-lg font-normal text-gray-400 ml-1">kg CO₂</span>
          </h3>
        </div>
        <span className="text-3xl">{config.icon}</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1.5">
          <span className={`font-semibold ${config.color}`}>{config.label}</span>
          <span className="text-gray-400">{level}</span>
        </div>
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${config.barColor}`}
            style={{ width: config.barWidth }}
          />
        </div>
      </div>

      {breakdown && (
        <div className="space-y-2 pt-3 border-t border-gray-200/60">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Breakdown</p>
          {Object.entries(breakdown).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-gray-600 capitalize">{key}</span>
              <span className="text-gray-900 font-medium">{value} kg</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
