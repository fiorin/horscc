import "@testing-library/jest-dom";
import { vi } from "vitest";
import React from "react";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock next/link
vi.mock("next/link", () => {
  return {
    default: ({ children, href }: any) => // eslint-disable-line @typescript-eslint/no-explicit-any
      React.createElement("a", { href }, children),
  };
});

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: any) => React.createElement("img", props), // eslint-disable-line @typescript-eslint/no-explicit-any
}));
