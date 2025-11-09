/* -------------------------------------------------
   reset-success.js – Password Reset Success Page
   ------------------------------------------------- */
const continueBtn = document.getElementById("continue-btn");
const toast = document.getElementById("toast");

// Show toast on load
window.addEventListener("load", () => {
  // Trigger toast animation
  toast.classList.add("show");

  // Auto-hide toast after 4 seconds
  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);

  // Auto-redirect to login after 5 seconds
  setTimeout(() => {
    window.location.href = "login.html";
  }, 5000);
});

// Manual button click
continueBtn.addEventListener("click", () => {
  window.location.href = "login.html";
});