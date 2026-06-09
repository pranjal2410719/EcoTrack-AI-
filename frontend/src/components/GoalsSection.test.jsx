import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import GoalsSection from "./GoalsSection";

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("GoalsSection", () => {
  it("renders the goals section title", () => {
    render(<GoalsSection />);
    expect(screen.getByText("Sustainability Goals")).toBeInTheDocument();
  });

  it("shows empty state when no goals exist", () => {
    render(<GoalsSection />);
    expect(screen.getByText(/Set your first sustainability goal/)).toBeInTheDocument();
  });

  it("renders goal template buttons", () => {
    render(<GoalsSection />);
    expect(screen.getByText(/Reduce transport emissions/)).toBeInTheDocument();
    expect(screen.getByText(/Try plant-based meals/)).toBeInTheDocument();
    expect(screen.getByText(/Custom goal/)).toBeInTheDocument();
  });
});
