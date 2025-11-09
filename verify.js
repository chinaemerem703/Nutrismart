const API_BASE = "https://nutri-smart-akeg.onrender.com";
const $ = id => document.getElementById(id);
const userEmailEl = $("user-email");
const verifyBtn = $("verify-btn");
const resendLink = $("resend-link");
const messageEl = $("message");

let userEmail = "";

async function verify() {
  const code = prompt("Enter 6-digit OTP:");
  if (!code || code.length !== 6) return show("Invalid OTP", true);

  show("Verifying...");

  try {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, code })
    });

    if (res.ok) {
      show("Verified!", false);
      localStorage.removeItem("pendingEmail");
      setTimeout(() => location.href = "../login.html", 1500);
    } else {
      const data = await res.json();
      show(data.message || "Wrong OTP", true);
    }
  } catch (err) {
    show("Network error", true);
  }
}

async function resend() {
  show("Sending...");
  try {
    const res = await fetch(`${API_BASE}/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail })
    });
    if (res.ok) show("New OTP sent!", false);
    else show("Failed to resend", true);
  } catch (err) {
    show("Network error", true);
  }
}

function show(msg, isError = false) {
  messageEl.textContent = msg;
  messageEl.style.color = isError ? "red" : "green";
}

window.addEventListener("load", () => {
  userEmail = localStorage.getItem("pendingEmail") || "unknown@example.com";
  userEmailEl.textContent = userEmail;

  verifyBtn.onclick = verify;
  resendLink.onclick = resend;
});