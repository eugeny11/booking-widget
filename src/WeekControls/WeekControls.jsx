import React from 'react'
import './WeekControls.css'
import arrowLeft from '../images/arrow-left.png'
import arrowRight from '../images/arrow-right.png'

const WeekControls = ({ week, onPrev, onNext, initialWeekStart }) => {
  if (!week || week.length === 0) return null;

  const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });
};

const startDateISO = week[0].date;
const isAtInitialWeek = startDateISO === initialWeekStart;

 const start = formatDate(startDateISO);
 const end = formatDate(week[week.length - 1].date);

  

  return (
    <div className="week__nav">
      <button onClick={onPrev} disabled={isAtInitialWeek} className={isAtInitialWeek ? 'disabled' : ''}>
        <img src={arrowLeft} alt="arrow-left" />
      </button>
      <span>{start} &mdash; {end}</span>
      <button onClick={onNext}>
        <img src={arrowRight} alt="arrow-right" />
      </button>
    </div>
  );
};

export default WeekControls