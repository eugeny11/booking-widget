import React from 'react'
import './WeekControls.css'
import arrowLeft from '../images/arrow-left.png'
import arrowRight from '../images/arrow-right.png'

const WeekControls = ({ week, onPrev, onNext, initialWeekStart }) => {
  if (!week || week.length === 0) return null;

  const start = week[0].date;
  const end = week[week.length - 1].date;

  const isAtInitialWeek = start === initialWeekStart;

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