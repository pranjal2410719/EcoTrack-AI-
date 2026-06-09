import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingSpinner from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("renders without text", () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("renders with text", () => {
    render(<LoadingSpinner text="Loading..." />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders with different sizes", () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toHaveClass("h-12");
    expect(spinner).toHaveClass("w-12");
  });
});
