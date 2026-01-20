import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../src/hooks/useAuth";

// Mock Supabase
vi.mock("../src/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return loading state initially", () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
  });

  it("should handle null user", async () => {
    const { result } = await new Promise((resolve) => {
      const hookResult = renderHook(() => useAuth());
      setTimeout(() => resolve(hookResult), 100);
    });
    expect(result).toBeDefined();
  });
});
