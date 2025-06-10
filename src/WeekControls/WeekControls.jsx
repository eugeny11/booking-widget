import React from 'react'
import './WeekControls.css'
import arrowLeft from '../images/arrow-left.png'
import arrowRight from '../images/arrow-right.png'

const WeekControls = ({week, onPrev, onNext}) => {
    if (!week || week.length === 0) return null;

    const start = week[0].date;
    const end = week[week.length - 1].date;

    return(
        <div className="week__nav">
            <button onClick={onPrev}><img src={arrowLeft} alt="arrow-right" /></button>
            <span>{start} &mdash; {end}</span>
            <button onClick={onNext}><img src={arrowRight} alt="arrow-right" /></button>
        </div>
    )
}

export default WeekControls