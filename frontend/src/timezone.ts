interface WallClockParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

const formatterFor = (timeZone: string) => new Intl.DateTimeFormat("en-GB", {
  timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const wallClockParts = (date: Date, timeZone: string): WallClockParts => {
  const parts = formatterFor(timeZone).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return { year: value("year"), month: value("month"), day: value("day"), hour: value("hour"), minute: value("minute"), second: value("second") };
};

const parseLocalInput = (value: string): WallClockParts => {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(value);
  if (!match) throw new RangeError("Invalid local date/time");
  const parts = { year: Number(match[1]), month: Number(match[2]), day: Number(match[3]), hour: Number(match[4]), minute: Number(match[5]), second: Number(match[6] ?? 0) };
  const probe = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second));
  if (probe.getUTCFullYear() !== parts.year || probe.getUTCMonth() + 1 !== parts.month || probe.getUTCDate() !== parts.day || probe.getUTCHours() !== parts.hour || probe.getUTCMinutes() !== parts.minute || probe.getUTCSeconds() !== parts.second) throw new RangeError("Invalid local date/time");
  return parts;
};

const sameParts = (left: WallClockParts, right: WallClockParts): boolean => left.year === right.year && left.month === right.month && left.day === right.day && left.hour === right.hour && left.minute === right.minute && left.second === right.second;
const asUtcMs = (parts: WallClockParts): number => Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
const pad = (value: number): string => String(value).padStart(2, "0");

export const isoToLocalInput = (iso: string, timeZone: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) throw new RangeError("Invalid timestamp");
  const parts = wallClockParts(date, timeZone);
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)}T${pad(parts.hour)}:${pad(parts.minute)}`;
};

export const localInputToIso = (value: string, timeZone: string): string => {
  const target = parseLocalInput(value);
  const targetAsUtc = asUtcMs(target);
  let candidate = targetAsUtc;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const displayed = wallClockParts(new Date(candidate), timeZone);
    const delta = targetAsUtc - asUtcMs(displayed);
    if (delta === 0) break;
    candidate += delta;
  }
  const result = new Date(candidate);
  if (!sameParts(wallClockParts(result, timeZone), target)) throw new RangeError("This wall-clock time does not exist in the selected timezone");
  return result.toISOString();
};
