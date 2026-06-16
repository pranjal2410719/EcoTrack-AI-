import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./Home";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null }),
}));

describe("Home", () => {
  it("renders the hero section heading", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders the How It Works section with 3 steps", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/How It Works/i)).toBeInTheDocument();
    expect(screen.getByText(/Take the Assessment/i)).toBeInTheDocument();
    expect(screen.getByText(/Get Your Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Track & Reduce/i)).toBeInTheDocument();
  });
});
