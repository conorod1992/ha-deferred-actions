import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { dump, load } from "js-yaml";
import { createJob, listJobs, operateJob, runFor, subscribeJobs, updateJob } from "./api";
import {
  conditionsToVisual, dataEntryWithType, presentError, sequenceToVisual, UserFacingError, visualToConditions, visualToSequence,
  type DataEntry, type DataValueType, type VisualAction, type VisualCondition, type VisualConditions, type VisualTarget,
} from "./editor-model";
import { effectiveOverdueLabel, isHistoryStatus, localDate, relativeTime, resolutionHints, snoozePresets } from "./format";
import type { DeferredJob, HomeAssistant, PushEvent, QueueSummary } from "./types";

type Tab = "Pending" | "Paused" | "Failed" | "History" | "All";
type EditorMode = "visual" | "yaml";
type ScheduleMode = "delay" | "absolute";
type CreationKind = "later" | "run_for";
type QuickDialog = { job: DeferredJob; kind: "reschedule" | "extend" | "snooze" | "duplicate" };
const RUN_FOR_INVERSES: Record<string, string> = {
  "light.turn_on": "light.turn_off",
  "switch.turn_on": "switch.turn_off",
  "fan.turn_on": "fan.turn_off",
  "input_boolean.turn_on": "input_boolean.turn_off",
  "media_player.media_play": "media_player.media_pause",
};

@customElement("deferred-actions-panel")
export class DeferredActionsPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private jobs: DeferredJob[] = [];
  @state() private summary: QueueSummary = { pending: 0, paused: 0, failed: 0 };
  @state() private tab: Tab = "Pending";
  @state() private selected?: DeferredJob;
  @state() private editor?: { job?: DeferredJob; mode: EditorMode };
  @state() private creationKind: CreationKind = "later";
  @state() private scheduleMode: ScheduleMode = "delay";
  @state() private visualActions: VisualAction[] = [];
  @state() private actionYaml = "";
  @state() private conditionMode: EditorMode = "visual";
  @state() private visualConditions: VisualConditions = { operator: "and", items: [] };
  @state() private conditionsYaml = "";
  @state() private runForTarget: VisualTarget = {};
  @state() private runForStart = "light.turn_on";
  @state() private runForEnd = "light.turn_off";
  @state() private jobKey = "";
  @state() private previewDelay = 20;
  @state() private previewUnit = "minutes";
  @state() private confirmAction?: { operation: string; job: DeferredJob };
  @state() private errorDetails?: string;
  @state() private menuJobId?: string;
  @state() private quickDialog?: QuickDialog;
  @state() private error?: string;
  @state() private busy = false;
  private unsubscribe?: () => void;
  private clock?: number;

  connectedCallback(): void {
    super.connectedCallback();
    this.clock = window.setInterval(() => this.requestUpdate(), 1000);
  }

  disconnectedCallback(): void {
    this.unsubscribe?.();
    if (this.clock) window.clearInterval(this.clock);
    super.disconnectedCallback();
  }

  protected firstUpdated(): void { void this.initialize(); }

  private async initialize(): Promise<void> {
    await this.refresh();
    this.unsubscribe = await subscribeJobs(this.hass, (event) => this.handlePush(event));
  }

  private async refresh(): Promise<void> {
    try {
      const result = await listJobs(this.hass);
      this.jobs = result.jobs;
      this.recalculate();
    } catch (error) { this.setError(error); }
  }

  private handlePush(event: PushEvent): void {
    if (event.event === "queue_summary" && event.summary) this.summary = event.summary;
    if (event.event === "job_deleted" && event.job_id) this.jobs = this.jobs.filter((job) => job.id !== event.job_id);
    else if (event.job) {
      const index = this.jobs.findIndex((job) => job.id === event.job?.id);
      this.jobs = index < 0 ? [...this.jobs, event.job] : this.jobs.map((job) => job.id === event.job?.id ? event.job! : job);
      if (this.selected?.id === event.job.id) this.selected = event.job;
    }
    this.recalculate();
  }

  private recalculate(): void {
    const pending = this.jobs.filter((job) => job.status === "pending").sort((a, b) => a.execute_at.localeCompare(b.execute_at));
    this.summary = {
      pending: pending.length,
      paused: this.jobs.filter((job) => job.status === "paused").length,
      failed: this.jobs.filter((job) => job.status === "failed").length,
      next_job_name: pending[0]?.name,
      next_execution_local: pending[0]?.execute_at_local,
    };
  }

  private visibleJobs(): DeferredJob[] {
    return this.jobs.filter((job) => this.tab === "All"
      || (this.tab === "Pending" && ["pending", "executing"].includes(job.status))
      || (this.tab === "Paused" && job.status === "paused")
      || (this.tab === "Failed" && job.status === "failed")
      || (this.tab === "History" && isHistoryStatus(job.status)))
      .sort((a, b) => a.execute_at.localeCompare(b.execute_at));
  }

  private async operate(operation: string, job: DeferredJob, data: Record<string, unknown> = {}): Promise<void> {
    this.menuJobId = undefined;
    if (["cancel", "delete", "execute_now"].includes(operation)) {
      this.confirmAction = { operation, job };
      return;
    }
    await this.performOperation(operation, job, data);
  }

  private async performOperation(operation: string, job: DeferredJob, data: Record<string, unknown> = {}): Promise<void> {
    this.busy = true;
    this.error = undefined;
    this.errorDetails = undefined;
    try {
      await operateJob(this.hass, operation, job.id, data);
      if (operation === "delete") this.selected = undefined;
    } catch (error) { this.setError(error); }
    finally { this.busy = false; }
  }

  private setError(error: unknown): void {
    const presented = presentError(error);
    this.error = presented.message;
    this.errorDetails = presented.details;
  }

  private openEditor(job?: DeferredJob): void {
    const sequence = job?.sequence ?? [{ action: "light.turn_off", target: {} }];
    const visual = sequenceToVisual(sequence);
    this.visualActions = visual ?? [];
    this.actionYaml = dump(sequence, { noRefs: true });
    const visualConditions = conditionsToVisual(job?.conditions ?? []);
    this.visualConditions = visualConditions ?? { operator: "and", items: [] };
    this.conditionMode = visualConditions ? "visual" : "yaml";
    this.conditionsYaml = job?.conditions.length ? dump(job.conditions, { noRefs: true }) : "";
    this.scheduleMode = "delay";
    this.creationKind = "later";
    this.jobKey = job?.job_key ?? "";
    this.previewDelay = 20;
    this.previewUnit = "minutes";
    this.editor = { job, mode: visual ? "visual" : "yaml" };
    this.menuJobId = undefined;
    this.error = undefined;
    this.errorDetails = undefined;
  }

  private openRunFor(): void {
    this.openEditor();
    this.creationKind = "run_for";
  }

  private primaryOperation(job: DeferredJob): { label: string; icon: string; operation: string } | undefined {
    if (job.status === "pending") return { label: "Pause", icon: "mdi:pause", operation: "pause" };
    if (job.status === "paused") return { label: "Resume", icon: "mdi:play", operation: "resume" };
    if (["failed", "missed"].includes(job.status)) return { label: "Run now", icon: "mdi:play", operation: "execute_now" };
    if (["completed", "cancelled", "skipped", "expired"].includes(job.status)) return { label: "Duplicate", icon: "mdi:content-copy", operation: "duplicate" };
    return undefined;
  }

  private renderMenu(job: DeferredJob) {
    if (this.menuJobId !== job.id) return nothing;
    return html`<div class="menu" @click=${(event: Event) => event.stopPropagation()}>
      <button @click=${() => { this.selected = job; this.menuJobId = undefined; }}><ha-icon icon="mdi:information-outline"></ha-icon>View details</button>
      ${["pending", "paused"].includes(job.status) ? html`
        <button @click=${() => this.openEditor(job)}><ha-icon icon="mdi:pencil-outline"></ha-icon>Edit</button>
        <button @click=${() => { this.quickDialog = { job, kind: "reschedule" }; this.menuJobId = undefined; }}><ha-icon icon="mdi:calendar-clock"></ha-icon>Reschedule</button>
        ${job.status === "pending" ? html`<button @click=${() => { this.quickDialog = { job, kind: "snooze" }; this.menuJobId = undefined; }}><ha-icon icon="mdi:timer-plus-outline"></ha-icon>Snooze</button>` : html`<button @click=${() => { this.quickDialog = { job, kind: "extend" }; this.menuJobId = undefined; }}><ha-icon icon="mdi:timer-plus-outline"></ha-icon>Extend</button>`}` : nothing}
      ${["pending", "paused", "failed", "missed"].includes(job.status) ? html`<button @click=${() => this.operate("execute_now", job)}><ha-icon icon="mdi:play"></ha-icon>Run now</button>` : nothing}
      <button @click=${() => { this.quickDialog = { job, kind: "duplicate" }; this.menuJobId = undefined; }}><ha-icon icon="mdi:content-copy"></ha-icon>Duplicate</button>
      ${["pending", "paused"].includes(job.status) ? html`<button class="warning" @click=${() => this.operate("cancel", job)}><ha-icon icon="mdi:cancel"></ha-icon>Cancel</button>` : nothing}
      ${job.status !== "executing" ? html`<button class="danger" @click=${() => this.operate("delete", job)}><ha-icon icon="mdi:delete-outline"></ha-icon>Delete</button>` : nothing}
    </div>`;
  }

  private renderJob(job: DeferredJob) {
    const primary = this.primaryOperation(job);
    return html`<article class="job" @click=${() => { this.selected = job; }}>
      <div class="job-icon"><ha-icon icon=${job.status === "failed" ? "mdi:alert-circle-outline" : "mdi:clock-outline"}></ha-icon></div>
      <div class="job-body">
        <div class="job-head"><h3>${job.name}</h3>${job.status !== "pending" ? html`<span class="status ${job.status}">${job.status}</span>` : nothing}</div>
        <div class="time">${localDate(job.execute_at_local)} · ${relativeTime(job.execute_at)}</div>
        <p>${job.action_summary}</p>
        ${job.terminal_reason ? html`<p class="compact">${job.terminal_reason}</p>` : nothing}
        ${job.last_error ? html`<div class="error compact">${job.last_error}</div>` : nothing}
      </div>
      <div class="row-actions" @click=${(event: Event) => event.stopPropagation()}>
        ${primary ? html`<button class="quiet" @click=${() => primary.operation === "duplicate" ? this.quickDialog = { job, kind: "duplicate" } : this.operate(primary.operation, job)}><ha-icon icon=${primary.icon}></ha-icon>${primary.label}</button>` : nothing}
        <div class="menu-wrap"><button class="icon" title="More actions" @click=${() => { this.menuJobId = this.menuJobId === job.id ? undefined : job.id; }}><ha-icon icon="mdi:dots-vertical"></ha-icon></button>${this.renderMenu(job)}</div>
      </div>
    </article>`;
  }

  private renderDetails(job: DeferredJob) {
    return html`<div class="overlay" @click=${() => { this.selected = undefined; }}><section class="dialog wide" @click=${(e: Event) => e.stopPropagation()}>
      <header><div><h2>${job.name}</h2><span class="status ${job.status}">${job.status}</span></div><button class="icon" title="Close" @click=${() => { this.selected = undefined; }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      <section class="detail-summary"><div><span>Scheduled</span><strong>${localDate(job.execute_at_local)}</strong><small>${relativeTime(job.execute_at)}</small></div><div><span>Action</span><strong>${job.action_summary}</strong></div></section>
      ${job.description ? html`<p>${job.description}</p>` : nothing}
      <div class="detail-actions">
        ${["pending", "paused"].includes(job.status) ? html`<button class="primary" @click=${() => this.openEditor(job)}>Edit action</button><button @click=${() => { this.quickDialog = { job, kind: "reschedule" }; }}>Change time</button>` : nothing}
      </div>
      ${job.status === "pending" ? html`<div class="snooze"><span>Snooze</span><div class="chips">${snoozePresets.map((minutes) => html`<button @click=${() => this.operate("snooze", job, { duration: { minutes } })}>+${minutes < 60 ? `${minutes} min` : "1 hour"}</button>`)}</div><button class="link" @click=${() => { this.quickDialog = { job, kind: "snooze" }; }}>Custom</button></div>` : nothing}
      <details><summary>Additional information</summary><dl>
        ${Object.entries({
          "Job ID": job.id, Status: job.status, "Scheduled UTC": job.execute_at,
          "Don’t run after": job.valid_until_local ? `${localDate(job.valid_until_local)} (${job.valid_until})` : "—",
          Conditions: job.has_conditions ? `Yes — ${job.condition_failure === "skip" ? "skip this run" : job.condition_failure === "cancel" ? "cancel the action" : "mark as failed"} if not met` : "None",
          "Overdue behavior": effectiveOverdueLabel(job),
          Created: job.created_at, Modified: job.modified_at, Completed: job.completed_at || "—",
          Source: job.source, "Job key": job.job_key || "—", Tags: job.tags.join(", ") || "—",
          "Resolved targets": job.target_entities.join(", ") || "—",
          "Resolution hints": resolutionHints(job).join(", ") || "—", Revision: String(job.revision),
          "Terminal reason": job.terminal_reason || "—",
          "Last error": job.last_error || "—",
        }).map(([label, value]) => html`<dt>${label}</dt><dd>${value}</dd>`)}
      </dl></details>
      <details><summary>Action sequence YAML</summary><pre>${dump(job.sequence, { noRefs: true })}</pre></details>
      ${job.has_conditions ? html`<details><summary>Execution conditions YAML</summary><pre>${dump(job.conditions, { noRefs: true })}</pre></details>` : nothing}
      <details><summary>Attribution and diagnostics</summary><pre>${JSON.stringify(job.attribution, null, 2)}</pre>${Object.keys(job.linkage).length ? html`<pre>${JSON.stringify(job.linkage, null, 2)}</pre>` : nothing}</details>
    </section></div>`;
  }

  private renderEditor() {
    const job = this.editor?.job;
    const runForEditor = !job && this.creationKind === "run_for";
    return html`<div class="overlay"><form class="dialog wide" @submit=${(event: SubmitEvent) => this.saveEditor(event)}>
      <header><h2>${job ? "Edit deferred action" : runForEditor ? "Run something for a while" : "Do something later"}</h2><button type="button" class="icon" title="Close" @click=${() => { this.editor = undefined; }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      ${!job ? html`<div class="segmented creation-kind"><button type="button" class=${this.creationKind === "later" ? "active" : ""} @click=${() => { this.creationKind = "later"; }}>Do something later</button><button type="button" class=${runForEditor ? "active" : ""} @click=${() => { this.creationKind = "run_for"; }}>Run something for a while</button></div>` : nothing}
      <label>Name<input name="name" required .value=${job?.name ?? ""} placeholder="Turn off office heater"></label>
      ${runForEditor ? this.renderRunForFields() : html`
        ${job ? nothing : this.renderScheduleFields()}
        <section class="action-editor"><div class="section-head"><h3>Actions</h3><button type="button" class="link" @click=${() => this.switchActionMode()}>${this.editor?.mode === "visual" ? "Edit in YAML" : "Use visual editor"}</button></div>
          ${this.editor?.mode === "visual" ? this.renderVisualActions() : html`<label>Action sequence YAML<textarea class="yaml" name="yaml" .value=${this.actionYaml} @input=${(event: InputEvent) => { this.actionYaml = (event.currentTarget as HTMLTextAreaElement).value; }}></textarea><small>Advanced sequences such as choose, repeat, parallel, waits, and templates stay here.</small></label>`}
        </section>
        ${this.renderNormalOptions(job)}
      `}
      <details class="advanced"><summary>Developer and automation options</summary>
        <label>Job key<input name="job_key" .value=${this.jobKey} @input=${(event: InputEvent) => { this.jobKey = (event.currentTarget as HTMLInputElement).value; }}><small>Optional stable identifier for automations.</small></label>
        ${!job && this.jobKey.trim() ? html`<label>When another action has this job key<select name="conflict_mode"><option value="keep_all">Keep both actions</option><option value="replace_same_key">Replace the existing action</option><option value="cancel_same_key">Cancel the existing action</option><option value="reject_same_key">Do not create this action</option></select></label>` : nothing}
        <label>Tags<input name="tags" .value=${job?.tags.join(", ") ?? ""} placeholder="heating, office"><small>Separate tags with commas.</small></label>
        <label>Resolution entity hints<ha-entity-picker .hass=${this.hass} .value=${resolutionHints(job)[0] ?? ""} .allowCustomEntity=${true} @value-changed=${(event: CustomEvent<{ value: string }>) => { const input = (event.currentTarget as HTMLElement).parentElement?.querySelector("input[name=target_entities]") as HTMLInputElement | null; if (input) input.value = event.detail.value; }}></ha-entity-picker><input name="target_entities" type="hidden" .value=${resolutionHints(job).join(", ")}><small>Used to find this job later; it does not change the action target.</small></label>
      </details>
      <section class="preview"><ha-icon icon="mdi:eye-outline"></ha-icon><div><strong>Preview</strong><span>${this.editorPreview(job)}</span></div></section>
      <footer><button type="button" @click=${() => { this.editor = undefined; }}>Cancel</button><button class="primary" ?disabled=${this.busy}>${job ? "Save" : "Create"}</button></footer>
    </form></div>`;
  }

  private renderScheduleFields() {
    return html`<fieldset><legend>When</legend><div class="segmented"><button type="button" class=${this.scheduleMode === "delay" ? "active" : ""} @click=${() => { this.scheduleMode = "delay"; }}>After a delay</button><button type="button" class=${this.scheduleMode === "absolute" ? "active" : ""} @click=${() => { this.scheduleMode = "absolute"; }}>At a date and time</button></div>
      ${this.scheduleMode === "delay" ? html`<div class="delay-row"><input name="delay_value" type="number" min="1" .value=${String(this.previewDelay)} @input=${(event: InputEvent) => { this.previewDelay = Number((event.currentTarget as HTMLInputElement).value); }}><select name="delay_unit" .value=${this.previewUnit} @change=${(event: Event) => { this.previewUnit = (event.currentTarget as HTMLSelectElement).value; }}><option value="minutes">minutes</option><option value="hours">hours</option><option value="days">days</option></select></div><div class="chips">${[5,15,30,60].map((minutes) => html`<button type="button" @click=${() => { this.previewDelay = minutes; this.previewUnit = "minutes"; }}>${minutes < 60 ? `${minutes} min` : "1 hour"}</button>`)}</div>` : html`<div class="two"><label>Date<input name="date" type="date" required></label><label>Time<input name="time" type="time" required></label></div>`}
    </fieldset>`;
  }

  private renderRunForFields() {
    return html`<fieldset><legend>Run For</legend>
      <label>Description<textarea name="description"></textarea></label>
      <label>Target<ha-target-picker .hass=${this.hass} .value=${this.runForTarget} @value-changed=${(event: CustomEvent<{ value: VisualTarget }>) => { this.runForTarget = event.detail.value; }}></ha-target-picker><small>Choose entities, devices, or areas.</small></label>
      <div class="two"><label>Start action<ha-service-picker .hass=${this.hass} .value=${this.runForStart} @value-changed=${(event: CustomEvent<{ value: string }>) => { this.runForStart = event.detail.value; this.runForEnd = RUN_FOR_INVERSES[event.detail.value] ?? ""; }}></ha-service-picker></label><label>End action<ha-service-picker .hass=${this.hass} .value=${this.runForEnd} @value-changed=${(event: CustomEvent<{ value: string }>) => { this.runForEnd = event.detail.value; }}></ha-service-picker><small>Suggested only for conservative, known opposite actions; otherwise choose one explicitly.</small></label></div>
      <label>Duration<div class="delay-row"><input name="delay_value" type="number" min="1" .value=${String(this.previewDelay)} @input=${(event: InputEvent) => { this.previewDelay = Number((event.currentTarget as HTMLInputElement).value); }}><select name="delay_unit" .value=${this.previewUnit} @change=${(event: Event) => { this.previewUnit = (event.currentTarget as HTMLSelectElement).value; }}><option value="minutes">minutes</option><option value="hours">hours</option><option value="days">days</option></select></div></label>
      <div class="timeline"><div><span>Now</span><strong>${this.actionLabel(this.runForStart, this.runForTarget)}</strong></div><ha-icon icon="mdi:arrow-right"></ha-icon><div><span>After ${this.previewDelay} ${this.previewUnit}</span><strong>${this.actionLabel(this.runForEnd, this.runForTarget)}</strong></div></div>
    </fieldset>`;
  }

  private renderVisualActions() {
    return html`${this.visualActions.map((action, index) => html`<article class="visual-card">
      <div class="section-head"><strong>Action ${index + 1}</strong>${this.visualActions.length > 1 ? html`<button type="button" class="link danger" @click=${() => { this.visualActions = this.visualActions.filter((_, itemIndex) => itemIndex !== index); }}>Remove</button>` : nothing}</div>
      <label>Service<ha-service-picker .hass=${this.hass} .value=${action.action} @value-changed=${(event: CustomEvent<{ value: string }>) => this.updateAction(index, { action: event.detail.value })}></ha-service-picker></label>
      <label>Target<ha-target-picker .hass=${this.hass} .value=${action.target} @value-changed=${(event: CustomEvent<{ value: VisualTarget }>) => this.updateAction(index, { target: event.detail.value })}></ha-target-picker><small>Choose entities, devices, or areas. Leave empty for services that do not need a target.</small></label>
      <div class="section-head"><strong>Action data</strong><button type="button" class="link" @click=${() => this.updateAction(index, { data: [...action.data, { key: "", type: "text", value: "", raw: "" }] })}>Add field</button></div>
      ${action.data.map((entry, dataIndex) => html`<div class="data-row"><input aria-label="Data field" placeholder="brightness_pct" .value=${entry.key} @input=${(event: InputEvent) => this.updateData(index, dataIndex, { key: (event.currentTarget as HTMLInputElement).value })}><select aria-label="Data value type" .value=${entry.type} @change=${(event: Event) => this.setDataType(index, dataIndex, (event.currentTarget as HTMLSelectElement).value as DataValueType)}><option value="text">Text</option><option value="number">Number</option><option value="boolean">Boolean</option><option value="null">Null</option></select>${this.renderDataValue(index, dataIndex, entry)}<button type="button" class="icon" title="Remove data field" @click=${() => this.updateAction(index, { data: action.data.filter((_, itemIndex) => itemIndex !== dataIndex) })}><ha-icon icon="mdi:close"></ha-icon></button></div>`)}
    </article>`)}<button type="button" @click=${() => { this.visualActions = [...this.visualActions, { action: "", target: {}, data: [] }]; }}><ha-icon icon="mdi:plus"></ha-icon>Add another action</button>`;
  }

  private renderDataValue(actionIndex: number, dataIndex: number, entry: DataEntry) {
    if (entry.type === "null") return html`<span class="null-value">No value</span>`;
    if (entry.type === "boolean") return html`<select aria-label="Boolean value" .value=${entry.value === true ? "true" : "false"} @change=${(event: Event) => this.updateData(actionIndex, dataIndex, { value: (event.currentTarget as HTMLSelectElement).value === "true" })}><option value="true">True</option><option value="false">False</option></select>`;
    return html`<input aria-label="Data value" type=${entry.type === "number" ? "number" : "text"} step=${entry.type === "number" ? "any" : ""} placeholder=${entry.type === "number" ? "42" : "Message text"} .value=${entry.raw ?? String(entry.value ?? "")} @input=${(event: InputEvent) => this.updateData(actionIndex, dataIndex, { raw: (event.currentTarget as HTMLInputElement).value })}>`;
  }

  private renderNormalOptions(job?: DeferredJob) {
    return html`<section class="normal-options"><h3>Optional settings</h3>
      <label>Description<textarea name="description">${job?.description ?? ""}</textarea></label>
      <div class="section-head"><h3>Only run this action if…</h3><button type="button" class="link" @click=${() => this.switchConditionMode()}>${this.conditionMode === "visual" ? "Edit in YAML" : "Use visual editor"}</button></div>
      ${this.conditionMode === "visual" ? this.renderVisualConditions() : html`<label>Conditions YAML<textarea class="yaml small-yaml" .value=${this.conditionsYaml} @input=${(event: InputEvent) => { this.conditionsYaml = (event.currentTarget as HTMLTextAreaElement).value; }}></textarea><small>Existing and advanced Home Assistant conditions are preserved here.</small></label>`}
      <label>If the conditions aren’t met<select name="condition_failure"><option value="skip" ?selected=${!job || job.condition_failure === "skip"}>Skip this run and keep it in history</option><option value="cancel" ?selected=${job?.condition_failure === "cancel"}>Cancel the action</option><option value="fail" ?selected=${job?.condition_failure === "fail"}>Mark the action as failed</option></select></label>
      <label>Don’t run after<input name="valid_until" type="datetime-local" .value=${job?.valid_until_local?.slice(0, 16) ?? ""}><small>The action will never begin at or after this cutoff.</small></label>
      <label>If Home Assistant was offline when this was due<select name="overdue_policy"><option value="" ?selected=${!job?.overdue_policy}>Use the integration default</option><option value="execute" ?selected=${job?.overdue_policy === "execute"}>Run it when Home Assistant comes back</option><option value="execute_within_grace" ?selected=${job?.overdue_policy === "execute_within_grace"}>Run it only if it is less than the grace period late</option><option value="skip" ?selected=${job?.overdue_policy === "skip"}>Don’t run it</option></select></label>
      <label>Grace period (minutes)<input name="overdue_grace_minutes" type="number" min="0" .value=${job?.overdue_grace ? String(job.effective_overdue_grace_minutes) : ""} placeholder="Use integration default"><small>Used only for “less than the grace period late”.</small></label>
    </section>`;
  }

  private renderVisualConditions() {
    const weekdays: [string, string][] = [["mon", "Mon"], ["tue", "Tue"], ["wed", "Wed"], ["thu", "Thu"], ["fri", "Fri"], ["sat", "Sat"], ["sun", "Sun"]];
    return html`<div class="condition-builder">${this.visualConditions.items.length > 1 ? html`<label>Match<select .value=${this.visualConditions.operator} @change=${(event: Event) => { this.visualConditions = { ...this.visualConditions, operator: (event.currentTarget as HTMLSelectElement).value as "and" | "or" }; }}><option value="and">All conditions (AND)</option><option value="or">Any condition (OR)</option></select></label>` : nothing}
      ${this.visualConditions.items.map((condition, index) => html`<article class="visual-card"><div class="section-head"><select aria-label="Condition type" .value=${condition.type} @change=${(event: Event) => this.changeConditionType(index, (event.currentTarget as HTMLSelectElement).value as VisualCondition["type"])}><option value="state">State</option><option value="numeric_state">Numeric state</option><option value="time">Time / day</option></select><button type="button" class="link danger" @click=${() => { this.visualConditions = { ...this.visualConditions, items: this.visualConditions.items.filter((_, itemIndex) => itemIndex !== index) }; }}>Remove</button></div>
        ${condition.type === "state" ? html`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${condition.entity_id} .allowCustomEntity=${true} @value-changed=${(event: CustomEvent<{ value: string }>) => this.updateCondition(index, { ...condition, entity_id: event.detail.value })}></ha-entity-picker></label><label>Must be in state<input .value=${condition.state} @input=${(event: InputEvent) => this.updateCondition(index, { ...condition, state: (event.currentTarget as HTMLInputElement).value })}></label>` : nothing}
        ${condition.type === "numeric_state" ? html`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${condition.entity_id} .allowCustomEntity=${true} @value-changed=${(event: CustomEvent<{ value: string }>) => this.updateCondition(index, { ...condition, entity_id: event.detail.value })}></ha-entity-picker></label><div class="two"><label>Above<input type="number" step="any" .value=${condition.above} @input=${(event: InputEvent) => this.updateCondition(index, { ...condition, above: (event.currentTarget as HTMLInputElement).value })}></label><label>Below<input type="number" step="any" .value=${condition.below} @input=${(event: InputEvent) => this.updateCondition(index, { ...condition, below: (event.currentTarget as HTMLInputElement).value })}></label></div>` : nothing}
        ${condition.type === "time" ? html`<div class="two"><label>After<input type="time" step="1" .value=${condition.after} @input=${(event: InputEvent) => this.updateCondition(index, { ...condition, after: (event.currentTarget as HTMLInputElement).value })}></label><label>Before<input type="time" step="1" .value=${condition.before} @input=${(event: InputEvent) => this.updateCondition(index, { ...condition, before: (event.currentTarget as HTMLInputElement).value })}></label></div><div class="weekdays">${weekdays.map(([value, label]) => html`<label><input type="checkbox" .checked=${condition.weekdays.includes(value)} @change=${(event: Event) => this.toggleWeekday(index, condition, value, (event.currentTarget as HTMLInputElement).checked)}>${label}</label>`)}</div>` : nothing}
      </article>`)}<button type="button" @click=${() => { this.visualConditions = { ...this.visualConditions, items: [...this.visualConditions.items, { type: "state", entity_id: "", state: "" }] }; }}><ha-icon icon="mdi:plus"></ha-icon>Add condition</button></div>`;
  }

  private async saveEditor(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const formElement = event.currentTarget as HTMLFormElement;
    const form = new FormData(formElement);
    try {
      if (!this.editor?.job && this.creationKind === "run_for") {
        const value = Number(form.get("delay_value"));
        const unit = String(form.get("delay_unit"));
        if (!Number.isFinite(value) || value <= 0) throw new UserFacingError("Duration must be greater than zero");
        if (!this.runForStart || !this.runForEnd || !Object.values(this.runForTarget).some((ids) => ids?.length)) throw new UserFacingError("Choose a target, start action, and end action");
        this.busy = true;
        await runFor(this.hass, {
          name: String(form.get("name")), description: String(form.get("description") ?? "") || undefined,
          duration: { [unit]: value },
          start_sequence: visualToSequence([{ action: this.runForStart, target: this.runForTarget, data: [] }]),
          end_sequence: visualToSequence([{ action: this.runForEnd, target: this.runForTarget, data: [] }]),
          job_key: String(form.get("job_key") ?? "") || undefined,
          tags: String(form.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
          conflict_mode: String(form.get("conflict_mode") ?? "keep_all"),
        });
        await this.refresh();
        this.editor = undefined;
        return;
      }
      const sequence = this.editor?.mode === "visual" ? visualToSequence(this.visualActions) : load(this.actionYaml);
      if (!Array.isArray(sequence)) throw new UserFacingError("Advanced YAML must be a list of actions");
      if (this.editor?.mode === "visual" && (this.visualActions.length === 0 || this.visualActions.some((action) => !action.action))) throw new UserFacingError("Choose a service for every action");
      const conditions = this.conditionMode === "visual" ? visualToConditions(this.visualConditions) : (this.conditionsYaml.trim() ? load(this.conditionsYaml) : []);
      if (this.conditionMode === "visual" && this.visualConditions.items.some((condition) =>
        condition.type === "state" ? !condition.entity_id || !condition.state
          : condition.type === "numeric_state" ? !condition.entity_id || (!condition.above.trim() && !condition.below.trim())
            : !condition.after && !condition.before && condition.weekdays.length === 0)) throw new UserFacingError("Complete or remove each condition");
      const common = {
        name: String(form.get("name")), description: String(form.get("description") ?? "") || undefined,
        job_key: String(form.get("job_key") ?? "") || undefined,
        tags: String(form.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
        target_entities: String(form.get("target_entities") ?? "").split(",").map((entity) => entity.trim()).filter(Boolean), sequence,
        conditions,
        condition_failure: String(form.get("condition_failure") ?? "skip"),
        overdue_policy: String(form.get("overdue_policy") ?? "") || null,
        overdue_grace: String(form.get("overdue_grace_minutes") ?? "") ? { minutes: Number(form.get("overdue_grace_minutes")) } : null,
        valid_until: String(form.get("valid_until") ?? "") ? new Date(String(form.get("valid_until"))).toISOString() : null,
      };
      if (!Array.isArray(common.conditions)) throw new UserFacingError("Conditions YAML must be a list");
      this.busy = true;
      if (this.editor?.job) await updateJob(this.hass, { job_id: this.editor.job.id, expected_revision: this.editor.job.revision, ...common });
      else {
        let schedule: Record<string, unknown>;
        if (this.scheduleMode === "absolute") {
          const date = String(form.get("date"));
          const time = String(form.get("time"));
          const local = new Date(`${date}T${time}`);
          if (Number.isNaN(local.getTime())) throw new UserFacingError("Choose a valid date and time");
          schedule = { execute_at: local.toISOString() };
        } else {
          const value = Number(form.get("delay_value"));
          const unit = String(form.get("delay_unit"));
          if (!Number.isFinite(value) || value <= 0) throw new UserFacingError("Delay must be greater than zero");
          schedule = { delay: { [unit]: value } };
        }
        await createJob(this.hass, { ...common, ...schedule, conflict_mode: String(form.get("conflict_mode") ?? "keep_all") });
      }
      this.editor = undefined;
    } catch (error) { this.setError(error); }
    finally { this.busy = false; }
  }

  private updateAction(index: number, patch: Partial<VisualAction>): void {
    this.visualActions = this.visualActions.map((action, itemIndex) => itemIndex === index ? { ...action, ...patch } : action);
  }

  private updateData(actionIndex: number, dataIndex: number, patch: Partial<VisualAction["data"][number]>): void {
    const action = this.visualActions[actionIndex];
    if (!action) return;
    this.updateAction(actionIndex, { data: action.data.map((entry, itemIndex) => itemIndex === dataIndex ? { ...entry, ...patch } : entry) });
  }

  private setDataType(actionIndex: number, dataIndex: number, type: DataValueType): void {
    const entry = this.visualActions[actionIndex]?.data[dataIndex];
    if (entry) this.updateData(actionIndex, dataIndex, dataEntryWithType(entry, type));
  }

  private updateCondition(index: number, condition: VisualCondition): void {
    this.visualConditions = { ...this.visualConditions, items: this.visualConditions.items.map((item, itemIndex) => itemIndex === index ? condition : item) };
  }

  private changeConditionType(index: number, type: VisualCondition["type"]): void {
    const condition: VisualCondition = type === "state" ? { type, entity_id: "", state: "" }
      : type === "numeric_state" ? { type, entity_id: "", above: "", below: "" }
        : { type, after: "", before: "", weekdays: [] };
    this.updateCondition(index, condition);
  }

  private toggleWeekday(index: number, condition: Extract<VisualCondition, { type: "time" }>, weekday: string, checked: boolean): void {
    this.updateCondition(index, { ...condition, weekdays: checked ? [...condition.weekdays, weekday] : condition.weekdays.filter((item) => item !== weekday) });
  }

  private switchActionMode(): void {
    if (this.editor?.mode === "visual") {
      this.actionYaml = dump(visualToSequence(this.visualActions), { noRefs: true });
      this.editor = { ...this.editor, mode: "yaml" };
      return;
    }
    try {
      const loaded = load(this.actionYaml);
      if (!Array.isArray(loaded)) throw new UserFacingError("Action YAML must be a list");
      const visual = sequenceToVisual(loaded as Record<string, unknown>[]);
      if (!visual) throw new UserFacingError("This sequence uses advanced features that the visual editor cannot represent safely.");
      this.visualActions = visual;
      this.editor = { ...this.editor!, mode: "visual" };
    } catch (error) { this.setError(error); }
  }

  private switchConditionMode(): void {
    if (this.conditionMode === "visual") {
      this.conditionsYaml = dump(visualToConditions(this.visualConditions), { noRefs: true });
      this.conditionMode = "yaml";
      return;
    }
    try {
      const loaded = this.conditionsYaml.trim() ? load(this.conditionsYaml) : [];
      if (!Array.isArray(loaded)) throw new UserFacingError("Conditions YAML must be a list");
      const visual = conditionsToVisual(loaded as Record<string, unknown>[]);
      if (!visual) throw new UserFacingError("These conditions use advanced options that the visual editor cannot represent safely.");
      this.visualConditions = visual;
      this.conditionMode = "visual";
    } catch (error) { this.setError(error); }
  }

  private actionLabel(action: string, target: VisualTarget): string {
    const verb = action.split(".").pop()?.replaceAll("_", " ") ?? "Run action";
    const targetValue = target.entity_id ?? target.device_id ?? target.area_id ?? target.floor_id ?? target.label_id;
    const targetId = Array.isArray(targetValue) ? targetValue[0] : targetValue;
    const targetLabel = targetId?.split(".").pop()?.replaceAll("_", " ");
    return `${verb.charAt(0).toUpperCase()}${verb.slice(1)}${targetLabel ? ` ${targetLabel}` : ""}`;
  }

  private editorPreview(job?: DeferredJob): string {
    if (job) return `${this.visualActions[0] ? this.actionLabel(this.visualActions[0].action, this.visualActions[0].target) : job.action_summary}; scheduled for ${localDate(job.execute_at_local)}`;
    if (this.creationKind === "run_for") return `${this.actionLabel(this.runForStart, this.runForTarget)} now, then ${this.actionLabel(this.runForEnd, this.runForTarget).toLowerCase()} in ${this.previewDelay} ${this.previewUnit}`;
    const first = this.visualActions[0];
    const action = first ? this.actionLabel(first.action, first.target) : "Run the configured action";
    return this.scheduleMode === "delay" ? `${action} in ${this.previewDelay} ${this.previewUnit}` : `${action} at the selected date and time`;
  }

  private renderQuickDialog() {
    const dialog = this.quickDialog;
    if (!dialog) return nothing;
    const labels = { reschedule: "Reschedule action", extend: "Change remaining time", snooze: "Snooze action", duplicate: "Duplicate action" };
    return html`<div class="overlay"><form class="dialog small" @submit=${(event: SubmitEvent) => this.submitQuickDialog(event)}><header><h2>${labels[dialog.kind]}</h2><button type="button" class="icon" @click=${() => { this.quickDialog = undefined; }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      ${dialog.kind === "reschedule" ? html`<div class="two"><label>Date<input name="date" type="date" required></label><label>Time<input name="time" type="time" required></label></div>` : html`<label>${dialog.kind === "extend" ? "Minutes to add (negative reduces time)" : dialog.kind === "snooze" ? "Minutes to snooze" : "Run the copy in how many minutes?"}<input name="minutes" type="number" min=${dialog.kind === "extend" ? nothing : "1"} .value=${dialog.kind === "extend" ? "15" : "20"} required></label>`}
      <footer><button type="button" @click=${() => { this.quickDialog = undefined; }}>Cancel</button><button class="primary">${dialog.kind === "duplicate" ? "Duplicate" : "Apply"}</button></footer></form></div>`;
  }

  private async submitQuickDialog(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const dialog = this.quickDialog;
    if (!dialog) return;
    const form = new FormData(event.currentTarget as HTMLFormElement);
    if (dialog.kind === "reschedule") {
      const local = new Date(`${String(form.get("date"))}T${String(form.get("time"))}`);
      if (Number.isNaN(local.getTime())) { this.error = "Choose a valid date and time"; return; }
      await this.operate("reschedule", dialog.job, { execute_at: local.toISOString() });
    } else {
      const minutes = Number(form.get("minutes"));
      if (!Number.isFinite(minutes) || (["duplicate", "snooze"].includes(dialog.kind) ? minutes <= 0 : minutes === 0)) { this.error = "Enter a valid number of minutes"; return; }
      await this.operate(dialog.kind, dialog.job, ["extend", "snooze"].includes(dialog.kind) ? { duration: { minutes } } : { delay: { minutes } });
    }
    this.quickDialog = undefined;
  }

  private renderConfirmation() {
    const confirmation = this.confirmAction;
    if (!confirmation) return nothing;
    const isDelete = confirmation.operation === "delete";
    const isCancel = confirmation.operation === "cancel";
    const title = isDelete ? "Delete this record permanently?" : isCancel ? "Cancel this deferred action?" : "Run this action now?";
    const explanation = isDelete
      ? "This permanently removes the record and its history. This cannot be undone."
      : isCancel ? "The action will not run, but the cancelled record will remain in history." : "This bypasses the remaining delay and starts the action now.";
    return html`<div class="overlay" @click=${() => { this.confirmAction = undefined; }}><section class="dialog small confirmation" role="alertdialog" aria-modal="true" @click=${(event: Event) => event.stopPropagation()}>
      <header><h2>${title}</h2><button class="icon" title="Close" @click=${() => { this.confirmAction = undefined; }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      <p><strong>${confirmation.job.name}</strong></p><p>${explanation}</p>
      <footer><button @click=${() => { this.confirmAction = undefined; }}>Keep it</button><button class=${isDelete ? "danger" : isCancel ? "warning" : "primary"} ?disabled=${this.busy} @click=${async () => { const current = this.confirmAction; this.confirmAction = undefined; if (current) await this.performOperation(current.operation, current.job); }}>${isDelete ? "Delete permanently" : isCancel ? "Cancel action" : "Run now"}</button></footer>
    </section></div>`;
  }

  protected render() {
    const visible = this.visibleJobs();
    return html`<ha-card>
      <header class="top"><h1>Deferred Actions</h1><div class="create-actions"><button @click=${() => this.openRunFor()}><ha-icon icon="mdi:timer-play-outline"></ha-icon>Run for a while</button><button class="primary" @click=${() => this.openEditor()}><ha-icon icon="mdi:clock-plus-outline"></ha-icon>Do something later</button></div></header>
      ${this.error ? html`<div class="banner"><div>${this.error}${this.errorDetails ? html`<details><summary>Technical details</summary><code>${this.errorDetails}</code></details>` : nothing}</div><button class="icon" @click=${() => { this.error = undefined; this.errorDetails = undefined; }}><ha-icon icon="mdi:close"></ha-icon></button></div>` : nothing}
      <nav>${(["Pending", "Paused", "Failed", "History"] as Tab[]).map((tab) => html`<button class=${this.tab === tab ? "active" : ""} @click=${() => { this.tab = tab; }}>${tab}<span>${tab === "Pending" ? this.summary.pending : tab === "Paused" ? this.summary.paused : tab === "Failed" ? this.summary.failed : ""}</span></button>`)}<button class=${this.tab === "All" ? "active" : ""} title="All actions" @click=${() => { this.tab = "All"; }}><ha-icon icon="mdi:format-list-bulleted"></ha-icon></button></nav>
      <section class="next"><ha-icon icon="mdi:clock-outline"></ha-icon><span>Next:</span><strong>${this.summary.next_job_name ?? "No pending actions"}</strong>${this.summary.next_execution_local ? html`<small>${localDate(this.summary.next_execution_local)} · ${relativeTime(this.summary.next_execution_local)}</small>` : nothing}</section>
      <main>${visible.length ? visible.map((job) => this.renderJob(job)) : html`<div class="empty"><ha-icon icon="mdi:calendar-check"></ha-icon><p>No ${this.tab.toLowerCase()} deferred actions.</p></div>`}</main>
      ${this.selected ? this.renderDetails(this.selected) : nothing}${this.editor ? this.renderEditor() : nothing}${this.renderQuickDialog()}${this.renderConfirmation()}
    </ha-card>`;
  }

  static styles = css`
    :host{display:block;color:var(--primary-text-color);background:var(--primary-background-color);min-height:100vh}ha-card{max-width:980px;margin:24px auto;padding:24px;background:var(--card-background-color);box-sizing:border-box}.top{display:flex;justify-content:space-between;align-items:center;gap:16px}.top h1{margin:0;font-size:28px}.create-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}button{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--divider-color);border-radius:10px;padding:9px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}button.primary{background:var(--primary-color);color:var(--text-primary-color);border-color:var(--primary-color)}button.danger{color:var(--error-color)}button.warning{color:var(--warning-color)}button.quiet,button.icon,button.link{background:none}button.icon{padding:8px;border:0}button.link{border:0;color:var(--primary-color);padding:4px}button:disabled{opacity:.5}nav{display:flex;align-items:end;gap:4px;overflow:auto;border-bottom:1px solid var(--divider-color);margin-top:20px}nav button{border:0;background:none;border-radius:0}nav button span{min-width:20px;padding:2px 6px;border-radius:999px;background:var(--secondary-background-color);font-size:12px}nav button.active{color:var(--primary-color);border-bottom:3px solid var(--primary-color)}.next{display:flex;align-items:center;gap:8px;padding:12px 4px;color:var(--secondary-text-color)}.next strong{color:var(--primary-text-color)}.next small{margin-left:auto}main{display:flex;flex-direction:column;border-top:1px solid var(--divider-color)}.job{position:relative;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:16px 4px;border-bottom:1px solid var(--divider-color);cursor:pointer}.job:hover{background:var(--secondary-background-color)}.job-icon{color:var(--primary-color)}.job-head{display:flex;align-items:center;gap:8px}.job h3{margin:0;font-size:16px}.job p{margin:5px 0 0;color:var(--secondary-text-color)}.time{color:var(--secondary-text-color);font-size:13px;margin-top:4px}.status{font-size:12px;border-radius:999px;padding:3px 7px;background:var(--secondary-background-color);text-transform:capitalize}.status.failed{color:var(--error-color)}.row-actions{display:flex;align-items:center;gap:4px}.row-actions ha-icon{--mdc-icon-size:18px}.menu-wrap{position:relative}.menu{position:absolute;z-index:4;right:0;top:100%;display:flex;flex-direction:column;min-width:210px;padding:6px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;box-shadow:var(--ha-card-box-shadow,0 4px 14px rgba(0,0,0,.2))}.menu button{justify-content:flex-start;border:0;background:none}.error,.banner{color:var(--error-color);padding:10px;background:color-mix(in srgb,var(--error-color) 10%,transparent);border-radius:10px}.error.compact{margin-top:8px}.banner{display:flex;justify-content:space-between;margin:12px 0}.banner details{color:var(--secondary-text-color);font-size:12px}.empty{text-align:center;padding:56px;color:var(--secondary-text-color)}.empty ha-icon{--mdc-icon-size:48px}.overlay{position:fixed;z-index:10;inset:0;background:rgba(0,0,0,.48);display:grid;place-items:center;padding:16px}.dialog{width:min(620px,100%);max-height:90vh;overflow:auto;background:var(--card-background-color);border-radius:16px;padding:20px;box-sizing:border-box}.dialog.wide{width:min(820px,100%)}.dialog.small{width:min(480px,100%)}.dialog header,.dialog footer,.section-head{display:flex;justify-content:space-between;align-items:center;gap:8px}.dialog header h2,.section-head h3{margin:0}.dialog header>div{display:flex;align-items:center;gap:10px}.dialog label{display:flex;flex-direction:column;gap:6px;margin:14px 0}.dialog input,.dialog textarea,.dialog select{font:inherit;padding:10px;border:1px solid var(--divider-color);border-radius:8px;color:var(--primary-text-color);background:var(--primary-background-color)}.dialog textarea{min-height:70px}.dialog textarea.yaml{min-height:260px;font-family:monospace}.dialog textarea.small-yaml{min-height:150px}.dialog footer{margin-top:20px;justify-content:flex-end}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}fieldset,.action-editor,.advanced,.normal-options{border:1px solid var(--divider-color);border-radius:12px;padding:14px;margin-top:16px}.segmented,.delay-row,.chips,.detail-actions{display:flex;gap:8px}.creation-kind{margin:16px 0}.segmented button{flex:1}.segmented .active{border-color:var(--primary-color);color:var(--primary-color)}.delay-row input{flex:1;min-width:0}.delay-row select{min-width:130px}.chips{flex-wrap:wrap;margin-top:10px}.chips button{padding:6px 9px}.advanced summary,details summary{cursor:pointer;font-weight:600}.visual-card{border:1px solid var(--divider-color);border-radius:10px;padding:12px;margin:12px 0;background:var(--primary-background-color)}.data-row{display:grid;grid-template-columns:minmax(120px,1fr) 110px minmax(140px,1fr) auto;gap:8px;align-items:center;margin:8px 0}.null-value{padding:10px;color:var(--secondary-text-color);font-style:italic}.weekdays{display:flex;flex-wrap:wrap;gap:8px}.weekdays label{flex-direction:row;margin:0;padding:7px 9px;border:1px solid var(--divider-color);border-radius:8px}.preview{display:flex;gap:12px;align-items:center;padding:14px;margin-top:16px;border-radius:12px;background:color-mix(in srgb,var(--primary-color) 9%,transparent)}.preview div{display:flex;flex-direction:column;gap:3px}.timeline{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px}.timeline div{display:flex;flex-direction:column;padding:12px;border-radius:10px;background:var(--secondary-background-color)}.timeline span{color:var(--secondary-text-color);font-size:12px}.detail-summary{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0}.detail-summary>div{display:flex;flex-direction:column;gap:4px;padding:14px;border:1px solid var(--divider-color);border-radius:12px}.detail-summary span,.detail-summary small{color:var(--secondary-text-color)}details{margin-top:14px}dl{display:grid;grid-template-columns:minmax(130px,auto) 1fr;gap:8px 16px}dt{font-weight:600}dd{margin:0;overflow-wrap:anywhere}pre{padding:12px;overflow:auto;background:var(--secondary-background-color);border-radius:10px;white-space:pre-wrap}@media(max-width:700px){ha-card{margin:0;padding:16px;min-height:100vh;border-radius:0}.top{align-items:flex-start;flex-direction:column}.create-actions{width:100%}.create-actions button{flex:1}.top h1{font-size:24px}.next{flex-wrap:wrap}.next small{width:100%;margin-left:32px}.job{grid-template-columns:auto 1fr}.row-actions{grid-column:2}.row-actions .quiet{flex:1}.overlay{padding:0}.dialog{width:100%;height:100%;max-height:none;border-radius:0}.two,.detail-summary,.timeline{grid-template-columns:1fr}.timeline>ha-icon{transform:rotate(90deg);justify-self:center}.data-row{grid-template-columns:1fr auto}.data-row input,.data-row select,.data-row .null-value{grid-column:1}.data-row button{grid-column:2;grid-row:1/4}.creation-kind{flex-direction:column}dl{grid-template-columns:1fr}dd{margin-bottom:8px}}
  `;
}

declare global { interface HTMLElementTagNameMap { "deferred-actions-panel": DeferredActionsPanel } }
