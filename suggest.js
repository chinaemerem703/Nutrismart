const refreshBtn = document.getElementById("refreshBtn");
const categories = document.querySelectorAll(".category");

refreshBtn.addEventListener("click", () => {
  alert("New meal suggestions loaded!");
});

categories.forEach(btn => {
  btn.addEventListener("click", () => {
    categories.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Tab switching logic
const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});