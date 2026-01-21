import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

describe("LoadingSpinner", () => {
  it("should render with default size", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector("[role='status']");
    expect(spinner).toBeInTheDocument();
  });

  it("should render with small size", () => {
    const { container } = render(<LoadingSpinner size="sm" />);
    const spinner = container.querySelector("[role='status']");
    expect(spinner).toHaveClass("h-4", "w-4");
  });

  it("should render with medium size", () => {
    const { container } = render(<LoadingSpinner size="md" />);
    const spinner = container.querySelector("[role='status']");
    expect(spinner).toHaveClass("h-8", "w-8");
  });

  it("should render with large size", () => {
    const { container } = render(<LoadingSpinner size="lg" />);
    const spinner = container.querySelector("[role='status']");
    expect(spinner).toHaveClass("h-12", "w-12");
  });

  it("should have loading aria-label", () => {
    const { container } = render(<LoadingSpinner />);
    const spinner = container.querySelector("[aria-label='Loading']");
    expect(spinner).toBeInTheDocument();
  });
});
