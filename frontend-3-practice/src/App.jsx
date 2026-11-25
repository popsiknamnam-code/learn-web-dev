import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import TimeSlots from './components/TimeSlots';
import BottomBar from './components/BottomBar';
import { isDateSelectable, buildCalendarGrid } from './data/dateUtils';
import './styles.css';

const ALL_SLOTS = ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];

// Выносим вашу страницу в отдельный компонент
function BookingPage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    const grid = buildCalendarGrid(currentYear, currentMonth);
    const days = grid.flat().filter(d => d !== null);
    
    const currentIsValid = 
      selectedDay && 
      days.includes(selectedDay) && 
      isDateSelectable(selectedDay, currentMonth, currentYear, today);

    if (!currentIsValid) {
      const firstAvailable = days.find(d => isDateSelectable(d, currentMonth, currentYear, today));
      setSelectedDay(firstAvailable || 1);
      setSelectedTime(null);
    }
  }, [currentMonth, currentYear]);

  const handleDayClick = (day) => {
    if (day === selectedDay) return;
    setSelectedDay(day);
    setSelectedTime(null);
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  return (
    <>
      <header className="header">
        <div className="container header__container">
          <a href="#" className="logo">BARBER<span>SHOP</span></a>
          <nav className="nav">
            {/* Заменили <a> на <Link> для будущей навигации, если понадобится */}
            <a href="#" className="nav__link">Услуги</a>
            <a href="#" className="nav__link">Мастера</a>
            <a href="#" className="nav__link">Контакты</a>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="container">
          <h1 className="page-title">Выберите дату и время</h1>

          <div className="booking-layout">
            <section className="calendar">
              <CalendarHeader month={currentMonth} year={currentYear} onPrev={handlePrevMonth} onNext={handleNextMonth} />
              <CalendarGrid year={currentYear} month={currentMonth} selectedDay={selectedDay} onDayClick={handleDayClick} />
            </section>

            <section className="time-slots">
              <h2 className="time-slots__title">Свободное время</h2>
              <TimeSlots slots={ALL_SLOTS} selectedTime={selectedTime} onTimeClick={handleTimeClick} />
            </section>
          </div>
        </div>
      </main>

      <BottomBar year={currentYear} month={currentMonth} day={selectedDay} time={selectedTime} />
    </>
  );
}

// Главный компонент App теперь отвечает только за роутинг
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BookingPage />} />
    </Routes>
  );
}