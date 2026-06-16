import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Simulator from "./Simulator";

vi.mock("../services/api", () => ({
  simulateReduction: vi.fn(),
}));

describe("Simulator", () => {
  it("renders the simulator header", () => {
    render(
      <BrowserRouter>
        <Simulator />
      </BrowserRouter>
    );
    expect(screen.getByText(/Carbon Reduction Simulator/i)).toBeInTheDocument();
  });

  it("renders the compare button", () => {
    render(
      <BrowserRouter>
        <Simulator />
      </BrowserRouter>
    );
    expect(screen.getByRole("button", { name: /Compare & See Savings/i })).toBeInTheDocument();
  });
});
