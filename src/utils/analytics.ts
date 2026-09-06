import posthog from "posthog-js";

// Env-gated analytics wrapper. If VITE_POSTHOG_KEY is not set (local dev, or
// before configuring the key in production), every function here is a safe
// no-op — nothing initializes, nothing tracks, no errors.

let enabled = false;

// Read from build-time env first, then the runtime config (window.__APP_CONFIG__,
// same mechanism as API URL / Auth0), so the key can be set without a rebuild.
const runtime = (typeof window !== "undefined" && (window as any).__APP_CONFIG__) || {};
const KEY = (import.meta.env.VITE_POSTHOG_KEY as string | undefined) || runtime.VITE_POSTHOG_KEY;
// PostHog Cloud host. US default; override for EU (https://eu.i.posthog.com).
const HOST =
  (import.meta.env.VITE_POSTHOG_HOST as string | undefined) ||
  runtime.VITE_POSTHOG_HOST ||
  "https://us.i.posthog.com";

export function initAnalytics() {
  if (enabled) return;
  if (!KEY) {
    // No key configured — analytics stays off.
    return;
  }
  posthog.init(KEY, {
    api_host: HOST,
    // We send pageviews manually on route change (this is an SPA), so disable
    // the automatic one to avoid double-counting.
    capture_pageview: false,
    // Privacy-friendly defaults; avoids needing a cookie banner in most cases.
    persistence: "localStorage+cookie",
    autocapture: false,
  });
  enabled = true;
}

// Capture UTM parameters from the current URL and attach them to the PostHog
// person so they persist across the session and onto conversion events. Call
// once on initial load. This is what ties a cold-email/ad click to an eventual
// signup ("this go_pro came from utm_campaign=childcare-batch1").
export function captureUtmParams() {
  if (!enabled) return;
  const params = new URLSearchParams(window.location.search);
  const utmKeys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];
  const found: Record<string, string> = {};
  for (const k of utmKeys) {
    const v = params.get(k);
    if (v) found[k] = v;
  }
  if (Object.keys(found).length > 0) {
    // register() persists these as super-properties on every subsequent event
    // this session, so conversion events (get_started_clicked, go_pro_clicked)
    // carry the campaign attribution.
    posthog.register(found);
  }
}

export function trackPageview(path: string) {
  if (!enabled) return;
  posthog.capture("$pageview", { $current_url: window.location.origin + path });
}

// Named conversion events. Keep the set small and meaningful.
export type AnalyticsEvent =
  | "get_started_clicked"
  | "login_clicked"
  | "go_pro_clicked";

export function track(event: AnalyticsEvent, props?: Record<string, unknown>) {
  if (!enabled) return;
  posthog.capture(event, props);
}
