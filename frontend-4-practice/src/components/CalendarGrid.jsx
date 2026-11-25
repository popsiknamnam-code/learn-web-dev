import { buildCalendarGrid, isDateSelectable } from '../data/dateUtils';

export default function CalendarGrid({ year, month, selectedDay, onDayClick, today }) {
  // Если сервер еще не прислал дату today (или она не передана), показываем пустоту
  if (!today) return null; 

  const todayDate = new Date(today.year, today.month, today.day);
  const grid = buildCalendarGrid(year, month);
  const weekDays = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];

  return (
    <div>
      <div className="calendar__weekdays">
        {weekDays.map(d => <span key={d}>{d}</span>)}
      </div>
      <div className="calendar__grid">
        {grid.map((week, weekIdx) => (
          <div key={weekIdx} className="calendar__week" style={{ display: 'contents' }}>
            {week.map((day, dayIdx) => {
              if (day === null) {
                return <span key={`empty-${weekIdx}-${dayIdx}`} className="calendar__day calendar__day--empty"></span>;
              }

              // Теперь используем todayDate (дату с сервера)
              const selectable = isDateSelectable(day, month, year, todayDate);
              const isSelected = day === selectedDay;
              
              let cls = 'calendar__day';
              if (!selectable) cls += ' calendar__day--disabled';
              if (isSelected) cls += ' calendar__day--selected';

              return (
                <button
                  key={`day-${day}`}
                  className={cls}
                  disabled={!selectable}
                  onClick={() => onDayClick(day)}
                >
                  {day}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}