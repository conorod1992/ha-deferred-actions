import { readFileSync, writeFileSync } from "node:fs";

const panelPath = "src/deferred-actions-panel.ts";
let panel = readFileSync(panelPath, "utf8");

const replaceOnce = (oldValue, newValue) => {
  const first = panel.indexOf(oldValue);
  if (first < 0 || panel.indexOf(oldValue, first + oldValue.length) >= 0) {
    throw new Error(`Expected exactly one match: ${oldValue.slice(0, 100)}`);
  }
  panel = panel.replace(oldValue, newValue);
};

replaceOnce(
  '  conditionsToVisual, dataEntryWithType, newVisualAction, presentError, sequenceToVisual, UserFacingError, visualToConditions, visualToSequence,\n',
  '  conditionsToVisual, dataEntry, dataEntryWithType, newVisualAction, presentError, sequenceToVisual, UserFacingError, visualToConditions, visualToSequence,\n',
);
replaceOnce(
  'import { buildJobPreview, effectiveOverdueLabel, groupActiveJobs, historyOutcome, isHistoryStatus, localDate, matchesJobSearch, relativeTime, resolutionHints, snoozePresets } from "./format";\n',
  'import { buildJobPreview, effectiveOverdueLabel, groupActiveJobs, historyOutcome, isHistoryStatus, localDate, matchesJobSearch, relativeTime, resolutionHints, snoozePresets } from "./format";\nimport { defaultValueForSelector, selectorFieldForAction, selectorFieldsForAction, selectorValueForEntry } from "./service-selectors";\nimport { isoToLocalInput, localInputToIso } from "./timezone";\n',
);
replaceOnce(
  '    this.validUntil = job?.valid_until_local?.slice(0, 16) ?? "";\n',
  '    this.validUntil = job?.valid_until ? isoToLocalInput(job.valid_until, this.timeZone) : "";\n',
);
replaceOnce(
  '        valid_until: String(form.get("valid_until") ?? "") ? new Date(String(form.get("valid_until"))).toISOString() : null,\n',
  '        valid_until: this.validUntil ? this.localWallTimeToIso(this.validUntil) : null,\n',
);
replaceOnce(
  '          const local = new Date(`${date}T${time}`);\n          if (Number.isNaN(local.getTime())) throw new UserFacingError("Choose a valid date and time");\n          schedule = { execute_at: local.toISOString() };\n',
  '          schedule = { execute_at: this.localWallTimeToIso(`${date}T${time}`) };\n',
);
replaceOnce(
  '  private previewValidUntil(): string | undefined {\n    const value = new Date(this.validUntil);\n    return Number.isNaN(value.getTime()) ? undefined : localDate(value.toISOString(), this.timeZone);\n  }\n',
  '  private localWallTimeToIso(value: string): string {\n    try { return localInputToIso(value, this.timeZone); }\n    catch { throw new UserFacingError(`Choose a valid date and time in the Home Assistant timezone (${this.timeZone}).`); }\n  }\n\n  private previewValidUntil(): string | undefined {\n    try { return localDate(localInputToIso(this.validUntil, this.timeZone), this.timeZone); }\n    catch { return undefined; }\n  }\n',
);
replaceOnce(
  '      const local = new Date(`${String(form.get("date"))}T${String(form.get("time"))}`);\n      if (Number.isNaN(local.getTime())) { this.error = "Choose a valid date and time"; return; }\n      await this.operate("reschedule", dialog.job, { execute_at: local.toISOString() });\n',
  '      try {\n        const executeAt = this.localWallTimeToIso(`${String(form.get("date"))}T${String(form.get("time"))}`);\n        await this.operate("reschedule", dialog.job, { execute_at: executeAt });\n      } catch (error) { this.setError(error); return; }\n',
);

const start = panel.indexOf("  private renderActionData(action: VisualServiceAction");
const end = panel.indexOf("  private renderDataValue", start);
if (start < 0 || end < 0) throw new Error("Could not locate renderActionData");
const replacement = `  private renderActionData(action: VisualServiceAction, update: (action: VisualServiceAction) => void): ReturnType<typeof html> {
    const updateData = (index: number, patch: Partial<DataEntry>) => update({ ...action, data: action.data.map((entry, itemIndex) => itemIndex === index ? { ...entry, ...patch } : entry) });
    const selectorFields = selectorFieldsForAction(this.hass, action.action);
    const availableSelectorFields = selectorFields.filter((field) => !action.data.some((entry) => entry.key === field.key));
    const addSelectorField = (event: Event): void => {
      const select = event.currentTarget as HTMLSelectElement;
      const field = selectorFields.find((item) => item.key === select.value);
      if (!field) return;
      update({ ...action, data: [...action.data, dataEntry(field.key, defaultValueForSelector(field.selector, field.default))] });
      select.value = "";
    };
    return html\`<div class="section-head"><strong>Action data</strong><button type="button" class="link" @click=\${() => update({ ...action, data: [...action.data, { key: "", type: "text", value: "", raw: "" }] })}>Add custom field</button></div>
      \${availableSelectorFields.length ? html\`<label>Add Home Assistant field<select aria-label="Add Home Assistant field" @change=\${addSelectorField}><option value="">Choose a field…</option>\${availableSelectorFields.map((field) => html\`<option value=\${field.key}>\${field.name ?? field.key}\${field.required ? " (required)" : ""}</option>\`)}</select><small>Fields advertised by Home Assistant use their native selector. Custom or unsupported values still use the typed fallback below.</small></label>\` : nothing}
      \${action.data.map((entry, index) => {
        const field = selectorFieldForAction(this.hass, action.action, entry.key);
        return html\`<div class="data-row"><input aria-label="Data field" placeholder="brightness_pct" .value=\${entry.key} @input=\${(event: InputEvent) => updateData(index, { key: (event.currentTarget as HTMLInputElement).value })}>\${field ? html\`<span class="null-value">Home Assistant</span>\` : html\`<select aria-label="Data value type" .value=\${entry.type} @change=\${(event: Event) => updateData(index, dataEntryWithType(entry, (event.currentTarget as HTMLSelectElement).value as DataValueType))}><option value="text">Text</option><option value="number">Number</option><option value="boolean">Boolean</option><option value="null">Null</option></select>\`}\${field ? html\`<div><ha-selector .hass=\${this.hass} .selector=\${field.selector} .value=\${selectorValueForEntry(entry)} .label=\${field.name ?? entry.key} @value-changed=\${(event: CustomEvent<{ value: unknown }>) => { const value = event.detail.value; if (value === null || ["string", "number", "boolean"].includes(typeof value)) update({ ...action, data: action.data.map((item, itemIndex) => itemIndex === index ? dataEntry(entry.key, value as string | number | boolean | null) : item) }); else this.setError(new UserFacingError("This Home Assistant field returned a structured value. Use a custom field or YAML for this action.")); }}></ha-selector>\${field.description ? html\`<small>\${field.description}</small>\` : nothing}</div>\` : this.renderDataValue(entry, (patch) => updateData(index, patch))}<button type="button" class="icon" title="Remove data field" @click=\${() => update({ ...action, data: action.data.filter((_, itemIndex) => itemIndex !== index) })}><ha-icon icon="mdi:close"></ha-icon></button></div>\`;
      })}\`;
  }

`;
panel = panel.slice(0, start) + replacement + panel.slice(end);
writeFileSync(panelPath, panel);

writeFileSync("src/timezone.ts", `interface WallClockParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

const formatterFor = (timeZone: string) => new Intl.DateTimeFormat("en-GB", {
  timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const wallClockParts = (date: Date, timeZone: string): WallClockParts => {
  const parts = formatterFor(timeZone).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return { year: value("year"), month: value("month"), day: value("day"), hour: value("hour"), minute: value("minute"), second: value("second") };
};

const parseLocalInput = (value: string): WallClockParts => {
  const match = /^(\\d{4})-(\\d{2})-(\\d{2})T(\\d{2}):(\\d{2})(?::(\\d{2}))?$/.exec(value);
  if (!match) throw new RangeError("Invalid local date/time");
  const parts = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]), hour: Number(match[4]), minute: Number(match[5]), second: Number(match[6] ?? 0) };
  const probe = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second));
  if (probe.getUTCFullYear() !== parts.year || probe.getUTCMonth() + 1 !== parts.month || probe.getUTCDate() !== parts.day || probe.getUTCHours() !== parts.hour || probe.getUTCMinutes() !== parts.minute || probe.getUTCSeconds() !== parts.second) throw new RangeError("Invalid local date/time");
  return parts;
};

const sameParts = (left: WallClockParts, right: WallClockParts): boolean => left.year === right.year && left.month === right.month && left.day === right.day && left.hour === right.hour && left.minute === right.minute && left.second === right.second;
const asUtcMs = (parts: WallClockParts): number => Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
const pad = (value: number): string => String(value).padStart(2, "0");

export const isoToLocalInput = (iso: string, timeZone: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) throw new RangeError("Invalid timestamp");
  const parts = wallClockParts(date, timeZone);
  return \`\${parts.year}-\${pad(parts.month)}-\${pad(parts.day)}T\${pad(parts.hour)}:\${pad(parts.minute)}\`;
};

export const localInputToIso = (value: string, timeZone: string): string => {
  const target = parseLocalInput(value);
  const targetAsUtc = asUtcMs(target);
  let candidate = targetAsUtc;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const displayed = wallClockParts(new Date(candidate), timeZone);
    const delta = targetAsUtc - asUtcMs(displayed);
    if (delta === 0) break;
    candidate += delta;
  }
  const result = new Date(candidate);
  if (!sameParts(wallClockParts(result, timeZone), target)) throw new RangeError("This wall-clock time does not exist in the selected timezone");
  return result.toISOString();
};
`);

writeFileSync("src/service-selectors.ts", `import type { DataEntry, Primitive } from "./editor-model";
import type { HomeAssistant } from "./types";

export interface ServiceFieldDescription {
  name?: string;
  description?: string;
  required?: boolean;
  default?: unknown;
  selector?: Record<string, unknown>;
}

export interface SelectorServiceField extends ServiceFieldDescription {
  key: string;
  selector: Record<string, unknown>;
}

type HassWithServices = HomeAssistant & {
  services?: Record<string, Record<string, { fields?: Record<string, ServiceFieldDescription> }>>;
};

const supportedSelector = (selector: Record<string, unknown> | undefined): selector is Record<string, unknown> => {
  if (!selector) return false;
  const keys = Object.keys(selector);
  if (keys.length !== 1) return false;
  const kind = keys[0];
  if (!kind || !["number", "boolean", "select", "text", "time", "date", "datetime"].includes(kind)) return false;
  if (kind === "select") {
    const config = selector.select;
    if (config && typeof config === "object" && !Array.isArray(config) && (config as Record<string, unknown>).multiple === true) return false;
  }
  return true;
};

const serviceFields = (hass: HomeAssistant, action: string): Record<string, ServiceFieldDescription> => {
  const [domain, service, ...rest] = action.split(".");
  if (!domain || !service || rest.length) return {};
  return (hass as HassWithServices).services?.[domain]?.[service]?.fields ?? {};
};

export const selectorFieldsForAction = (hass: HomeAssistant, action: string): SelectorServiceField[] => Object.entries(serviceFields(hass, action))
  .filter(([, field]) => supportedSelector(field.selector))
  .map(([key, field]) => ({ ...field, key, selector: field.selector! }));

export const selectorFieldForAction = (hass: HomeAssistant, action: string, key: string): SelectorServiceField | undefined => selectorFieldsForAction(hass, action).find((field) => field.key === key);

export const defaultValueForSelector = (selector: Record<string, unknown>, configuredDefault?: unknown): Primitive => {
  if (configuredDefault === null || ["string", "number", "boolean"].includes(typeof configuredDefault)) return configuredDefault as Primitive;
  return Object.prototype.hasOwnProperty.call(selector, "boolean") ? false : "";
};

export const selectorValueForEntry = (entry: DataEntry): Primitive | undefined => {
  if (entry.type === "null") return null;
  if (entry.type === "boolean") return entry.value === true;
  if (entry.type === "number") {
    const value = Number(entry.raw ?? entry.value);
    return Number.isFinite(value) ? value : undefined;
  }
  return entry.raw ?? String(entry.value ?? "");
};
`);

writeFileSync("src/timezone.test.ts", `import { describe, expect, it } from "vitest";
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
    expect(() => localInputToIso("2026-03-29T01:30", "Europe/Dublin")).toThrow();
  });
});
`);

writeFileSync("src/service-selectors.test.ts", `import { describe, expect, it } from "vitest";
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
`);
