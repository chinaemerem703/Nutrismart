// ====== 1. TAB NAVIGATION (Works on ALL pages) ======
function goToTab(tab) {
  const pages = {
    calories: 'progress-tracker.html',
    macros: 'macros.html',
    weight: 'progress-tracker-weight.html',
    achievement: 'achievement.html'  // Add later
  };

  if (pages[tab]) {
    window.location.href = pages[tab];
  }
}

// ====== 2. SAMPLE DATA (Shared) ======
const sampleData = {
  week: {
    labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
    calories: [1950, 2050, 1900, 1980, 2010, 2100, 1970],
    carbs: [220, 240, 230, 215, 230, 250, 235],
    fat: [60, 58, 62, 59, 60, 63, 61],
    protein: [80, 85, 78, 82, 86, 90, 88],
    weight: [82.2, 81.9, 81.6, 81.3, 81.0, 80.8, 80.6],
  },
  month: {
    labels: ['Week 1','Week 2','Week 3','Week 4'],
    calories: [2020, 1980, 1950, 1979],
    carbs: [230, 225, 220, 228],
    fat: [62, 60, 61, 60],
    protein: [85, 82, 80, 88],
    weight: [82.2, 81.7, 81.0, 80.6],
  },
  '3months': {
    labels: ['Month 1','Month 2','Month 3'],
    calories: [2100, 2000, 1979],
    carbs: [250, 230, 228],
    fat: [67, 62, 60],
    protein: [78, 84, 88],
    weight: [84.0, 82.3, 80.6],
  },
  year: {
    labels: ['Jan','Mar','May','Jul','Sep','Nov'],
    calories: [2400, 2200, 2100, 2050, 2000, 1979],
    carbs: [300, 270, 250, 240, 235, 228],
    fat: [80, 72, 68, 65, 63, 60],
    protein: [70, 75, 80, 82, 86, 88],
    weight: [90, 86, 84, 82, 81, 80.6],
  }
};

// ====== 3. DOM READY: CREATE CHARTS ONLY IF CANVAS EXISTS ======
document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loaded:", window.location.pathname);

  // --- MACROS CHART (Only on macros.html) ---
  const macroCanvas = document.getElementById('macroChart');
  if (macroCanvas) {
    const ctx = macroCanvas.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: sampleData.week.labels,
        datasets: [
          { label: 'Carbs (g)', data: sampleData.week.carbs, borderColor: 'orange', backgroundColor: 'rgba(255,165,0,0.1)', tension: 0.4, fill: false },
          { label: 'Protein (g)', data: sampleData.week.protein, borderColor: 'green', backgroundColor: 'rgba(76,175,80,0.1)', tension: 0.4, fill: false },
          { label: 'Fat (g)', data: sampleData.week.fat, borderColor: 'red', backgroundColor: 'rgba(244,67,54,0.1)', tension: 0.4, fill: false }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  // --- WEIGHT CHART (Only on weight page) ---
  const weightCanvas = document.getElementById('weightChart');
  if (weightCanvas) {
    const ctx = weightCanvas.getContext('2d');
    let current = { labels: sampleData.month.labels, data: sampleData.month.weight };

    const weightChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: current.labels,
        datasets: [{
          label: "Weight (kg)",
          data: current.data,
          borderColor: "#ff9500",
          backgroundColor: "rgba(255,149,0,0.1)",
          tension: 0.3,
          fill: false,
          pointRadius: 5,
          pointBackgroundColor: "#ff9500"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { title: { display: true, text: "Weight (kg)" } } }
      }
    });

    // Week selector
    const select = document.getElementById("weekSelect");
    if (select) {
      select.addEventListener("change", () => {
        const key = select.value;
        const dataMap = {
          "this-week": "week",
          "this-month": "month",
          "3-months": "3months",
          "this-year": "year"
        };
        const period = dataMap[key] || "month";
        weightChart.data.labels = sampleData[period].labels;
        weightChart.data.datasets[0].data = sampleData[period].weight;
        weightChart.update();
      });
    }
  }

  // --- CALORIES CHART (Add later on calories page) ---
  // const caloriesCanvas = document.getElementById('caloriesChart');
  // if (caloriesCanvas) { ... }
});