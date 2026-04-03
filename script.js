// LOGIN
function setUser() {
  let name = prompt("Enter your name:");
  if (name) {
    localStorage.setItem("user", name);
    document.getElementById("username").innerText = "👤 " + name;
  }
}

// LOAD
window.onload = function () {
  const user = localStorage.getItem("user");
  if (user) document.getElementById("username").innerText = "👤 " + user;

  loadHistory();
};

// GENERATE PLAN
function generatePlan() {
  const weight = Number(document.getElementById("weight").value);
  const height = Number(document.getElementById("height").value);

  const plan = {
    water: (weight * 0.033).toFixed(2),
    exercise: 30,
    steps: 8000,
    diet: `
🥗 Breakfast: Oats / Fruits
🍛 Lunch: Rice + Veg + Protein
🍲 Dinner: Light meal
💧 Stay hydrated`
  };

  localStorage.setItem("plan", JSON.stringify(plan));

  waterPlan.innerText = plan.water + " L";
  exercisePlan.innerText = plan.exercise + " mins";
  stepsPlan.innerText = plan.steps + " steps";
  dietPlan.innerText = plan.diet;

  startWaterReminder(plan.water);
}

// SAVE DATA
function saveData() {
  const data = {
    date: new Date().toLocaleDateString(),
    water: Number(water.value),
    exercise: Number(exercise.value),
    steps: Number(steps.value)
  };

  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(data);
  localStorage.setItem("history", JSON.stringify(history));

  evaluate(data);
  loadHistory();
}

// STATUS CHECK
function evaluate(d) {
  const plan = JSON.parse(localStorage.getItem("plan"));
  if (!plan) return;

  let msg = "";

  msg += d.water >= plan.water ? "✔ Water Goal Completed\n" : "❌ Water Goal Pending\n";
  msg += d.exercise >= plan.exercise ? "✔ Exercise Completed\n" : "❌ Exercise Pending\n";
  msg += d.steps >= plan.steps ? "✔ Steps Completed\n" : "❌ Steps Pending\n";

  document.getElementById("status").innerText = msg;
}

// HISTORY (login required)
function loadHistory() {
  const user = localStorage.getItem("user");
  const table = document.getElementById("historyTable");

  if (!user) {
    table.innerHTML = "<tr><td>Please login to view history</td></tr>";
    return;
  }

  const history = JSON.parse(localStorage.getItem("history")) || [];

  table.innerHTML = `
    <tr>
      <th>Date</th><th>Water</th><th>Exercise</th><th>Steps</th>
    </tr>
  `;

  history.slice(-5).forEach(item => {
    const row = table.insertRow();
    row.innerHTML = `
      <td>${item.date}</td>
      <td>${item.water}</td>
      <td>${item.exercise}</td>
      <td>${item.steps}</td>
    `;
  });
}

// DARK MODE
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// WATER REMINDER
function startWaterReminder(liters) {
  const interval = (liters * 60 * 60 * 1000) / 8;

  setInterval(() => {
    alert("💧 Drink water!");
  }, interval);
}
// --- When the user clicks "Save" or "Generate Plan" ---
function saveDetails() {
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;
    
    // Save to sessionStorage (wipes on refresh)
    sessionStorage.setItem('userWeight', weight);
    sessionStorage.setItem('userHeight', height);
}

// --- When the user Logins ---
function handleLogin() {
    // 1. Perform your login authentication...
    
    // 2. Fetch history from your server/database
    const userHistory = fetchHistoryFromServer(); 
    
    // 3. Save to sessionStorage so it shows up now, 
    // but will be gone if they hit F5 (Refresh)
    sessionStorage.setItem('recentHistory', JSON.stringify(userHistory));
    renderHistoryTable();
}

// --- On Page Load ---
window.onload = function() {
    // Check if details exist in session
    if (sessionStorage.getItem('userWeight')) {
        document.getElementById('weight').value = sessionStorage.getItem('userWeight');
    }
    
    // We DON'T fetch history here because you want it deleted on refresh.
    // The table will remain empty until handleLogin() is called again.
};