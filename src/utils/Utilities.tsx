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
  // Convert the input to a Date object
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  // Check if the date is valid
  if (isNaN(parsedDate.getTime())) {
    return ""; // Return an empty string if the date is invalid
  }

  // Extract the month, day, and year
  const month = (parsedDate.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-based
  const day = parsedDate.getDate().toString().padStart(2, "0");
  const year = parsedDate.getFullYear();

  // Return the formatted date as MM/DD/YYYY
  return `${month}/${day}/${year}`;
};
