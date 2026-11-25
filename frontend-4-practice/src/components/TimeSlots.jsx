export default function TimeSlots({ slots, selectedTime, onTimeClick, isLoading }) {
  if (isLoading) {
    return <div className="time-slots__loading" style={{ padding: '20px', color: '#888' }}>Загрузка слотов...</div>;
  }
  if (!slots || slots.length === 0) {
    return <div className="time-slots__empty" style={{ padding: '20px', color: '#888' }}>Нет доступных слотов</div>;
  }

  return (
    <div className="time-slots__grid">
      {slots.map((slot) => {
        const isSelected = slot.time === selectedTime;
        let cls = 'slot';
        if (isSelected) cls += ' slot--selected';
        if (!slot.available) cls += ' slot--busy';

        return (
          <button key={slot.time} className={cls} disabled={!slot.available} onClick={() => onTimeClick(slot.time)}>
            {slot.time}
          </button>
        );
      })}
    </div>
  );
}