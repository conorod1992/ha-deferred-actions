import type { DataEntry, Primitive } from "./editor-model";
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
