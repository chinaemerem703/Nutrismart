 function goToTab(tab) {
    const pages = {
      calories: 'progress-tracker.html',
      macros: 'macros.html',
      weight: 'progress-tracker-weight.html',
      Acheivement : '#'
    };
    if (pages[tab]) {
      window.location.href = pages[tab];
    }
  }



const ctx = document.getElementById('calorieChart');

new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Actual Calories',
        data: [1900, 2150, 1950, 1750, 2050, 2100, 1800],
        backgroundColor: '#ff6b35',
        borderRadius: 6,
        barThickness: 25,
      },
      {
        label: 'Goal',
        data: [2000, 2000, 2000, 2000, 2000, 2000, 2000],
        backgroundColor: '#c7eed8',
        borderRadius: 6,
        barThickness: 25,
      }
    ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#eee' },
      },
      x: {
        grid: { display: false },
      },
    },
  }
});