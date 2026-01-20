import { describe, it, expect, vi } from "vitest";
import { showToast } from "../../src/lib/toast";
import toast from "react-hot-toast";

// Mock react-hot-toast
vi.mock("react-hot-toast", () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    promise: vi.fn(),
  },
}));

describe("Toast utilities", () => {
  it("should call toast.success", () => {
    showToast.success("Test message");
    expect(toast.success).toHaveBeenCalledWith("Test message");
  });

  it("should call toast.error", () => {
    showToast.error("Error message");
    expect(toast.error).toHaveBeenCalledWith("Error message");
  });

  it("should call toast.loading", () => {
    showToast.loading("Loading...");
    expect(toast.loading).toHaveBeenCalledWith("Loading...");
  });

  it("should call toast.promise with correct structure", async () => {
    const promise = Promise.resolve("success");
    const messages = {
      loading: "Loading",
      success: "Success",
      error: "Error",
    };

    showToast.promise(promise, messages);
    expect(toast.promise).toHaveBeenCalledWith(promise, messages);
  });
});
