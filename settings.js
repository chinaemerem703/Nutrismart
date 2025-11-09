/* ==================== profile.js ==================== */
const API_BASE = "https://nutri-smart-akeg.onrender.com";

function getToken() {
  return localStorage.getItem("authToken");
}

function showMessage(text, isError = false) {
  const msgEl = document.getElementById("profile-message");
  msgEl.textContent = text;
  msgEl.style.display = "block";
  msgEl.style.background = isError ? "#ffe6e6" : "#f0f7f0";
  msgEl.style.color = isError ? "#d32f2f" : "#2e7d32";
}

document.getElementById("profile-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const token = getToken();
  if (!token) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  const data = {
    name: document.getElementById("full-name").value.trim(),
    email: document.getElementById("email").value.trim(),
    age: document.getElementById("age").value,
    gender: document.getElementById("gender").value,
    weight: document.getElementById("weight").value,
    height: document.getElementById("height").value,
    activityLevel: document.getElementById("activity-level").value,
  };

  console.log("Sending:", data); // Debug

  try {
    const response = await fetch(`${API_BASE}/profile/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Response:", result);

    if (response.ok) {
      showMessage("Profile saved successfully!", false);
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 1500);
    } else {
      showMessage(result.message || "Failed to save profile", true);
    }
  } catch (error) {
    console.error("Error:", error);
    showMessage("Network error. Check internet.", true);
  }
});