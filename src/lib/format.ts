export function formatMoney(value: number | null | undefined, unit?: string, currency = "USD"): string | null {
  if (value == null) return null;
  const sym = currency === "USD" ? "$" : currency + " ";
  const u = (unit || "").toLowerCase();
  if (u.includes("billion") || u === "b") return `${sym}${value}B`;
  if (u.includes("million") || u === "m") return `${sym}${value}M`;
  return `${sym}${value.toLocaleString()}`;
}

export function formatRange(
  low: number | null | undefined,
  high: number | null | undefined,
  unit?: string,
  cur = "USD"
): string | null {
  if (low == null && high == null) return null;
  const sym = cur === "USD" ? "$" : cur + " ";
  const u = (unit || "").toLowerCase().includes("bill") ? "B"
    : (unit || "").toLowerCase().includes("mill") ? "M" : "";
  if (low == null) return `${sym}${high}${u}`;
  if (high == null) return `${sym}${low}${u}`;
  if (cur === "$") return `${low} – ${high}`;
  return `${sym}${low}${u} – ${sym}${high}${u}`;
}

export function bpsToPercent(bps: number | null | undefined): number | null {
  if (bps == null) return null;
  return bps / 100;
}
