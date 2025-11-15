

const API_BASE = "https://nutri-smart-akeg.onrender.com";
const COMPLETED_KEY = "profileCompleted"; // For one-time check

// -------------------------------------------------
// Helper Functions
// -------------------------------------------------
function getToken() {
  return localStorage.getItem("authToken");
}

function saveProfile(data) {
  localStorage.setItem("tempProfile", JSON.stringify(data));
}

function loadProfile() {
  const saved = localStorage.getItem("tempProfile");
  return saved ? JSON.parse(saved) : {};
}

function clearProfile() {
  localStorage.removeItem("tempProfile");
}

function isProfileCompleted() {
  return localStorage.getItem(COMPLETED_KEY) === "true";
}

function setProfileCompleted() {
  localStorage.setItem(COMPLETED_KEY, "true");
}

// Check on page load: Skip if completed
if (isProfileCompleted()) {
  window.location.href = "dashboard.html";
  throw new Error("Profile already completed");
}

// -------------------------------------------------
// STEP 1: healthprofile.html (Basic Info)
// -------------------------------------------------
if (document.getElementById("name")) {
  document.addEventListener("DOMContentLoaded", () => {
    const profile = loadProfile();

    // Restore saved values
    document.getElementById("name").value = profile.name || "";
    document.getElementById("age").value = profile.age || "";
    document.getElementById("gender").value = profile.gender || "Select";
    document.getElementById("weight").value = profile.weight || "";
    document.getElementById("height").value = profile.height || "";
    document.getElementById("activity").value = profile.activityLevel || "Select activity level";

    // Next button
    document.querySelector(".next-btn").addEventListener("click", (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const age = document.getElementById("age").value;
      const gender = document.getElementById("gender").value;
      const weight = document.getElementById("weight").value;
      const height = document.getElementById("height").value;
      const activityLevel = document.getElementById("activity").value;

      // Validation
      if (!name || !age || gender === "Select" || !weight || !height || activityLevel.includes("Select")) {
        alert("Please fill all fields correctly.");
        return;
      }

      const data = {
        name,
        age: parseInt(age),
        gender,
        weight: parseFloat(weight),
        height: parseFloat(height),
        activityLevel,
      };

      saveProfile({ ...loadProfile(), ...data });
      window.location.href = "healthprofile2.html";
    });
  });
}

// -------------------------------------------------
// STEP 2: healthprofile2.html (Health Conditions)
// -------------------------------------------------
else if (document.querySelector('input[name="conditions"]')) {
  document.addEventListener("DOMContentLoaded", () => {
    const profile = loadProfile();
    const conditions = profile.conditions || [];

    // Restore checked conditions
    document.querySelectorAll('input[name="conditions"]').forEach(cb => {
      cb.checked = conditions.includes(cb.value);
    });

    // Next button
    document.querySelector(".next-btn").addEventListener("click", (e) => {
      e.preventDefault();

      const selected = Array.from(document.querySelectorAll('input[name="conditions"]:checked'))
        .map(cb => cb.value);

      saveProfile({ ...loadProfile(), conditions: selected });
      window.location.href = "healthprofile3.html";
    });

    // Back button
    document.querySelector(".back-btn").addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "healthprofile.html";
    });
  });
}

// -------------------------------------------------
// STEP 3: healthprofile3.html 
// -------------------------------------------------
else if (document.querySelector('input[name="allergies"]')) {
  document.addEventListener("DOMContentLoaded", () => {
    const profile = loadProfile();
    const allergies = profile.allergies || [];
    const dietary = profile.dietary || [];

    // Restore allergies
    document.querySelectorAll('input[name="allergies"]').forEach(cb => {
      cb.checked = allergies.includes(cb.value);
    });

    // Restore dietary preferences
    document.querySelectorAll('input[name="dietary"]').forEach(cb => {
      cb.checked = dietary.includes(cb.value);
    });

    // Final Submit
    document.querySelector(".next-btn").addEventListener("click", async (e) => {
      e.preventDefault();

      const allergies = Array.from(document.querySelectorAll('input[name="allergies"]:checked'))
        .map(cb => cb.value);
      const dietary = Array.from(document.querySelectorAll('input[name="dietary"]:checked'))
        .map(cb => cb.value);

      const finalProfile = {
        ...loadProfile(),
        allergies,
        dietaryGoal: dietary.length > 0 ? dietary[0] : null,
      };

      const token = getToken();
      if (!token) {
        alert("Authentication token missing. Please log in again.");
        window.location.href = "login.html";
        return;
      }

      try {
        console.log("Sending profile to backend:", finalProfile);
        const res = await fetch(`${API_BASE}/profile/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(finalProfile)
        });

        const result = await res.json();

        if (res.ok) {
          clearProfile();
          localStorage.setItem("user", JSON.stringify({ name: finalProfile.name }));
          setProfileCompleted();
          alert("Profile saved successfully!");
          window.location.href = "dashboard.html";
        } else {
          console.error("Backend error:", result);
          alert(result.message || "Failed to save profile. Please try again.");
        }
      } catch (err) {
        console.error("Network or server error:", err);
        alert("Network error. Please check your connection and try again.");
      }
    });

    // Back button
    document.querySelector(".back-btn").addEventListener("click", (e) => {
      e.preventDefault();
      window.location.href = "healthprofile2.html";
    });
  });
}