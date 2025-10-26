const habits = ["tennis", "メリオール", "小田急使用", "英語学習", "コナ散歩"];

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function saveData(data) {
  localStorage.setItem("habitData", JSON.stringify(data));
}

function loadData() {
  return JSON.parse(localStorage.getItem("habitData") || "{}");
}

function buildTable() {
  const data = loadData();
  const today = new Date();
  const monday = getMonday(today);
  const days = [...Array(7)].map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });

  const tracker = document.getElementById("tracker");
  tracker.innerHTML = "";

  const table = document.createElement("table");
  const headerRow = document.createElement("tr");
  const emptyTh = document.createElement("th");
  headerRow.appendChild(emptyTh);

  days.forEach(d => {
    const th = document.createElement("th");
    const day = ["日","月","火","水","木","金","土"][d.getDay()];
    th.innerHTML = `${d.getMonth()+1}/${d.getDate()}<br>${day}`;
    if (day === "土") th.style.color = "blue";
    if (day === "日") th.style.color = "red";
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  habits.forEach(habit => {
    const row = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = habit;
    row.appendChild(th);
    days.forEach(d => {
      const dateStr = d.toISOString().split("T")[0];
      const td = document.createElement("td");
      const btn = document.createElement("button");
      if (data[habit]?.includes(dateStr)) btn.classList.add("done");
      btn.addEventListener("click", () => {
        if (!data[habit]) data[habit] = [];
        if (data[habit].includes(dateStr)) {
          data[habit] = data[habit].filter(x => x !== dateStr);
          btn.classList.remove("done");
        } else {
          data[habit].push(dateStr);
          btn.classList.add("done");
        }
        saveData(data);
      });
      td.appendChild(btn);
      row.appendChild(td);
    });
    table.appendChild(row);
  });
  tracker.appendChild(table);
}

buildTable();