import { DAYS_OF_WEEK, MONTHS_GENITIVE } from '../data/dateUtils';

export default function BottomBar({ year, month, day, time }) {
  const date = new Date(year, month, day);
  const weekdayIdx = (date.getDay() + 6) % 7; // 0 = Пн, 6 = Вс

  const dateStr = `${DAYS_OF_WEEK[weekdayIdx]}, ${day} ${MONTHS_GENITIVE[month]} ${year}`;

  return (
    <footer className="bottom-bar">
      <div className="container bottom-bar__container">
        <div className="bottom-bar__info">
          <p className="bottom-bar__date">{dateStr}</p>
          <p className="bottom-bar__time">
            {time ? `Время: ${time}` : 'Выберите время'}
          </p>
        </div>
        <button className="btn-submit">Далее</button>
      </div>
    </footer>
  );
}