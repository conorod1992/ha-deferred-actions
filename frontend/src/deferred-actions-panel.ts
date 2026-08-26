import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { dump, load } from "js-yaml";
import { createJob, listJobs, operateJob, runFor, subscribeJobs, updateJob } from "./api";
import {
  conditionsToVisual, dataEntryWithType, newVisualAction, presentError, sequenceToVisual, UserFacingError, visualToConditions, visualToSequence,
  type DataEntry, type DataValueType, type VisualAction, type VisualCondition, type VisualConditions, type VisualServiceAction, type VisualTarget,
} from "./editor-model";
import { buildJobPreview, effectiveOverdueLabel, groupActiveJobs, historyOutcome, isHistoryStatus, localDate, matchesJobSearch, relativeTime, resolutionHints, snoozePresets } from "./format";
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
  @state() private conditionFailure: "skip" | "cancel" | "fail" = "skip";
  @state() private overduePolicy = "";
  @state() private overdueGraceMinutes = "";
  @state() private validUntil = "";
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
  @state() private search = "";
  @state() private tagFilter = "";
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
      .filter((job) => matchesJobSearch(job, this.search))
      .filter((job) => !this.tagFilter || job.tags.includes(this.tagFilter))
      .sort((a, b) => a.execute_at.localeCompare(b.execute_at));
  }

  private get timeZone(): string { return this.hass?.config?.time_zone ?? "UTC"; }

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
    this.visualActions = visual;
    this.actionYaml = dump(sequence, { noRefs: true });
    const visualConditions = conditionsToVisual(job?.conditions ?? []);
    this.visualConditions = visualConditions;
    this.conditionMode = "visual";
    this.conditionsYaml = job?.conditions.length ? dump(job.conditions, { noRefs: true }) : "";
    this.conditionFailure = job?.condition_failure ?? "skip";
    this.overduePolicy = job?.overdue_policy ?? "";
    this.overdueGraceMinutes = job?.overdue_grace ? String(job.effective_overdue_grace_minutes) : "";
    this.validUntil = job?.valid_until_local?.slice(0, 16) ?? "";
    this.scheduleMode = "delay";
    this.creationKind = "later";
    this.jobKey = job?.job_key ?? "";
    this.previewDelay = 20;
    this.previewUnit = "minutes";
    this.editor = { job, mode: "visual" };
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
    if (["completed", "cancelled", "skipped", "expired"].includes(job.status)) return { label: "Schedule again", icon: "mdi:calendar-plus", operation: "duplicate" };
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
      <button @click=${() => { this.quickDialog = { job, kind: "duplicate" }; this.menuJobId = undefined; }}><ha-icon icon=${isHistoryStatus(job.status) ? "mdi:calendar-plus" : "mdi:content-copy"}></ha-icon>${isHistoryStatus(job.status) ? "Schedule again" : "Duplicate"}</button>
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
        <div class="time">${localDate(job.execute_at, this.timeZone)} · ${relativeTime(job.execute_at)}</div>
        <p>${job.action_summary}</p>
        ${isHistoryStatus(job.status) || job.status === "failed" ? html`<p class="compact outcome">${historyOutcome(job)}</p>` : job.terminal_reason ? html`<p class="compact">${job.terminal_reason}</p>` : nothing}
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
      <section class="detail-summary"><div><span>Scheduled</span><strong>${localDate(job.execute_at, this.timeZone)}</strong><small>${relativeTime(job.execute_at)}</small></div><div><span>Outcome / action</span><strong>${isHistoryStatus(job.status) || job.status === "failed" ? historyOutcome(job) : job.action_summary}</strong></div></section>
      <section class="preview"><ha-icon icon="mdi:eye-outline"></ha-icon><div><strong>What will happen</strong><span>${buildJobPreview({ sequence: job.sequence, when: `At ${localDate(job.execute_at, this.timeZone)}`, hasConditions: job.has_conditions, conditionFailure: job.condition_failure, overdue: effectiveOverdueLabel(job), validUntil: job.valid_until ? localDate(job.valid_until, this.timeZone) : undefined })}</span></div></section>
      ${job.description ? html`<p>${job.description}</p>` : nothing}
      <div class="detail-actions">
        ${["pending", "paused"].includes(job.status) ? html`<button class="primary" @click=${() => this.openEditor(job)}>Edit action</button><button @click=${() => { this.quickDialog = { job, kind: "reschedule" }; }}>Change time</button>` : nothing}
      </div>
      ${job.status === "pending" ? html`<div class="snooze"><span>Snooze</span><div class="chips">${snoozePresets.map((minutes) => html`<button @click=${() => this.operate("snooze", job, { duration: { minutes } })}>+${minutes < 60 ? `${minutes} min` : "1 hour"}</button>`)}</div><button class="link" @click=${() => { this.quickDialog = { job, kind: "snooze" }; }}>Custom</button></div>` : nothing}
      <details><summary>Additional information</summary><dl>
        ${Object.entries({
          "Job ID": job.id, Status: job.status, "Scheduled UTC": job.execute_at,
          "Don’t run after": job.valid_until ? `${localDate(job.valid_until, this.timeZone)} (${job.valid_until})` : "—",
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
          ${this.editor?.mode === "visual" ? this.renderVisualActions() : html`<label>Action sequence YAML<textarea class="yaml" name="yaml" .value=${this.actionYaml} @input=${(event: InputEvent) => { this.actionYaml = (event.currentTarget as HTMLTextAreaElement).value; }}></textarea><small>Switch back to render supported blocks visually. Unsupported nodes are preserved unchanged.</small></label>`}
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

  private renderVisualActions() { return this.renderSequence(this.visualActions, (actions) => { this.visualActions = actions; }); }

  private renderSequence(actions: VisualAction[], update: (actions: VisualAction[]) => void, depth = 0): ReturnType<typeof html> {
    const replace = (index: number, action: VisualAction) => update(actions.map((item, itemIndex) => itemIndex === index ? action : item));
    return html`<div class="sequence depth-${Math.min(depth, 3)}">${actions.map((action, index) => html`<article class="visual-card block ${action.kind}">
      <div class="section-head"><select aria-label="Action type" .value=${action.kind} ?disabled=${action.kind === "unsupported"} @change=${(event: Event) => replace(index, newVisualAction((event.currentTarget as HTMLSelectElement).value as VisualAction["kind"]))}><option value="service">Call service</option><option value="if">If / Then / Else</option><option value="choose">Choose</option><option value="repeat">Repeat</option><option value="parallel">Parallel</option><option value="delay">Delay</option><option value="wait_template">Wait for template</option>${action.kind === "unsupported" ? html`<option value="unsupported">YAML required</option>` : nothing}</select><span><button type="button" class="icon" title="Move up" ?disabled=${index === 0} @click=${() => { const next = [...actions]; [next[index - 1], next[index]] = [next[index]!, next[index - 1]!]; update(next); }}><ha-icon icon="mdi:arrow-up"></ha-icon></button><button type="button" class="icon" title="Move down" ?disabled=${index === actions.length - 1} @click=${() => { const next = [...actions]; [next[index], next[index + 1]] = [next[index + 1]!, next[index]!]; update(next); }}><ha-icon icon="mdi:arrow-down"></ha-icon></button><button type="button" class="link danger" @click=${() => update(actions.filter((_, itemIndex) => itemIndex !== index))}>Remove</button></span></div>
      ${this.renderActionBlock(action, (value) => replace(index, value), depth)}
    </article>`)}<button type="button" @click=${() => update([...actions, newVisualAction("service")])}><ha-icon icon="mdi:plus"></ha-icon>Add action</button></div>`;
  }

  private renderActionBlock(action: VisualAction, update: (action: VisualAction) => void, depth: number): ReturnType<typeof html> {
    if (action.kind === "unsupported") return html`<div class="yaml-required"><strong>YAML required</strong><p>This action cannot be edited visually without risking data loss. It will be kept exactly as-is.</p><pre>${dump(action.raw, { noRefs: true })}</pre><button type="button" class="link" @click=${() => this.switchActionMode()}>Edit the full sequence in YAML</button></div>`;
    if (action.kind === "service") return html`<label>Service<ha-service-picker .hass=${this.hass} .value=${action.action} @value-changed=${(event: CustomEvent<{ value: string }>) => update({ ...action, action: event.detail.value })}></ha-service-picker></label><label>Target<ha-target-picker .hass=${this.hass} .value=${action.target} @value-changed=${(event: CustomEvent<{ value: VisualTarget }>) => update({ ...action, target: event.detail.value })}></ha-target-picker><small>Leave empty when the service needs no target.</small></label>${this.renderActionData(action, update)}`;
    if (action.kind === "if") return html`<h4>If</h4>${this.renderConditionList(action.conditions, (conditions) => update({ ...action, conditions }), depth + 1)}<h4>Then</h4>${this.renderSequence(action.then, (then) => update({ ...action, then }), depth + 1)}<div class="section-head"><h4>Else</h4>${action.else ? html`<button type="button" class="link danger" @click=${() => { const { else: ignored, ...rest } = action; void ignored; update(rest); }}>Remove Else</button>` : html`<button type="button" class="link" @click=${() => update({ ...action, else: [] })}>Add Else</button>`}</div>${action.else ? this.renderSequence(action.else, (otherwise) => update({ ...action, else: otherwise }), depth + 1) : nothing}`;
    if (action.kind === "choose") return html`${action.choices.map((choice, choiceIndex) => html`<section class="branch"><div class="section-head"><h4>Option ${choiceIndex + 1}</h4><button type="button" class="link danger" @click=${() => update({ ...action, choices: action.choices.filter((_, index) => index !== choiceIndex) })}>Remove option</button></div><strong>When</strong>${this.renderConditionList(choice.conditions, (conditions) => update({ ...action, choices: action.choices.map((item, index) => index === choiceIndex ? { ...item, conditions } : item) }), depth + 1)}<strong>Do</strong>${this.renderSequence(choice.sequence, (sequence) => update({ ...action, choices: action.choices.map((item, index) => index === choiceIndex ? { ...item, sequence } : item) }), depth + 1)}</section>`)}<button type="button" class="link" @click=${() => update({ ...action, choices: [...action.choices, { conditions: [], sequence: [], metadata: {} }] })}>Add option</button><div class="section-head"><h4>Otherwise</h4>${action.default ? html`<button type="button" class="link danger" @click=${() => { const { default: ignored, ...rest } = action; void ignored; update(rest); }}>Remove</button>` : html`<button type="button" class="link" @click=${() => update({ ...action, default: [] })}>Add fallback</button>`}</div>${action.default ? this.renderSequence(action.default, (fallback) => update({ ...action, default: fallback }), depth + 1) : nothing}`;
    if (action.kind === "repeat") return html`<label>Repeat mode<select .value=${action.mode} @change=${(event: Event) => { const mode = (event.currentTarget as HTMLSelectElement).value as typeof action.mode; update({ ...action, mode, ...(mode === "while" || mode === "until" ? { conditions: [], value: undefined } : { value: mode === "count" ? 1 : [], conditions: undefined }) }); }}><option value="count">Count</option><option value="while">While conditions pass</option><option value="until">Until conditions pass</option><option value="for_each">For each item</option></select></label>${action.mode === "while" || action.mode === "until" ? this.renderConditionList(action.conditions ?? [], (conditions) => update({ ...action, conditions }), depth + 1) : this.renderYamlValue(action.mode === "count" ? "Count or template" : "Items or template", action.value, (value) => update({ ...action, value }))}<h4>Sequence</h4>${this.renderSequence(action.sequence, (sequence) => update({ ...action, sequence }), depth + 1)}`;
    if (action.kind === "parallel") return html`<p class="hint">Branches start together. Actions inside each branch still run in order.</p>${action.branches.map((branch, branchIndex) => html`<section class="branch"><div class="section-head"><h4>Branch ${branchIndex + 1}</h4><button type="button" class="link danger" @click=${() => update({ ...action, branches: action.branches.filter((_, index) => index !== branchIndex) })}>Remove</button></div>${this.renderSequence(branch.sequence, (sequence) => update({ ...action, branches: action.branches.map((item, index) => index === branchIndex ? { ...item, wrapped: true, sequence } : item) }), depth + 1)}</section>`)}<button type="button" class="link" @click=${() => update({ ...action, branches: [...action.branches, { wrapped: true, sequence: [], metadata: {} }] })}>Add branch</button>`;
    if (action.kind === "delay") return this.renderYamlValue("Duration (HA duration or template)", action.value, (value) => update({ ...action, value }));
    return html`<label>Wait template<textarea .value=${action.template} @input=${(event: InputEvent) => update({ ...action, template: (event.currentTarget as HTMLTextAreaElement).value })}></textarea></label>${this.renderYamlValue("Timeout (optional)", action.timeout, (timeout) => update({ ...action, timeout }))}<label class="checkbox"><input type="checkbox" .checked=${action.continueOnTimeout !== false} @change=${(event: Event) => update({ ...action, continueOnTimeout: (event.currentTarget as HTMLInputElement).checked })}>Continue after timeout</label>`;
  }

  private renderYamlValue(label: string, value: unknown, update: (value: unknown) => void): ReturnType<typeof html> { return html`<label>${label}<textarea class="typed-yaml" .value=${value === undefined ? "" : dump(value, { noRefs: true }).trim()} @change=${(event: Event) => { const text = (event.currentTarget as HTMLTextAreaElement).value; try { update(text.trim() ? load(text) : undefined); } catch (error) { this.setError(error); } }}></textarea><small>Typed YAML value; strings, numbers, lists, mappings, and templates keep their type.</small></label>`; }

  private renderActionData(action: VisualServiceAction, update: (action: VisualServiceAction) => void): ReturnType<typeof html> {
    const updateData = (index: number, patch: Partial<DataEntry>) => update({ ...action, data: action.data.map((entry, itemIndex) => itemIndex === index ? { ...entry, ...patch } : entry) });
    return html`<div class="section-head"><strong>Action data</strong><button type="button" class="link" @click=${() => update({ ...action, data: [...action.data, { key: "", type: "text", value: "", raw: "" }] })}>Add field</button></div>${action.data.map((entry, index) => html`<div class="data-row"><input aria-label="Data field" placeholder="brightness_pct" .value=${entry.key} @input=${(event: InputEvent) => updateData(index, { key: (event.currentTarget as HTMLInputElement).value })}><select aria-label="Data value type" .value=${entry.type} @change=${(event: Event) => updateData(index, dataEntryWithType(entry, (event.currentTarget as HTMLSelectElement).value as DataValueType))}><option value="text">Text</option><option value="number">Number</option><option value="boolean">Boolean</option><option value="null">Null</option></select>${this.renderDataValue(entry, (patch) => updateData(index, patch))}<button type="button" class="icon" title="Remove data field" @click=${() => update({ ...action, data: action.data.filter((_, itemIndex) => itemIndex !== index) })}><ha-icon icon="mdi:close"></ha-icon></button></div>`)}`;
  }

  private renderDataValue(entry: DataEntry, update: (patch: Partial<DataEntry>) => void) {
    if (entry.type === "null") return html`<span class="null-value">No value</span>`;
    if (entry.type === "boolean") return html`<select aria-label="Boolean value" .value=${entry.value === true ? "true" : "false"} @change=${(event: Event) => update({ value: (event.currentTarget as HTMLSelectElement).value === "true" })}><option value="true">True</option><option value="false">False</option></select>`;
    return html`<input aria-label="Data value" type=${entry.type === "number" ? "number" : "text"} step=${entry.type === "number" ? "any" : ""} placeholder=${entry.type === "number" ? "42" : "Message text"} .value=${entry.raw ?? String(entry.value ?? "")} @input=${(event: InputEvent) => update({ raw: (event.currentTarget as HTMLInputElement).value })}>`;
  }

  private renderNormalOptions(job?: DeferredJob) {
    return html`<section class="normal-options"><h3>Optional settings</h3>
      <label>Description<textarea name="description">${job?.description ?? ""}</textarea></label>
      <div class="section-head"><h3>Only run this action if…</h3><button type="button" class="link" @click=${() => this.switchConditionMode()}>${this.conditionMode === "visual" ? "Edit in YAML" : "Use visual editor"}</button></div>
      ${this.conditionMode === "visual" ? this.renderVisualConditions() : html`<label>Conditions YAML<textarea class="yaml small-yaml" .value=${this.conditionsYaml} @input=${(event: InputEvent) => { this.conditionsYaml = (event.currentTarget as HTMLTextAreaElement).value; }}></textarea><small>Existing and advanced Home Assistant conditions are preserved here.</small></label>`}
      <label>If the conditions aren’t met<select name="condition_failure" .value=${this.conditionFailure} @change=${(event: Event) => { this.conditionFailure = (event.currentTarget as HTMLSelectElement).value as "skip" | "cancel" | "fail"; }}><option value="skip">Skip this run and keep it in history</option><option value="cancel">Cancel the action</option><option value="fail">Mark the action as failed</option></select></label>
      <label>Don’t run after<input name="valid_until" type="datetime-local" .value=${this.validUntil} @input=${(event: InputEvent) => { this.validUntil = (event.currentTarget as HTMLInputElement).value; }}><small>The action will never begin at or after this cutoff.</small></label>
      <label>If Home Assistant was offline when this was due<select name="overdue_policy" .value=${this.overduePolicy} @change=${(event: Event) => { this.overduePolicy = (event.currentTarget as HTMLSelectElement).value; }}><option value="">Use the integration default</option><option value="execute">Run it when Home Assistant comes back</option><option value="execute_within_grace">Run it only if it is less than the grace period late</option><option value="skip">Don’t run it</option></select></label>
      <label>Grace period (minutes)<input name="overdue_grace_minutes" type="number" min="0" .value=${this.overdueGraceMinutes} @input=${(event: InputEvent) => { this.overdueGraceMinutes = (event.currentTarget as HTMLInputElement).value; }} placeholder="Use integration default"><small>Used only for “less than the grace period late”.</small></label>
    </section>`;
  }

  private renderVisualConditions() {
    return html`<div class="condition-builder">${this.visualConditions.items.length > 1 ? html`<label>Match<select .value=${this.visualConditions.operator} @change=${(event: Event) => { this.visualConditions = { ...this.visualConditions, operator: (event.currentTarget as HTMLSelectElement).value as "and" | "or" }; }}><option value="and">All conditions (AND)</option><option value="or">Any condition (OR)</option></select></label>` : nothing}
      ${this.renderConditionList(this.visualConditions.items, (items) => { this.visualConditions = { ...this.visualConditions, items }; })}</div>`;
  }

  private newCondition(type: Exclude<VisualCondition["type"], "unsupported">): VisualCondition {
    if (type === "state") return { type, entity_id: "", state: "", metadata: {} };
    if (type === "numeric_state") return { type, entity_id: "", above: "", below: "", metadata: {} };
    if (type === "time") return { type, after: "", before: "", weekdays: [], metadata: {} };
    if (type === "zone") return { type, entity_id: "", zone: "", metadata: {} };
    if (type === "sun") return { type, after: "", before: "", after_offset: "", before_offset: "", metadata: {} };
    return { type, conditions: [], metadata: {} };
  }

  private renderConditionList(conditions: VisualCondition[], update: (conditions: VisualCondition[]) => void, depth = 0): ReturnType<typeof html> {
    const replace = (index: number, condition: VisualCondition) => update(conditions.map((item, itemIndex) => itemIndex === index ? condition : item));
    const weekdays: [string, string][] = [["mon", "Mon"], ["tue", "Tue"], ["wed", "Wed"], ["thu", "Thu"], ["fri", "Fri"], ["sat", "Sat"], ["sun", "Sun"]];
    return html`<div class="conditions depth-${Math.min(depth, 3)}">${conditions.map((condition, index) => html`<article class="visual-card condition"><div class="section-head"><select aria-label="Condition type" .value=${condition.type} ?disabled=${condition.type === "unsupported"} @change=${(event: Event) => replace(index, this.newCondition((event.currentTarget as HTMLSelectElement).value as Exclude<VisualCondition["type"], "unsupported">))}><option value="state">State</option><option value="numeric_state">Numeric state</option><option value="time">Time / day</option><option value="zone">Zone</option><option value="sun">Sun</option><option value="and">AND group</option><option value="or">OR group</option><option value="not">NOT group</option>${condition.type === "unsupported" ? html`<option value="unsupported">YAML required</option>` : nothing}</select><button type="button" class="link danger" @click=${() => update(conditions.filter((_, itemIndex) => itemIndex !== index))}>Remove</button></div>
      ${condition.type === "unsupported" ? html`<div class="yaml-required"><strong>YAML required</strong><p>This condition is preserved exactly.</p><pre>${dump(condition.raw, { noRefs: true })}</pre></div>` : nothing}
      ${condition.type !== "unsupported" ? html`<label>Alias (optional)<input .value=${condition.alias ?? ""} @input=${(event: InputEvent) => replace(index, { ...condition, alias: (event.currentTarget as HTMLInputElement).value, metadata: { ...condition.metadata, alias: (event.currentTarget as HTMLInputElement).value || undefined } } as VisualCondition)}></label>` : nothing}
      ${condition.type === "state" ? html`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${condition.entity_id} .allowCustomEntity=${true} @value-changed=${(event: CustomEvent<{ value: string }>) => replace(index, { ...condition, entity_id: event.detail.value })}></ha-entity-picker></label><label>Must be in state<input .value=${condition.state} @input=${(event: InputEvent) => replace(index, { ...condition, state: (event.currentTarget as HTMLInputElement).value })}></label>` : nothing}
      ${condition.type === "numeric_state" ? html`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${condition.entity_id} .allowCustomEntity=${true} @value-changed=${(event: CustomEvent<{ value: string }>) => replace(index, { ...condition, entity_id: event.detail.value })}></ha-entity-picker></label><div class="two"><label>Above<input type="number" step="any" .value=${condition.above} @input=${(event: InputEvent) => replace(index, { ...condition, above: (event.currentTarget as HTMLInputElement).value })}></label><label>Below<input type="number" step="any" .value=${condition.below} @input=${(event: InputEvent) => replace(index, { ...condition, below: (event.currentTarget as HTMLInputElement).value })}></label></div>` : nothing}
      ${condition.type === "time" ? html`<div class="two"><label>After<input type="time" step="1" .value=${condition.after} @input=${(event: InputEvent) => replace(index, { ...condition, after: (event.currentTarget as HTMLInputElement).value })}></label><label>Before<input type="time" step="1" .value=${condition.before} @input=${(event: InputEvent) => replace(index, { ...condition, before: (event.currentTarget as HTMLInputElement).value })}></label></div><div class="weekdays">${weekdays.map(([value, label]) => html`<label><input type="checkbox" .checked=${condition.weekdays.includes(value)} @change=${(event: Event) => replace(index, { ...condition, weekdays: (event.currentTarget as HTMLInputElement).checked ? [...condition.weekdays, value] : condition.weekdays.filter((item) => item !== value) })}>${label}</label>`)}</div>` : nothing}
      ${condition.type === "zone" ? html`<label>Entity<ha-entity-picker .hass=${this.hass} .value=${condition.entity_id} .allowCustomEntity=${true} @value-changed=${(event: CustomEvent<{ value: string }>) => replace(index, { ...condition, entity_id: event.detail.value })}></ha-entity-picker></label><label>Zone<ha-entity-picker .hass=${this.hass} .value=${condition.zone} .includeDomains=${["zone"]} .allowCustomEntity=${true} @value-changed=${(event: CustomEvent<{ value: string }>) => replace(index, { ...condition, zone: event.detail.value })}></ha-entity-picker></label>` : nothing}
      ${condition.type === "sun" ? html`<div class="two"><label>After<select .value=${condition.after} @change=${(event: Event) => replace(index, { ...condition, after: (event.currentTarget as HTMLSelectElement).value })}><option value="">—</option><option value="sunrise">Sunrise</option><option value="sunset">Sunset</option></select></label><label>Before<select .value=${condition.before} @change=${(event: Event) => replace(index, { ...condition, before: (event.currentTarget as HTMLSelectElement).value })}><option value="">—</option><option value="sunrise">Sunrise</option><option value="sunset">Sunset</option></select></label><label>After offset<input placeholder="-01:00:00" .value=${condition.after_offset} @input=${(event: InputEvent) => replace(index, { ...condition, after_offset: (event.currentTarget as HTMLInputElement).value })}></label><label>Before offset<input placeholder="00:30:00" .value=${condition.before_offset} @input=${(event: InputEvent) => replace(index, { ...condition, before_offset: (event.currentTarget as HTMLInputElement).value })}></label></div>` : nothing}
      ${condition.type === "and" || condition.type === "or" || condition.type === "not" ? this.renderConditionList(condition.conditions, (nested) => replace(index, { ...condition, conditions: nested }), depth + 1) : nothing}
    </article>`)}<button type="button" @click=${() => update([...conditions, this.newCondition("state")])}><ha-icon icon="mdi:plus"></ha-icon>Add condition</button></div>`;
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
          start_sequence: visualToSequence([{ kind: "service", action: this.runForStart, target: this.runForTarget, data: [], metadata: {} }]),
          end_sequence: visualToSequence([{ kind: "service", action: this.runForEnd, target: this.runForTarget, data: [], metadata: {} }]),
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
      if (this.editor?.mode === "visual" && (this.visualActions.length === 0 || !this.sequenceIsComplete(this.visualActions))) throw new UserFacingError("Complete every visual action block");
      const conditions = this.conditionMode === "visual" ? visualToConditions(this.visualConditions) : (this.conditionsYaml.trim() ? load(this.conditionsYaml) : []);
      if (this.conditionMode === "visual" && !this.conditionsAreComplete(this.visualConditions.items)) throw new UserFacingError("Complete or remove each condition");
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

  private sequenceIsComplete(actions: VisualAction[]): boolean {
    return actions.every((action) => action.kind === "unsupported" || action.kind === "service" ? action.kind === "unsupported" || !!action.action
      : action.kind === "if" ? this.conditionsAreComplete(action.conditions) && action.then.length > 0 && this.sequenceIsComplete(action.then) && (!action.else || this.sequenceIsComplete(action.else))
        : action.kind === "choose" ? action.choices.length > 0 && action.choices.every((choice) => this.conditionsAreComplete(choice.conditions) && choice.sequence.length > 0 && this.sequenceIsComplete(choice.sequence)) && (!action.default || this.sequenceIsComplete(action.default))
          : action.kind === "repeat" ? action.sequence.length > 0 && this.sequenceIsComplete(action.sequence) && (action.conditions ? this.conditionsAreComplete(action.conditions) : action.value !== undefined)
            : action.kind === "parallel" ? action.branches.length > 0 && action.branches.every((branch) => branch.sequence.length > 0 && this.sequenceIsComplete(branch.sequence))
              : action.kind === "wait_template" ? !!action.template.trim() : action.value !== undefined);
  }

  private conditionsAreComplete(conditions: VisualCondition[]): boolean {
    return conditions.every((condition) => condition.type === "unsupported"
      || condition.type === "state" ? condition.type === "unsupported" || !!condition.entity_id && !!condition.state
        : condition.type === "numeric_state" ? !!condition.entity_id && (!!condition.above.trim() || !!condition.below.trim())
          : condition.type === "time" ? !!condition.after || !!condition.before || condition.weekdays.length > 0
            : condition.type === "zone" ? !!condition.entity_id && !!condition.zone
              : condition.type === "sun" ? !!condition.after || !!condition.before
                : condition.conditions.length > 0 && this.conditionsAreComplete(condition.conditions));
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
    const sequence = this.editor?.mode === "visual" ? visualToSequence(this.visualActions) : this.previewYamlList(this.actionYaml);
    if (this.creationKind === "run_for" && !job) return buildJobPreview({ sequence: [], when: "Now", runFor: { start: this.runForStart, end: this.runForEnd, duration: `${this.previewDelay} ${this.previewUnit}` } });
    if (!sequence) return "Preview unavailable until the action YAML is a valid list.";
    const conditions = this.conditionMode === "visual" ? visualToConditions(this.visualConditions) : this.previewYamlList(this.conditionsYaml);
    if (!conditions) return "Preview unavailable until the conditions YAML is a valid list.";
    return buildJobPreview({
      sequence,
      when: job ? `Scheduled for ${localDate(job.execute_at, this.timeZone)}` : this.scheduleMode === "delay" ? `In ${this.previewDelay} ${this.previewUnit}` : "At the selected date and time",
      hasConditions: conditions.length > 0,
      conditionFailure: this.conditionFailure,
      overdue: this.previewOverdueLabel(),
      validUntil: this.validUntil ? this.previewValidUntil() : undefined,
    });
  }

  private previewYamlList(value: string): Record<string, unknown>[] | undefined {
    try { const loaded = value.trim() ? load(value) : []; return Array.isArray(loaded) ? loaded as Record<string, unknown>[] : undefined; }
    catch { return undefined; }
  }

  private previewOverdueLabel(): string {
    if (!this.overduePolicy) return "Offline handling follows the integration default";
    if (this.overduePolicy === "execute") return "Run when Home Assistant comes back";
    if (this.overduePolicy === "skip") return "Don’t run when Home Assistant comes back";
    return this.overdueGraceMinutes ? `Run only if less than ${this.overdueGraceMinutes} minutes late` : "Run only within the configured grace period";
  }

  private previewValidUntil(): string | undefined {
    const value = new Date(this.validUntil);
    return Number.isNaN(value.getTime()) ? undefined : localDate(value.toISOString(), this.timeZone);
  }

  private renderQuickDialog() {
    const dialog = this.quickDialog;
    if (!dialog) return nothing;
    const labels = { reschedule: "Reschedule action", extend: "Change remaining time", snooze: "Snooze action", duplicate: isHistoryStatus(dialog.job.status) ? "Schedule action again" : "Duplicate action" };
    return html`<div class="overlay"><form class="dialog small" @submit=${(event: SubmitEvent) => this.submitQuickDialog(event)}><header><h2>${labels[dialog.kind]}</h2><button type="button" class="icon" @click=${() => { this.quickDialog = undefined; }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      ${dialog.kind === "reschedule" ? html`<div class="two"><label>Date<input name="date" type="date" required></label><label>Time<input name="time" type="time" required></label></div>` : html`<label>${dialog.kind === "extend" ? "Minutes to add (negative reduces time)" : dialog.kind === "snooze" ? "Minutes to snooze" : "Run the copy in how many minutes?"}<input name="minutes" type="number" min=${dialog.kind === "extend" ? nothing : "1"} .value=${dialog.kind === "extend" ? "15" : "20"} required></label>`}
      <footer><button type="button" @click=${() => { this.quickDialog = undefined; }}>Cancel</button><button class="primary">${dialog.kind === "duplicate" ? isHistoryStatus(dialog.job.status) ? "Schedule again" : "Duplicate" : "Apply"}</button></footer></form></div>`;
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
      : isCancel ? "The action will not run, but the cancelled record will remain in history." : "This bypasses the remaining delay. Conditions are checked again at run time; Run now does not bypass them.";
    return html`<div class="overlay" @click=${() => { this.confirmAction = undefined; }}><section class="dialog small confirmation" role="alertdialog" aria-modal="true" @click=${(event: Event) => event.stopPropagation()}>
      <header><h2>${title}</h2><button class="icon" title="Close" @click=${() => { this.confirmAction = undefined; }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      <p><strong>${confirmation.job.name}</strong></p><p>${explanation}</p>
      <footer><button @click=${() => { this.confirmAction = undefined; }}>Keep it</button><button class=${isDelete ? "danger" : isCancel ? "warning" : "primary"} ?disabled=${this.busy} @click=${async () => { const current = this.confirmAction; this.confirmAction = undefined; if (current) await this.performOperation(current.operation, current.job); }}>${isDelete ? "Delete permanently" : isCancel ? "Cancel action" : "Run now"}</button></footer>
    </section></div>`;
  }

  protected render() {
    const visible = this.visibleJobs();
    const active = visible.filter((job) => ["pending", "paused", "executing"].includes(job.status));
    const inactive = visible.filter((job) => !["pending", "paused", "executing"].includes(job.status));
    const groups = groupActiveJobs(active, new Date(), this.timeZone);
    const tags = [...new Set(this.jobs.flatMap((job) => job.tags))].sort();
    return html`<ha-card>
      <header class="top"><h1>Deferred Actions</h1><div class="create-actions"><button @click=${() => this.openRunFor()}><ha-icon icon="mdi:timer-play-outline"></ha-icon>Run for a while</button><button class="primary" @click=${() => this.openEditor()}><ha-icon icon="mdi:clock-plus-outline"></ha-icon>Do something later</button></div></header>
      ${this.error ? html`<div class="banner"><div>${this.error}${this.errorDetails ? html`<details><summary>Technical details</summary><code>${this.errorDetails}</code></details>` : nothing}</div><button class="icon" @click=${() => { this.error = undefined; this.errorDetails = undefined; }}><ha-icon icon="mdi:close"></ha-icon></button></div>` : nothing}
      <nav>${(["Pending", "Paused", "Failed", "History"] as Tab[]).map((tab) => html`<button class=${this.tab === tab ? "active" : ""} @click=${() => { this.tab = tab; }}>${tab}<span>${tab === "Pending" ? this.summary.pending : tab === "Paused" ? this.summary.paused : tab === "Failed" ? this.summary.failed : ""}</span></button>`)}<button class=${this.tab === "All" ? "active" : ""} title="All actions" @click=${() => { this.tab = "All"; }}><ha-icon icon="mdi:format-list-bulleted"></ha-icon></button></nav>
      <section class="next"><ha-icon icon="mdi:clock-outline"></ha-icon><span>Next:</span><strong>${this.summary.next_job_name ?? "No pending actions"}</strong>${this.summary.next_execution_local ? html`<small>${localDate(this.summary.next_execution_local, this.timeZone)} · ${relativeTime(this.summary.next_execution_local)}</small>` : nothing}</section>
      <section class="queue-tools"><label><ha-icon icon="mdi:magnify"></ha-icon><input type="search" placeholder="Search name, key, tags, or targets" .value=${this.search} @input=${(event: InputEvent) => { this.search = (event.currentTarget as HTMLInputElement).value; }}></label><select aria-label="Filter by tag" .value=${this.tagFilter} @change=${(event: Event) => { this.tagFilter = (event.currentTarget as HTMLSelectElement).value; }}><option value="">All tags</option>${tags.map((tag) => html`<option value=${tag}>${tag}</option>`)}</select></section>
      <main>${visible.length ? html`${groups.map((group) => html`<section class="queue-group"><h2>${group.label}<span>${group.jobs.length}</span></h2>${group.jobs.map((job) => this.renderJob(job))}</section>`)}${inactive.length ? html`<section class="queue-group">${active.length ? html`<h2>${this.tab === "History" ? "History" : "Other"}<span>${inactive.length}</span></h2>` : nothing}${inactive.map((job) => this.renderJob(job))}</section>` : nothing}` : html`<div class="empty"><ha-icon icon="mdi:calendar-check"></ha-icon><p>No matching ${this.tab.toLowerCase()} deferred actions.</p></div>`}</main>
      ${this.selected ? this.renderDetails(this.selected) : nothing}${this.editor ? this.renderEditor() : nothing}${this.renderQuickDialog()}${this.renderConfirmation()}
    </ha-card>`;
  }

  static styles = css`
    :host{display:block;color:var(--primary-text-color);background:var(--primary-background-color);min-height:100vh}ha-card{max-width:980px;margin:24px auto;padding:24px;background:var(--card-background-color);box-sizing:border-box}.top{display:flex;justify-content:space-between;align-items:center;gap:16px}.top h1{margin:0;font-size:28px}.create-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}button{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--divider-color);border-radius:10px;padding:9px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}button.primary{background:var(--primary-color);color:var(--text-primary-color);border-color:var(--primary-color)}button.danger{color:var(--error-color)}button.warning{color:var(--warning-color)}button.quiet,button.icon,button.link{background:none}button.icon{padding:8px;border:0}button.link{border:0;color:var(--primary-color);padding:4px}button:disabled{opacity:.5}nav{display:flex;align-items:end;gap:4px;overflow:auto;border-bottom:1px solid var(--divider-color);margin-top:20px}nav button{border:0;background:none;border-radius:0}nav button span{min-width:20px;padding:2px 6px;border-radius:999px;background:var(--secondary-background-color);font-size:12px}nav button.active{color:var(--primary-color);border-bottom:3px solid var(--primary-color)}.next{display:flex;align-items:center;gap:8px;padding:12px 4px;color:var(--secondary-text-color)}.next strong{color:var(--primary-text-color)}.next small{margin-left:auto}main{display:flex;flex-direction:column;border-top:1px solid var(--divider-color)}.job{position:relative;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:16px 4px;border-bottom:1px solid var(--divider-color);cursor:pointer}.job:hover{background:var(--secondary-background-color)}.job-icon{color:var(--primary-color)}.job-head{display:flex;align-items:center;gap:8px}.job h3{margin:0;font-size:16px}.job p{margin:5px 0 0;color:var(--secondary-text-color)}.job p.outcome{color:var(--primary-text-color);font-weight:500}.time{color:var(--secondary-text-color);font-size:13px;margin-top:4px}.status{font-size:12px;border-radius:999px;padding:3px 7px;background:var(--secondary-background-color);text-transform:capitalize}.status.failed{color:var(--error-color)}.row-actions{display:flex;align-items:center;gap:4px}.row-actions ha-icon{--mdc-icon-size:18px}.menu-wrap{position:relative}.menu{position:absolute;z-index:4;right:0;top:100%;display:flex;flex-direction:column;min-width:210px;padding:6px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;box-shadow:var(--ha-card-box-shadow,0 4px 14px rgba(0,0,0,.2))}.menu button{justify-content:flex-start;border:0;background:none}.queue-tools{display:flex;gap:10px;margin:4px 0 12px}.queue-tools label{display:flex;align-items:center;gap:8px;flex:1;border:1px solid var(--divider-color);border-radius:10px;padding:0 10px}.queue-tools input,.queue-tools select{font:inherit;color:var(--primary-text-color);background:transparent;border:0;padding:10px;min-width:0}.queue-tools select{border:1px solid var(--divider-color);border-radius:10px}.queue-group>h2{display:flex;gap:8px;align-items:center;margin:18px 4px 4px;font-size:14px;color:var(--secondary-text-color);text-transform:uppercase;letter-spacing:.04em}.queue-group>h2 span{font-size:11px;border-radius:999px;padding:2px 6px;background:var(--secondary-background-color)}.error,.banner{color:var(--error-color);padding:10px;background:color-mix(in srgb,var(--error-color) 10%,transparent);border-radius:10px}.error.compact{margin-top:8px}.banner{display:flex;justify-content:space-between;margin:12px 0}.banner details{color:var(--secondary-text-color);font-size:12px}.empty{text-align:center;padding:56px;color:var(--secondary-text-color)}.empty ha-icon{--mdc-icon-size:48px}.overlay{position:fixed;z-index:10;inset:0;background:rgba(0,0,0,.48);display:grid;place-items:center;padding:16px}.dialog{width:min(620px,100%);max-height:90vh;overflow:auto;background:var(--card-background-color);border-radius:16px;padding:20px;box-sizing:border-box}.dialog.wide{width:min(820px,100%)}.dialog.small{width:min(480px,100%)}.dialog header,.dialog footer,.section-head{display:flex;justify-content:space-between;align-items:center;gap:8px}.dialog header h2,.section-head h3{margin:0}.dialog header>div{display:flex;align-items:center;gap:10px}.dialog label{display:flex;flex-direction:column;gap:6px;margin:14px 0}.dialog label.checkbox{flex-direction:row;align-items:center}.dialog input,.dialog textarea,.dialog select{font:inherit;padding:10px;border:1px solid var(--divider-color);border-radius:8px;color:var(--primary-text-color);background:var(--primary-background-color)}.dialog textarea{min-height:70px}.dialog textarea.yaml{min-height:260px;font-family:monospace}.dialog textarea.small-yaml{min-height:150px}.dialog textarea.typed-yaml{min-height:48px;font-family:monospace}.dialog footer{margin-top:20px;justify-content:flex-end}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}fieldset,.action-editor,.advanced,.normal-options{border:1px solid var(--divider-color);border-radius:12px;padding:14px;margin-top:16px}.segmented,.delay-row,.chips,.detail-actions{display:flex;gap:8px}.creation-kind{margin:16px 0}.segmented button{flex:1}.segmented .active{border-color:var(--primary-color);color:var(--primary-color)}.delay-row input{flex:1;min-width:0}.delay-row select{min-width:130px}.chips{flex-wrap:wrap;margin-top:10px}.chips button{padding:6px 9px}.advanced summary,details summary{cursor:pointer;font-weight:600}.visual-card{border:1px solid var(--divider-color);border-radius:10px;padding:12px;margin:12px 0;background:var(--primary-background-color)}.sequence.depth-1,.conditions.depth-1,.sequence.depth-2,.conditions.depth-2,.sequence.depth-3,.conditions.depth-3{border-left:3px solid color-mix(in srgb,var(--primary-color) 35%,var(--divider-color));padding-left:10px}.branch{border:1px dashed var(--divider-color);border-radius:10px;padding:10px;margin:10px 0}.branch h4,.block h4{margin:8px 0}.yaml-required{border-radius:8px;padding:10px;background:color-mix(in srgb,var(--warning-color) 9%,transparent)}.yaml-required p,.hint{color:var(--secondary-text-color)}.yaml-required pre{max-height:180px}.data-row{display:grid;grid-template-columns:minmax(120px,1fr) 110px minmax(140px,1fr) auto;gap:8px;align-items:center;margin:8px 0}.null-value{padding:10px;color:var(--secondary-text-color);font-style:italic}.weekdays{display:flex;flex-wrap:wrap;gap:8px}.weekdays label{flex-direction:row;margin:0;padding:7px 9px;border:1px solid var(--divider-color);border-radius:8px}.preview{display:flex;gap:12px;align-items:center;padding:14px;margin-top:16px;border-radius:12px;background:color-mix(in srgb,var(--primary-color) 9%,transparent)}.preview div{display:flex;flex-direction:column;gap:3px}.timeline{display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:12px}.timeline div{display:flex;flex-direction:column;padding:12px;border-radius:10px;background:var(--secondary-background-color)}.timeline span{color:var(--secondary-text-color);font-size:12px}.detail-summary{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0}.detail-summary>div{display:flex;flex-direction:column;gap:4px;padding:14px;border:1px solid var(--divider-color);border-radius:12px}.detail-summary span,.detail-summary small{color:var(--secondary-text-color)}details{margin-top:14px}dl{display:grid;grid-template-columns:minmax(130px,auto) 1fr;gap:8px 16px}dt{font-weight:600}dd{margin:0;overflow-wrap:anywhere}pre{padding:12px;overflow:auto;background:var(--secondary-background-color);border-radius:10px;white-space:pre-wrap}@media(max-width:700px){ha-card{margin:0;padding:16px;min-height:100vh;border-radius:0}.top{align-items:flex-start;flex-direction:column}.create-actions{width:100%}.create-actions button{flex:1}.top h1{font-size:24px}.next{flex-wrap:wrap}.next small{width:100%;margin-left:32px}.queue-tools{flex-direction:column}.job{grid-template-columns:auto 1fr}.row-actions{grid-column:2}.row-actions .quiet{flex:1}.overlay{padding:0}.dialog{width:100%;height:100%;max-height:none;border-radius:0}.two,.detail-summary,.timeline{grid-template-columns:1fr}.timeline>ha-icon{transform:rotate(90deg);justify-self:center}.data-row{grid-template-columns:1fr auto}.data-row input,.data-row select,.data-row .null-value{grid-column:1}.data-row button{grid-column:2;grid-row:1/4}.creation-kind{flex-direction:column}dl{grid-template-columns:1fr}dd{margin-bottom:8px}}
  `;
}

declare global { interface HTMLElementTagNameMap { "deferred-actions-panel": DeferredActionsPanel } }
