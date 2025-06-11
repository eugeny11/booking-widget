import React, { useState } from "react";
import './CalendarTable.css'
import { fetchPrice } from "../utils/fetchPrice";
import exclamation from '../images/exclamation.png'

const CalendarTable = ({week, selectedSlots, setSelectedSlots, getTimeEnd}) => {

    const timeSlots = week[0].slots.map(slot => slot.time);

    const [priceInfo, setPriceInfo] = useState(null);

    const isSelected = (date, time) => {
        return selectedSlots.some(slot => slot.date === date && slot.time === time)
    }

    const isWeekend = (day) => ['сб', 'вс', 'Sat', 'Sun'].includes(day.toLowerCase());
    
    const canAddSlot = (newSlot, currentSlots) => {
        if (currentSlots.length === 0) return true;

        const sameDate = currentSlots[0].date === newSlot.date;
        if (!sameDate) return false;

        const times = currentSlots.map(s => s.slotIndex).sort((a,b) => a - b);
        const minIndex = times[0];
        const maxIndex = times[times.length - 1];
        return newSlot.slotIndex === minIndex - 1 || newSlot.slotIndex === maxIndex + 1;
    }

    const isMiddleSlot = (slot, slots) => {
        const sameDaySlots = slots.filter(s => s.date === slot.date)
        if (sameDaySlots.length < 3) return false;

        const indices = sameDaySlots.map(s => s.slotIndex).sort((a, b) => a - b);
        const min = indices[0];
        const max = indices[indices.length - 1];

        return slot.slotIndex > min && slot.slotIndex < max;
    }

    const addOneHour = (time) => {
    const [hour, minute] = time.split(':').map(Number);
    const newHour = (hour + 1) % 24;
    return `${newHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    };

    const handleSlotClick = async (dayIndex, slotIndex) => {
        const clickedSlot = week[dayIndex].slots[slotIndex];

        if (clickedSlot.status !== 'free') return;

        const slot = {
            date: week[dayIndex].date,
            time: clickedSlot.time,
            price: clickedSlot.price,
            dayIndex,
            slotIndex
        }

        const alreadySelected = isSelected(slot.date, slot.time);

        let newSelectedSlots;
       if (alreadySelected) {
          
            if (isMiddleSlot(slot, selectedSlots)) {
                newSelectedSlots = [];
            } else {
                // иначе просто снимаем его (если это крайний)
                newSelectedSlots = selectedSlots.filter(
                    s => !(s.date === slot.date && s.time === slot.time)
                );
            }
        }else if(canAddSlot(slot, selectedSlots)){
            newSelectedSlots = [...selectedSlots, slot]
        } else {
            newSelectedSlots = [slot]
        }

        setSelectedSlots(newSelectedSlots)

        if(!alreadySelected){
            const response = fetchPrice(slot.date, slot.time);
            setPriceInfo(response.price)
        } else {
            if (newSelectedSlots.length === 0){
                setPriceInfo(null)
            }
        }

        

    }

    return (
        <div className="calendar__wrapper">
            <div className="calendar__header">
                <div className="calendar-cell empty"></div>
                {week.map(day => (
                   <div key={day.date} className={`calendar-cell day-header ${isWeekend(day.day) ? 'weekend' : ''}`}>
                        <div className="day-header--day">{day.day}</div>
                        <div className="day-header--date">{day.date.slice(8)}</div>
                    </div>
                ))}
            </div>
            <div className="calendar__body">
                {timeSlots.map((time, rowIndex) => (
                    <div key={time} className="calendar-row">
                        <div className="calendar-cell time-table">{time}</div>
                        {week.map((day, colIndex) => {
                            const slot = day.slots[rowIndex];
                            const isSelectedSlot = isSelected(day.date, slot.time);
                            const timeEnd = timeSlots[rowIndex + 1] || addOneHour(time);

                            return (
                                <div
                                key={`${day.date}-${slot.time}`}
                                className={`calendar-cell slot ${slot.status} ${
                                    isSelectedSlot ? "selected" : ""
                                }`}
                                onClick={() => handleSlotClick(colIndex, rowIndex)}
                                >
                                {(isSelectedSlot || slot.status === 'occupied') && timeEnd
                                    ? `${slot.time} ${timeEnd}`
                                    : `${slot.price} ₽`}
                                </div>
                            );
                        })}

                    </div>
                ))}             
            </div>
            <div className="calendar__note">
                <img src={exclamation} alt="exclamation" />
                <span>При бронировании от 3х часов (с 9 до 20) скидка на аренду студии 20%</span>
            </div>
        </div>
    )
}

export default CalendarTable