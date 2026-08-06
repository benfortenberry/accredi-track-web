type AppRuntimeConfig = {
  VITE_APP_API_URL?: string;
};

declare global {
  interface Window {
    __APP_CONFIG__?: AppRuntimeConfig;
  }
}

export const getApiBaseUrl = (): string => {
  const normalizeApiUrl = (value?: string): string => {
    const raw = (value || "").trim();
    if (!raw) {
      return "";
    }

    const withoutTrailingSlash = raw.replace(/\/+$/, "");

    if (/^https?:\/\//i.test(withoutTrailingSlash)) {
      return withoutTrailingSlash;
    }

    if (/^[a-z0-9.-]+(:\d+)?(\/.*)?$/i.test(withoutTrailingSlash)) {
      return `https://${withoutTrailingSlash}`;
    }

    return withoutTrailingSlash;
  };

  const fromBuild = import.meta.env.VITE_APP_API_URL?.trim();
  if (fromBuild) {
    return normalizeApiUrl(fromBuild);
  }

  const fromRuntime = window.__APP_CONFIG__?.VITE_APP_API_URL?.trim();
  if (fromRuntime) {
    return normalizeApiUrl(fromRuntime);
  }

  return "";
};
