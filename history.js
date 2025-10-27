const habits = ["tennis", "メリオール", "小田急使用", "英語学習", "コナ散歩"];
const historyDiv = document.getElementById("history");

function loadData() {
  return JSON.parse(localStorage.getItem("habitData") || "{}");
}

function renderHistory() {
  const data = loadData();
  const allKeys = Object.keys(data).sort();
  if (allKeys.length === 0) {
    historyDiv.innerHTML = "<p>記録がまだありません。</p>";
    return;
  }

  let currentMonth = "";
  let table;

  allKeys.forEach(dateKey => {
    const date = new Date(dateKey);
    const ym = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    if (ym !== currentMonth) {
      currentMonth = ym;
      const h2 = document.createElement("h2");
      h2.textContent = `${date.getFullYear()}年 ${date.getMonth() + 1}月`;
      historyDiv.appendChild(h2);

      table = document.createElement("table");
      const header = document.createElement("tr");
      header.innerHTML = "<th>日付</th>" + habits.map(h => `<th>${h}</th>`).join("");
      table.appendChild(header);
      historyDiv.appendChild(table);

      const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const row = document.createElement("tr");
        const dKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dateObj = new Date(dKey);
        const dayCell = document.createElement("td");
        dayCell.textContent = `${dateObj.getMonth() + 1}/${day}`;
        if (dateObj.getDay() === 0 || dateObj.getDay() === 6) dayCell.style.color = "red";
        row.appendChild(dayCell);

        habits.forEach(habit => {
          const td = document.createElement("td");
          if (data[dKey]?.[habit]) td.textContent = "x";
          row.appendChild(td);
        });
        table.appendChild(row);
      }
    }
  });
}

renderHistory();