import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

const mocks = vi.hoisted(() => {
  const httpClient = { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() };
  return { httpClient };
});

vi.mock("../utils/AxiosInstance", () => ({
  httpClient: mocks.httpClient,
  withAxios: (C: any) => C,
  withAxiosDirect: () => mocks.httpClient,
}));

vi.mock("../utils/config", () => ({
  getApiBaseUrl: () => "",
  getAuth0Audience: () => "",
}));

// Charts use canvas which jsdom doesn't render; stub them out.
vi.mock("./charts/LicenseTypeChart", () => ({ default: () => null }));
vi.mock("./charts/ExpiringSoonChart", () => ({ default: () => null }));

// react-router Link -> plain anchor.
vi.mock("react-router-dom", () => ({
  Link: ({ to, children }: any) => <a href={to}>{children}</a>,
}));

import Dashboard from "./Dashboard";

// Wire httpClient.get to respond based on the requested URL.
const wireDashboard = (opts: {
  metrics: any;
  licenses: any[];
}) => {
  mocks.httpClient.get.mockImplementation((url: string) => {
    if (url.endsWith("/metrics")) return Promise.resolve({ data: opts.metrics });
    if (url.endsWith("/licenses")) return Promise.resolve({ data: opts.licenses });
    // chart-data endpoints
    return Promise.resolve({ data: [] });
  });
};

const baseMetrics = {
  totalEmployees: 0,
  expiredCount: 0,
  expiringSoon: 0,
  complianceRate: 0,
  licenseAvg: 0,
  notificationCount: 0,
  totalEmployeeLicenses: 0,
};

beforeEach(() => {
  mocks.httpClient.get.mockReset();
  document.body.innerHTML = "";
});

describe("Dashboard setup checklist", () => {
  it("shows all steps incomplete for a brand-new account", async () => {
    wireDashboard({ metrics: { ...baseMetrics }, licenses: [] });

    render(<Dashboard />);

    expect(await screen.findByText(/Getting started/i)).toBeInTheDocument();
    // Action buttons for the incomplete steps.
    expect(screen.getByText(/Add license type/i)).toBeInTheDocument();
    expect(screen.getByText(/Add employee/i)).toBeInTheDocument();
  });

  it("reflects partial progress: license types exist but no employees yet", async () => {
    wireDashboard({
      metrics: { ...baseMetrics, totalEmployees: 0, totalEmployeeLicenses: 0 },
      licenses: [{ id: 1, name: "CPR", inUseBy: "" }],
    });

    render(<Dashboard />);

    await screen.findByText(/Getting started/i);
    // License-type step is done, so its action button should be gone...
    await waitFor(() => {
      expect(screen.queryByText(/Add license type/i)).not.toBeInTheDocument();
    });
    // ...but the add-employee action remains.
    expect(screen.getByText(/Add employee/i)).toBeInTheDocument();
  });

  it("hides the checklist once all three steps are complete", async () => {
    wireDashboard({
      metrics: { ...baseMetrics, totalEmployees: 3, totalEmployeeLicenses: 5 },
      licenses: [{ id: 1, name: "CPR", inUseBy: "[1]" }],
    });

    render(<Dashboard />);

    // Wait for data to load (a stat card or similar), then assert checklist gone.
    await waitFor(() => {
      expect(screen.queryByText(/Getting started/i)).not.toBeInTheDocument();
    });
  });
});
