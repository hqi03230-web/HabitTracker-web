const habits = ["tennis", "メリオール", "小田急使用", "英語学習", "コナ散歩"];

function loadData() {
  return JSON.parse(localStorage.getItem("habitData") || "{}");
}

function buildTable() {
  const data = loadData();
  const allDates = Object.values(data).flat();
  if (allDates.length === 0) {
    document.getElementById("history").textContent = "記録はまだありません。";
    return;
  }

  const months = {};
  allDates.forEach(d => {
    const date = new Date(d);
    const ym = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
    if (!months[ym]) months[ym] = [];
    months[ym].push(d);
  });

  let html = "";
  for (const ym of Object.keys(months)) {
    const [year, month] = ym.split("-");
    const y = parseInt(year);
    const m = parseInt(month);
    const daysInMonth = new Date(y, m, 0).getDate();
    const dates = [...Array(daysInMonth)].map((_, i) => {
      const d = new Date(y, m - 1, i + 1);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    });

    html += `<h2>${year}年${m}月</h2>`;
    html += `<div class="table-container"><table><thead><tr><th>習慣</th>`;
    html += dates.map(d => {
      const date = new Date(d);
      const day = ["日","月","火","水","木","金","土"][date.getDay()];
      const color = (day === "土") ? "blue" : (day === "日") ? "red" : "";
      return `<th style="color:${color}">${date.getDate()}<br>${day}</th>`;
    }).join("");
    html += `</tr></thead><tbody>`;
    habits.forEach(habit => {
      html += `<tr><td>${habit}</td>`;
      html += dates.map(d => data[habit]?.includes(d) ? `<td>x</td>` : `<td></td>`).join("");
      html += `</tr>`;
    });
    html += `</tbody></table></div>`;
  }
  document.getElementById("history").innerHTML = html;
}

buildTable();