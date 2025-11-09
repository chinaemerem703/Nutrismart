/* ==================== TABS ==================== */
function show(id) {
  document.getElementById("login").style.display = "none";
  document.getElementById("signup").style.display = "none";
  document.getElementById(id).style.display = "block";

  const tabs = document.getElementsByClassName("tab");
  for (let tab of tabs) {
    tab.className = tab.className.replace(" active", "");
  }
  event.target.className += " active";
}

/* ==================== CONFIG ==================== */
const API_BASE = "https://nutri-smart-akeg.onrender.com";

/* ==================== DOM ==================== */
const signupForm = document.getElementById("signup");
const loginForm = document.getElementById("login");
const registerName = document.getElementById("signupName");
const registerEmail = document.getElementById("signupEmail");
const registerPassword = document.querySelector(".register-password-input");
const loginEmail = document.querySelector(".login-email-input");
const loginPassword = document.querySelector(".login-password-input");

/* ==================== MESSAGE ==================== */
function showMessage(formId, msg, isError = false) {
  const container = document.querySelector(`#${formId}`);
  let msgEl = container.querySelector(".msg");
  if (!msgEl) {
    msgEl = document.createElement("div");
    msgEl.className = "msg";
    container.appendChild(msgEl);
  }
  msgEl.textContent = msg;
  msgEl.style.color = isError ? "#d32f2f" : "#2e7d32";
  msgEl.style.marginTop = "10px";
}

/* ==================== SIGNUP (USE /auth/resend-otp) ==================== */
signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = registerName.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value.trim();

  if (!name || !email || !password) {
    return showMessage("signup", "All fields required", true);
  }

  try {
    // USE /auth/resend-otp FOR SIGNUP TOO
    const res = await fetch(`${API_BASE}/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("pendingEmail", email);
      showMessage("signup", "OTP sent! Redirecting...", false);
      setTimeout(() => location.href = "verify-email/index.html", 1000);
    } else {
      showMessage("signup", data.message || "Failed to send OTP", true);
    }
  } catch (err) {
    showMessage("signup", "Network error. Is backend live?", true);
  }
});

/* ==================== LOGIN ==================== */
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    return showMessage("login", "Fill all fields", true);
  }

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("authToken", data.accessToken);
      showMessage("login", "Login successful!", false);
      setTimeout(() => location.href = "dashboard.html", 1000);
    } else {
      showMessage("login", data.message || "Login failed", true);
    }
  } catch (err) {
    showMessage("login", "Network error", true);
  }
});