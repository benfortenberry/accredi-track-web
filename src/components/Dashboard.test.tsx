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
  it("shows the add-employee action for a brand-new account", async () => {
    wireDashboard({ metrics: { ...baseMetrics }, licenses: [] });

    render(<Dashboard />);

    expect(await screen.findByText(/Getting started/i)).toBeInTheDocument();
    // First step's action: add an employee. (Matches the button role so we
    // don't also match the step label text "Add an employee.")
    expect(
      screen.getByRole("link", { name: /Add an employee/i })
    ).toBeInTheDocument();
  });

  it("advances to the add-credential action once an employee exists", async () => {
    wireDashboard({
      metrics: { ...baseMetrics, totalEmployees: 2, totalEmployeeLicenses: 0 },
      licenses: [],
    });

    render(<Dashboard />);

    await screen.findByText(/Getting started/i);
    // Employee step is done, so its action button is gone...
    await waitFor(() => {
      expect(
        screen.queryByRole("link", { name: /Add an employee/i })
      ).not.toBeInTheDocument();
    });
    // ...and the add-credential action is now shown.
    expect(
      screen.getByRole("link", { name: /Add a credential/i })
    ).toBeInTheDocument();
  });

  it("hides the checklist once there's an employee with a credential", async () => {
    wireDashboard({
      metrics: { ...baseMetrics, totalEmployees: 3, totalEmployeeLicenses: 5 },
      licenses: [],
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.queryByText(/Getting started/i)).not.toBeInTheDocument();
    });
  });
});
