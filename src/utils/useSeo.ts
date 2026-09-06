import { useEffect } from "react";

// Sets document title + meta description + OpenGraph tags at runtime. This is a
// client-side SPA (no SSR), so tags are applied on mount. Good enough for the
// browser tab, link previews, and crawlers that execute JS. Restores nothing on
// unmount by design — the next page that uses this hook will set its own.
interface SeoOptions {
  title: string;
  description: string;
  // Absolute canonical URL for this page (helps SEO + OG).
  url?: string;
}

function setMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSeo({ title, description, url }: SeoOptions) {
  useEffect(() => {
    document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:type", "website");
    if (url) setMeta("property", "og:url", url);
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
  }, [title, description, url]);
}
