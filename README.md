# Deferred Actions

Deferred Actions is a Home Assistant custom integration for scheduling **one-off actions to run later**.

For example, you can use it to:

- turn a heater off in 20 minutes;
- switch something on now and automatically turn it off later;
- lock the doors at a specific time tonight;
- run several Home Assistant actions together at a later time;
- schedule an action that only runs if certain conditions are still true.

Scheduled actions are saved by Home Assistant, so they survive restarts. You can view and manage them from the **Deferred Actions** sidebar panel, including editing, snoozing, pausing, rescheduling, running early, cancelling and duplicating them.

> **Minimum Home Assistant version: 2024.12.0**

Deferred Actions is intended for **one-off work**. If something should happen every day, every week, or on another repeating schedule, a normal Home Assistant automation or schedule is usually the better choice.

---

## Features

- Schedule an action after a delay or at a specific date and time
- Run one action or a complete Home Assistant action sequence
- Create and manage scheduled actions from a Home Assistant sidebar panel
- Use normal Home Assistant service/action and target pickers
- Add conditions that are checked immediately before an action runs
- Choose what should happen if Home Assistant was offline when an action was due
- Add an optional deadline after which an action must never run
- Snooze, pause, resume, reschedule, duplicate, cancel or run actions immediately
- Use **Run For** to start something now and schedule its end action for later
- Keep a configurable history of completed, cancelled, failed, missed, skipped and expired actions
- Use Deferred Actions from automations, scripts, voice workflows or other integrations
- Use optional job keys to identify related scheduled actions
- Restrict supported actions for trusted-but-limited callers with `create_safe`
- Redacted diagnostics and concise Home Assistant events

---

## Installation

### HACS

Deferred Actions is installed as a custom HACS repository.

1. Open **HACS** in Home Assistant.
2. Open **Integrations**.
3. Open the menu in the top-right corner and choose **Custom repositories**.
4. Add:

   ```text
   https://github.com/conorod1992/ha-deferred-actions
   ```

5. Choose **Integration** as the repository type.
6. Search for **Deferred Actions** in HACS and install it.
7. Restart Home Assistant when HACS asks.
8. Go to **Settings → Devices & services → Add integration**.
9. Search for and add **Deferred Actions**.
10. Open **Deferred Actions** from the Home Assistant sidebar.

The sidebar panel is currently available to Home Assistant administrators.

### Manual installation

Copy the `deferred_actions` folder from this repository into:

```text
/config/custom_components/deferred_actions/
```

Your final folder structure should therefore include:

```text
/config/custom_components/deferred_actions/manifest.json
```

Restart Home Assistant, then go to:

**Settings → Devices & services → Add integration → Deferred Actions**

---

## Getting started

For normal use, you do **not** need to write YAML.

### Create your first deferred action

1. Open **Deferred Actions** from the Home Assistant sidebar.
2. Create a new deferred action.
3. Give it a name, for example **Turn off office heater**.
4. Choose when it should run:
   - after a delay, such as **20 minutes**; or
   - at a specific date and time.
5. Choose the Home Assistant action you want to run.
6. Choose its target entity, device or area.
7. Save it.

The new action appears in the **Pending** list.

From there you can:

- edit it;
- snooze it;
- pause it;
- reschedule it;
- run it immediately;
- duplicate it;
- cancel it.

Advanced Home Assistant sequences can also be entered as YAML where needed.

---

## Common uses

### Do something later

A simple deferred action might mean:

> Turn off the office heater in 20 minutes.

Create a normal deferred action, choose a 20-minute delay, select `switch.turn_off`, and choose the heater as the target.

### Run something for a while

**Run For** is useful for cases such as:

> Turn the office heater on for 20 minutes.

The start action runs immediately. Deferred Actions then schedules the end action for the selected duration later.

For common actions, Deferred Actions can suggest a sensible opposite action automatically, including:

- `light.turn_on` → `light.turn_off`
- `switch.turn_on` → `switch.turn_off`
- `fan.turn_on` → `fan.turn_off`
- `input_boolean.turn_on` → `input_boolean.turn_off`
- `media_player.media_play` → `media_player.media_pause`

For anything less obvious, choose the end action yourself.

Locks, covers, alarm panels, vacuums, scenes, scripts and arbitrary actions always require an explicit end action or end sequence.

### Run several actions later

A deferred action can contain multiple Home Assistant actions, just like the action section of an automation.

For example, a bedtime action could:

1. turn off downstairs lights;
2. lock the front door;
3. set the bedroom temperature.

### Only run if something is still true

You can add Home Assistant conditions to a deferred action.

Conditions are checked **when the action is about to run**, not when you create it.

For example:

> Turn the heater off in 30 minutes, but only if it is still on.

If the condition is no longer true, Deferred Actions can:

- **Skip this run and keep it in history**
- **Cancel the action**
- **Mark the action as failed**

### Snooze or reschedule

Pending actions can be moved later without recreating them.

Use:

- **Snooze** to push a pending action later by a positive duration;
- **Reschedule** to replace its scheduled time;
- **Extend** when you want to move a scheduled time by a signed duration.

### Pause and resume

A paused deferred action stays saved but is removed from active scheduling.

When resumed, it can either use its existing time or be given a replacement time.

---

## What happens if Home Assistant was offline?

Suppose an action was due at **14:00**, but Home Assistant was restarting and came back at **14:08**.

Deferred Actions can be configured to:

- **Run it anyway**
- **Run it only if it is not too late**
- **Mark it as missed**

The default behaviour is:

```yaml
overdue_policy: execute_within_grace
overdue_grace_minutes: 15
```

That means an overdue action normally runs if Home Assistant comes back within 15 minutes of when it was due. Older actions are marked as missed instead.

This behaviour can also be overridden for an individual deferred action.

Paused actions stay paused. The same overdue rules are applied when a paused action is resumed without a replacement time.

---

## Optional deadline

A deferred action can have a **Don't run after** time.

If the action has not started by that cutoff, it becomes `expired` and can never run.

This is useful when an action only makes sense within a certain window.

For example:

> Turn the heater off at 09:00, but never run this after 09:30.

---

## Using Deferred Actions in automations and scripts

Deferred Actions registers normal Home Assistant actions under the `deferred_actions` domain.

You can therefore call it from automations, scripts and other integrations.

### Turn off in 20 minutes

```yaml
action: deferred_actions.create
data:
  name: Turn off office heater
  delay:
    minutes: 20
  sequence:
    - action: switch.turn_off
      target:
        entity_id: switch.office_heater
```

### Turn on for 20 minutes

```yaml
action: deferred_actions.run_for
target:
  entity_id: switch.office_heater
data:
  name: Office heater timer
  duration:
    minutes: 20
  start_action: switch.turn_on
  end_action: switch.turn_off
```

### Run several actions later

```yaml
action: deferred_actions.create
data:
  name: Prepare house for bedtime
  execute_at: "2026-08-02T23:00:00+01:00"
  sequence:
    - action: light.turn_off
      target:
        area_id: downstairs

    - action: lock.lock
      target:
        entity_id: lock.front_door

    - action: climate.set_temperature
      target:
        entity_id: climate.bedroom
      data:
        temperature: 18
```

When using the **sidebar UI**, choose the date and time normally.

When calling `deferred_actions.create` directly and supplying `execute_at`, the timestamp must include an explicit UTC offset. For example:

```text
2026-08-02T23:00:00+01:00
```

Timestamps without an offset are rejected to avoid ambiguity around daylight-saving changes.

---

## Conditions, expiry and overdue behaviour in YAML

```yaml
action: deferred_actions.create
data:
  name: Turn off office heater if it is still on
  delay:
    minutes: 30

  valid_until: "2026-08-09T09:30:00+01:00"

  overdue_policy: execute_within_grace
  overdue_grace:
    minutes: 5

  conditions:
    - condition: state
      entity_id: switch.office_heater
      state: "on"

  condition_failure: skip

  sequence:
    - action: switch.turn_off
      target:
        entity_id: switch.office_heater
```

Conditions use normal Home Assistant condition syntax.

They are validated when the deferred action is saved, then checked again immediately before execution.

`condition_failure` can be:

- `skip` — record the action as `skipped`;
- `cancel` — record it as `cancelled`;
- `fail` — record it as `failed`.

`valid_until` must be later than the scheduled execution time.

A job that has not started by its `valid_until` time becomes `expired`.

Per-job `overdue_policy` can be:

- `execute`;
- `skip`;
- `execute_within_grace`.

If omitted, the integration-wide default is used.

A supplied `overdue_grace` overrides the global grace period for that job.

---

## Extend, snooze, list and cancel

### Extend

```yaml
action: deferred_actions.extend
data:
  job_id: "JOB_ID"
  duration:
    minutes: 15
```

### Snooze

For the common postpone-only case, `snooze` moves a pending job later by a positive duration.

```yaml
action: deferred_actions.snooze
data:
  job_id: "JOB_ID"
  duration:
    minutes: 15
```

If the deferred action has a `valid_until` cutoff, snooze refuses to move the action to or beyond that time.

### List pending actions

```yaml
action: deferred_actions.list
data:
  statuses:
    - pending
```

### Cancel

```yaml
action: deferred_actions.cancel
data:
  job_id: "JOB_ID"
```

`cancel` keeps the record in history.

`delete` permanently removes the record.

Bulk cancellation and history deletion require both:

- an explicit selector; and
- `confirm_bulk: true`.

Omitting a selector never means "everything".

---

## Job keys and conflict handling

A deferred action can optionally have a `job_key`.

This is useful when several scheduled actions represent the same logical timer or purpose.

For example, if an automation repeatedly creates a heater auto-off timer, you might want the newest timer to replace the old one rather than creating several copies.

```yaml
action: deferred_actions.create
data:
  name: Office heater auto-off
  job_key: office_heater_auto_off
  conflict_mode: replace_same_key

  delay:
    minutes: 40

  sequence:
    - action: switch.turn_off
      target:
        entity_id: switch.office_heater
```

Available conflict modes are:

- `keep_all`
- `replace_same_key`
- `cancel_same_key`
- `reject_same_key`

---

## Target discovery

Deferred Actions automatically identifies literal `entity_id` values from normal and nested Home Assistant action structures, including:

- `choose`
- `repeat`
- `parallel`
- `if` / `then` / `else`
- nested sequences

Templates are not rendered for target discovery.

If an action uses dynamic targets, you can provide `target_entities` explicitly.

Explicit targets are merged with automatically discovered targets.

---

## Restricted scheduling with `create_safe`

`create_safe` is intended for integrations, assistants or other callers that should be allowed to schedule a limited set of simple actions without being given access to arbitrary Home Assistant action sequences.

Example:

```yaml
action: deferred_actions.create_safe
data:
  name: Turn off the office light
  delay:
    minutes: 20

  action: light.turn_off

  target_entities:
    - light.office

  data:
    transition: 2
```

`create_safe` accepts one literal action instead of an arbitrary sequence.

The action must also pass the integration's restrictions:

- its domain must be enabled in the integration options;
- the operation must be in the built-in allowed action set;
- it must not be explicitly blocked;
- targets must be literal entity IDs in the same domain;
- templates are not allowed;
- arbitrary nested sequences are not allowed;
- unsupported action data is rejected.

Optional conditions are limited to literal `state` and `numeric_state` conditions.

`create_safe` reduces what a restricted caller can schedule, but it is **not** a complete Home Assistant permission sandbox.

---

## Actions reference

You do not need this section to use Deferred Actions through its sidebar panel.

The integration registers these actions under the `deferred_actions` domain:

- `create`
- `create_safe`
- `run_for`
- `get`
- `list`
- `update`
- `reschedule`
- `extend`
- `snooze`
- `pause`
- `resume`
- `cancel`
- `delete`
- `duplicate`
- `execute_now`
- `cancel_all`
- `delete_history`
- `cleanup_history`

Actions return JSON-serializable response data where applicable.

A create response includes the full normalized deferred-action record, UTC and local execution times, remaining seconds and an action summary.

Updates can include `expected_revision`. If another caller has already changed the record, a stale update receives `revision_conflict`.

Single-job resolution can use:

- exact job ID;
- exact job key;
- exact name;
- target entity hint;
- most recent pending job.

If more than one action matches, candidates are returned so the caller can clarify which one was intended.

Duplicating a job with `valid_until` preserves the original validity window relative to the new scheduled time rather than reusing the original absolute cutoff.

---

## Configuration

Open:

**Settings → Devices & services → Deferred Actions → Configure**

Default options are:

```yaml
overdue_policy: execute_within_grace
overdue_grace_minutes: 15

history_enabled: true
history_retention_days: 7
maximum_history_records: 500

default_conflict_mode: keep_all

frontend_panel_enabled: true

safe_allowed_domains:
  - light
  - switch
  - fan
  - media_player

safe_blocked_actions: []
```

### Overdue options

`execute`

Runs every overdue pending action when Home Assistant starts.

`skip`

Marks overdue actions as `missed`.

`execute_within_grace`

Runs overdue actions only if they are no more than the configured grace period late. Older actions are marked as `missed`.

### Restricted action options

`safe_allowed_domains` controls which domains are available to `create_safe`.

An entry in `safe_blocked_actions` always wins.

Allowing a domain does not automatically allow every operation in that domain. Deferred Actions also applies its conservative built-in action list.

---

## Job states

Deferred actions can use these states:

- `pending`
- `paused`
- `executing`
- `completed`
- `cancelled`
- `failed`
- `missed`
- `skipped`
- `expired`

An executing action cannot be edited, cancelled or deleted.

Finished records cannot be edited back to `pending`. Duplicate or reschedule an eligible record instead.

Normal finished outcomes such as expiry, skipping and policy-driven misses use `terminal_reason`.

`last_error` is reserved for genuine condition or execution failures.

---

## Sensor and events

### Sensor

Deferred Actions creates:

```text
sensor.deferred_actions
```

Its state is the number of pending actions.

Its attributes contain summary information only, including:

- paused count;
- failed count;
- next job ID;
- next job name;
- next UTC execution time;
- next local execution time.

The full queue is not stored in sensor attributes.

### Events

Home Assistant fires lifecycle events including:

- `deferred_actions_job_created`
- `deferred_actions_job_updated`
- `deferred_actions_job_started`
- `deferred_actions_job_completed`
- `deferred_actions_job_failed`
- `deferred_actions_job_cancelled`
- `deferred_actions_job_deleted`
- `deferred_actions_job_missed`
- `deferred_actions_job_skipped`
- `deferred_actions_job_expired`
- `deferred_actions_job_paused`
- `deferred_actions_job_resumed`

Event data is intentionally concise and does not include the stored action sequence.

---

## Voice assistants and LLMs

Deferred Actions does not add its own conversation agent, sentence grammar, Hassil sentences or native LLM tools.

You can still use its normal Home Assistant actions from:

- sentence-triggered automations;
- scripts;
- custom voice workflows;
- external integrations;
- LLM-based Home Assistant integrations.

For fixed voice phrases, create a normal Home Assistant sentence-triggered automation that calls the relevant Deferred Actions action.

For callers that should only be allowed to schedule a restricted set of simple actions, consider `deferred_actions.create_safe`.

---

## Security

For ordinary administrator use through Home Assistant, no special security configuration is required.

Extra care is needed if you expose Deferred Actions to:

- less-trusted Home Assistant users;
- external applications;
- voice assistants;
- LLM-based integrations;
- other automated callers.

The unrestricted Deferred Actions actions can store and later run complete Home Assistant action sequences.

Deferred Actions does not recursively inspect every possible nested action or reliably re-check every eventual action against the original caller's permissions at execution time.

Access to unrestricted scheduling should therefore be treated as permission to schedule any Home Assistant action sequence that caller can submit.

Do not expose unrestricted scheduling actions to untrusted users or clients.

`create_safe` significantly narrows what a trusted-but-restricted caller can schedule, but it is not a complete Home Assistant permission sandbox.

Administrators should still review:

- allowed domains;
- blocked actions;
- caller access;
- Home Assistant action/service behaviour;
- any downstream automations triggered by those actions.

The integration stores available source and context metadata for attribution, but this should not be treated as a complete security boundary.

Full conversation text is never stored.

---

## Persistence, history and privacy

Deferred actions are stored using Home Assistant's versioned storage system.

Scheduled actions survive Home Assistant restarts.

If a stored record is invalid, it is ignored rather than preventing the entire integration from starting. The number of invalid records is reported in diagnostics.

Completed, cancelled, failed, missed, skipped and expired records are cleaned according to the configured history-retention settings.

Cleanup occurs:

- at startup;
- every six hours;
- when manually requested.

Routine UI summaries do not render templates or include action data.

Diagnostics redact:

- stored action sequences;
- descriptions;
- errors;
- user identifiers.

---

## Troubleshooting

### The integration is not listed

Check that the integration exists at:

```text
/config/custom_components/deferred_actions/
```

Then restart Home Assistant.

If necessary, refresh or clear the browser cache.

### The sidebar panel is missing

Make sure:

- the frontend panel option is enabled;
- you are signed in as a Home Assistant administrator.

### A deferred action is `failed`

Open its detail view to see the error.

Missing entities, unavailable actions/services and template failures affect that deferred action only. Other scheduled actions continue normally.

### A deferred action is `missed`

Home Assistant was unavailable when it was due and the action exceeded the configured overdue policy or grace period.

You can:

- run it manually;
- duplicate it;
- reschedule it.

### A deferred action is `expired`

Its **Don't run after** / `valid_until` cutoff passed before execution began.

Expired actions cannot be executed.

### Voice control does not appear automatically

Deferred Actions does not add its own native sentences or conversation agent.

Create a Home Assistant sentence-triggered automation, script or other voice workflow that calls a Deferred Actions action.

---

## Technical notes

Deferred Actions keeps multiple independent scheduled jobs but only schedules the next due Home Assistant callback rather than creating a sleeping task for every job.

The scheduler uses status claims to prevent automatic execution and manual `execute_now` from running the same job at the same time.

Frontend updates are pushed over WebSocket rather than repeatedly polling the backend.

These implementation details are not required for normal use.

---

## Development

Python 3.12 or newer is used with Ruff and pytest.

The frontend uses Lit, TypeScript, ESLint, Vitest and Vite.

```text
python -m ruff format --check .
python -m ruff check .
python -m pytest

cd frontend
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

CI also runs HACS and Hassfest validation and verifies that a clean frontend build produces no diff from the committed bundle.

---

## License

MIT
