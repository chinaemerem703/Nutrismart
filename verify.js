const API_BASE = "https://nutri-smart-akeg.onrender.com";
const $ = id => document.getElementById(id);
const userEmailEl = $("user-email");
const verifyBtn = $("verify-btn");
const messageEl = $("message");

let userEmail = "";

async function verifyOTP() {
  const code = prompt("Enter 6-digit OTP:");
  if (!code || !/^\d{6}$/.test(code)) {
    show("Invalid code", true);
    return;
  }

  show("Verifying...");

  try {
    const res = await fetch(`${API_BASE}/auth/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, code })
    });

    if (res.ok) {
      show("Verified! Going to dashboard...", false);
      localStorage.removeItem("pendingEmail");
      localStorage.removeItem("justSignedUp");
      setTimeout(() => location.href = "../dashboard.html", 1500);
    } else {
      const data = await res.json();
      show(data.message || "Wrong OTP", true);
    }
  } catch (err) {
    show("Network error", true);
  }
}

function show(msg, isError = false) {
  messageEl.textContent = msg;
  messageEl.style.color = isError ? "#d32f2f" : "#2e7d32";
}

window.addEventListener("load", () => {
  userEmail = localStorage.getItem("pendingEmail") || "unknown@example.com";
  userEmailEl.textContent = userEmail;

  verifyBtn.onclick = verifyOTP;
  $("back-btn").onclick = () => history.back();
});