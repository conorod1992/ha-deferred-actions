import { describe, expect, it } from "vitest";
import { relativeTime } from "./format";

describe("relativeTime", () => {
  it("formats future minutes", () => {
    expect(relativeTime("2026-01-01T00:20:00Z", Date.parse("2026-01-01T00:00:00Z"))).toBe("in 20 minutes");
  });
  it("formats overdue times", () => {
    expect(relativeTime("2026-01-01T00:00:00Z", Date.parse("2026-01-01T00:01:00Z"))).toBe("overdue by 1 minute");
  });
});
