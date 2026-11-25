import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import TimeSlots from './components/TimeSlots';
import BottomBar from './components/BottomBar';
import { fetchToday, fetchSlots } from './api';
import './styles.css';

function BookingPage() {
  const [today, setToday] = useState(null);
  const [isTodayLoading, setIsTodayLoading] = useState(true);
  const [todayError, setTodayError] = useState(null);

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  const [slots, setSlots] = useState([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [slotsError, setSlotsError] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  // 1. Загружаем "сегодня"
  useEffect(() => {
    fetchToday()
      .then((data) => {
        setToday(data);
        setCurrentYear(data.year);
        setCurrentMonth(data.month);
        setSelectedDay(data.day);
      })
      .catch((err) => setTodayError(err.message))
      .finally(() => setIsTodayLoading(false));
  }, []);

  // 2. Загружаем слоты
  useEffect(() => {
    if (isTodayLoading || todayError) return;

    setIsSlotsLoading(true);
    setSlotsError(null);
    const date = { day: selectedDay, month: currentMonth, year: currentYear };

    fetchSlots(date)
      .then((data) => {
        setSlots(data.slots);
      })
      .catch((err) => setSlotsError(err.message))
      .finally(() => setIsSlotsLoading(false));
  }, [selectedDay, currentMonth, currentYear, isTodayLoading, todayError]);

  const handleDayClick = (day) => {
    if (day === selectedDay) return;
    setSelectedDay(day);
    setSelectedTime(null);
  };

  const handleTimeClick = (time) => setSelectedTime(time);

  const handlePrevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else { setCurrentMonth(m => m - 1); }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else { setCurrentMonth(m => m + 1); }
  };

  if (isTodayLoading) return <div style={{ padding: '40px', fontSize: '24px' }}>Загрузка...</div>;
  if (todayError) return <div style={{ padding: '40px', fontSize: '24px', color: 'red' }}>Ошибка: {todayError}</div>;

  return (
    <>
      <header className="header">
        <div className="container header__container">
          <a href="#" className="logo">BARBER<span>SHOP</span></a>
          <nav className="nav">
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
              <CalendarGrid year={currentYear} month={currentMonth} selectedDay={selectedDay} onDayClick={handleDayClick} today={today} />
            </section>
            <section className="time-slots">
              <h2 className="time-slots__title">Свободное время</h2>
              {slotsError ? (
                <div style={{ color: 'red' }}>Ошибка: {slotsError}</div>
              ) : (
                <TimeSlots slots={slots} selectedTime={selectedTime} onTimeClick={handleTimeClick} isLoading={isSlotsLoading} />
              )}
            </section>
          </div>
        </div>
      </main>
      <BottomBar year={currentYear} month={currentMonth} day={selectedDay} time={selectedTime} />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<BookingPage />} />
    </Routes>
  );
}