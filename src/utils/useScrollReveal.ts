import { useEffect } from "react";

// Adds the "is-visible" class to any element carrying the "reveal" class once it
// scrolls into view, driving the CSS transition in App.css. Purely presentational
// and progressive: if IntersectionObserver is unavailable, every reveal element is
// shown immediately so nothing is ever hidden.
//
// Call once from a page component after its content has mounted. The `deps` array
// lets callers re-scan when the rendered content changes (e.g. route/vertical
// swap on the landing page).
export function useScrollReveal(deps: unknown[] = []) {
  useEffect(() => {
    const els = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)"),
    );
    if (els.length === 0) return;

    // Fallback: no observer support -> reveal everything up front.
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
