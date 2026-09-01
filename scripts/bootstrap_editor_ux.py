#!/usr/bin/env python3
"""Apply the Deferred Actions editor UX refactor once on the feature branch."""

from __future__ import annotations

from pathlib import Path

PATH = Path("frontend/src/deferred-actions-panel.ts")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    count = text.count(old)
    if count != 1:
        raise RuntimeError(f"Expected exactly one {label} block, found {count}")
    return text.replace(old, new, 1)


def main() -> None:
    text = PATH.read_text(encoding="utf-8")

    old_editor = '''  private renderEditor() {
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
'''

    new_editor = '''  private editorConditionCount(): number | undefined {
    if (this.conditionMode === "visual") return this.visualConditions.items.length;
    return this.previewYamlList(this.conditionsYaml)?.length;
  }

  private editorActionStatus(): string {
    if (this.editor?.mode !== "visual") return "YAML";
    const count = this.visualActions.length;
    return `${count} ${count === 1 ? "action" : "actions"}`;
  }

  private editorScheduleStatus(): string {
    if (this.scheduleMode === "absolute") return "Date & time";
    const unit = this.previewDelay === 1 ? this.previewUnit.replace(/s$/, "") : this.previewUnit;
    return `In ${this.previewDelay} ${unit}`;
  }

  private renderEditor() {
    const job = this.editor?.job;
    const runForEditor = !job && this.creationKind === "run_for";
    return html`<div class="overlay"><form class="dialog editor-dialog" @submit=${(event: SubmitEvent) => this.saveEditor(event)}>
      <header class="editor-header"><h2>${job ? "Edit deferred action" : runForEditor ? "Run something for a while" : "Do something later"}</h2><button type="button" class="icon" title="Close" @click=${() => { this.editor = undefined; }}><ha-icon icon="mdi:close"></ha-icon></button></header>
      <div class="editor-body">
        ${!job ? html`<div class="segmented creation-kind"><button type="button" class=${this.creationKind === "later" ? "active" : ""} @click=${() => { this.creationKind = "later"; }}>Do something later</button><button type="button" class=${runForEditor ? "active" : ""} @click=${() => { this.creationKind = "run_for"; }}>Run something for a while</button></div>` : nothing}
        <label class="editor-name">Name<input name="name" required .value=${job?.name ?? ""} placeholder="Turn off office heater"></label>
        ${runForEditor ? this.renderRunForFields() : html`
          ${job ? nothing : this.renderScheduleFields()}
          <section class="editor-section action-editor"><div class="section-head"><div><h3>Actions</h3><small>What should Home Assistant do?</small></div><div class="section-tools"><span class="section-status">${this.editorActionStatus()}</span><button type="button" class="link editor-mode-toggle" @click=${() => this.switchActionMode()}>${this.editor?.mode === "visual" ? "Edit in YAML" : "Use visual editor"}</button></div></div>
            ${this.editor?.mode === "visual" ? this.renderVisualActions() : html`<label>Action sequence YAML<textarea class="yaml" name="yaml" .value=${this.actionYaml} @input=${(event: InputEvent) => { this.actionYaml = (event.currentTarget as HTMLTextAreaElement).value; }}></textarea><small>Switch back to render supported blocks visually. Unsupported nodes are preserved unchanged.</small></label>`}
          </section>
          ${this.renderNormalOptions(job)}
        `}
        <details class="editor-disclosure advanced developer-options"><summary><span class="disclosure-copy"><strong>Developer and automation options</strong><small>Job key, tags, and resolution hints</small></span><span class="disclosure-meta"><span class="section-status">Advanced</span><ha-icon icon="mdi:chevron-down"></ha-icon></span></summary><div class="disclosure-body">
          <label>Job key<input name="job_key" .value=${this.jobKey} @input=${(event: InputEvent) => { this.jobKey = (event.currentTarget as HTMLInputElement).value; }}><small>Optional stable identifier for automations.</small></label>
          ${!job && this.jobKey.trim() ? html`<label>When another action has this job key<select name="conflict_mode"><option value="keep_all">Keep both actions</option><option value="replace_same_key">Replace the existing action</option><option value="cancel_same_key">Cancel the existing action</option><option value="reject_same_key">Do not create this action</option></select></label>` : nothing}
          <label>Tags<input name="tags" .value=${job?.tags.join(", ") ?? ""} placeholder="heating, office"><small>Separate tags with commas.</small></label>
          <label>Resolution entity hints<ha-entity-picker .hass=${this.hass} .value=${resolutionHints(job)[0] ?? ""} .allowCustomEntity=${true} @value-changed=${(event: CustomEvent<{ value: string }>) => { const input = (event.currentTarget as HTMLElement).parentElement?.querySelector("input[name=target_entities]") as HTMLInputElement | null; if (input) input.value = event.detail.value; }}></ha-entity-picker><input name="target_entities" type="hidden" .value=${resolutionHints(job).join(", ")}><small>Used to find this job later; it does not change the action target.</small></label>
        </div></details>
      </div>
      <footer class="editor-footer"><div class="editor-footer-preview"><ha-icon icon="mdi:eye-outline"></ha-icon><div><strong>Summary</strong><span>${this.editorPreview(job)}</span></div></div><div class="footer-actions"><button type="button" @click=${() => { this.editor = undefined; }}>Cancel</button><button class="primary" ?disabled=${this.busy}>${job ? "Save" : "Create"}</button></div></footer>
    </form></div>`;
  }
'''
    text = replace_once(text, old_editor, new_editor, "editor")

    old_schedule = '''  private renderScheduleFields() {
    return html`<fieldset><legend>When</legend><div class="segmented"><button type="button" class=${this.scheduleMode === "delay" ? "active" : ""} @click=${() => { this.scheduleMode = "delay"; }}>After a delay</button><button type="button" class=${this.scheduleMode === "absolute" ? "active" : ""} @click=${() => { this.scheduleMode = "absolute"; }}>At a date and time</button></div>
      ${this.scheduleMode === "delay" ? html`<div class="delay-row"><input name="delay_value" type="number" min="1" .value=${String(this.previewDelay)} @input=${(event: InputEvent) => { this.previewDelay = Number((event.currentTarget as HTMLInputElement).value); }}><select name="delay_unit" .value=${this.previewUnit} @change=${(event: Event) => { this.previewUnit = (event.currentTarget as HTMLSelectElement).value; }}><option value="minutes">minutes</option><option value="hours">hours</option><option value="days">days</option></select></div><div class="chips">${[5,15,30,60].map((minutes) => html`<button type="button" @click=${() => { this.previewDelay = minutes; this.previewUnit = "minutes"; }}>${minutes < 60 ? `${minutes} min` : "1 hour"}</button>`)}</div>` : html`<div class="two"><label>Date<input name="date" type="date" required></label><label>Time<input name="time" type="time" required></label></div>`}
    </fieldset>`;
  }
'''
    new_schedule = '''  private renderScheduleFields() {
    return html`<section class="editor-section schedule-editor"><div class="section-head"><div><h3>When</h3><small>Choose when this action should run.</small></div><span class="section-status">${this.editorScheduleStatus()}</span></div><div class="segmented"><button type="button" class=${this.scheduleMode === "delay" ? "active" : ""} @click=${() => { this.scheduleMode = "delay"; }}>After a delay</button><button type="button" class=${this.scheduleMode === "absolute" ? "active" : ""} @click=${() => { this.scheduleMode = "absolute"; }}>At a date and time</button></div>
      ${this.scheduleMode === "delay" ? html`<div class="delay-row"><input name="delay_value" type="number" min="1" .value=${String(this.previewDelay)} @input=${(event: InputEvent) => { this.previewDelay = Number((event.currentTarget as HTMLInputElement).value); }}><select name="delay_unit" .value=${this.previewUnit} @change=${(event: Event) => { this.previewUnit = (event.currentTarget as HTMLSelectElement).value; }}><option value="minutes">minutes</option><option value="hours">hours</option><option value="days">days</option></select></div><div class="chips">${[5,15,30,60].map((minutes) => html`<button type="button" class=${this.previewUnit === "minutes" && this.previewDelay === minutes ? "active" : ""} @click=${() => { this.previewDelay = minutes; this.previewUnit = "minutes"; }}>${minutes < 60 ? `${minutes} min` : "1 hour"}</button>`)}</div>` : html`<div class="two"><label>Date<input name="date" type="date" required></label><label>Time<input name="time" type="time" required></label></div>`}
    </section>`;
  }
'''
    text = replace_once(text, old_schedule, new_schedule, "schedule")

    old_run_for = '''  private renderRunForFields() {
    return html`<fieldset><legend>Run For</legend>
      <label>Description<textarea name="description"></textarea></label>
      <label>Target<ha-target-picker .hass=${this.hass} .value=${this.runForTarget} @value-changed=${(event: CustomEvent<{ value: VisualTarget }>) => { this.runForTarget = event.detail.value; }}></ha-target-picker><small>Choose entities, devices, or areas.</small></label>
      <div class="two"><label>Start action<ha-service-picker .hass=${this.hass} .value=${this.runForStart} @value-changed=${(event: CustomEvent<{ value: string }>) => { this.runForStart = event.detail.value; this.runForEnd = RUN_FOR_INVERSES[event.detail.value] ?? ""; }}></ha-service-picker></label><label>End action<ha-service-picker .hass=${this.hass} .value=${this.runForEnd} @value-changed=${(event: CustomEvent<{ value: string }>) => { this.runForEnd = event.detail.value; }}></ha-service-picker><small>Suggested only for conservative, known opposite actions; otherwise choose one explicitly.</small></label></div>
      <label>Duration<div class="delay-row"><input name="delay_value" type="number" min="1" .value=${String(this.previewDelay)} @input=${(event: InputEvent) => { this.previewDelay = Number((event.currentTarget as HTMLInputElement).value); }}><select name="delay_unit" .value=${this.previewUnit} @change=${(event: Event) => { this.previewUnit = (event.currentTarget as HTMLSelectElement).value; }}><option value="minutes">minutes</option><option value="hours">hours</option><option value="days">days</option></select></div></label>
      <div class="timeline"><div><span>Now</span><strong>${this.actionLabel(this.runForStart, this.runForTarget)}</strong></div><ha-icon icon="mdi:arrow-right"></ha-icon><div><span>After ${this.previewDelay} ${this.previewUnit}</span><strong>${this.actionLabel(this.runForEnd, this.runForTarget)}</strong></div></div>
    </fieldset>`;
  }
'''
    new_run_for = '''  private renderRunForFields() {
    return html`<section class="editor-section run-for-editor"><div class="section-head"><div><h3>Run for</h3><small>Start something now, then automatically stop or reverse it later.</small></div><span class="section-status">${this.previewDelay} ${this.previewUnit}</span></div>
      <label>Description<textarea name="description"></textarea></label>
      <label>Target<ha-target-picker .hass=${this.hass} .value=${this.runForTarget} @value-changed=${(event: CustomEvent<{ value: VisualTarget }>) => { this.runForTarget = event.detail.value; }}></ha-target-picker><small>Choose entities, devices, or areas.</small></label>
      <div class="two"><label>Start action<ha-service-picker .hass=${this.hass} .value=${this.runForStart} @value-changed=${(event: CustomEvent<{ value: string }>) => { this.runForStart = event.detail.value; this.runForEnd = RUN_FOR_INVERSES[event.detail.value] ?? ""; }}></ha-service-picker></label><label>End action<ha-service-picker .hass=${this.hass} .value=${this.runForEnd} @value-changed=${(event: CustomEvent<{ value: string }>) => { this.runForEnd = event.detail.value; }}></ha-service-picker><small>Suggested only for conservative, known opposite actions; otherwise choose one explicitly.</small></label></div>
      <label>Duration<div class="delay-row"><input name="delay_value" type="number" min="1" .value=${String(this.previewDelay)} @input=${(event: InputEvent) => { this.previewDelay = Number((event.currentTarget as HTMLInputElement).value); }}><select name="delay_unit" .value=${this.previewUnit} @change=${(event: Event) => { this.previewUnit = (event.currentTarget as HTMLSelectElement).value; }}><option value="minutes">minutes</option><option value="hours">hours</option><option value="days">days</option></select></div></label>
      <div class="timeline"><div><span>Now</span><strong>${this.actionLabel(this.runForStart, this.runForTarget)}</strong></div><ha-icon icon="mdi:arrow-right"></ha-icon><div><span>After ${this.previewDelay} ${this.previewUnit}</span><strong>${this.actionLabel(this.runForEnd, this.runForTarget)}</strong></div></div>
    </section>`;
  }
'''
    text = replace_once(text, old_run_for, new_run_for, "run-for")

    old_options = '''  private renderNormalOptions(job?: DeferredJob) {
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
'''
    new_options = '''  private renderNormalOptions(job?: DeferredJob) {
    const conditionCount = this.editorConditionCount();
    const conditionStatus = conditionCount === undefined ? "Check YAML" : conditionCount === 0 ? "None" : `${conditionCount} ${conditionCount === 1 ? "condition" : "conditions"}`;
    const hasConditions = conditionCount === undefined || conditionCount > 0;
    const moreOptionsConfigured = Boolean(job?.description || this.validUntil || this.overduePolicy);
    return html`
      <details class="editor-disclosure conditions-editor"><summary><span class="disclosure-copy"><strong>Conditions</strong><small>Only run this action when specific conditions are true.</small></span><span class="disclosure-meta"><span class="section-status">${conditionStatus}</span><ha-icon icon="mdi:chevron-down"></ha-icon></span></summary><div class="disclosure-body">
        <div class="section-head"><span class="hint">Conditions are checked when the action is due.</span><button type="button" class="link editor-mode-toggle" @click=${() => this.switchConditionMode()}>${this.conditionMode === "visual" ? "Edit in YAML" : "Use visual editor"}</button></div>
        ${this.conditionMode === "visual" ? this.renderVisualConditions() : html`<label>Conditions YAML<textarea class="yaml small-yaml" .value=${this.conditionsYaml} @input=${(event: InputEvent) => { this.conditionsYaml = (event.currentTarget as HTMLTextAreaElement).value; }}></textarea><small>Existing and advanced Home Assistant conditions are preserved here.</small></label>`}
        ${hasConditions ? html`<label>If the conditions aren’t met<select name="condition_failure" .value=${this.conditionFailure} @change=${(event: Event) => { this.conditionFailure = (event.currentTarget as HTMLSelectElement).value as "skip" | "cancel" | "fail"; }}><option value="skip">Skip this run and keep it in history</option><option value="cancel">Cancel the action</option><option value="fail">Mark the action as failed</option></select></label>` : nothing}
      </div></details>
      <details class="editor-disclosure more-options"><summary><span class="disclosure-copy"><strong>More options</strong><small>Description, expiry, and offline behaviour</small></span><span class="disclosure-meta"><span class="section-status">${moreOptionsConfigured ? "Configured" : "Optional"}</span><ha-icon icon="mdi:chevron-down"></ha-icon></span></summary><div class="disclosure-body">
        <label>Description<textarea name="description" .value=${job?.description ?? ""}></textarea></label>
        <label>Don’t run after<input name="valid_until" type="datetime-local" .value=${this.validUntil} @input=${(event: InputEvent) => { this.validUntil = (event.currentTarget as HTMLInputElement).value; }}><small>The action will never begin at or after this cutoff.</small></label>
        <label>If Home Assistant was offline when this was due<select name="overdue_policy" .value=${this.overduePolicy} @change=${(event: Event) => { this.overduePolicy = (event.currentTarget as HTMLSelectElement).value; }}><option value="">Use the integration default</option><option value="execute">Run it when Home Assistant comes back</option><option value="execute_within_grace">Run it only if it is less than the grace period late</option><option value="skip">Don’t run it</option></select></label>
        ${this.overduePolicy === "execute_within_grace" ? html`<label>Grace period (minutes)<input name="overdue_grace_minutes" type="number" min="0" .value=${this.overdueGraceMinutes} @input=${(event: InputEvent) => { this.overdueGraceMinutes = (event.currentTarget as HTMLInputElement).value; }} placeholder="Use integration default"><small>How late the action may be and still run.</small></label>` : html`<input name="overdue_grace_minutes" type="hidden" .value=${this.overdueGraceMinutes}>`}
      </div></details>`;
  }
'''
    text = replace_once(text, old_options, new_options, "normal options")

    css_marker = 'pre{padding:12px;overflow:auto;background:var(--secondary-background-color);border-radius:10px;white-space:pre-wrap}@media(max-width:700px){'
    css_insert = '''pre{padding:12px;overflow:auto;background:var(--secondary-background-color);border-radius:10px;white-space:pre-wrap}.editor-dialog{width:min(1000px,100%);padding:0}.editor-header{position:sticky;z-index:3;top:0;padding:22px 28px;background:var(--card-background-color);border-bottom:1px solid var(--divider-color)}.editor-body{padding:0 28px 24px}.editor-name{margin:20px 0 4px}.editor-section{margin-top:20px;padding:22px 0 0;border-top:1px solid var(--divider-color)}.editor-section>.section-head{margin-bottom:16px}.section-head>div:first-child,.disclosure-copy,.editor-footer-preview div{display:flex;flex-direction:column;gap:3px}.section-head small,.disclosure-copy small,.editor-footer-preview span{color:var(--secondary-text-color);font-weight:400}.section-tools,.disclosure-meta,.footer-actions{display:flex;align-items:center;gap:10px}.section-status{display:inline-flex;align-items:center;white-space:nowrap;padding:4px 8px;border-radius:999px;background:var(--secondary-background-color);color:var(--secondary-text-color);font-size:12px;font-weight:500}.editor-mode-toggle{font-size:13px}.action-editor,.advanced{border:0;border-radius:0;padding:22px 0 0}.action-editor .visual-card{padding:18px;margin:14px 0}.chips button.active{border-color:var(--primary-color);color:var(--primary-color)}.editor-disclosure{margin-top:0;padding:0;border:0;border-top:1px solid var(--divider-color);border-radius:0}.editor-disclosure>summary{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:18px 0;list-style:none}.editor-disclosure>summary::-webkit-details-marker{display:none}.editor-disclosure>summary::marker{content:""}.disclosure-copy{min-width:0}.disclosure-copy strong{font-size:16px}.disclosure-copy small{font-size:13px}.disclosure-meta ha-icon{transition:transform .16s ease}.editor-disclosure[open] .disclosure-meta ha-icon{transform:rotate(180deg)}.disclosure-body{padding:0 0 22px}.disclosure-body>.section-head{margin:0 0 10px}.editor-footer{position:sticky;z-index:3;bottom:0;margin:0;padding:14px 28px;display:flex;align-items:center;gap:20px;background:var(--card-background-color);border-top:1px solid var(--divider-color);box-shadow:0 -8px 24px rgba(0,0,0,.12)}.editor-footer-preview{display:flex;align-items:center;gap:10px;flex:1;min-width:0}.editor-footer-preview ha-icon{flex:none;color:var(--primary-color)}.editor-footer-preview span{font-size:13px;line-height:1.35}.footer-actions{flex:none}@media(max-width:700px){'''
    text = replace_once(text, css_marker, css_insert, "editor CSS insertion point")

    mobile_marker = '.creation-kind{flex-direction:column}dl{grid-template-columns:1fr}dd{margin-bottom:8px}}\n  `;'
    mobile_replacement = '.creation-kind{flex-direction:column}dl{grid-template-columns:1fr}dd{margin-bottom:8px}}@media(max-width:700px){.editor-dialog{height:100%;max-height:none;border-radius:0}.editor-header{padding:16px}.editor-body{padding:0 16px 20px}.editor-section>.section-head{align-items:flex-start;flex-wrap:wrap}.section-tools{width:100%;justify-content:space-between}.editor-disclosure>summary{padding:16px 0}.disclosure-meta{gap:6px}.editor-footer{padding:12px 16px;gap:10px;align-items:stretch;flex-direction:column}.editor-footer-preview{align-items:flex-start}.footer-actions{justify-content:flex-end}.footer-actions button{flex:1}}\n  `;'
    text = replace_once(text, mobile_marker, mobile_replacement, "mobile CSS")

    PATH.write_text(text, encoding="utf-8")


if __name__ == "__main__":
    main()
