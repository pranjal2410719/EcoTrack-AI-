import { useState } from "react";
import { showSuccess } from "../utils/toast";

const STORAGE_KEY = "ecotrack_goals";

const GOAL_TEMPLATES = [
  { id: "transport", icon: "🚗", label: "Reduce transport emissions by 20%", category: "transport" },
  { id: "electricity", icon: "⚡", label: "Cut electricity usage by 15%", category: "electricity" },
  { id: "diet", icon: "🥦", label: "Try plant-based meals 3x/week", category: "diet" },
  { id: "flights", icon: "✈️", label: "Take 1 less flight this year", category: "flights" },
  { id: "shopping", icon: "🛍️", label: "Reduce online shopping by 30%", category: "shopping" },
  { id: "custom", icon: "🎯", label: "Custom goal", category: "custom" },
];

export default function GoalsSection() {
  const [goals, setGoals] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [showForm, setShowForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ text: "", category: "custom", target: "" });

  function persist(updated) {
    setGoals(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function addGoal(template) {
    if (template.id === "custom") {
      setNewGoal({ text: "", category: "custom", target: "" });
      setShowForm((prev) => !prev);
      return;
    }
    const goal = {
      id: Date.now().toString(),
      text: template.label,
      icon: template.icon,
      category: template.category,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    persist([...goals, goal]);
    showSuccess("Goal added!", "Track your progress on the dashboard.");
  }

  function addCustomGoal() {
    if (!newGoal.text.trim()) return;
    const goal = {
      id: Date.now().toString(),
      text: newGoal.text,
      icon: "🎯",
      category: "custom",
      completed: false,
      createdAt: new Date().toISOString(),
    };
    persist([...goals, goal]);
    setShowForm(false);
    setNewGoal({ text: "", category: "custom", target: "" });
    showSuccess("Custom goal created!");
  }

  function toggleGoal(id) {
    persist(goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)));
  }

  function deleteGoal(id) {
    persist(goals.filter((g) => g.id !== id));
  }

  const activeGoals = goals.filter((g) => !g.completed);
  const completedGoals = goals.filter((g) => g.completed);
  const progress = goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎯</span>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Sustainability Goals</h3>
            <p className="text-xs text-gray-400">
              {activeGoals.length} active · {completedGoals.length} completed
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="btn-secondary !py-1.5 !px-3 text-xs"
        >
          + Add Goal
        </button>
      </div>

      {goals.length > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        {GOAL_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => addGoal(t)}
            className="text-xs bg-gray-50 hover:bg-primary-50 text-gray-600 hover:text-primary-700 border border-gray-200 hover:border-primary-200 rounded-xl px-3 py-2 transition-all duration-200"
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newGoal.text}
            onChange={(e) => setNewGoal((p) => ({ ...p, text: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && addCustomGoal()}
            placeholder="Enter your custom goal..."
            className="input-field flex-1 text-sm"
            aria-label="Custom goal description"
          />
          <button
            type="button"
            onClick={addCustomGoal}
            className="btn-primary !py-2 !px-4 text-sm"
          >
            Add
          </button>
        </div>
      )}

      {activeGoals.length > 0 && (
        <div className="space-y-2 mb-4">
          {activeGoals.map((goal) => (
            <div
              key={goal.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <button
                type="button"
                onClick={() => toggleGoal(goal.id)}
                className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0 hover:border-primary-500 transition-colors"
                aria-label={`Mark "${goal.text}" as complete`}
              />
              <span className="text-sm">{goal.icon}</span>
              <span className="text-sm text-gray-700 flex-1">{goal.text}</span>
              <button
                type="button"
                onClick={() => deleteGoal(goal.id)}
                className="text-gray-400 hover:text-red-500 transition-colors text-xs"
                aria-label={`Delete goal: ${goal.text}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {completedGoals.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase mb-2">Completed</p>
          <div className="space-y-1">
            {completedGoals.map((goal) => (
              <div key={goal.id} className="flex items-center gap-3 px-3 py-2">
                <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs flex-shrink-0">✓</span>
                <span className="text-sm text-gray-400 line-through flex-1">{goal.text}</span>
                <button
                  type="button"
                  onClick={() => deleteGoal(goal.id)}
                  className="text-gray-300 hover:text-red-500 transition-colors text-xs"
                  aria-label={`Remove completed goal: ${goal.text}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {goals.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">
          Set your first sustainability goal above! 🎯
        </p>
      )}
    </div>
  );
}
