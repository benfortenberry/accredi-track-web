type AppRuntimeConfig = {
  VITE_APP_API_URL?: string;
  VITE_AUTH0_DOMAIN?: string;
  VITE_AUTH0_CLIENT_ID?: string;
  VITE_AUTH0_AUDIENCE?: string;
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

const normalizeTextValue = (value?: string): string => {
  let normalized = (value || "").trim();
  normalized = normalized.replace(/^['"]+|['"]+$/g, "");

  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    normalized = normalized.slice(1, -1).trim();
    normalized = normalized.replace(/^['"]+|['"]+$/g, "");
  }

  return normalized;
};

export const getAuth0Domain = (): string => {
  const fromBuild = normalizeTextValue(import.meta.env.VITE_AUTH0_DOMAIN);
  if (fromBuild) {
    return fromBuild;
  }

  const fromRuntime = normalizeTextValue(window.__APP_CONFIG__?.VITE_AUTH0_DOMAIN);
  if (fromRuntime) {
    return fromRuntime;
  }

  return "thumbsupsolutions.auth0.com";
};

export const getAuth0ClientId = (): string => {
  const fromBuild = normalizeTextValue(import.meta.env.VITE_AUTH0_CLIENT_ID);
  if (fromBuild) {
    return fromBuild;
  }

  const fromRuntime = normalizeTextValue(window.__APP_CONFIG__?.VITE_AUTH0_CLIENT_ID);
  if (fromRuntime) {
    return fromRuntime;
  }

  return "RwAsIDcSImAUQsefyBpCH8FWvxe4wSLL";
};

export const getAuth0Audience = (): string => {
  const fromBuild = normalizeTextValue(import.meta.env.VITE_AUTH0_AUDIENCE);
  if (fromBuild) {
    return fromBuild;
  }

  const fromRuntime = normalizeTextValue(window.__APP_CONFIG__?.VITE_AUTH0_AUDIENCE);
  if (fromRuntime) {
    return fromRuntime;
  }

  return "";
};
