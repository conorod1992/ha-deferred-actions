import { LitElement, css, html, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { dump, load } from "js-yaml";
import { createJob, listJobs, operateJob, subscribeJobs, updateJob } from "./api";
import { localDate, relativeTime } from "./format";
import type { DeferredJob, HomeAssistant, PushEvent, QueueSummary } from "./types";

type Tab = "Pending" | "Paused" | "Failed" | "History" | "All";

@customElement("deferred-actions-panel")
export class DeferredActionsPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @state() private jobs: DeferredJob[] = [];
  @state() private summary: QueueSummary = { pending: 0, paused: 0, failed: 0 };
  @state() private tab: Tab = "Pending";
  @state() private selected?: DeferredJob;
  @state() private editor?: { job?: DeferredJob; mode: "simple" | "advanced" };
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
    const history = new Set(["completed", "cancelled", "missed"]);
    return this.jobs.filter((job) => this.tab === "All"
      || (this.tab === "Pending" && ["pending", "executing"].includes(job.status))
      || (this.tab === "Paused" && job.status === "paused")
      || (this.tab === "Failed" && job.status === "failed")
      || (this.tab === "History" && history.has(job.status)))
      .sort((a, b) => a.execute_at.localeCompare(b.execute_at));
  }

  private async operate(operation: string, job: DeferredJob, data: Record<string, unknown> = {}): Promise<void> {
    if (["cancel", "delete", "execute_now"].includes(operation) && !window.confirm(`${operation.replace("_", " ")} “${job.name}”?`)) return;
    this.busy = true;
    this.error = undefined;
    try {
      await operateJob(this.hass, operation, job.id, data);
      if (operation === "delete") this.selected = undefined;
    } catch (error) { this.error = String(error); }
    finally { this.busy = false; }
  }

  private reschedule(job: DeferredJob): void {
    const executeAt = window.prompt("New offset-aware ISO date and time", job.execute_at_local);
    if (executeAt) void this.operate("reschedule", job, { execute_at: executeAt });
  }

  private extend(job: DeferredJob): void {
    const value = window.prompt("Minutes to add (use a negative number to reduce)", "15");
    if (value !== null && Number.isFinite(Number(value)) && Number(value) !== 0) {
      void this.operate("extend", job, { duration: { minutes: Number(value) } });
    }
  }

  private duplicate(job: DeferredJob): void {
    const value = window.prompt("Run the copy in how many minutes?", "20");
    if (value !== null && Number(value) > 0) {
      void this.operate("duplicate", job, { delay: { minutes: Number(value) } });
    }
  }

  private renderControls(job: DeferredJob) {
    return html`<div class="controls">
      <button @click=${() => { this.selected = job; }}>View</button>
      ${["pending", "paused"].includes(job.status) ? html`<button @click=${() => { this.editor = { job, mode: "advanced" }; }}>Edit</button>` : nothing}
      ${["pending", "paused"].includes(job.status) ? html`<button @click=${() => this.reschedule(job)}>Reschedule</button><button @click=${() => this.extend(job)}>Extend</button>` : nothing}
      ${job.status === "pending" ? html`<button @click=${() => this.operate("pause", job)}>Pause</button>` : nothing}
      ${job.status === "paused" ? html`<button @click=${() => this.operate("resume", job)}>Resume</button>` : nothing}
      ${["pending", "paused", "failed", "missed"].includes(job.status) ? html`<button @click=${() => this.operate("execute_now", job)}>Execute now</button>` : nothing}
      ${["pending", "paused"].includes(job.status) ? html`<button class="warning" @click=${() => this.operate("cancel", job)}>Cancel</button>` : nothing}
      <button @click=${() => this.duplicate(job)}>Duplicate</button>
      ${job.status !== "executing" ? html`<button class="danger" @click=${() => this.operate("delete", job)}>Delete</button>` : nothing}
    </div>`;
  }

  private renderJob(job: DeferredJob) {
    return html`<article class="job" @click=${() => { this.selected = job; }}>
      <div class="job-head"><h3>${job.name}</h3><span class="status ${job.status}">${job.status}</span></div>
      <div class="time">${localDate(job.execute_at_local)} · ${relativeTime(job.execute_at)}</div>
      <p>${job.action_summary}</p>
      <div class="meta">${job.job_key ? html`<code>${job.job_key}</code>` : nothing}${job.tags.map((tag) => html`<span class="tag">${tag}</span>`)}<span>${job.source}</span></div>
      ${job.last_error ? html`<div class="error">${job.last_error}</div>` : nothing}
      <div @click=${(event: Event) => event.stopPropagation()}>${this.renderControls(job)}</div>
    </article>`;
  }

  private renderDetails(job: DeferredJob) {
    return html`<div class="overlay" @click=${() => { this.selected = undefined; }}><section class="dialog wide" @click=${(e: Event) => e.stopPropagation()}>
      <header><h2>${job.name}</h2><button @click=${() => { this.selected = undefined; }}>✕</button></header>
      <dl>
        ${Object.entries({
          "Job ID": job.id, Status: job.status, Description: job.description || "—",
          "Scheduled UTC": job.execute_at, "Scheduled local": job.execute_at_local,
          Created: job.created_at, Modified: job.modified_at, Completed: job.completed_at || "—",
          Source: job.source, "Job key": job.job_key || "—", Tags: job.tags.join(", ") || "—",
          "Target hints": job.target_entities.join(", ") || "—",
          Overdue: new Date(job.execute_at).getTime() < Date.now() && ["pending", "paused"].includes(job.status) ? "Yes" : "No",
          Revision: String(job.revision), "Last error": job.last_error || "—",
        }).map(([label, value]) => html`<dt>${label}</dt><dd>${value}</dd>`)}
      </dl>
      <h3>Action sequence</h3><pre>${dump(job.sequence, { noRefs: true })}</pre>
      <h3>Attribution</h3><pre>${JSON.stringify(job.attribution, null, 2)}</pre>
      ${Object.keys(job.linkage).length ? html`<h3>Run-for / linkage</h3><pre>${JSON.stringify(job.linkage, null, 2)}</pre>` : nothing}
      ${this.renderControls(job)}
    </section></div>`;
  }

  private renderEditor() {
    const job = this.editor?.job;
    return html`<div class="overlay"><form class="dialog" @submit=${(event: SubmitEvent) => this.saveEditor(event)}>
      <header><h2>${job ? "Edit deferred action" : "Add deferred action"}</h2><button type="button" @click=${() => { this.editor = undefined; }}>✕</button></header>
      <label>Name<input name="name" required .value=${job?.name ?? ""}></label>
      <label>Description<textarea name="description">${job?.description ?? ""}</textarea></label>
      ${job ? nothing : html`<label>Absolute execution time (optional, ISO 8601 with UTC offset)<input name="execute_at" placeholder="2026-08-02T21:00:00+01:00"></label><div class="two"><label>Or delay hours<input name="hours" type="number" min="0" value="0"></label><label>Delay minutes<input name="minutes" type="number" min="0" value="20"></label></div>`}
      <label>Job key<input name="job_key" .value=${job?.job_key ?? ""}></label>
      <label>Tags (comma separated)<input name="tags" .value=${job?.tags.join(", ") ?? ""}></label>
      <label>Target entity hints (comma separated)<input name="target_entities" .value=${job?.target_entities.join(", ") ?? ""}></label>
      ${job ? nothing : html`<label>Conflict mode<select name="conflict_mode"><option>keep_all</option><option>replace_same_key</option><option>cancel_same_key</option><option>reject_same_key</option></select></label>`}
      <div class="mode"><button type="button" class=${this.editor?.mode === "simple" ? "active" : ""} @click=${() => { this.editor = { ...this.editor!, mode: "simple" }; }}>Simple action</button><button type="button" class=${this.editor?.mode === "advanced" ? "active" : ""} @click=${() => { this.editor = { ...this.editor!, mode: "advanced" }; }}>Advanced YAML</button></div>
      ${this.editor?.mode === "simple" ? html`<label>Action<input name="action" placeholder="light.turn_off"></label><label>Entity ID<input name="entity_id" placeholder="light.porch"></label>` : html`<label>Action sequence YAML<textarea class="yaml" name="yaml" required>${dump(job?.sequence ?? [{ action: "light.turn_off", target: { entity_id: "light.porch" } }], { noRefs: true })}</textarea></label>`}
      <footer><button type="button" @click=${() => { this.editor = undefined; }}>Cancel</button><button class="primary" ?disabled=${this.busy}>Save</button></footer>
    </form></div>`;
  }

  private async saveEditor(event: SubmitEvent): Promise<void> {
    event.preventDefault();
    const form = new FormData(event.currentTarget as HTMLFormElement);
    try {
      const sequence = this.editor?.mode === "simple"
        ? [{ action: String(form.get("action")), target: { entity_id: String(form.get("entity_id")) } }]
        : load(String(form.get("yaml")));
      if (!Array.isArray(sequence)) throw new Error("Advanced YAML must be a list of actions");
      const common = {
        name: String(form.get("name")), description: String(form.get("description")) || undefined,
        job_key: String(form.get("job_key")) || undefined,
        tags: String(form.get("tags")).split(",").map((tag) => tag.trim()).filter(Boolean),
        target_entities: String(form.get("target_entities")).split(",").map((entity) => entity.trim()).filter(Boolean), sequence,
      };
      this.busy = true;
      if (this.editor?.job) await updateJob(this.hass, { job_id: this.editor.job.id, expected_revision: this.editor.job.revision, ...common });
      else {
        const executeAt = String(form.get("execute_at") ?? "").trim();
        await createJob(this.hass, {
          ...common,
          ...(executeAt ? { execute_at: executeAt } : { delay: { hours: Number(form.get("hours")), minutes: Number(form.get("minutes")) } }),
          conflict_mode: String(form.get("conflict_mode")),
        });
      }
      this.editor = undefined;
    } catch (error) { this.error = String(error); }
    finally { this.busy = false; }
  }

  protected render() {
    return html`<ha-card>
      <header class="top"><div><h1>Deferred Actions</h1><p>Persistent one-off action scheduling</p></div><button class="primary" @click=${() => { this.editor = { mode: "simple" }; }}>＋ Add deferred action</button></header>
      ${this.error ? html`<div class="banner">${this.error}<button @click=${() => { this.error = undefined; }}>✕</button></div>` : nothing}
      <section class="summary"><div><strong>${this.summary.pending}</strong><span>Pending</span></div><div><strong>${this.summary.paused}</strong><span>Paused</span></div><div><strong>${this.summary.failed}</strong><span>Failed</span></div><div class="next"><span>Next action</span><strong>${this.summary.next_job_name ?? "None"}</strong><small>${this.summary.next_execution_local ? `${localDate(this.summary.next_execution_local)} · ${relativeTime(this.summary.next_execution_local)}` : "No pending actions"}</small></div></section>
      <nav>${(["Pending", "Paused", "Failed", "History", "All"] as Tab[]).map((tab) => html`<button class=${this.tab === tab ? "active" : ""} @click=${() => { this.tab = tab; }}>${tab}</button>`)}</nav>
      <main>${this.visibleJobs().length ? this.visibleJobs().map((job) => this.renderJob(job)) : html`<div class="empty"><ha-icon icon="mdi:calendar-check"></ha-icon><p>No ${this.tab.toLowerCase()} deferred actions.</p></div>`}</main>
      ${this.selected ? this.renderDetails(this.selected) : nothing}${this.editor ? this.renderEditor() : nothing}
    </ha-card>`;
  }

  static styles = css`
    :host{display:block;color:var(--primary-text-color);background:var(--primary-background-color);min-height:100vh}ha-card{max-width:1180px;margin:24px auto;padding:24px;background:var(--card-background-color);box-sizing:border-box}.top{display:flex;justify-content:space-between;align-items:center;gap:16px}.top h1{margin:0;font-size:28px}.top p{margin:4px 0;color:var(--secondary-text-color)}button{border:1px solid var(--divider-color);border-radius:10px;padding:9px 12px;background:var(--secondary-background-color);color:var(--primary-text-color);cursor:pointer}button.primary{background:var(--primary-color);color:var(--text-primary-color);border-color:var(--primary-color)}button.danger{color:var(--error-color)}button.warning{color:var(--warning-color)}button:disabled{opacity:.5}.summary{display:grid;grid-template-columns:repeat(3,minmax(90px,1fr)) minmax(260px,2fr);gap:12px;margin:24px 0}.summary>div{display:flex;flex-direction:column;padding:16px;border:1px solid var(--divider-color);border-radius:14px}.summary strong{font-size:24px}.summary span,.summary small,.time,.meta{color:var(--secondary-text-color)}.summary .next strong{font-size:16px;margin:4px 0}nav{display:flex;gap:4px;overflow:auto;border-bottom:1px solid var(--divider-color);margin-bottom:16px}nav button{border:0;background:none;border-radius:0}nav button.active{color:var(--primary-color);border-bottom:3px solid var(--primary-color)}main{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px}.job{padding:16px;border:1px solid var(--divider-color);border-radius:14px;background:var(--card-background-color);cursor:pointer}.job:hover{box-shadow:var(--ha-card-box-shadow,0 2px 8px rgba(0,0,0,.14))}.job-head{display:flex;justify-content:space-between;gap:8px}.job h3{margin:0}.status,.tag{font-size:12px;border-radius:999px;padding:4px 8px;background:var(--secondary-background-color)}.status.failed{color:var(--error-color)}.status.pending{color:var(--primary-color)}.meta,.controls{display:flex;flex-wrap:wrap;gap:7px;align-items:center}.controls{margin-top:14px}.error,.banner{color:var(--error-color);padding:10px;background:color-mix(in srgb,var(--error-color) 10%,transparent);border-radius:10px}.banner{display:flex;justify-content:space-between;margin:12px 0}.empty{grid-column:1/-1;text-align:center;padding:56px;color:var(--secondary-text-color)}.empty ha-icon{--mdc-icon-size:48px}.overlay{position:fixed;z-index:10;inset:0;background:rgba(0,0,0,.48);display:grid;place-items:center;padding:16px}.dialog{width:min(620px,100%);max-height:90vh;overflow:auto;background:var(--card-background-color);border-radius:16px;padding:20px;box-sizing:border-box}.dialog.wide{width:min(850px,100%)}.dialog header,.dialog footer{display:flex;justify-content:space-between;align-items:center;gap:8px}.dialog label{display:flex;flex-direction:column;gap:6px;margin:14px 0}.dialog input,.dialog textarea,.dialog select{font:inherit;padding:10px;border:1px solid var(--divider-color);border-radius:8px;color:var(--primary-text-color);background:var(--primary-background-color)}.dialog textarea{min-height:70px}.dialog textarea.yaml{min-height:260px;font-family:monospace}.two{display:grid;grid-template-columns:1fr 1fr;gap:12px}.mode{display:flex;gap:6px}.mode .active{border-color:var(--primary-color);color:var(--primary-color)}dl{display:grid;grid-template-columns:minmax(130px,auto) 1fr;gap:8px 16px}dt{font-weight:600}dd{margin:0;overflow-wrap:anywhere}pre{padding:12px;overflow:auto;background:var(--secondary-background-color);border-radius:10px;white-space:pre-wrap}@media(max-width:700px){ha-card{margin:0;padding:16px;min-height:100vh;border-radius:0}.top{align-items:flex-start;flex-direction:column}.summary{grid-template-columns:repeat(3,1fr)}.summary .next{grid-column:1/-1}main{grid-template-columns:1fr}.controls button{flex:1}.overlay{padding:0}.dialog{width:100%;height:100%;max-height:none;border-radius:0}.two{grid-template-columns:1fr}dl{grid-template-columns:1fr}dd{margin-bottom:8px}}
  `;
}

declare global { interface HTMLElementTagNameMap { "deferred-actions-panel": DeferredActionsPanel } }
