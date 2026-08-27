import { describe, expect, it } from "vitest";
import { dataEntry } from "./editor-model";
import { defaultValueForSelector, selectorFieldForAction, selectorFieldsForAction, selectorValueForEntry } from "./service-selectors";
import type { HomeAssistant } from "./types";

const hass = {
  services: {
    light: {
      turn_on: {
        fields: {
          brightness_pct: { name: "Brightness", selector: { number: { min: 0, max: 100 } } },
          flash: { selector: { select: { options: ["short", "long"] } } },
          effect: { selector: { select: { multiple: true, options: ["one"] } } },
          rgb_color: { selector: { color_rgb: {} } },
        },
      },
    },
  },
} as unknown as HomeAssistant;

describe("service selector metadata", () => {
  it("exposes only primitive, lossless Home Assistant selectors", () => {
    expect(selectorFieldsForAction(hass, "light.turn_on").map((field) => field.key)).toEqual(["brightness_pct", "flash"]);
    expect(selectorFieldForAction(hass, "light.turn_on", "brightness_pct")?.name).toBe("Brightness");
    expect(selectorFieldForAction(hass, "light.turn_on", "rgb_color")).toBeUndefined();
  });

  it("keeps the typed scalar fallback representation compatible with selector values", () => {
    expect(selectorValueForEntry(dataEntry("brightness_pct", 42))).toBe(42);
    expect(selectorValueForEntry(dataEntry("flash", "short"))).toBe("short");
    expect(defaultValueForSelector({ boolean: {} })).toBe(false);
    expect(defaultValueForSelector({ number: {} })).toBe("");
  });
});
