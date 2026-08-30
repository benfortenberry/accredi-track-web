export const showToast = (message: string, type: "success" | "error") => {
  const toast = document.createElement("div");
  toast.className = `alert ${
    type === "success" ? "alert-success" : "alert-error"
  } shadow-lg`;
  toast.innerHTML = `
    <div>
      <span>${message}</span>
    </div>
  `;
  document.getElementById("toast-container")?.appendChild(toast);

  // Remove the toast after 3 seconds
  setTimeout(() => {
    toast.remove();
  }, 3000);
};

export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Check if the input is a valid 10-digit phone number
  if (cleaned.length !== 10) {
    return phone; // Return the original input if it's not valid
  }

  // Format the phone number as (123) 456-7890
  const formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(
    3,
    6
  )}-${cleaned.slice(6)}`;
  return formatted;
};

export const formatDate = (date: string): string => {
  // For plain YYYY-MM-DD strings, parse the parts as a local date. Using
  // `new Date("2026-03-05")` would parse as UTC midnight and then read local
  // fields, shifting the day backward in timezones behind UTC.
  if (typeof date === "string") {
    const match = date.slice(0, 10).match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, year, month, day] = match;
      return `${month}/${day}/${year}`;
    }
  }

  // Fallback for other date formats.
  const parsedDate = typeof date === "string" ? new Date(date) : date;
  if (isNaN(parsedDate.getTime())) {
    return ""; // Return an empty string if the date is invalid
  }
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const day = parsedDate.getDate().toString().padStart(2, "0");
  const year = parsedDate.getFullYear();
  return `${month}/${day}/${year}`;
};


export function isCancelledOver30DaysAgo(cancelledDate: string | number): boolean {
  if (!cancelledDate) return false;
  const cancelled = typeof cancelledDate === "number"
    ? new Date(cancelledDate)
    : new Date(cancelledDate);
  const now = new Date();
  const days30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return cancelled < days30Ago;
}

// getLicenseStatus classifies a license by its expiration date using a
// date-only comparison: a license is active through its expiration date and
// becomes "Expired" the following day. This matches the backend rule
// (expDate < CURDATE()).
export const getLicenseStatus = (expDate?: string): string => {
  if (!expDate) return "No Expiration Date";
  const parts = expDate.slice(0, 10).split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return "No Expiration Date";
  const [year, month, day] = parts;
  const expirationDate = new Date(year, month - 1, day);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return expirationDate < today ? "Expired" : "Active";
};
