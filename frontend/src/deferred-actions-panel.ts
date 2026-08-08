import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { dump, load } from "js-yaml";
import { createJob, listJobs, operateJob, subscribeJobs, updateJob } from "./api";
import { effectiveOverdueLabel, isHistoryStatus, localDate, relativeTime, resolutionHints, snoozePresets } from "./format";
import type { DeferredJob, HomeAssistant, PushEvent, QueueSummary } from "./types";

type Tab = "Pending" | "Paused" | "Failed" | "History" | "All";
type EditorMode = "simple" | "advanced";
type ScheduleMode = "delay" | "absolute";
type QuickDialog = { job: DeferredJob; kind: "reschedule" | "extend" | "snooze" | "duplicate" };

@customElement("deferred-actions-panel")
export class DeferredActionsPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private jobs: DeferredJob[] = [];
  @state() private summary: QueueSummary = { pending: 0, paused: 0, failed: 0 };
  @state() private tab: Tab = "Pending";
  @state() private selected?: DeferredJob;
  @state() private editor?: { job?: DeferredJob; mode: EditorMode };
  @state() private scheduleMode: ScheduleMode = "delay";
  @state() private simpleAction = "light.turn_off";
  @state() private simpleEntity = "";
  @state() private advancedOpen = false;
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
    } catch (error) { this.error = String(error); }
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
    if (["cancel", "delete", "execute_now"].includes(operation) && !window.confirm(`${operation.replace("_", " ")} “${job.name}”?`)) return;
    this.busy = true;
    this.error = undefined;
    try {
      await operateJob(this.hass, operation, job.id, data);
      if (operation === "delete") this.selected = undefined;
    } catch (error) { this.error = String(error); }
    finally { this.busy = false; }
  }

  private openEditor(job?: DeferredJob): void {
    const first = job?.sequence[0] as { action?: unknown; target?: { entity_id?: unknown } } | undefined;
    const entity = first?.target?.entity_id;
    this.simpleAction = typeof first?.action === "string" ? first.action : "light.turn_off";
    this.simpleEntity = typeof entity === "string" ? entity : "";
    this.scheduleMode = "delay";
    this.advancedOpen = false;
    this.editor = { job, mode: job ? "advanced" : "simple" };
    this.menuJobId = undefined;
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
          "Valid until": job.valid_until_local ? `${localDate(job.valid_until_local)} (${job.valid_until})` : "—",
          Conditions: job.has_conditions ? `Yes — ${job.condition_failure} if false` : "None",
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
    return html`<div class="overlay"><form class="dialog" @submit=${(event: SubmitEvent) => this.saveEditor(event)}>
      <header><h2>${job ? "Edit deferred action" : "Add deferred action"}</h2><button type="button" class="icon" title="Close" @click=${() => { this.editor = undefined; }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      <label>Name<input name="name" required .value=${job?.name ?? ""} placeholder="Turn off office heater"></label>
      ${job ? nothing : html`<fieldset><legend>When</legend><div class="segmented"><button type="button" class=${this.scheduleMode === "delay" ? "active" : ""} @click=${() => { this.scheduleMode = "delay"; }}>After a delay</button><button type="button" class=${this.scheduleMode === "absolute" ? "active" : ""} @click=${() => { this.scheduleMode = "absolute"; }}>At a date and time</button></div>
        ${this.scheduleMode === "delay" ? html`<div class="delay-row"><input name="delay_value" type="number" min="1" value="20"><select name="delay_unit"><option value="minutes">minutes</option><option value="hours">hours</option><option value="days">days</option></select></div><div class="chips">${[5,15,30,60].map((minutes) => html`<button type="button" @click=${(event: Event) => { const form = (event.currentTarget as HTMLElement).closest("form")!; (form.elements.namedItem("delay_value") as HTMLInputElement).value = String(minutes); (form.elements.namedItem("delay_unit") as HTMLSelectElement).value = "minutes"; }}>${minutes < 60 ? `${minutes} min` : "1 hour"}</button>`)}</div>` : html`<div class="two"><label>Date<input name="date" type="date" required></label><label>Time<input name="time" type="time" required></label></div>`}
      </fieldset>`}
      <section class="action-editor"><div class="section-head"><h3>Action</h3><button type="button" class="link" @click=${() => { this.editor = { ...this.editor!, mode: this.editor?.mode === "simple" ? "advanced" : "simple" }; }}>${this.editor?.mode === "simple" ? "Edit in YAML" : "Use simple editor"}</button></div>
      ${this.editor?.mode === "simple" ? html`
        <label>Service<ha-service-picker .hass=${this.hass} .value=${this.simpleAction} @value-changed=${(event: CustomEvent<{ value: string }>) => { this.simpleAction = event.detail.value; }}></ha-service-picker></label>
        <label>Entity<ha-entity-picker .hass=${this.hass} .value=${this.simpleEntity} .allowCustomEntity=${true} @value-changed=${(event: CustomEvent<{ value: string }>) => { this.simpleEntity = event.detail.value; }}></ha-entity-picker></label>
      ` : html`<label>Action sequence YAML<textarea class="yaml" name="yaml" required>${dump(job?.sequence ?? [{ action: "light.turn_off", target: { entity_id: "light.porch" } }], { noRefs: true })}</textarea></label>`}
      </section>
      <details class="advanced" ?open=${this.advancedOpen} @toggle=${(event: Event) => { this.advancedOpen = (event.currentTarget as HTMLDetailsElement).open; }}><summary>Advanced options</summary>
        <label>Description<textarea name="description">${job?.description ?? ""}</textarea></label>
        <label>Job key<input name="job_key" .value=${job?.job_key ?? ""}></label>
        <label>Tags (comma separated)<input name="tags" .value=${job?.tags.join(", ") ?? ""}></label>
        <label>Resolution entity hints<ha-entity-picker .hass=${this.hass} .value=${resolutionHints(job)[0] ?? ""} .allowCustomEntity=${true} @value-changed=${(event: CustomEvent<{ value: string }>) => { const input = (event.currentTarget as HTMLElement).parentElement?.querySelector("input[name=target_entities]") as HTMLInputElement | null; if (input) input.value = event.detail.value; }}></ha-entity-picker><input name="target_entities" type="hidden" .value=${resolutionHints(job).join(", ")}><small>Used to find this job later; it does not change the action target.</small></label>
        ${job ? nothing : html`<label>When another action has this job key<select name="conflict_mode"><option value="keep_all">Keep both actions</option><option value="replace_same_key">Replace the existing action</option><option value="cancel_same_key">Cancel the existing action</option><option value="reject_same_key">Do not create this action</option></select></label>`}
        <label>Execution conditions YAML<textarea class="yaml small-yaml" name="conditions_yaml">${job?.conditions.length ? dump(job.conditions, { noRefs: true }) : ""}</textarea><small>Normal Home Assistant conditions, evaluated immediately before the action.</small></label>
        <label>If conditions are false<select name="condition_failure"><option value="skip" ?selected=${!job || job.condition_failure === "skip"}>Skip</option><option value="cancel" ?selected=${job?.condition_failure === "cancel"}>Cancel</option><option value="fail" ?selected=${job?.condition_failure === "fail"}>Fail</option></select></label>
        <label>Valid until<input name="valid_until" type="datetime-local" .value=${job?.valid_until_local?.slice(0, 16) ?? ""}><small>The action will never begin at or after this cutoff.</small></label>
        <label>Overdue recovery<select name="overdue_policy"><option value="" ?selected=${!job?.overdue_policy}>Use integration default</option><option value="execute" ?selected=${job?.overdue_policy === "execute"}>Execute</option><option value="skip" ?selected=${job?.overdue_policy === "skip"}>Skip as missed</option><option value="execute_within_grace" ?selected=${job?.overdue_policy === "execute_within_grace"}>Execute within grace</option></select></label>
        <label>Job-specific grace (minutes)<input name="overdue_grace_minutes" type="number" min="0" .value=${job?.overdue_grace ? String(job.effective_overdue_grace_minutes) : ""} placeholder="Use integration default"></label>
      </details>
      <footer><button type="button" @click=${() => { this.editor = undefined; }}>Cancel</button><button class="primary" ?disabled=${this.busy}>${job ? "Save" : "Create"}</button></footer>
    </form></div>`;
  }

  private async saveEditor(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const formElement = event.currentTarget as HTMLFormElement;
    const form = new FormData(formElement);
    try {
      const sequence = this.editor?.mode === "simple"
        ? [{ action: this.simpleAction, target: { entity_id: this.simpleEntity } }]
        : load(String(form.get("yaml")));
      if (!Array.isArray(sequence)) throw new Error("Advanced YAML must be a list of actions");
      if (this.editor?.mode === "simple" && (!this.simpleAction || !this.simpleEntity)) throw new Error("Choose both an action and entity");
      const common = {
        name: String(form.get("name")), description: String(form.get("description") ?? "") || undefined,
        job_key: String(form.get("job_key") ?? "") || undefined,
        tags: String(form.get("tags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
        target_entities: String(form.get("target_entities") ?? "").split(",").map((entity) => entity.trim()).filter(Boolean), sequence,
        conditions: String(form.get("conditions_yaml") ?? "").trim() ? load(String(form.get("conditions_yaml"))) : [],
        condition_failure: String(form.get("condition_failure") ?? "skip"),
        overdue_policy: String(form.get("overdue_policy") ?? "") || null,
        overdue_grace: String(form.get("overdue_grace_minutes") ?? "") ? { minutes: Number(form.get("overdue_grace_minutes")) } : null,
        valid_until: String(form.get("valid_until") ?? "") ? new Date(String(form.get("valid_until"))).toISOString() : null,
      };
      if (!Array.isArray(common.conditions)) throw new Error("Conditions YAML must be a list");
      this.busy = true;
      if (this.editor?.job) await updateJob(this.hass, { job_id: this.editor.job.id, expected_revision: this.editor.job.revision, ...common });
      else {
        let schedule: Record<string, unknown>;
        if (this.scheduleMode === "absolute") {
          const date = String(form.get("date"));
          const time = String(form.get("time"));
          const local = new Date(`${date}T${time}`);
          if (Number.isNaN(local.getTime())) throw new Error("Choose a valid date and time");
          schedule = { execute_at: local.toISOString() };
        } else {
          const value = Number(form.get("delay_value"));
          const unit = String(form.get("delay_unit"));
          if (!Number.isFinite(value) || value <= 0) throw new Error("Delay must be greater than zero");
          schedule = { delay: { [unit]: value } };
        }
        await createJob(this.hass, { ...common, ...schedule, conflict_mode: String(form.get("conflict_mode") ?? "keep_all") });
      }
      this.editor = undefined;
    } catch (error) { this.error = String(error); }
    finally { this.busy = false; }
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

  protected render() {
    const visible = this.visibleJobs();
    return html`<ha-card>
      <header class="top"><h1>Deferred Actions</h1><button class="primary" @click=${() => this.openEditor()}><ha-icon icon="mdi:plus"></ha-icon>Add action</button></header>
      ${this.error ? html`<div class="banner">${this.error}<button class="icon" @click=${() => { this.error = undefined; }}><ha-icon icon="mdi:close"></ha-icon></button></div>` : nothing}
      <nav>${(["Pending", "Paused", "Failed", "History"] as Tab[]).map((tab) => html`<button class=${this.tab === tab ? "active" : ""} @click=${() => { this.tab = tab; }}>${tab}<span>${tab === "Pending" ? this.summary.pending : tab === "Paused" ? this.summary.paused : tab === "Failed" ? this.summary.failed : ""}</span></button>`)}<button class=${this.tab === "All" ? "active" : ""} title="All actions" @click=${() => { this.tab = "All"; }}><ha-icon icon="mdi:format-list-bulleted"></ha-icon></button></nav>
      <section class="next"><ha-icon icon="mdi:clock-outline"></ha-icon><span>Next:</span><strong>${this.summary.next_job_name ?? "No pending actions"}</strong>${this.summary.next_execution_local ? html`<small>${localDate(this.summary.next_execution_local)} · ${relativeTime(this.summary.next_execution_local)}</small>` : nothing}</section>
      <main>${visible.length ? visible.map((job) => this.renderJob(job)) : html`<div class="empty"><ha-icon icon="mdi:calendar-check"></ha-icon><p>No ${this.tab.toLowerCase()} deferred actions.</p></div>`}</main>
      ${this.selected ? this.renderDetails(this.selected) : nothing}${this.editor ? this.renderEditor() : nothing}${this.renderQuickDialog()}
    </ha-card>`;
  }

  static styles = css`
    :host{display:block;color:var(--primary-text-color);background:var(--primary-background-color);min-height:100vh}ha-card{max-width:980px;margin:24px auto;padding:24px;background:var(--card-background-color);box-sizing:border-box}.top{display:flex;justify-content:space-between;align-items:center;gap:16px}.top h1{margin:0;font-size:28px}button{display:inline-flex;align-items:center;justify-content:center;gap:7px;border:1px solid var(--divider-color);border-radius:10px;padding:9px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}button.primary{background:var(--primary-color);color:var(--text-primary-color);border-color:var(--primary-color)}button.danger{color:var(--error-color)}button.warning{color:var(--warning-color)}button.quiet,button.icon,button.link{background:none}button.icon{padding:8px;border:0}button.link{border:0;color:var(--primary-color);padding:4px}button:disabled{opacity:.5}nav{display:flex;align-items:end;gap:4px;overflow:auto;border-bottom:1px solid var(--divider-color);margin-top:20px}nav button{border:0;background:none;border-radius:0}nav button span{min-width:20px;padding:2px 6px;border-radius:999px;background:var(--secondary-background-color);font-size:12px}nav button.active{color:var(--primary-color);border-bottom:3px solid var(--primary-color)}.next{display:flex;align-items:center;gap:8px;padding:12px 4px;color:var(--secondary-text-color)}.next strong{color:var(--primary-text-color)}.next small{margin-left:auto}main{display:flex;flex-direction:column;border-top:1px solid var(--divider-color)}.job{position:relative;display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:16px 4px;border-bottom:1px solid var(--divider-color);cursor:pointer}.job:hover{background:var(--secondary-background-color)}.job-icon{color:var(--primary-color)}.job-head{display:flex;align-items:center;gap:8px}.job h3{margin:0;font-size:16px}.job p{margin:5px 0 0;color:var(--secondary-text-color)}.time{color:var(--secondary-text-color);font-size:13px;margin-top:4px}.status{font-size:12px;border-radius:999px;padding:3px 7px;background:var(--secondary-background-color);text-transform:capitalize}.status.failed{color:var(--error-color)}.row-actions{display:flex;align-items:center;gap:4px}.row-actions ha-icon{--mdc-icon-size:18px}.menu-wrap{position:relative}.menu{position:absolute;z-index:4;right:0;top:100%;display:flex;flex-direction:column;min-width:210px;padding:6px;background:var(--card-background-color);border:1px solid var(--divider-color);border-radius:12px;box-shadow:var(--ha-card-box-shadow,0 4px 14px rgba(0,0,0,.2))}.menu button{justify-content:flex-start;border:0;background:none}.error,.banner{color:var(--error-color);padding:10px;background:color-mix(in srgb,var(--error-color) 10%,transparent);border-radius:10px}.error.compact{margin-top:8px}.banner{display:flex;justify-content:space-between;margin:12px 0}.empty{text-align:center;padding:56px;color:var(--secondary-text-color)}.empty ha-icon{--mdc-icon-size:48px}.overlay{position:fixed;z-index:10;inset:0;background:rgba(0,0,0,.48);display:grid;place-items:center;padding:16px}.dialog{width:min(620px,100%);max-height:90vh;overflow:auto;background:var(--card-background-color);border-radius:16px;padding:20px;box-sizing:border-box}.dialog.wide{width:min(820px,100%)}.dialog.small{width:min(480px,100%)}.dialog header,.dialog footer,.section-head{display:flex;justify-content:space-between;align-items:center;gap:8px}.dialog header h2,.section-head h3{margin:0}.dialog header>div{display:flex;align-items:center;gap:10px}.dialog label{display:flex;flex-direction:column;gap:6px;margin:14px 0}.dialog input,.dialog textarea,.dialog select{font:inherit;padding:10px;border:1px solid var(--divider-color);border-radius:8px;color:var(--primary-text-color);background:var(--primary-background-color)}.dialog textarea{min-height:70px}.dialog textarea.yaml{min-height:260px;font-family:monospace}.dialog footer{margin-top:20px;justify-content:flex-end}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}fieldset,.action-editor,.advanced{border:1px solid var(--divider-color);border-radius:12px;padding:14px;margin-top:16px}.segmented,.delay-row,.chips,.detail-actions{display:flex;gap:8px}.segmented button{flex:1}.segmented .active{border-color:var(--primary-color);color:var(--primary-color)}.delay-row input{flex:1}.delay-row select{min-width:130px}.chips{flex-wrap:wrap;margin-top:10px}.chips button{padding:6px 9px}.advanced summary,details summary{cursor:pointer;font-weight:600}.detail-summary{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:18px 0}.detail-summary>div{display:flex;flex-direction:column;gap:4px;padding:14px;border:1px solid var(--divider-color);border-radius:12px}.detail-summary span,.detail-summary small{color:var(--secondary-text-color)}details{margin-top:14px}dl{display:grid;grid-template-columns:minmax(130px,auto) 1fr;gap:8px 16px}dt{font-weight:600}dd{margin:0;overflow-wrap:anywhere}pre{padding:12px;overflow:auto;background:var(--secondary-background-color);border-radius:10px;white-space:pre-wrap}@media(max-width:700px){ha-card{margin:0;padding:16px;min-height:100vh;border-radius:0}.top h1{font-size:24px}.next{flex-wrap:wrap}.next small{width:100%;margin-left:32px}.job{grid-template-columns:auto 1fr}.row-actions{grid-column:2}.row-actions .quiet{flex:1}.overlay{padding:0}.dialog{width:100%;height:100%;max-height:none;border-radius:0}.two,.detail-summary{grid-template-columns:1fr}dl{grid-template-columns:1fr}dd{margin-bottom:8px}}
  `;
}

declare global { interface HTMLElementTagNameMap { "deferred-actions-panel": DeferredActionsPanel } }
