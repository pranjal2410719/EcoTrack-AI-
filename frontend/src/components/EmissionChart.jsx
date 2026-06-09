import { memo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = {
  transport: "#3B82F6",
  electricity: "#F59E0B",
  flights: "#EF4444",
  shopping: "#8B5CF6",
  diet: "#22C55E",
};

const LABELS = {
  transport: "Transport",
  electricity: "Energy",
  flights: "Travel",
  shopping: "Shopping",
  diet: "Food",
};

const EmissionChart = memo(function EmissionChart({ breakdown }) {
  if (!breakdown) {
    return (
      <div className="card text-center py-8">
        <span className="text-3xl mb-3 block">📊</span>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Emission Breakdown</h3>
        <p className="text-gray-500 text-sm">
          Complete an assessment to see your emission breakdown.
        </p>
      </div>
    );
  }

  const data = Object.entries(breakdown).map(([key, value]) => ({
    name: LABELS[key] || key,
    value: Math.max(value, 0.1), // Minimum value for display
    color: COLORS[key] || "#999",
  }));

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const percentage = ((item.value / total) * 100).toFixed(1);
      return (
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-3">
          <p className="font-medium text-gray-900">{item.name}</p>
          <p className="text-sm text-gray-500">
            {item.value.toFixed(1)} kg ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" role="region" aria-label="Emission breakdown chart">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Emission Breakdown</h3>
      <div className="h-[280px]" role="img" aria-label={`Emission breakdown: ${data.map(d => `${d.name}: ${d.value.toFixed(1)} kg`).join(", ")}`}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => (
                <span className="text-sm text-gray-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Total Emissions</span>
          <span className="text-lg font-bold text-gray-900">{total.toFixed(1)} kg CO₂</span>
        </div>
      </div>
    </div>
  );
});

export default EmissionChart;
