// HabitTracker v2 - history as tables, import = complete overwrite (with confirm)
// HabitTracker - vanilla JS, no React. Local-time based yyyy-mm-dd creation (no toISOString)
const HABITS = ['tennis','メリオール','小田急使用','英語学習','コナ散歩']; // order fixed
const STORAGE_KEY = 'habittracker_records_v2'; // bump version to avoid collision with older exports

function localYMD(date){
  // produce yyyy-mm-dd in local time (no toISOString)
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,'0');
  const d = String(date.getDate()).padStart(2,'0');
  return `${y}-${m}-${d}`;
}

function getMonday(d){
  const date = new Date(d);
  const day = date.getDay(); // 0 Sun - 6 Sat
  const diff = (day === 0 ? -6 : 1) - day; // shift so Monday is start
  date.setDate(date.getDate() + diff);
  return date;
}

function loadRecords(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  }catch(e){console.error(e); return {}; }
}

function saveRecords(recs){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recs));
}

function toggleHabit(dateYmd, habitIndex){
  const recs = loadRecords();
  const day = recs[dateYmd] || Array(HABITS.length).fill(false);
  day[habitIndex] = !day[habitIndex];
  recs[dateYmd] = day;
  saveRecords(recs);
  renderWeek(currentMonday);
}

function createWeekHeader(monday){
  const header = document.getElementById('week-header');
  header.innerHTML = '';
  for(let i=0;i<7;i++){
    const d = new Date(monday);
    d.setDate(monday.getDate()+i);
    const el = document.createElement('div');
    el.className = 'day ' + (i===5? 'sat':'') + (i===6? ' sun':'');
    el.textContent = `${d.getMonth()+1}/${d.getDate()}`;
    header.appendChild(el);
  }
}

function renderWeek(monday){
  currentMonday = new Date(monday);
  createWeekHeader(monday);
  const container = document.getElementById('buttons-column');
  container.innerHTML = '';

  // left column habit labels (visual buttons without text)
  const labels = document.createElement('div');
  labels.className = 'habit-labels';
  HABITS.forEach((name, idx) => {
    const btn = document.createElement('button');
    btn.title = name; // accessible label but visually empty
    btn.setAttribute('aria-label', name);
    btn.addEventListener('click', ()=>{
      const today = localYMD(new Date());
      toggleHabit(today, idx);
    });
    labels.appendChild(btn);
  });

  // grid of 5 rows x 7 columns
  const grid = document.createElement('div');
  grid.className = 'habit-grid';

  const recs = loadRecords();
  for(let h=0; h<HABITS.length; h++){
    for(let i=0;i<7;i++){
      const d = new Date(monday);
      d.setDate(monday.getDate()+i);
      const ymd = localYMD(d);
      const cell = document.createElement('div');
      cell.className = 'habit-cell' + (localYMD(new Date())===ymd ? ' today':'');
      cell.dataset.ymd = ymd;
      cell.dataset.habit = String(h);
      const mark = document.createElement('div');
      mark.className = 'mark';
      const dayRec = recs[ymd] || Array(HABITS.length).fill(false);
      if(dayRec[h]){ mark.textContent = 'x'; cell.classList.add('checked'); }
      else{ mark.textContent = ''; }
      cell.appendChild(mark);

      cell.addEventListener('pointerdown', (e)=>{
        toggleHabit(ymd, h);
      });

      grid.appendChild(cell);
    }
  }

  container.appendChild(labels);
  container.appendChild(grid);
}

// Build history as a table per month
function buildHistory(){
  const recs = loadRecords();
  // gather months from records; if none, include current month
  const monthsSet = new Set();
  Object.keys(recs).forEach(ymd=> monthsSet.add(ymd.slice(0,7)));
  if(monthsSet.size===0){
    const n = new Date();
    monthsSet.add(`${n.getFullYear()}-${String(n.getMonth()+1).padStart(2,'0')}`);
  }
  const months = Array.from(monthsSet).sort((a,b)=>b.localeCompare(a)); // recent first

  const container = document.getElementById('history-container');
  container.innerHTML = '';

  months.forEach(m => {
    const [yy,mm] = m.split('-');
    const year = Number(yy), month = Number(mm)-1;
    const first = new Date(year, month, 1);
    const next = new Date(year, month+1, 1);
    const days = (next - first) / (1000*60*60*24);

    // wrapper
    const wrap = document.createElement('div');
    wrap.className = 'month-column';

    const title = document.createElement('h3');
    title.textContent = `${year}年 ${Number(mm)}月`;
    wrap.appendChild(title);

    // create responsive table
    const tableWrap = document.createElement('div');
    tableWrap.className = 'table-wrap';
    const table = document.createElement('table');
    table.className = 'history-table';

    // header row: empty cell then day numbers
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    const thEmpty = document.createElement('th');
    thEmpty.textContent = '習慣 \\ 日';
    headRow.appendChild(thEmpty);
    for(let d=1; d<=days; d++){
      const th = document.createElement('th');
      th.textContent = d;
      if(new Date(year, month, d).getDay()===0 || new Date(year, month, d).getDay()===6) th.classList.add('weekend');
      headRow.appendChild(th);
    }
    thead.appendChild(headRow);
    table.appendChild(thead);

    // body rows: one per habit
    const tbody = document.createElement('tbody');
    HABITS.forEach((hname, hi)=>{
      const tr = document.createElement('tr');
      const tdName = document.createElement('td');
      tdName.textContent = hname;
      tdName.className = 'habit-name-cell';
      tr.appendChild(tdName);
      for(let d=1; d<=days; d++){
        const ymd = `${yy}-${String(mm).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const td = document.createElement('td');
        const dayRec = recs[ymd] || Array(HABITS.length).fill(false);
        td.textContent = dayRec[hi] ? 'x' : '';
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    wrap.appendChild(tableWrap);
    container.appendChild(wrap);
  });
}

// Export JSON (includes HABITS and exportedAt)
function exportJSON(){
  const recs = loadRecords();
  const data = { exportedAt: localYMD(new Date()), records: recs, habits: HABITS };
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'habittracker_export_v2.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Import JSON: COMPLETE OVERWRITE after confirmation
function importJSONFile(file){
  const reader = new FileReader();
  reader.onload = ()=>{
    try{
      const parsed = JSON.parse(reader.result);
      if(parsed.records){
        if(confirm('現在の記録をすべて上書きします。よろしいですか？')){
          // overwrite completely
          localStorage.removeItem(STORAGE_KEY);
          saveRecords(parsed.records);
          alert('インポート完了（完全上書き）');
          renderWeek(currentMonday);
        } else {
          alert('インポートをキャンセルしました。');
        }
      }else{
        alert('不正なファイルです');
      }
    }catch(e){ alert('読み込みに失敗しました'); }
  };
  reader.readAsText(file);
}

// UI wiring
let currentMonday = getMonday(new Date());
document.addEventListener('DOMContentLoaded', ()=>{
  renderWeek(currentMonday);

  document.getElementById('toggle-history').addEventListener('click', ()=>{
    document.getElementById('week-view').classList.toggle('hidden');
    document.getElementById('history-view').classList.toggle('hidden');
    if(!document.getElementById('history-view').classList.contains('hidden')){
      buildHistory();
    }
  });

  document.getElementById('back-week').addEventListener('click', ()=>{
    document.getElementById('week-view').classList.remove('hidden');
    document.getElementById('history-view').classList.add('hidden');
  });

  document.getElementById('export-btn').addEventListener('click', exportJSON);
  document.getElementById('import-btn').addEventListener('click', ()=> document.getElementById('import-file').click());
  document.getElementById('import-file').addEventListener('change', (e)=>{
    const f = e.target.files[0];
    if(f) importJSONFile(f);
  });

  window.addEventListener('keydown', e=>{
    if(e.key===' '){
      e.preventDefault();
      toggleHabit(localYMD(new Date()), 0);
    }
  });
});
