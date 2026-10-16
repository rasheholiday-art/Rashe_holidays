// HTML-escaping for values interpolated into email templates. Booking fields are
// user-supplied, so they must never be inserted into email HTML unescaped.

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: unknown): string {
  if (value === null || value === undefined) return "";
  return String(value).replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch] ?? ch);
}

/** Returns a copy of props with every string value HTML-escaped (numbers etc. untouched). */
export function escapeHtmlProps<T extends object>(props: T): T {
  const out = {} as Record<string, unknown>;
  for (const [key, value] of Object.entries(props)) {
    out[key] = typeof value === "string" ? escapeHtml(value) : value;
  }
  return out as T;
}
