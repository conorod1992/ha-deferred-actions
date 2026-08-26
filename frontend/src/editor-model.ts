export type Primitive = string | number | boolean | null;
export type DataValueType = "text" | "number" | "boolean" | "null";
export type RawObject = Record<string, unknown>;

export interface VisualTarget { entity_id?: string | string[]; device_id?: string | string[]; area_id?: string | string[]; floor_id?: string | string[]; label_id?: string | string[] }
export interface DataEntry { key: string; type: DataValueType; value: Primitive; raw?: string }
interface WithMetadata { metadata: RawObject }
export interface VisualServiceAction extends WithMetadata { kind: "service"; action: string; syntax?: "action" | "service"; target: VisualTarget; scalarTargets?: (keyof VisualTarget)[]; data: DataEntry[] }
export interface VisualIfAction extends WithMetadata { kind: "if"; conditions: VisualCondition[]; then: VisualAction[]; else?: VisualAction[] }
export interface VisualChooseBranch extends WithMetadata { conditions: VisualCondition[]; sequence: VisualAction[] }
export interface VisualChooseAction extends WithMetadata { kind: "choose"; choices: VisualChooseBranch[]; default?: VisualAction[] }
export interface VisualRepeatAction extends WithMetadata { kind: "repeat"; mode: "count" | "while" | "until" | "for_each"; value?: unknown; conditions?: VisualCondition[]; sequence: VisualAction[] }
export interface VisualParallelBranch extends WithMetadata { wrapped: boolean; sequence: VisualAction[] }
export interface VisualParallelAction extends WithMetadata { kind: "parallel"; branches: VisualParallelBranch[] }
export interface VisualDelayAction extends WithMetadata { kind: "delay"; value: unknown }
export interface VisualWaitAction extends WithMetadata { kind: "wait_template"; template: string; timeout?: unknown; continueOnTimeout?: boolean }
export interface UnsupportedAction { kind: "unsupported"; raw: RawObject }
export type VisualAction = VisualServiceAction | VisualIfAction | VisualChooseAction | VisualRepeatAction | VisualParallelAction | VisualDelayAction | VisualWaitAction | UnsupportedAction;

interface ConditionBase extends WithMetadata { alias?: string }
export type VisualCondition =
  | (ConditionBase & { type: "state"; entity_id: string; state: string })
  | (ConditionBase & { type: "numeric_state"; entity_id: string; above: string; below: string })
  | (ConditionBase & { type: "time"; after: string; before: string; weekdays: string[]; weekdayScalar?: boolean })
  | (ConditionBase & { type: "zone"; entity_id: string; zone: string })
  | (ConditionBase & { type: "sun"; after: string; before: string; after_offset: string; before_offset: string })
  | (ConditionBase & { type: "and" | "or" | "not"; conditions: VisualCondition[] })
  | { type: "unsupported"; raw: RawObject };
export interface VisualConditions { operator: "and" | "or"; items: VisualCondition[]; grouped?: boolean; metadata?: RawObject }

const isObject = (value: unknown): value is RawObject => !!value && typeof value === "object" && !Array.isArray(value);
const asStringArray = (value: unknown): string[] | undefined => typeof value === "string" ? [value] : Array.isArray(value) && value.every((item) => typeof item === "string") ? [...value] : value === undefined ? undefined : undefined;
const splitKeys = (raw: RawObject, structural: string[], common = ["alias", "description", "enabled", "continue_on_error"]): RawObject | undefined => {
  const allowed = new Set([...structural, ...common]);
  return Object.keys(raw).some((key) => !allowed.has(key)) ? undefined : Object.fromEntries(Object.entries(raw).filter(([key]) => common.includes(key)));
};
const conditionsArray = (value: unknown): VisualCondition[] | undefined => Array.isArray(value) ? value.map((item) => isObject(item) ? conditionFromRaw(item) : ({ type: "unsupported", raw: { value: item } })) : undefined;

const actionFromRaw = (raw: RawObject): VisualAction => {
  const service = typeof raw.action === "string" ? raw.action : typeof raw.service === "string" ? raw.service : undefined;
  if (service && !(raw.action !== undefined && raw.service !== undefined)) {
    const metadata = splitKeys(raw, ["action", "service", "target", "data"]); const targetRaw = raw.target ?? {}; const dataRaw = raw.data ?? {};
    if (metadata && isObject(targetRaw) && isObject(dataRaw) && Object.keys(targetRaw).every((key) => ["entity_id", "device_id", "area_id", "floor_id", "label_id"].includes(key))) {
      const target: VisualTarget = {};
      for (const key of ["entity_id", "device_id", "area_id", "floor_id", "label_id"] as const) { const values = asStringArray(targetRaw[key]); if (targetRaw[key] !== undefined && !values) return { kind: "unsupported", raw }; if (values?.length) target[key] = values; }
      const entries = Object.entries(dataRaw);
      if (entries.every(([, value]) => value === null || ["string", "number", "boolean"].includes(typeof value))) return { kind: "service", action: service, syntax: raw.service !== undefined ? "service" : "action", target, scalarTargets: (["entity_id", "device_id", "area_id", "floor_id", "label_id"] as const).filter((key) => typeof targetRaw[key] === "string"), data: entries.map(([key, value]) => dataEntry(key, value as Primitive)), metadata };
    }
  }
  if (Array.isArray(raw.if) && Array.isArray(raw.then)) { const metadata = splitKeys(raw, ["if", "then", "else"]); const conditions = conditionsArray(raw.if); if (metadata && conditions && (raw.else === undefined || Array.isArray(raw.else))) return { kind: "if", conditions, then: sequenceToVisual(raw.then), ...(Array.isArray(raw.else) ? { else: sequenceToVisual(raw.else) } : {}), metadata }; }
  if (Array.isArray(raw.choose)) {
    const metadata = splitKeys(raw, ["choose", "default"]);
    if (metadata && (raw.default === undefined || Array.isArray(raw.default))) {
      const choices: VisualChooseBranch[] = [];
      for (const choice of raw.choose) { if (!isObject(choice) || !Array.isArray(choice.conditions) || !Array.isArray(choice.sequence)) return { kind: "unsupported", raw }; const branchMetadata = splitKeys(choice, ["conditions", "sequence"], ["alias"]); const conditions = conditionsArray(choice.conditions); if (!branchMetadata || !conditions) return { kind: "unsupported", raw }; choices.push({ conditions, sequence: sequenceToVisual(choice.sequence), metadata: branchMetadata }); }
      return { kind: "choose", choices, ...(Array.isArray(raw.default) ? { default: sequenceToVisual(raw.default) } : {}), metadata };
    }
  }
  if (isObject(raw.repeat) && Array.isArray(raw.repeat.sequence)) {
    const repeatRaw = raw.repeat;
    const metadata = splitKeys(raw, ["repeat"]); const repeatShape = splitKeys(repeatRaw, ["count", "while", "until", "for_each", "sequence"], []);
    if (metadata && repeatShape) { const modes = (["count", "while", "until", "for_each"] as const).filter((key) => repeatRaw[key] !== undefined); if (modes.length === 1) { const mode = modes[0]!; const conditionValue = mode === "while" || mode === "until" ? conditionsArray(repeatRaw[mode]) : undefined; if ((mode !== "while" && mode !== "until") || conditionValue) return { kind: "repeat", mode, ...(conditionValue ? { conditions: conditionValue } : { value: repeatRaw[mode] }), sequence: sequenceToVisual(repeatRaw.sequence as unknown[]), metadata }; } }
  }
  if (Array.isArray(raw.parallel)) { const metadata = splitKeys(raw, ["parallel"]); if (metadata) return { kind: "parallel", branches: raw.parallel.map((branch): VisualParallelBranch => isObject(branch) && Array.isArray(branch.sequence) && splitKeys(branch, ["sequence"], ["alias"]) ? { wrapped: true, sequence: sequenceToVisual(branch.sequence), metadata: splitKeys(branch, ["sequence"], ["alias"])! } : isObject(branch) ? { wrapped: false, sequence: [actionFromRaw(branch)], metadata: {} } : { wrapped: false, sequence: [{ kind: "unsupported", raw: { value: branch } }], metadata: {} }), metadata }; }
  if (raw.delay !== undefined) { const metadata = splitKeys(raw, ["delay"]); if (metadata) return { kind: "delay", value: raw.delay, metadata }; }
  if (typeof raw.wait_template === "string") { const metadata = splitKeys(raw, ["wait_template", "timeout", "continue_on_timeout"]); if (metadata && (raw.continue_on_timeout === undefined || typeof raw.continue_on_timeout === "boolean")) return { kind: "wait_template", template: raw.wait_template, ...(raw.timeout !== undefined ? { timeout: raw.timeout } : {}), ...(typeof raw.continue_on_timeout === "boolean" ? { continueOnTimeout: raw.continue_on_timeout } : {}), metadata }; }
  return { kind: "unsupported", raw };
};

export const sequenceToVisual = (sequence: unknown[]): VisualAction[] => sequence.map((raw) => isObject(raw) ? actionFromRaw(raw) : ({ kind: "unsupported", raw: { value: raw } }));
const actionToRaw = (item: VisualAction): RawObject => {
  if (item.kind === "unsupported") return item.raw;
  if (item.kind === "service") { const target = Object.fromEntries(Object.entries(item.target).filter(([, value]) => value?.length).map(([key, value]) => [key, item.scalarTargets?.includes(key as keyof VisualTarget) && Array.isArray(value) && value.length === 1 ? value[0] : value])); const data = Object.fromEntries(item.data.filter((entry) => entry.key.trim()).map((entry) => [entry.key.trim(), dataEntryValue(entry)])); return { ...item.metadata, [item.syntax ?? "action"]: item.action, ...(Object.keys(target).length ? { target } : {}), ...(Object.keys(data).length ? { data } : {}) }; }
  if (item.kind === "if") return { ...item.metadata, if: item.conditions.map(conditionToRaw), then: visualToSequence(item.then), ...(item.else ? { else: visualToSequence(item.else) } : {}) };
  if (item.kind === "choose") return { ...item.metadata, choose: item.choices.map((choice) => ({ ...choice.metadata, conditions: choice.conditions.map(conditionToRaw), sequence: visualToSequence(choice.sequence) })), ...(item.default ? { default: visualToSequence(item.default) } : {}) };
  if (item.kind === "repeat") return { ...item.metadata, repeat: { [item.mode]: item.conditions ? item.conditions.map(conditionToRaw) : item.value, sequence: visualToSequence(item.sequence) } };
  if (item.kind === "parallel") return { ...item.metadata, parallel: item.branches.map((branch) => branch.wrapped ? { ...branch.metadata, sequence: visualToSequence(branch.sequence) } : visualToSequence(branch.sequence)[0]) };
  if (item.kind === "delay") return { ...item.metadata, delay: item.value };
  return { ...item.metadata, wait_template: item.template, ...(item.timeout !== undefined ? { timeout: item.timeout } : {}), ...(item.continueOnTimeout !== undefined ? { continue_on_timeout: item.continueOnTimeout } : {}) };
};
export const visualToSequence = (actions: VisualAction[]): RawObject[] => actions.map(actionToRaw);

const conditionFromRaw = (raw: RawObject): VisualCondition => {
  const alias = typeof raw.alias === "string" ? raw.alias : undefined; const base = (structural: string[]) => splitKeys(raw, structural, ["alias", "enabled"]);
  if (raw.condition === "state" && base(["condition", "entity_id", "state"]) && typeof raw.entity_id === "string" && typeof raw.state === "string") return { type: "state", entity_id: raw.entity_id, state: raw.state, alias, metadata: base(["condition", "entity_id", "state"])! };
  if (raw.condition === "numeric_state" && base(["condition", "entity_id", "above", "below"]) && typeof raw.entity_id === "string" && [raw.above, raw.below].every((value) => value === undefined || typeof value === "number")) return { type: "numeric_state", entity_id: raw.entity_id, above: raw.above === undefined ? "" : String(raw.above), below: raw.below === undefined ? "" : String(raw.below), alias, metadata: base(["condition", "entity_id", "above", "below"])! };
  if (raw.condition === "time" && base(["condition", "after", "before", "weekday"]) && [raw.after, raw.before].every((value) => value === undefined || typeof value === "string")) { const weekdays = asStringArray(raw.weekday); if (raw.weekday === undefined || weekdays) return { type: "time", after: String(raw.after ?? ""), before: String(raw.before ?? ""), weekdays: weekdays ?? [], weekdayScalar: typeof raw.weekday === "string", alias, metadata: base(["condition", "after", "before", "weekday"])! }; }
  if (raw.condition === "zone" && base(["condition", "entity_id", "zone"]) && typeof raw.entity_id === "string" && typeof raw.zone === "string") return { type: "zone", entity_id: raw.entity_id, zone: raw.zone, alias, metadata: base(["condition", "entity_id", "zone"])! };
  if (raw.condition === "sun" && base(["condition", "after", "before", "after_offset", "before_offset"]) && [raw.after, raw.before, raw.after_offset, raw.before_offset].every((value) => value === undefined || typeof value === "string")) return { type: "sun", after: String(raw.after ?? ""), before: String(raw.before ?? ""), after_offset: String(raw.after_offset ?? ""), before_offset: String(raw.before_offset ?? ""), alias, metadata: base(["condition", "after", "before", "after_offset", "before_offset"])! };
  if (["and", "or", "not"].includes(String(raw.condition)) && Array.isArray(raw.conditions) && base(["condition", "conditions"])) return { type: raw.condition as "and" | "or" | "not", conditions: conditionsArray(raw.conditions)!, alias, metadata: base(["condition", "conditions"])! };
  return { type: "unsupported", raw };
};
const conditionToRaw = (item: VisualCondition): RawObject => {
  if (item.type === "unsupported") return item.raw; const meta = item.metadata;
  if (item.type === "state") return { ...meta, condition: "state", entity_id: item.entity_id, state: item.state };
  if (item.type === "numeric_state") return { ...meta, condition: "numeric_state", entity_id: item.entity_id, ...(item.above.trim() ? { above: Number(item.above) } : {}), ...(item.below.trim() ? { below: Number(item.below) } : {}) };
  if (item.type === "time") return { ...meta, condition: "time", ...(item.after ? { after: item.after } : {}), ...(item.before ? { before: item.before } : {}), ...(item.weekdays.length ? { weekday: item.weekdayScalar && item.weekdays.length === 1 ? item.weekdays[0] : item.weekdays } : {}) };
  if (item.type === "zone") return { ...meta, condition: "zone", entity_id: item.entity_id, zone: item.zone };
  if (item.type === "sun") return { ...meta, condition: "sun", ...(item.after ? { after: item.after } : {}), ...(item.before ? { before: item.before } : {}), ...(item.after_offset ? { after_offset: item.after_offset } : {}), ...(item.before_offset ? { before_offset: item.before_offset } : {}) };
  return { ...meta, condition: item.type, conditions: item.conditions.map(conditionToRaw) };
};
export const conditionsToVisual = (conditions: RawObject[]): VisualConditions => { if (conditions.length === 1 && ["and", "or"].includes(String(conditions[0]?.condition)) && Array.isArray(conditions[0]?.conditions)) { const group = conditionFromRaw(conditions[0]!); if (group.type === "and" || group.type === "or") return { operator: group.type, items: group.conditions, grouped: true, metadata: group.metadata }; } return { operator: "and", items: conditions.map(conditionFromRaw) }; };
export const visualToConditions = (visual: VisualConditions): RawObject[] => { const conditions = visual.items.map(conditionToRaw); return (visual.operator === "or" || visual.grouped) && conditions.length ? [{ ...(visual.metadata ?? {}), condition: visual.operator, conditions }] : conditions; };

export const newVisualAction = (kind: VisualAction["kind"]): VisualAction => {
  if (kind === "service") return { kind, action: "", target: {}, data: [], metadata: {} };
  if (kind === "if") return { kind, conditions: [], then: [], metadata: {} };
  if (kind === "choose") return { kind, choices: [{ conditions: [], sequence: [], metadata: {} }], metadata: {} };
  if (kind === "repeat") return { kind, mode: "count", value: 1, sequence: [], metadata: {} };
  if (kind === "parallel") return { kind, branches: [{ wrapped: true, sequence: [], metadata: {} }, { wrapped: true, sequence: [], metadata: {} }], metadata: {} };
  if (kind === "delay") return { kind, value: { seconds: 1 }, metadata: {} };
  if (kind === "wait_template") return { kind, template: "", metadata: {} };
  return { kind: "unsupported", raw: {} };
};

export class UserFacingError extends Error {}
export const dataTypeFor = (value: Primitive): DataValueType => value === null ? "null" : typeof value === "number" ? "number" : typeof value === "boolean" ? "boolean" : "text";
export const dataEntry = (key: string, value: Primitive): DataEntry => ({ key, type: dataTypeFor(value), value, ...(typeof value === "string" || typeof value === "number" ? { raw: String(value) } : {}) });
export const dataEntryValue = (entry: DataEntry): Primitive => { if (entry.type === "null") return null; if (entry.type === "boolean") return entry.value === true; if (entry.type === "text") return entry.raw ?? String(entry.value ?? ""); const value = Number(entry.raw ?? entry.value); if (!Number.isFinite(value)) throw new UserFacingError(`Enter a finite number for “${entry.key || "this data field"}”.`); return value; };
export const dataEntryWithType = (entry: DataEntry, type: DataValueType): DataEntry => { const raw = entry.raw ?? String(entry.value ?? ""); if (type === "text") return { ...entry, type, value: raw, raw }; if (type === "number") return { ...entry, type, raw }; if (type === "boolean") return { ...entry, type, value: entry.value === true || raw === "true" }; return { ...entry, type, value: null, raw: undefined }; };
export const friendlyError = (error: unknown): { message: string; details: string } => { const details = error instanceof Error ? error.message : String(error); const lower = details.toLowerCase(); if (lower.includes("expected_revision") || lower.includes("revision") || lower.includes("conflict")) return { message: "This action changed elsewhere. Close the editor, reopen it, and try again.", details }; if (lower.includes("permission") || lower.includes("unauthorized") || lower.includes("admin")) return { message: "You need administrator access to manage deferred actions.", details }; if (lower.includes("valid_until")) return { message: "‘Don’t run after’ must be later than the scheduled time.", details }; if (lower.includes("condition")) return { message: "One or more conditions are incomplete or invalid.", details }; if (lower.includes("sequence") || lower.includes("action")) return { message: "The action sequence is incomplete or invalid.", details }; return { message: "Home Assistant couldn’t save this deferred action.", details }; };
export const presentError = (error: unknown): { message: string; details?: string } => { if (error instanceof UserFacingError) return { message: error.message }; const friendly = friendlyError(error); return { message: friendly.message, ...(friendly.details === friendly.message ? {} : { details: friendly.details }) }; };
