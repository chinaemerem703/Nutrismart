
const API_BASE = "https://nutri-smart-akeg.onrender.com";

const signupForm = document.getElementById("signup");
const loginForm = document.getElementById("login");
const registerName = document.getElementById("signupName");
const registerEmail = document.getElementById("signupEmail");
const registerPassword = document.querySelector(".register-password-input");
const loginEmail = document.querySelector(".login-email-input");
const loginPassword = document.querySelector(".login-password-input");

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
  msgEl.style.display = "block";
}

/* ==================== SIGNUP ==================== */
signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = registerName.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value.trim();

  if (!name || !email || !password) {
    return showMessage("signup", "All fields required", true);
  }

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("pendingEmail", email);
      showMessage("signup", "OTP sent! Redirecting...", false);
      setTimeout(() => {
        window.location.href = "verify.html"; // ← YOUR FILE
      }, 1500);
    } else {
      showMessage("signup", data.message || "Signup failed", true);
    }
  } catch (err) {
    showMessage("signup", "Network error", true);
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
      localStorage.setItem("user", JSON.stringify({ name: data.name || "User" }));
      showMessage("login", "Login successful!", false);
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1000);
    } else {
      showMessage("login", data.message || "Login failed", true);
    }
  } catch (err) {
    showMessage("login", "Network error", true);
  }
});