/**
 * Number of whole calendar months between an ISO year-month (`YYYY-MM`) and
 * `now`. Clamped at zero so a future start date never renders as negative.
 */
export const monthsBetween = (from: string, now = new Date()) => {
  const [year, month] = from.split("-").map(Number);
  return Math.max(
    0,
    (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month),
  );
};

const plural = (value: number, unit: string) =>
  `${value} ${unit}${value === 1 ? "" : "s"}`;

/** `4` -> "4 mos", `12` -> "1 yr", `16` -> "1 yr 4 mos". */
export const humanizeMonths = (months: number) => {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (!years) return plural(rest, "mo");
  if (!rest) return plural(years, "yr");
  return `${plural(years, "yr")} ${plural(rest, "mo")}`;
};

/** Formats an ISO year-month start as e.g. "1 yr 4 mos". */
export const formatUptime = (from: string, now = new Date()) =>
  humanizeMonths(monthsBetween(from, now));
