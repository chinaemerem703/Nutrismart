
const API_BASE = "https://nutri-smart-akeg.onrender.com";
const $ = id => document.getElementById(id);

const userEmailEl = $("user-email");
const verifyBtn = $("verify-btn");
const resendLink = $("resend-link");
const countdownEl = $("countdown");
const messageEl = $("message");
const changeEmailLink = $("change-email");

let userEmail = "";
let countdown = 60;
let timer;

function show(msg, isError = false) {
  messageEl.textContent = msg;
  messageEl.style.color = isError ? "#d32f2f" : "#2e7d32";
}

function startCountdown() {
  resendLink.style.pointerEvents = "none";
  countdownEl.textContent = countdown;
  timer = setInterval(() => {
    countdown--;
    countdownEl.textContent = countdown;
    if (countdown <= 0) {
      clearInterval(timer);
      resendLink.innerHTML = "Resend code";
      resendLink.style.pointerEvents = "auto";
      resendLink.onclick = resend;
    }
  }, 1000);
}

async function resend() {
  show("Sending...");
  try {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail })
    });
    if (res.ok) {
      show("New OTP sent!", false);
      countdown = 60;
      startCountdown();
    } else {
      const data = await res.json();
      show(data.message || "Failed", true);
    }
  } catch (err) {
    show("Network error", true);
  }
}

async function verify() {
  const inputs = document.querySelectorAll(".otp-input");
  let code = "";
  for (let input of inputs) code += input.value;

  if (code.length !== 6 || !/^\d+$/.test(code)) {
    return show("Enter 6 digits", true);
  }

  show("Verifying...");
  try {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, otp: code })
    });

    const data = await res.json();

    if (res.ok) {
      show("Verified! Redirecting...", false);
      
      // CLEAR EVERYTHING
      localStorage.removeItem("pendingEmail");
      localStorage.removeItem("authToken"); // Just in case
      localStorage.setItem("userEmail", userEmail); // Optional: remember email

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    } else {
      show(data.message || "Wrong OTP", true);
    }
  } catch (err) {
    show("Network error", true);
  }
}

function setupOTPInputs() {
  const inputs = document.querySelectorAll(".otp-input");
  inputs.forEach((input, i) => {
    input.addEventListener("input", () => {
      input.value = input.value.replace(/[^0-9]/g, "");
      if (input.value && i < 5) inputs[i + 1].focus();
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && i > 0) {
        inputs[i - 1].focus();
      }
    });
  });
}

changeEmailLink.onclick = () => {
  localStorage.removeItem("pendingEmail");
  window.location.href = "login.html";
};

window.addEventListener("load", () => {
  userEmail = localStorage.getItem("pendingEmail");
  if (!userEmail) {
    show("No email. Sign up again.", true);
    setTimeout(() => { window.location.href = "login.html"; }, 2000);
    return;
  }
  userEmailEl.textContent = userEmail;
  verifyBtn.onclick = verify;
  startCountdown();
  setupOTPInputs();
});