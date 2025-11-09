
const API_BASE = "https://nutri-smart-akeg.onrender.com";

window.addEventListener("load", () => {
  const email = localStorage.getItem("pendingEmail") || "your email";
  document.getElementById("user-email").textContent = email;

  
  const toast = document.getElementById("toast");
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("show"), 100);
  setTimeout(() => toast.classList.add("hidden"), 4000);

  document.getElementById("back-login").onclick = () => {
    location.href = "login.html";
  };

  document.getElementById("try-another").onclick = () => {
    localStorage.removeItem("pendingEmail");
    location.href = "forgot-password.html";
  };
});