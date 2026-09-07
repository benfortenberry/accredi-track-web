import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// --- Mocks (hoisted) -------------------------------------------------------
const mocks = vi.hoisted(() => {
  const httpClient = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  const user = { current: { userSub: "auth0|test", email: "t@example.com", pro: 0 } };
  return { httpClient, user };
});

vi.mock("../../utils/AxiosInstance", () => ({
  httpClient: mocks.httpClient,
  withAxios: (C: any) => C, // passthrough: skip the Auth0 token interceptor
  withAxiosDirect: () => mocks.httpClient,
}));

vi.mock("../../context/UserContext", () => ({
  useUser: () => ({ aUser: mocks.user.current, isAuthenticated: true, isLoading: false }),
}));

vi.mock("../../utils/config", () => ({
  getApiBaseUrl: () => "",
  getAuth0Audience: () => "",
  getAuth0Domain: () => "",
  getAuth0ClientId: () => "",
}));

const navigateMock = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => navigateMock,
}));

import Employees from "./Employees";

const axiosError = (message: string, status = 400) => ({
  response: { status, data: { error: message } },
});

const sampleEmployees = [
  { id: 1, firstName: "Alex", lastName: "Morgan", phone1: "5551234567", email: "alex@example.com", status: "Active", licenseCount: 2 },
  { id: 2, firstName: "Jordan", lastName: "Lee", phone1: "5552345678", email: "jordan@example.com", status: "Expired", licenseCount: 1 },
];

beforeEach(() => {
  mocks.httpClient.get.mockReset();
  mocks.httpClient.post.mockReset();
  mocks.httpClient.put.mockReset();
  mocks.httpClient.delete.mockReset();
  navigateMock.mockReset();
  mocks.user.current = { userSub: "auth0|test", email: "t@example.com", pro: 0 };
  document.body.innerHTML = "";
  // The #toast-container is normally provided by Layout (which wraps these
  // pages in the app). These tests render the page in isolation, so add the
  // container here so showToast has a target.
  const toastRoot = document.createElement("div");
  toastRoot.id = "toast-container";
  document.body.appendChild(toastRoot);
});

describe("Employees list", () => {
  it("renders employee rows from the API", async () => {
    mocks.httpClient.get.mockResolvedValue({ data: sampleEmployees });

    render(<Employees />);

    expect(await screen.findByText("Alex")).toBeInTheDocument();
    expect(screen.getByText("Jordan")).toBeInTheDocument();
    // Phone is formatted for display.
    expect(screen.getByText("(555) 123-4567")).toBeInTheDocument();
  });

  it("shows the empty state with add/import/demo actions when there are no employees", async () => {
    mocks.httpClient.get.mockResolvedValue({ data: [] });

    render(<Employees />);

    expect(await screen.findByText(/Add your first employee/i)).toBeInTheDocument();
    expect(screen.getByText(/Import a CSV/i)).toBeInTheDocument();
    expect(screen.getByText(/Load demo data/i)).toBeInTheDocument();
  });
});

describe("Employees add flow", () => {
  it("submits a new employee and navigates on success", async () => {
    mocks.httpClient.get.mockResolvedValue({ data: [] });
    mocks.httpClient.post.mockResolvedValue({ data: { id: 99 } });
    const user = userEvent.setup();

    render(<Employees />);
    await screen.findByText(/Add your first employee/i);

    // Open the add modal via the primary button.
    await user.click(screen.getByRole("button", { name: /Add an employee/i }));

    await user.type(screen.getByPlaceholderText("First Name"), "Sam");
    await user.type(screen.getByPlaceholderText("Last Name"), "Doe");
    await user.type(screen.getByPlaceholderText("Phone Number"), "5551112222");
    await user.type(screen.getByPlaceholderText("Email Address"), "sam@example.com");

    await user.click(screen.getByRole("button", { name: "Add" }));

    await waitFor(() => {
      expect(mocks.httpClient.post).toHaveBeenCalledWith(
        "/employees",
        expect.objectContaining({
          firstName: "Sam",
          lastName: "Doe",
          phone1: "5551112222",
          email: "sam@example.com",
        })
      );
    });
    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/employee/99");
    });
  });

  it("surfaces the server error message when add fails", async () => {
    mocks.httpClient.get.mockResolvedValue({ data: [] });
    mocks.httpClient.post.mockRejectedValue(
      axiosError("Free plan limit reached. Upgrade to PRO to add more employees.", 403)
    );
    const user = userEvent.setup();

    render(<Employees />);
    await screen.findByText(/Add your first employee/i);
    await user.click(screen.getByRole("button", { name: /Add an employee/i }));

    await user.type(screen.getByPlaceholderText("First Name"), "Sam");
    await user.type(screen.getByPlaceholderText("Last Name"), "Doe");
    await user.type(screen.getByPlaceholderText("Phone Number"), "5551112222");
    await user.type(screen.getByPlaceholderText("Email Address"), "sam@example.com");
    await user.click(screen.getByRole("button", { name: "Add" }));

    // The specific backend message should appear via showToast.
    const toastContainer = document.getElementById("toast-container")!;
    await waitFor(() => {
      expect(within(toastContainer).getByText(/Free plan limit reached/i)).toBeInTheDocument();
    });
  });
});

describe("Employees CSV import", () => {
  it("shows a summary modal listing skipped rows after a partial import", async () => {
    mocks.httpClient.get.mockResolvedValue({ data: [] });
    mocks.httpClient.post.mockResolvedValue({
      data: {
        imported: 2,
        skipped: [
          { row: 3, reason: "A valid email address is required" },
          { row: 4, reason: "Phone number must be 10 digits" },
        ],
      },
    });
    const user = userEvent.setup();

    render(<Employees />);
    await screen.findByText(/Add your first employee/i);

    const csv = new File(["First Name,Last Name,Phone,Email\n"], "employees.csv", {
      type: "text/csv",
    });
    // The empty state's file input (there are two identical hidden inputs; the
    // first is in the header, the second in the empty state — either works).
    const inputs = document.querySelectorAll('input[type="file"]');
    await user.upload(inputs[0] as HTMLInputElement, csv);

    await waitFor(() => {
      expect(mocks.httpClient.post).toHaveBeenCalledWith(
        "/employees/import",
        expect.any(FormData)
      );
    });

    // Modal reports the imported count and each skipped row with its reason.
    // The count text is split across nodes, so match on the modal's content.
    const importModal = await waitFor(() => {
      const m = document.getElementById("import-result-modal");
      if (!m || !m.textContent?.includes("Imported")) {
        throw new Error("import modal not populated yet");
      }
      return m;
    });
    expect(importModal.textContent).toMatch(/Imported\s*2\s*employees/i);
    expect(within(importModal).getByText(/A valid email address is required/i)).toBeInTheDocument();
    expect(within(importModal).getByText(/Phone number must be 10 digits/i)).toBeInTheDocument();
    expect(importModal.textContent).toMatch(/Row\s*3/);
    expect(importModal.textContent).toMatch(/Row\s*4/);
  });
});

describe("Employees demo data", () => {
  it("loads demo data and refetches the list", async () => {
    // First GET (initial load) returns empty; after seeding, GET returns rows.
    mocks.httpClient.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: sampleEmployees });
    mocks.httpClient.post.mockResolvedValue({ data: { message: "Demo data loaded successfully" } });
    const user = userEvent.setup();

    render(<Employees />);
    await screen.findByText(/Load demo data/i);

    await user.click(screen.getByText(/Load demo data/i));

    await waitFor(() => {
      expect(mocks.httpClient.post).toHaveBeenCalledWith("/demo-data");
    });
    // Refetch happened -> the seeded rows render.
    expect(await screen.findByText("Alex")).toBeInTheDocument();
  });
});
