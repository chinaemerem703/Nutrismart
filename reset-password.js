/* -------------------------------------------------
   Reset Password – Strength Meter + Validation + API
   ------------------------------------------------- */
const API_BASE = "https://nutri-smart-akeg.onrender.com";

const form = document.getElementById("reset-form");
const newPass = document.getElementById("new-pass");
const confirmPass = document.getElementById("confirm-pass");
const strengthMeter = document.getElementById("strength-meter");
const rulesList = document.getElementById("rules-list");
const msgEl = document.getElementById("msg");
const resetBtn = document.getElementById("reset-btn");

// Toggle Show/Hide
document.querySelectorAll(".toggle-pass").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    const type = target.type === "password" ? "text" : "password";
    target.type = type;
    btn.textContent = type === "text" ? "Hide" : "Show";
  });
});

// Password Strength
function evaluateStrength(pw) {
  let score = 0;
  const rules = {
    length: pw.length >= 8,
    uppercase: /[A-Z]/.test(pw),
    lowercase: /[a-z]/.test(pw),
    number: /\d/.test(pw),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(pw)
  };

  score = Object.values(rules).filter(Boolean).length;

  // Update rules UI
  Object.keys(rules).forEach(rule => {
    const li = rulesList.querySelector(`[data-rule="${rule}"]`);
    li.classList.toggle("valid", rules[rule]);
  });

  // Update meter
  strengthMeter.className = "strength-meter";
  const bar = strengthMeter.querySelector(".bar");
  const text = strengthMeter.querySelector(".text");

  if (score <= 2) {
    strengthMeter.classList.add("weak");
    text.textContent = "Weak";
  } else if (score <= 4) {
    strengthMeter.classList.add("medium");
    text.textContent = "Medium";
  } else {
    strengthMeter.classList.add("strong");
    text.textContent = "Strong";
  }
}

// Real‑time validation
newPass.addEventListener("input", () => evaluateStrength(newPass.value));
confirmPass.addEventListener("input", () => {
  const match = newPass.value && newPass.value === confirmPass.value;
  msgEl.textContent = match ? "" : "Passwords do not match";
  msgEl.style.color = match ? "" : "#d32f2f";
  resetBtn.disabled = !match || !isStrong();
});

function isStrong() {
  return document.querySelectorAll(".rules li.valid").length === 5;
}

// Submit
form.addEventListener("submit", async e => {
  e.preventDefault();
  if (!isStrong()) return showMsg("Password does not meet requirements", true);
  if (newPass.value !== confirmPass.value) return showMsg("Passwords do not match", true);

  showMsg("Updating password...", false);
  resetBtn.disabled = true;

  try {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) throw new Error("Missing reset token");

    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: newPass.value })
    });

    const data = await res.json();

    if (res.ok) {
      showMsg("Password reset successful! Redirecting...", false);
      localStorage.removeItem("pendingEmail");
      setTimeout(() => location.href = "login.html", 2000);
    } else {
      showMsg(data.message || "Failed to reset password", true);
    }
  } catch (err) {
    showMsg("Invalid or expired link", true);
  } finally {
    resetBtn.disabled = false;
  }
});

function showMsg(text, isError = false) {
  msgEl.textContent = text;
  msgEl.style.color = isError ? "#d32f2f" : "#2e7d32";
}

// Init
evaluateStrength("");