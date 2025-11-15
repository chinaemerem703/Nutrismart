/* -------------------------------------------------------------
   settings.js – FINAL: ARRAYS → STRINGS + FULL MERGE
   ------------------------------------------------------------- */
const API_BASE  = "https://nutri-smart-akeg.onrender.com";
const STATE_KEY = "nutrismart_settings_state";

function getToken() {
  return localStorage.getItem("authToken");
}

function showMessage(txt, err = false) {
  const msg = document.getElementById("settings-message") || document.getElementById("profile-message");
  if (!msg) return;
  msg.textContent = txt;
  msg.style.display = "block";
  msg.style.background = err ? "#ffe6e6" : "#e8f5e8";
  msg.style.color = err ? "#c62828" : "#2e7d32";
  setTimeout(() => msg.style.display = "none", 3000);
}

function loadState() {
  const s = localStorage.getItem(STATE_KEY);
  return s ? JSON.parse(s) : {};
}
function saveState(state) {
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

// Convert array → comma string
function toCommaString(arr) {
  if (!arr) return null;
  return Array.isArray(arr) ? arr.filter(Boolean).join(', ') : String(arr);
}

// Merge + convert arrays to strings
function preparePayload(partial) {
  const current = loadState();
  const merged = { ...current };

  // Merge arrays
  ['conditions', 'allergies'].forEach(key => {
    if (partial[key]) {
      const newArr = Array.isArray(partial[key]) ? partial[key] : [];
      const oldArr = Array.isArray(merged[key]) ? merged[key] : [];
      merged[key] = [...new Set([...oldArr, ...newArr])];
    }
  });

  // Overwrite others
  Object.keys(partial).forEach(key => {
    if (!['conditions', 'allergies'].includes(key)) {
      merged[key] = partial[key];
    }
  });

  // CONVERT arrays → strings
  merged.conditions = toCommaString(merged.conditions);
  merged.allergies = toCommaString(merged.allergies);

  return merged;
}

/* ---------- Save to Backend ---------- */
async function saveToBackend(payload) {
  try {
    const r = await fetch(`${API_BASE}/profile/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify(payload)
    });

    if (r.ok) {
      showMessage("Saved to server!", false);
    } else {
      const ct = r.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const err = await r.json();
        showMessage(err.message || "Server error", true);
      } else {
        showMessage("Saved locally (server error)", true);
      }
    }
  } catch (e) {
    console.error("Save failed:", e);
    showMessage("Saved locally – offline", true);
  }
}

/* ---------- Page detection ---------- */
const page = location.pathname.split("/").pop();

/* ============================================================= */
/* ===================== ACCOUNT (settings.html) =============== */
if (page === "settings.html") {
  document.addEventListener("DOMContentLoaded", () => {
    const state = loadState();
    fillAccount(state);
    document.getElementById("profile-form").addEventListener("submit", saveAccount);
  });

  function fillAccount(d) {
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.value = v ?? ""; };
    set("full-name", d.name);
    set("email", d.email);
    set("age", d.age);
    set("gender", d.gender || "Select");
    set("weight", d.weight);
    set("height", d.height);
    set("activity-level", d.activityLevel || "Select activity level");
  }

  async function saveAccount(e) {
    e.preventDefault();
    const payload = {
      name: document.getElementById("full-name").value.trim(),
      email: document.getElementById("email").value.trim(),
      age: +document.getElementById("age").value || 0,
      gender: document.getElementById("gender").value,
      weight: +document.getElementById("weight").value || 0,
      height: +document.getElementById("height").value || 0,
      activityLevel: document.getElementById("activity-level").value
    };

    const full = preparePayload(payload);
    saveState(full);
    localStorage.setItem("user", JSON.stringify({ name: payload.name, email: payload.email }));

    await saveToBackend(full);
  }
}

/* ============================================================= */
/* ==================== HEALTH (settings-health.html) ========= */
else if (page === "settings-health.html") {
  document.addEventListener("DOMContentLoaded", () => {
    const state = loadState();
    fillHealth(state);
    document.querySelector(".save-btn").addEventListener("click", saveHealth);
  });

  function fillHealth(d) {
    const check = (name, val) => {
      const cb = document.querySelector(`input[name="${name}"][value="${val}"]`);
      if (cb) cb.checked = true;
    };
    const arr = (str) => str ? str.split(', ').map(s => s.trim()) : [];
    arr(d.conditions).forEach(v => check("conditions", v));
    arr(d.allergies).forEach(v => check("allergies", v));
    if (d.dietaryGoal) check("dietary", d.dietaryGoal);
  }

  async function saveHealth(e) {
    e.preventDefault();
    const payload = {
      conditions: Array.from(document.querySelectorAll('input[name="conditions"]:checked')).map(cb => cb.value),
      allergies: Array.from(document.querySelectorAll('input[name="allergies"]:checked')).map(cb => cb.value),
      dietaryGoal: document.querySelector('input[name="dietary"]:checked')?.value || null
    };

    const full = preparePayload(payload);
    saveState(full);
    await saveToBackend(full);
  }
}

/* ============================================================= */
/* ============== NOTIFICATIONS (notification.html) ============ */
else if (page === "notification.html") {
  document.addEventListener("DOMContentLoaded", () => {
    const state = loadState();
    fillNotifications(state);
    document.querySelector(".save-btn").addEventListener("click", saveNotifications);
  });

  function fillNotifications(d) {
    const items = ["Daily Meal Reminders", "Nutrition Tips", "Progress Updates", "Achievement Alerts"];
    items.forEach((txt, i) => {
      const key = txt.toLowerCase().replace(/ /g, "_");
      const cb = document.querySelectorAll(".notification-settings-item input[type='checkbox']")[i];
      if (cb) cb.checked = d[key] ?? true;
    });
  }

  async function saveNotifications(e) {
    e.preventDefault();
    const items = ["Daily Meal Reminders", "Nutrition Tips", "Progress Updates", "Achievement Alerts"];
    const payload = {};
    items.forEach((txt, i) => {
      const key = txt.toLowerCase().replace(/ /g, "_");
      const cb = document.querySelectorAll(".notification-settings-item input[type='checkbox']")[i];
      payload[key] = cb ? cb.checked : true;
    });

    const full = preparePayload(payload);
    saveState(full);
    await saveToBackend(full);
  }
}

/* ============================================================= */
/* ===================== PRIVACY (privacy.html) =============== */
else if (page === "privacy.html") {
  document.addEventListener("DOMContentLoaded", () => {
    saveState(loadState());
  });
}
