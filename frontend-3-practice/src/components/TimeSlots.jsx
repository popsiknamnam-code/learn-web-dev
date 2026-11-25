export default function TimeSlots({ slots, selectedTime, onTimeClick }) {
  return (
    <div className="time-slots__grid">
      {slots.map((slot) => {
        const isSelected = slot === selectedTime;
        let cls = 'slot';
        if (isSelected) cls += ' slot--selected';

        return (
          <button
            key={slot}
            className={cls}
            onClick={() => onTimeClick(slot)}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
}