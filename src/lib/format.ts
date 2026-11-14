const month = (d: Date) => d.toLocaleDateString('en-CA', { month: 'short', year: 'numeric', timeZone: 'UTC' });
const iso = (d: Date) => d.toISOString().slice(0, 7);

/** "Sep 2025 – present", "Jun 2026 – Jul 2026", "Mar 2026" */
export function dateRange(p: { date: Date; endDate?: Date; ongoing: boolean }) {
  if (p.ongoing) return `${month(p.date)} – present`;
  if (p.endDate && iso(p.endDate) !== iso(p.date)) return `${month(p.date)} – ${month(p.endDate)}`;
  return month(p.date);
}

/** Compact "2025-09" form for tables. */
export const shortDate = (d: Date) => iso(d);

export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
