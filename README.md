# Deferred Actions

Deferred Actions is a Home Assistant custom integration for persistent, one-off action
sequences. It keeps multiple independent jobs, schedules only the next due callback,
survives restarts and exposes the same queue through normal Home Assistant actions, an
administrator-only sidebar panel and `sensor.deferred_actions`.

**Minimum Home Assistant version: 2024.12.0.** Deferred Actions intentionally does not
contribute LLM tools, a conversation agent or language-specific voice intents.

Recurring work deliberately belongs in Home Assistant automations or schedules. Deferred
Actions does not add sentence grammar, Hassil sentences or a conversation agent. Users can
call its normal actions from their own sentence-triggered automations.

## Features

- Absolute, timezone-aware dates or relative delays, normalized to UTC
- Full Home Assistant sequences: templates, choose, repeat, parallel, waits, delays and more
- Persistent active queue and configurable retained history
- One Home Assistant UTC callback for the earliest pending job; no sleeping tasks
- Safe status claims that prevent execute-now/automatic-execution races
- Create, get, list, update, reschedule, extend, pause, resume, cancel, delete, duplicate and execute-now
- Explicitly confirmed bulk cancellation and history deletion
- Semantic job keys with keep, replace, cancel or reject conflict behavior
- `run_for` for immediate start plus deferred end actions
- Responsive, theme-aware Lit panel with WebSocket push updates (no backend polling)
- One push-updated summary sensor and concise Home Assistant lifecycle events
- Redacted diagnostics

## Installation

### HACS

1. In HACS, open **Integrations**, choose the menu, then **Custom repositories**.
2. Add `https://github.com/conorod1992/ha-deferred-actions` as an **Integration** repository.
3. Search for and install **Deferred Actions**.
4. Restart Home Assistant when HACS asks.
5. Go to **Settings → Devices & services → Add integration** and add **Deferred Actions**.
6. Open **Deferred Actions** in the sidebar. The first release restricts this panel to administrators.

For manual installation, copy `custom_components/deferred_actions` into the matching
directory under your Home Assistant configuration, restart, and complete steps 5–6.

For fixed voice phrases, create a Home Assistant sentence-triggered automation that calls one
of the integration's normal actions. Deferred Actions does not expose native LLM tools.

## Examples

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

If `end_action` is omitted, Deferred Actions infers only these conservative pairs:
`light.turn_on → light.turn_off`, `switch.turn_on → switch.turn_off`,
`fan.turn_on → fan.turn_off`, `input_boolean.turn_on → input_boolean.turn_off`, and
`media_player.media_play → media_player.media_pause`. Locks, covers, alarm panels,
vacuums, scenes, scripts and arbitrary actions always need an explicit end action/sequence.

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

Absolute dates must include an explicit UTC offset. Naive local timestamps are rejected,
which avoids ambiguity during daylight-saving transitions.

### Extend, list and cancel

```yaml
action: deferred_actions.extend
data:
  job_id: "JOB_ID"
  duration:
    minutes: 15
```

```yaml
action: deferred_actions.list
data:
  statuses:
    - pending
```

```yaml
action: deferred_actions.cancel
data:
  job_id: "JOB_ID"
```

### Replace a semantic timer

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

`cancel` stops an eligible job and keeps its history. `delete` permanently removes the
record. Bulk actions require both `confirm_bulk: true` and a selector; an omitted selector
never means everything.

## Actions and responses

The integration registers:

`create`, `run_for`, `get`, `list`, `update`, `reschedule`, `extend`, `cancel`, `delete`,
`pause`, `resume`, `execute_now`, `duplicate`, `cancel_all`, `delete_history`, and
`cleanup_history` under the `deferred_actions` domain.

Actions return JSON-serializable response data. A create response includes the complete
normalized record, UTC and local execution dates, remaining seconds and a safe action
summary. Updates accept `expected_revision`; stale callers receive `revision_conflict`.
Resolution accepts exact ID, exact job key, exact name, target entity hint, or the most
recent pending job. Multiple matches produce candidates and require clarification.

## Options and overdue recovery

Open **Settings → Devices & services → Deferred Actions → Configure**. Defaults are:

```yaml
overdue_policy: execute_within_grace
overdue_grace_minutes: 15
history_enabled: true
history_retention_days: 7
maximum_history_records: 500
default_conflict_mode: keep_all
frontend_panel_enabled: true
```

`execute` runs every overdue pending job at startup. `skip` marks each overdue job
`missed`. `execute_within_grace` runs jobs no more than the grace period late and marks
older jobs missed. Paused jobs stay paused; the same policy is applied when one is resumed
without a replacement time.

## States and events

Jobs use `pending`, `paused`, `executing`, `completed`, `cancelled`, `failed`, and `missed`.
An executing job cannot be edited, cancelled or deleted. History states cannot be edited
back to pending; duplicate or execute an eligible failed/missed record instead.

Home Assistant fires `deferred_actions_job_created`, `_updated`, `_started`, `_completed`,
`_failed`, `_cancelled`, `_deleted`, `_missed`, `_paused`, and `_resumed`. Event data is
concise and excludes the action sequence.

`sensor.deferred_actions` has the pending count as its state and only summary attributes:
paused/failed counts and the ID, name, UTC and local time of the next job. It never stores
the full queue in state attributes.

## Security limitation

Deferred Actions stores Home Assistant action sequences and executes them later.

The first release does not recursively inspect all nested actions or reliably revalidate
every eventual action against the permissions of the original caller.

Access to unrestricted Deferred Actions actions should therefore be treated as permission
to schedule any Home Assistant action sequence those interfaces can submit.

Do not expose unrestricted scheduling actions to untrusted users or external clients.

Any automation, script or external caller remains responsible for deciding which actions it
may perform immediately or defer.

The integration stores available source and context metadata for attribution, but this must
not be treated as a complete security boundary. Full conversation text is never stored.

## Persistence and privacy

Jobs are stored with Home Assistant’s versioned storage helper. Important changes are
coalesced and flushed on unload. Invalid records are quarantined from the live queue and
reported as a count in diagnostics instead of preventing setup. Completed/cancelled/failed/
missed jobs are cleaned at startup, every six hours, or on demand.

Routine UI summaries never render templates or include service data. Diagnostics redact
action sequences, descriptions, errors and user identifiers.

## Troubleshooting

- **The integration is not listed:** confirm the folder is exactly
  `custom_components/deferred_actions`, restart Home Assistant, and clear browser cache.
- **The panel is missing:** ensure the panel option is enabled and sign in as an administrator.
- **A job is `failed`:** open its detail view for the concise error. Missing entities, services,
  and template failures affect that job only; other due jobs continue.
- **A job is `missed`:** it exceeded the configured startup/resume overdue policy. Use
  `execute_now`, or duplicate/reschedule it.
- **Voice control:** create a sentence-triggered automation that calls a Deferred Actions action.
  The integration intentionally does not contribute native LLM tools or sentence grammar.

## Development

Python 3.12 or newer uses Ruff and pytest with Home Assistant’s established fixtures. The panel uses Lit,
TypeScript, ESLint, Vitest and Vite:

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

CI additionally runs HACS and Hassfest validation and verifies a clean frontend build has no
diff from the committed bundle.

## License

MIT
