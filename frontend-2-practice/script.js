const MONTHS_NOMINATIVE = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
const MONTHS_GENITIVE = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const DAYS_OF_WEEK = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];
const ALL_SLOTS = ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
const state = {
  currentYear: 2026,
  currentMonth: 9,    
  selectedDay: 15,
  selectedTime: '12:00',
};
function compareDates(a, b) {
  return new Date(a.getFullYear(), a.getMonth(), a.getDate()) - new Date(b.getFullYear(), b.getMonth(), b.getDate());
}

function isDateSelectable(day, month, year, today) {
  const d = new Date(year, month, day);
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return compareDates(d, t) >= 0;
}

function buildCalendarGrid(year, month) {
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (first.getDay() + 6) % 7; // Сдвиг для начала с Пн

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
function renderCalendar() {
  const today = new Date();
  const grid = buildCalendarGrid(state.currentYear, state.currentMonth);

  document.querySelector('.calendar__month').textContent = `${MONTHS_NOMINATIVE[state.currentMonth]} ${state.currentYear}`;

  document.querySelector('.calendar__weekdays').innerHTML = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map(d => `<span>${d}</span>`).join('');

  const html = grid.map(week => `
    <div class="calendar__week" style="display: contents;">
      ${week.map(day => {
        if (day === null) return `<span class="calendar__day calendar__day--empty"></span>`;

        const selectable = isDateSelectable(day, state.currentMonth, state.currentYear, today);
        const isSelected = day === state.selectedDay;
        
        let cls = 'calendar__day';
        if (!selectable) cls += ' calendar__day--disabled';
        if (isSelected) cls += ' calendar__day--selected';

        return `<button class="${cls}" data-day="${day}" ${!selectable ? 'disabled' : ''}>${day}</button>`;
      }).join('')}
    </div>
  `).join('');

  const gridEl = document.querySelector('.calendar__grid');
  gridEl.innerHTML = html;

  // Вешаем обработчики заново
  gridEl.querySelectorAll('.calendar__day[data-day]').forEach(btn => {
    if (btn.classList.contains('calendar__day--disabled')) return;
    btn.addEventListener('click', onDayClick);
  });
}

function renderTimeSlots() {
  const el = document.querySelector('.time-slots__grid');
  
  const html = ALL_SLOTS.map(t => {
    const isBusy = t === '15:00'; // 15:00 всегда занято для примера
    const isSelected = t === state.selectedTime;

    let cls = 'slot';
    if (isBusy) cls += ' slot--busy';
    if (isSelected) cls += ' slot--selected';

    return `<button class="${cls}" data-time="${t}" ${isBusy ? 'disabled' : ''}>${t}</button>`;
  }).join('');

  el.innerHTML = html;

  el.querySelectorAll('.slot:not(.slot--busy)').forEach(btn => {
    btn.addEventListener('click', onTimeSlotClick);
  });
}

function updateBottomBar() {
  const date = new Date(state.currentYear, state.currentMonth, state.selectedDay);
  const weekdayIdx = (date.getDay() + 6) % 7;

  const dateStr = `${DAYS_OF_WEEK[weekdayIdx]}, ${state.selectedDay} ${MONTHS_GENITIVE[state.currentMonth]} ${state.currentYear}`;
  
  document.querySelector('.bottom-bar__date').textContent = dateStr;
  document.querySelector('.bottom-bar__time').textContent = state.selectedTime ? `Время: ${state.selectedTime}` : 'Выберите время';
}
function onDayClick(event) {
  const day = Number(event.currentTarget.dataset.day);
  if (day === state.selectedDay) return;

  state.selectedDay = day;
  state.selectedTime = null; // Сброс времени!

  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
}

function onTimeSlotClick(event) {
  state.selectedTime = event.currentTarget.dataset.time;
  renderTimeSlots();
  updateBottomBar();
}

function setupMonthNavigation() {
  document.querySelector('[data-action="prev"]').addEventListener('click', () => {
    state.currentMonth--;
    if (state.currentMonth < 0) { state.currentMonth = 11; state.currentYear--; }
    ensureValidSelection();
    renderCalendar(); renderTimeSlots(); updateBottomBar();
  });

  document.querySelector('[data-action="next"]').addEventListener('click', () => {
    state.currentMonth++;
    if (state.currentMonth > 11) { state.currentMonth = 0; state.currentYear++; }
    ensureValidSelection();
    renderCalendar(); renderTimeSlots(); updateBottomBar();
  });
}

function ensureValidSelection() {
  const today = new Date();
  const grid = buildCalendarGrid(state.currentYear, state.currentMonth);
  const days = grid.flat().filter(d => d !== null);
  
  const firstAvailable = days.find(d => isDateSelectable(d, state.currentMonth, state.currentYear, today));
  const currentIsValid = state.selectedDay && days.includes(state.selectedDay) && isDateSelectable(state.selectedDay, state.currentMonth, state.currentYear, today);

  if (!currentIsValid) {
    state.selectedDay = firstAvailable || 1;
    state.selectedTime = null;
  }
}
function init() {
  const today = new Date();
  state.currentYear = today.getFullYear();
  state.currentMonth = today.getMonth();
  state.selectedDay = today.getDate();
  state.selectedTime = null;

  ensureValidSelection();
  renderCalendar();
  renderTimeSlots();
  updateBottomBar();
  setupMonthNavigation();
}

document.addEventListener('DOMContentLoaded', init);