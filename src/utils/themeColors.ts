// Single source of truth for chart colors: read the daisyUI theme tokens
// (defined in index.css as CSS custom properties) at runtime, so charts use the
// exact same palette as the rest of the UI (text-error, badge-warning, etc.)
// instead of hardcoded hex/rgba that drifts out of sync.
//
// Chart.js accepts any valid CSS color string, and modern browsers accept
// oklch() with an alpha channel, so we can return the token value directly and
// optionally apply transparency via `oklch(... / <alpha>)`.

// Resolve a daisyUI color token (e.g. "primary", "error", "base-content") to
// its computed CSS value. Falls back to a sensible neutral if the variable is
// missing (e.g. during tests / non-browser environments).
export function themeColor(token: string, fallback = "#888"): string {
  if (typeof window === "undefined" || !document?.documentElement) {
    return fallback;
  }
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(`--color-${token}`)
    .trim();
  return value || fallback;
}

// Same as themeColor but with an alpha applied. The token value is an oklch()
// color, so we inject the alpha using oklch relative color syntax which every
// current browser supports: `oklch(from <color> l c h / <alpha>)`.
export function themeColorAlpha(
  token: string,
  alpha: number,
  fallback = "#888"
): string {
  const base = themeColor(token, fallback);
  if (!base.startsWith("oklch")) {
    // Fallback path (tests / unexpected value): return the base as-is.
    return base;
  }
  return `oklch(from ${base} l c h / ${alpha})`;
}
