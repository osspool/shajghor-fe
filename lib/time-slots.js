// lib/time-slots.js

// Convert HH:mm to minutes since start of day
export function parseTimeToMinutes(hhmm) {
  if (!hhmm || typeof hhmm !== 'string') return null;
  const [h, m] = hhmm.split(":").map((n) => Number(n));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

// Convert minutes since start of day to HH:mm
export function minutesToHHMM(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const hh = String(h).padStart(2, '0');
  const mm = String(m).padStart(2, '0');
  return `${hh}:${mm}`;
}

// Check if a minute value is within any provided break ranges
export function isWithinAnyBreak(mins, breaks = []) {
  if (!Array.isArray(breaks) || breaks.length === 0) return false;
  return breaks.some((b) => {
    const start = parseTimeToMinutes(b?.startTime);
    const end = parseTimeToMinutes(b?.endTime);
    if (start == null || end == null) return false;
    return mins >= start && mins < end;
  });
}

// Generate time options for a given date based on working hours and slot settings
export function generateTimeOptionsForDate({
  date, // Date instance
  workingHours = {},
  slotDurationMinutes = 30,
  breaks = [],
  leadTimeMinutes = 0,
  dailyCutoffTime = "",
}) {
  if (!(date instanceof Date) || isNaN(date.getTime())) return [];
  const dayIdx = date.getDay(); // 0=Sun
  const map = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
  const dayKey = map[dayIdx];

  const config = workingHours?.[dayKey];
  if (!config || config.isOpen === false) return [];

  let start = parseTimeToMinutes(config.startTime);
  let end = parseTimeToMinutes(config.endTime);
  if (start == null || end == null || end <= start) return [];

  const cutoff = parseTimeToMinutes(dailyCutoffTime);
  if (cutoff != null) end = Math.min(end, cutoff);

  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday && leadTimeMinutes > 0) {
    const nowMins = now.getHours() * 60 + now.getMinutes() + leadTimeMinutes;
    start = Math.max(start, nowMins);
  }

  const options = [];
  for (let t = start; t + slotDurationMinutes <= end; t += slotDurationMinutes) {
    if (!isWithinAnyBreak(t, breaks)) {
      const label = minutesToHHMM(t);
      options.push({ value: label, label });
    }
  }
  return options;
}


