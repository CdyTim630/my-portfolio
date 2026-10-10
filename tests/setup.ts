import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Next transforms local font imports during builds; jsdom only needs their classes.
vi.mock("next/font/local", () => ({
  default: () => ({ variable: "test-local-font", className: "test-local-font" }),
}));

afterEach(() => {
  cleanup();
});
