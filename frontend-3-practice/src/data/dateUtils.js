export const MONTHS_NOMINATIVE = ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'];
export const MONTHS_GENITIVE = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
export const DAYS_OF_WEEK = ['Понедельник','Вторник','Среда','Четверг','Пятница','Суббота','Воскресенье'];

export function compareDates(a, b) {
  return new Date(a.getFullYear(), a.getMonth(), a.getDate()) - new Date(b.getFullYear(), b.getMonth(), b.getDate());
}

export function isDateSelectable(day, month, year, today) {
  const d = new Date(year, month, day);
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return compareDates(d, t) >= 0;
}

export function buildCalendarGrid(year, month) {
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