import { MONTHS_NOMINATIVE } from '../data/dateUtils';

export default function CalendarHeader({ month, year, onPrev, onNext }) {
  return (
    <div className="calendar__header">
      <button className="calendar__arrow" onClick={onPrev} aria-label="Предыдущий месяц">&#8249;</button>
      <h2 className="calendar__month">{MONTHS_NOMINATIVE[month]} {year}</h2>
      <button className="calendar__arrow" onClick={onNext} aria-label="Следующий месяц">&#8250;</button>
    </div>
  );
}