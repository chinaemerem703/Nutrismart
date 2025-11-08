// login page
function show(id) {
  // hide both
  document.getElementById("login").style.display = "none";
  document.getElementById("signup").style.display = "none";

  // show the chosen one
  document.getElementById(id).style.display = "block";

  // update tab colors
  var tabs = document.getElementsByClassName("tab");
  for (var i = 0; i < tabs.length; i++) {
    tabs[i].className = tabs[i].className.replace(" active", "");
  }
  event.target.className += " active";
}
function goToProfile() {
  var name = document.getElementById("signupName").value.trim();
  var email = document.getElementById("signupEmail").value.trim();

  if (!name || !email) {
    alert("Please fill your name and email!");
    return;
  }

  var user = { name: name, email: email };
  localStorage.setItem("user", JSON.stringify(user));

  window.location.href = "healthprofile.html";
}
// health profile

function goToStep2() {
  const age = document.getElementById("age")?.value.trim();
  const gender = document.getElementById("gender")?.value;
  const weight = document.getElementById("weight")?.value.trim();
  const height = document.getElementById("height")?.value.trim();
  const activity = document.getElementById("activity")?.value;

  if (
    !age ||
    !gender ||
    gender === "" ||
    !weight ||
    !height ||
    !activity ||
    activity === ""
  ) {
    alert("Please fill all required fields!");
    return;
  }

  const data = { age, gender, weight, height, activity };
  localStorage.setItem("step1Data", JSON.stringify(data));

  window.location.href = "healthprofile2.html";
}

function goToStep3() {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"]:checked'
  );
  const conditions = Array.from(checkboxes).map((cb) => cb.value);
  localStorage.setItem("step2Data", JSON.stringify(conditions));

  window.location.href = "healthprofile3.html";
}

const registerForm = document.getElementById("signup");
const registerEmail = document.querySelector(".register-email-input");
const registerPassword = document.querySelector(".register-password-input");
const registerName = document.querySelector(".register-name-input");

// OTP Modal Elements
const otpModal = document.getElementById("otp-modal");
const otpInput = document.getElementById("otp-input");
const verifyOtpBtn = document.getElementById("verify-otp-btn");
const closeOtpModal = document.getElementById("close-otp-modal");

let currentRegisterEmail = "";

// Show OTP modal
function showOtpModal(email) {
  currentRegisterEmail = email;
  otpModal.style.display = "block";
  otpInput.focus();
}

// Close OTP modal
closeOtpModal.onclick = () => (otpModal.style.display = "none");

registerForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const email = registerEmail.value.trim();
  const password = registerPassword.value.trim();
  const name = registerName.value.trim();

  if (!email || !password || !name) {
    return showMessage("register-message", "All fields are required!", true);
  }

  const data = { email, password, name };

  try {
    const response = await fetch(
      "https://nutri-smart-akeg.onrender.com/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();

    if (response.status === 201) {
      showMessage("register-message", "OTP sent to your email!", false);
      showOtpModal(email);
    } else {
      showMessage("register-message", result.message || "Registration failed", true);
    }
  } catch (error) {
    console.error(error);
    showMessage("register-message", "Network error.", true);
  }
});

// VERIFY OTP
verifyOtpBtn.addEventListener("click", async () => {
  const code = otpInput.value.trim();

  if (!code || code.length !== 6) {
    return alert("Enter a valid 6-digit OTP");
  }

  try {
    const response = await fetch(
      "https://nutri-smart-akeg.onrender.com/auth/verify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentRegisterEmail, code }),
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert("Account verified! Please log in.");
      otpModal.style.display = "none";
      otpInput.value = "";
      window.location.href = "login.html"; // redirect to login
    } else {
      alert(result.message || "Invalid or expired OTP");
    }
  } catch (error) {
    console.error(error);
    alert("Verification failed");
  }
});