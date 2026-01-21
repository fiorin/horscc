import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "@/hooks/useDebounce";

describe("useDebounce", () => {
  it("should return initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("test", 500));
    expect(result.current).toBe("test");
  });

  it("should debounce value changes", async () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "initial", delay: 100 } }
    );

    expect(result.current).toBe("initial");

    act(() => {
      rerender({ value: "updated", delay: 100 });
    });

    // Value hasn't changed yet (still debouncing)
    expect(result.current).toBe("initial");

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(result.current).toBe("updated");
  });

  it("should reset debounce on rapid changes", async () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 100),
      { initialProps: { value: "first" } }
    );

    act(() => {
      rerender({ value: "second" });
    });

    act(() => {
      rerender({ value: "third" });
    });

    // After all rapid changes, should still be original
    expect(result.current).toBe("first");

    // Wait for debounce
    await new Promise((resolve) => setTimeout(resolve, 150));

    // Should now be the latest value
    expect(result.current).toBe("third");
  });
});
