import "@testing-library/jest-dom";
import { vi } from "vitest";

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
    default: ({ children, href }: any) => (
      <a href={href}>{children}</a>
    ),
  };
});

// Mock next/image
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));
