import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Assessment from "./Assessment";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    userId: "test-user-id",
    userEmail: "test@example.com",
    userName: "Test User",
  }),
}));

vi.mock("../services/api", () => ({
  saveAssessment: vi.fn(),
  analyzeAssessment: vi.fn(),
}));

describe("Assessment", () => {
  it("renders the assessment page header", () => {
    render(
      <MemoryRouter>
        <Assessment />
      </MemoryRouter>
    );
    expect(screen.getByText(/Carbon Footprint Assessment/i)).toBeInTheDocument();
  });

  it("renders step navigation with 5 steps", () => {
    render(
      <MemoryRouter>
        <Assessment />
      </MemoryRouter>
    );
    const steps = screen.getAllByRole("progressbar");
    expect(steps.length).toBe(5);
  });
});
