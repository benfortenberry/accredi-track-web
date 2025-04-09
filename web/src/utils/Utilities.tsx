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
