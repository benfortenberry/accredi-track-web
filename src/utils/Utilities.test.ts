import { describe, it, expect } from "vitest";
import {
  formatPhoneNumber,
  formatDate,
  isCancelledOver30DaysAgo,
  getLicenseStatus,
} from "./Utilities";

// Build a YYYY-MM-DD string offset from today by the given number of days,
// so expiry tests stay deterministic regardless of the run date.
const dayString = (offset: number): string => {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

describe("formatPhoneNumber", () => {
  it("formats a 10-digit number", () => {
    expect(formatPhoneNumber("5551234567")).toBe("(555) 123-4567");
  });

  it("returns the original input when not 10 digits", () => {
    expect(formatPhoneNumber("12345")).toBe("12345");
  });

  it("strips non-numeric characters before formatting", () => {
    expect(formatPhoneNumber("555-123-4567")).toBe("(555) 123-4567");
  });
});

describe("formatDate", () => {
  it("formats an ISO date as MM/DD/YYYY", () => {
    expect(formatDate("2026-03-05")).toBe("03/05/2026");
  });

  it("returns empty string for an invalid date", () => {
    expect(formatDate("not-a-date")).toBe("");
  });
});

describe("isCancelledOver30DaysAgo", () => {
  it("returns false for an empty value", () => {
    expect(isCancelledOver30DaysAgo("")).toBe(false);
  });

  it("returns true for a date more than 30 days ago", () => {
    const old = new Date();
    old.setDate(old.getDate() - 45);
    expect(isCancelledOver30DaysAgo(old.toISOString())).toBe(true);
  });

  it("returns false for a recent date", () => {
    const recent = new Date();
    recent.setDate(recent.getDate() - 5);
    expect(isCancelledOver30DaysAgo(recent.toISOString())).toBe(false);
  });
});

describe("getLicenseStatus", () => {
  it("returns 'No Expiration Date' when missing", () => {
    expect(getLicenseStatus(undefined)).toBe("No Expiration Date");
    expect(getLicenseStatus("")).toBe("No Expiration Date");
  });

  it("treats a license expiring today as Active (expired next day)", () => {
    expect(getLicenseStatus(dayString(0))).toBe("Active");
  });

  it("treats yesterday as Expired", () => {
    expect(getLicenseStatus(dayString(-1))).toBe("Expired");
  });

  it("treats a future date as Active", () => {
    expect(getLicenseStatus(dayString(30))).toBe("Active");
  });

  it("tolerates a full ISO timestamp by using the date portion", () => {
    expect(getLicenseStatus(dayString(5) + "T12:00:00Z")).toBe("Active");
  });

  it("returns 'No Expiration Date' for a malformed date", () => {
    expect(getLicenseStatus("garbage")).toBe("No Expiration Date");
  });
});
