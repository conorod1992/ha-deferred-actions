export type Primitive = string | number | boolean | null;
export type DataValueType = "text" | "number" | "boolean" | "null";

export interface VisualTarget {
  entity_id?: string | string[];
  device_id?: string | string[];
  area_id?: string | string[];
  floor_id?: string | string[];
  label_id?: string | string[];
}

export interface DataEntry {
  key: string;
  type: DataValueType;
  value: Primitive;
  raw?: string;
}

export interface VisualAction {
  action: string;
  syntax?: "action" | "service";
  target: VisualTarget;
  scalarTargets?: (keyof VisualTarget)[];
  data: DataEntry[];
}

export type VisualCondition =
  | { type: "state"; entity_id: string; state: string }
  | { type: "numeric_state"; entity_id: string; above: string; below: string }
  | { type: "time"; after: string; before: string; weekdays: string[]; weekdayScalar?: boolean };

export interface VisualConditions {
  operator: "and" | "or";
  items: VisualCondition[];
  grouped?: boolean;
}

const asStringArray = (value: unknown): string[] | undefined => {
  if (value === undefined) return undefined;
  if (typeof value === "string") return [value];
  if (Array.isArray(value) && value.every((item) => typeof item === "string")) return [...value];
  return undefined;
};

const sameKeys = (object: Record<string, unknown>, allowed: string[]): boolean =>
  Object.keys(object).every((key) => allowed.includes(key));

export const sequenceToVisual = (sequence: Record<string, unknown>[]): VisualAction[] | undefined => {
  const result: VisualAction[] = [];
  for (const raw of sequence) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw) || !sameKeys(raw, ["action", "service", "target", "data"])) return undefined;
    const action = typeof raw.action === "string" ? raw.action : typeof raw.service === "string" ? raw.service : undefined;
    if (!action || (raw.action !== undefined && raw.service !== undefined)) return undefined;
    const targetRaw = raw.target ?? {};
    if (!targetRaw || typeof targetRaw !== "object" || Array.isArray(targetRaw)) return undefined;
    const targetObject = targetRaw as Record<string, unknown>;
    if (!sameKeys(targetObject, ["entity_id", "device_id", "area_id", "floor_id", "label_id"])) return undefined;
    const target: VisualTarget = {};
    for (const key of ["entity_id", "device_id", "area_id", "floor_id", "label_id"] as const) {
      const values = asStringArray(targetObject[key]);
      if (targetObject[key] !== undefined && !values) return undefined;
      if (values?.length) target[key] = values;
    }
    const dataRaw = raw.data ?? {};
    if (!dataRaw || typeof dataRaw !== "object" || Array.isArray(dataRaw)) return undefined;
    const entries = Object.entries(dataRaw as Record<string, unknown>);
    if (entries.some(([, value]) => value !== null && !["string", "number", "boolean"].includes(typeof value))) return undefined;
    const scalarTargets = (["entity_id", "device_id", "area_id", "floor_id", "label_id"] as const).filter((key) => typeof targetObject[key] === "string");
    result.push({ action, syntax: raw.service !== undefined ? "service" : "action", target, scalarTargets, data: entries.map(([key, value]) => dataEntry(key, value as Primitive)) });
  }
  return result;
};

export const visualToSequence = (actions: VisualAction[]): Record<string, unknown>[] => actions.map((item) => {
  const target = Object.fromEntries(Object.entries(item.target).filter(([, value]) => value?.length).map(([key, value]) => [key, item.scalarTargets?.includes(key as keyof VisualTarget) && Array.isArray(value) && value.length === 1 ? value[0] : value]));
  const data = Object.fromEntries(item.data.filter((entry) => entry.key.trim()).map((entry) => [entry.key.trim(), dataEntryValue(entry)]));
  return {
    [item.syntax ?? "action"]: item.action,
    ...(Object.keys(target).length ? { target } : {}),
    ...(Object.keys(data).length ? { data } : {}),
  };
});

const conditionFromRaw = (raw: Record<string, unknown>): VisualCondition | undefined => {
  if (raw.condition === "state" && sameKeys(raw, ["condition", "entity_id", "state"]) && typeof raw.entity_id === "string" && typeof raw.state === "string") {
    return { type: "state", entity_id: raw.entity_id, state: raw.state };
  }
  if (raw.condition === "numeric_state" && sameKeys(raw, ["condition", "entity_id", "above", "below"]) && typeof raw.entity_id === "string") {
    if (raw.above !== undefined && typeof raw.above !== "number") return undefined;
    if (raw.below !== undefined && typeof raw.below !== "number") return undefined;
    return { type: "numeric_state", entity_id: raw.entity_id, above: raw.above === undefined ? "" : String(raw.above), below: raw.below === undefined ? "" : String(raw.below) };
  }
  if (raw.condition === "time" && sameKeys(raw, ["condition", "after", "before", "weekday"])) {
    if (raw.after !== undefined && typeof raw.after !== "string") return undefined;
    if (raw.before !== undefined && typeof raw.before !== "string") return undefined;
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?$/;
    if ([raw.after, raw.before].some((value) => typeof value === "string" && !timePattern.test(value))) return undefined;
    const weekdays = asStringArray(raw.weekday) ?? [];
    if (raw.weekday !== undefined && !asStringArray(raw.weekday)) return undefined;
    return { type: "time", after: String(raw.after ?? ""), before: String(raw.before ?? ""), weekdays, weekdayScalar: typeof raw.weekday === "string" };
  }
  return undefined;
};

export const conditionsToVisual = (conditions: Record<string, unknown>[]): VisualConditions | undefined => {
  let operator: "and" | "or" = "and";
  let rawItems = conditions;
  let grouped = false;
  if (conditions.length === 1 && ["and", "or"].includes(String(conditions[0]?.condition))) {
    const group = conditions[0]!;
    if (!sameKeys(group, ["condition", "conditions"]) || !Array.isArray(group.conditions) || group.conditions.length === 0) return undefined;
    operator = group.condition as "and" | "or";
    grouped = true;
    rawItems = group.conditions as Record<string, unknown>[];
  }
  const items = rawItems.map(conditionFromRaw);
  return items.every(Boolean) ? { operator, items: items as VisualCondition[], grouped } : undefined;
};

export const visualToConditions = (visual: VisualConditions): Record<string, unknown>[] => {
  const conditions = visual.items.map((item): Record<string, unknown> => {
    if (item.type === "state") return { condition: "state", entity_id: item.entity_id, state: item.state };
    if (item.type === "numeric_state") return {
      condition: "numeric_state", entity_id: item.entity_id,
      ...(item.above.trim() ? { above: Number(item.above) } : {}),
      ...(item.below.trim() ? { below: Number(item.below) } : {}),
    };
    return {
      condition: "time",
      ...(item.after ? { after: item.after } : {}),
      ...(item.before ? { before: item.before } : {}),
      ...(item.weekdays.length ? { weekday: item.weekdayScalar && item.weekdays.length === 1 ? item.weekdays[0] : item.weekdays } : {}),
    };
  });
  return (visual.operator === "or" || visual.grouped) && conditions.length ? [{ condition: visual.operator, conditions }] : conditions;
};

export class UserFacingError extends Error {}

export const dataTypeFor = (value: Primitive): DataValueType => {
  if (value === null) return "null";
  return typeof value === "number" ? "number" : typeof value === "boolean" ? "boolean" : "text";
};

export const dataEntry = (key: string, value: Primitive): DataEntry => ({
  key,
  type: dataTypeFor(value),
  value,
  ...(typeof value === "string" || typeof value === "number" ? { raw: String(value) } : {}),
});

export const dataEntryValue = (entry: DataEntry): Primitive => {
  if (entry.type === "null") return null;
  if (entry.type === "boolean") return entry.value === true;
  if (entry.type === "text") return entry.raw ?? String(entry.value ?? "");
  const value = Number(entry.raw ?? entry.value);
  if (!Number.isFinite(value)) throw new UserFacingError(`Enter a finite number for “${entry.key || "this data field"}”.`);
  return value;
};

export const dataEntryWithType = (entry: DataEntry, type: DataValueType): DataEntry => {
  const raw = entry.raw ?? String(entry.value ?? "");
  if (type === "text") return { ...entry, type, value: raw, raw };
  if (type === "number") return { ...entry, type, raw };
  if (type === "boolean") return { ...entry, type, value: entry.value === true || raw === "true" };
  return { ...entry, type, value: null, raw: undefined };
};

export const friendlyError = (error: unknown): { message: string; details: string } => {
  const details = error instanceof Error ? error.message : String(error);
  const lower = details.toLowerCase();
  if (lower.includes("expected_revision") || lower.includes("revision") || lower.includes("conflict")) return { message: "This action changed elsewhere. Close the editor, reopen it, and try again.", details };
  if (lower.includes("permission") || lower.includes("unauthorized") || lower.includes("admin")) return { message: "You need administrator access to manage deferred actions.", details };
  if (lower.includes("valid_until")) return { message: "‘Don’t run after’ must be later than the scheduled time.", details };
  if (lower.includes("condition")) return { message: "One or more conditions are incomplete or invalid.", details };
  if (lower.includes("sequence") || lower.includes("action")) return { message: "The action sequence is incomplete or invalid.", details };
  return { message: "Home Assistant couldn’t save this deferred action.", details };
};

export const presentError = (error: unknown): { message: string; details?: string } => {
  if (error instanceof UserFacingError) return { message: error.message };
  const friendly = friendlyError(error);
  return { message: friendly.message, ...(friendly.details === friendly.message ? {} : { details: friendly.details }) };
};
