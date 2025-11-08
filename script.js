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

/* ==================== DOM ==================== */
const signupForm = document.getElementById("signup");
const loginForm = document.getElementById("login");
const registerName = document.getElementById("signupName");
const registerEmail = document.getElementById("signupEmail");
const registerPassword = document.querySelector(".register-password-input");
const loginEmail = document.querySelector(".login-email-input");
const loginPassword = document.querySelector(".login-password-input");

/* ==================== AFTER SIGNUP → GO TO VERIFY ==================== */
signupForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const name = registerName.value.trim();
  const email = registerEmail.value.trim();
  const password = registerPassword.value.trim();

  if (!name || !email || !password) {
    alert("Fill all fields");
    return;
  }

  try {
    const res = await fetch("https://nutri-smart-akeg.onrender.com/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });

    if (res.status === 201) {
      localStorage.setItem("pendingEmail", email);
      localStorage.setItem("justSignedUp", "true");
      alert("OTP sent! Check your email.");
      window.location.href = "verify-email/verify.html";
    } else {
      const data = await res.json();
      alert(data.message || "Signup failed");
    }
  } catch (err) {
    alert("Network error");
  }
});

/* ==================== AFTER LOGIN → CHECK IF VERIFIED ==================== */
loginForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const email = loginEmail.value.trim();
  const password = loginPassword.value.trim();

  if (!email || !password) {
    alert("Fill all fields");
    return;
  }

  try {
    const res = await fetch("https://nutri-smart-akeg.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("authToken", data.accessToken);
      localStorage.setItem("userEmail", email);

      // CHECK IF USER IS VERIFIED
      const verifyRes = await fetch("https://nutri-smart-akeg.onrender.com/auth/check-verified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (verifyRes.ok) {
        const v = await verifyRes.json();
        if (v.verified) {
          window.location.href = "dashboard.html";
        } else {
          localStorage.setItem("pendingEmail", email);
          window.location.href = "verify-email/verify.html";
        }
      } else {
        // If no check endpoint, assume needs verify
        localStorage.setItem("pendingEmail", email);
        window.location.href = "verify-email/verify.html";
      }
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    alert("Network error");
  }
});