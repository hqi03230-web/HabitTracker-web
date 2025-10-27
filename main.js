const habits = ["tennis", "メリオール", "小田急使用", "英語学習", "コナ散歩"];
const app = document.getElementById("app");

function getMonday(d) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

function loadData() {
  return JSON.parse(localStorage.getItem("habitData") || "{}");
}

function saveData(data) {
  localStorage.setItem("habitData", JSON.stringify(data));
}

function renderWeek() {
  const data = loadData();
  const today = new Date();
  const monday = getMonday(today);

  const table = document.createElement("table");
  const header = document.createElement("tr");
  header.innerHTML = "<th>習慣</th>";

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
    const th = document.createElement("th");
    th.textContent = dateStr;
    if (d.getDay() === 0 || d.getDay() === 6) th.style.color = "red";
    header.appendChild(th);
  }
  table.appendChild(header);

  habits.forEach(habit => {
    const row = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = habit;
    row.appendChild(th);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dateKey = d.toISOString().slice(0, 10);
      const td = document.createElement("td");
      td.className = "habit-btn";
      if (data[dateKey]?.[habit]) td.classList.add("done");
      td.addEventListener("click", () => {
        const data = loadData();
        if (!data[dateKey]) data[dateKey] = {};
        data[dateKey][habit] = !data[dateKey][habit];
        saveData(data);
        renderWeek();
      });
      row.appendChild(td);
    }
    table.appendChild(row);
  });

  app.innerHTML = "";
  app.appendChild(table);
}

document.getElementById("exportBtn").addEventListener("click", () => {
  const data = localStorage.getItem("habitData") || "{}";
  const blob = new Blob([data], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "habit-data.json";
  a.click();
});

document.getElementById("importBtn").addEventListener("click", () => {
  document.getElementById("importFile").click();
});

document.getElementById("importFile").addEventListener("change", event => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      saveData(data);
      alert("データをインポートしました！");
      renderWeek();
    } catch {
      alert("JSONファイルが正しくありません。");
    }
  };
  reader.readAsText(file);
});

renderWeek();