import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "./Dashboard";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null, loading: false }),
}));

vi.mock("../services/api", () => ({
  getDashboard: vi.fn(),
}));

describe("Dashboard", () => {
  it("shows the empty state when no assessments exist", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    expect(screen.getByText(/No Assessments Yet/i)).toBeInTheDocument();
  });

  it("shows a link to take a new assessment", () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
    const link = screen.getByRole("link", { name: /Take Assessment/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/assessment");
  });
});
