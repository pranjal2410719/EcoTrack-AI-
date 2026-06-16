import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import Coach from "./Coach";

// Mock scrollIntoView for jsdom
Element.prototype.scrollIntoView = vi.fn();

vi.mock("../services/api", () => ({
  chatWithCoach: vi.fn(),
}));

describe("Coach", () => {
  it("renders the AI Climate Coach badge", () => {
    render(
      <BrowserRouter>
        <Coach />
      </BrowserRouter>
    );
    expect(screen.getByText(/AI Climate Coach/i)).toBeInTheDocument();
  });

  it("renders the chat input field", () => {
    render(
      <BrowserRouter>
        <Coach />
      </BrowserRouter>
    );
    expect(
      screen.getByPlaceholderText(/Ask me anything about sustainability/i)
    ).toBeInTheDocument();
  });
});
