const habits = ["tennis", "メリオール", "小田急使用", "英語学習", "コナ散歩"];

const app = document.getElementById("app");

function getStartOfWeek(date) {
  const day = date.getDay();
  const diff = (day + 6) % 7;
  const monday = new Date(date);
  monday.setDate(date.getDate() - diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

function formatDate(date) {
  return date.toISOString().slice(0, 10);
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
  const monday = getStartOfWeek(today);

  const table = document.createElement("table");
  const header = document.createElement("tr");
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    const th = document.createElement("th");
    const day = date.getDay();
    th.textContent = `${date.getMonth() + 1}/${date.getDate()}`;
    if (day === 0 || day === 6) th.style.color = "red";
    header.appendChild(th);
  }
  table.appendChild(header);

  habits.forEach((habit) => {
    const row = document.createElement("tr");
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const key = formatDate(date);
      const td = document.createElement("td");
      const btn = document.createElement("button");

      if (data[key] && data[key][habit]) btn.classList.add("done");

      btn.addEventListener("click", () => {
        const d = loadData();
        d[key] = d[key] || {};
        d[key][habit] = !d[key][habit];
        saveData(d);
        btn.classList.toggle("done");
      });

      td.appendChild(btn);
      row.appendChild(td);
    }
    table.appendChild(row);
  });

  app.innerHTML = "";
  app.appendChild(table);
}

renderWeek();

// ==============================
// JSONエクスポート／インポート機能
// ==============================
document.getElementById("exportBtn").addEventListener("click", () => {
  const data = localStorage.getItem("habitData");
  if (!data) {
    alert("記録がまだありません。");
    return;
  }
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `habit-data-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

document.getElementById("importBtn").addEventListener("click", () => {
  document.getElementById("importFile").click();
});

document.getElementById("importFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedData = JSON.parse(event.target.result);
      localStorage.setItem("habitData", JSON.stringify(importedData));
      alert("記録をインポートしました。ページを再読み込みします。");
      location.reload();
    } catch (err) {
      alert("インポートに失敗しました。JSON形式を確認してください。");
    }
  };
  reader.readAsText(file);
});
