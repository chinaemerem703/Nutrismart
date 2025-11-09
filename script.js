
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


const API_BASE = "https://nutri-smart-akeg.onrender.com";

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


signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = registerName.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value.trim();

  if (!name || !email || !password) {
    return showMessage("signup", "All fields required", true);
  }

  const payload = { name, email, password };

  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    console.log(data);

    // UNCOMMENT THIS (CHANGE #1)
    if (res.ok) {
      localStorage.setItem("pendingEmail", email);
      showMessage("signup", "OTP sent! Redirecting...", false);
      setTimeout(() => location.href = "verify.html", 1000);
    } else {
      // CHANGE #2: Show the actual errors array
      showMessage("signup", data.message || data.errors?.join(", ") || "Signup failed", true);
    }
  } catch (err) {
    showMessage("signup", "Network error", true);
    console.log(err);
  }
});

fetch(`${API_BASE}/auth/resend-otp`, {
  method: "POST",
  body: JSON.stringify({ email: "your-email@gmail.com" })
})