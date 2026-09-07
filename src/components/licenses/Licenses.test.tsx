import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
  withAxios: (C: any) => C,
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

import Licenses from "./Licenses";

beforeEach(() => {
  mocks.httpClient.get.mockReset();
  mocks.httpClient.post.mockReset();
  mocks.httpClient.put.mockReset();
  mocks.httpClient.delete.mockReset();
  mocks.user.current = { userSub: "auth0|test", email: "t@example.com", pro: 0 };
  document.body.innerHTML = "";
});

describe("Licenses list", () => {
  it("renders license type names from the API", async () => {
    mocks.httpClient.get.mockResolvedValue({
      data: [
        { id: 1, name: "CPR Certification", inUseBy: "" },
        { id: 2, name: "Driver's License", inUseBy: "" },
      ],
    });

    render(<Licenses />);

    expect(await screen.findByText("CPR Certification")).toBeInTheDocument();
    expect(screen.getByText("Driver's License")).toBeInTheDocument();
  });

  it("shows the empty state when there are no license types", async () => {
    mocks.httpClient.get.mockResolvedValue({ data: [] });

    render(<Licenses />);

    expect(await screen.findByText(/Add your first License Type/i)).toBeInTheDocument();
  });
});

describe("Licenses delete guard", () => {
  it("opens the cannot-delete modal when a license type is in use", async () => {
    // First GET: licenses list (one is in use by employee 5).
    mocks.httpClient.get.mockImplementation((url: string) => {
      if (url.endsWith("/licenses")) {
        return Promise.resolve({
          data: [{ id: 1, name: "CPR Certification", inUseBy: "[5]" }],
        });
      }
      // GET /employee/5 for the in-use modal.
      return Promise.resolve({ data: { id: 5, firstName: "Alex", lastName: "Morgan" } });
    });
    const user = userEvent.setup();

    render(<Licenses />);
    await screen.findByText("CPR Certification");

    // Click the delete (trash) action, now an accessible button.
    await user.click(
      screen.getByRole("button", { name: /Delete CPR Certification/i })
    );

    // The in-use modal is opened (not the confirm-delete modal), and lists the
    // blocking employee. Both dialogs exist in the DOM, so assert on `open`.
    await waitFor(() => {
      const inUse = document.getElementById("in-use-modal") as HTMLDialogElement;
      expect(inUse.open).toBe(true);
    });
    await waitFor(() => {
      expect(screen.getByText(/Alex Morgan/)).toBeInTheDocument();
    });
    const deleteModal = document.getElementById("delete-modal") as HTMLDialogElement;
    expect(deleteModal.open).toBe(false);
    // Delete must NOT have been called.
    expect(mocks.httpClient.delete).not.toHaveBeenCalled();
  });

  it("opens the confirm-delete modal (not the in-use modal) when not in use", async () => {
    mocks.httpClient.get.mockResolvedValue({
      data: [{ id: 1, name: "CPR Certification", inUseBy: "" }],
    });
    const user = userEvent.setup();

    render(<Licenses />);
    await screen.findByText("CPR Certification");

    await user.click(
      screen.getByRole("button", { name: /Delete CPR Certification/i })
    );

    // The confirm-delete modal is opened; the in-use modal is not.
    await waitFor(() => {
      const deleteModal = document.getElementById("delete-modal") as HTMLDialogElement;
      expect(deleteModal.open).toBe(true);
    });
    const inUse = document.getElementById("in-use-modal") as HTMLDialogElement;
    expect(inUse.open).toBe(false);
    // No delete request is sent until the user confirms.
    expect(mocks.httpClient.delete).not.toHaveBeenCalled();
  });
});
