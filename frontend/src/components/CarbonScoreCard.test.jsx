import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CarbonScoreCard from "./CarbonScoreCard";

describe("CarbonScoreCard", () => {
  const mockBreakdown = {
    transport: 31.5,
    electricity: 2.0,
    flights: 180,
    shopping: 25,
    diet: 50,
  };

  it("renders the score correctly", () => {
    render(<CarbonScoreCard score={288.5} level="Moderate" breakdown={mockBreakdown} />);
    expect(screen.getByText("289")).toBeInTheDocument();
    expect(screen.getByText("kg CO₂")).toBeInTheDocument();
  });

  it("renders the correct level label", () => {
    render(<CarbonScoreCard score={100} level="Low" breakdown={mockBreakdown} />);
    expect(screen.getByText("Low Impact")).toBeInTheDocument();
  });

  it("renders breakdown categories", () => {
    render(<CarbonScoreCard score={288.5} level="Moderate" breakdown={mockBreakdown} />);
    expect(screen.getByText("transport")).toBeInTheDocument();
    expect(screen.getByText("electricity")).toBeInTheDocument();
    expect(screen.getByText("flights")).toBeInTheDocument();
    expect(screen.getByText("shopping")).toBeInTheDocument();
    expect(screen.getByText("diet")).toBeInTheDocument();
  });

  it("renders without breakdown", () => {
    render(<CarbonScoreCard score={100} level="Low" />);
    expect(screen.getByText("Low Impact")).toBeInTheDocument();
    expect(screen.queryByText("transport")).not.toBeInTheDocument();
  });

  it("renders High level correctly", () => {
    render(<CarbonScoreCard score={600} level="High" breakdown={mockBreakdown} />);
    expect(screen.getByText("High Impact")).toBeInTheDocument();
  });
});
