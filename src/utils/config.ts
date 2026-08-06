type AppRuntimeConfig = {
  VITE_APP_API_URL?: string;
};

declare global {
  interface Window {
    __APP_CONFIG__?: AppRuntimeConfig;
  }
}

export const getApiBaseUrl = (): string => {
  const fromBuild = import.meta.env.VITE_APP_API_URL?.trim();
  if (fromBuild) {
    return fromBuild;
  }

  const fromRuntime = window.__APP_CONFIG__?.VITE_APP_API_URL?.trim();
  if (fromRuntime) {
    return fromRuntime;
  }

  return "";
};
