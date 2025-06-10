import React from 'react'
import './WeekControls.css'

const WeekControls = ({week, onPrev, onNext}) => {
    if (!week || week.length === 0) return null;

    const start = week[0].date;
    const end = week[week.length - 1].date;

    return(
        <div className="week__nav">
            <button onClick={onPrev}><img src='/images/arrow-left.png' alt="arrow-right" /></button>
            <span>{start} &mdash; {end}</span>
            <button onClick={onNext}><img src='/images/arrow-right.png' alt="arrow-right" /></button>
        </div>
    )
}

export default WeekControls