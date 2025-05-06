const calendarBody = document.getElementById('calendarBody');
const monthYear = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

let currentDate = new Date();

const events = {
  '2025-05-01': ['Codeforces Round'],
  '2025-05-03': ['Codeforces Round', 'AtCoder Beginner'],
  '2025-05-07': ['LeetCode Starters 185'],
  '2025-05-10': ['Biweekly Contest'],
  '2025-05-17': ['Panasonic Programming'],
  '2025-05-21': ['GfG Job-A-Thon'],
  '2025-05-24': ['AtCoder Beginner'],
};

function renderCalendar(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  monthYear.innerText = date.toLocaleString('default', { month: 'long', year: 'numeric' });

  calendarBody.innerHTML = '';

  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    calendarBody.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;

    const cell = document.createElement('div');
    cell.classList.add('day');
    cell.innerHTML = `<div class="date">${day}</div>`;

    if (events[dateStr]) {
      events[dateStr].forEach(event => {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.textContent = event;
        cell.appendChild(eventDiv);
      });
    }

    calendarBody.appendChild(cell);
  }
}

prevMonthBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
};

nextMonthBtn.onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
};

renderCalendar(currentDate);
