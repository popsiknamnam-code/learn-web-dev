export async function fetchToday() {
  const res = await fetch('/api/booking/today');
  if (!res.ok) throw new Error('Не удалось загрузить текущую дату');
  return res.json();
}

export async function fetchSlots(date) {
  const { day, month, year } = date;
  const res = await fetch(`/api/slots?day=${day}&month=${month}&year=${year}`);
  if (!res.ok) throw new Error('Не удалось загрузить слоты');
  return res.json();
}