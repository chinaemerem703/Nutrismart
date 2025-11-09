
const API_BASE = "https://nutri-smart-akeg.onrender.com";

document.getElementById("send-btn").addEventListener("click", async () => {
  const email = document.getElementById("reset-email").value.trim();
  const msgEl = document.getElementById("msg");

  if (!email) {
    showMsg("Please enter your email address.", true);
    return;
  }

  showMsg("Sending instructions…", false);

  try {
    
    const res = await fetch(`${API_BASE}/auth/resend-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (res.ok) {
      showMsg("Reset instructions sent! Check your inbox.", false);
      
      setTimeout(() => location.href = "login.html", 3000);
    } else {
      showMsg(data.message || "Could not send reset email.", true);
    }
  } catch (err) {
    showMsg("Network error – try again later.", true);
  }
});

function showMsg(text, isError = false) {
  const el = document.getElementById("msg");
  el.textContent = text;
  el.style.color = isError ? "#d32f2f" : "#2e7d32";
}