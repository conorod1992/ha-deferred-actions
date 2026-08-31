import { describe, expect, it } from "vitest";
import { isoToLocalInput, localInputToIso } from "./timezone";

describe("Home Assistant timezone wall-clock conversion", () => {
  it("interprets absolute input in the Home Assistant timezone rather than the browser timezone", () => {
    expect(localInputToIso("2026-01-15T12:00", "America/Los_Angeles")).toBe("2026-01-15T20:00:00.000Z");
    expect(localInputToIso("2026-07-15T12:00", "Europe/Dublin")).toBe("2026-07-15T11:00:00.000Z");
  });

  it("formats stored UTC timestamps back into HA-local datetime inputs", () => {
    expect(isoToLocalInput("2026-07-15T11:00:00Z", "Europe/Dublin")).toBe("2026-07-15T12:00");
  });

  it("rejects nonexistent DST wall-clock times", () => {
    expect(() => localInputToIso("2026-03-29T01:30", "Europe/Dublin")).toThrow("does not exist");
  });

  it("rejects ambiguous DST fall-back wall-clock times instead of silently choosing one", () => {
    expect(() => localInputToIso("2026-10-25T01:30", "Europe/Dublin")).toThrow("occurs twice");
  });

  it("handles non-hour DST transitions without guessing", () => {
    expect(() => localInputToIso("2026-04-05T01:45", "Australia/Lord_Howe")).toThrow("occurs twice");
  });
});
