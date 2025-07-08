import React, { useState } from "react";
import './CalendarTable.css'
import { fetchPrice } from "../utils/fetchPrice";
import exclamation from '../images/exclamation.png'

const CalendarTable = ({week, selectedSlots, setSelectedSlots, getTimeEnd}) => {

    const timeSlots = week[0].slots.map(slot => slot.time);

    const [priceInfo, setPriceInfo] = useState(null);
    const [hoveredSlot, setHoveredSlot] = useState(null);

    const renderTimeWithSup = (time) => {
  const [hours, minutes] = time.split(':');
  return (
    <>
      {hours}<sup className="time-sup">{minutes}</sup>
    </>
  );
};

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
    slotIndex,
  };

  const alreadySelected = isSelected(slot.date, slot.time);

  let newSelectedSlots;
  if (alreadySelected) {
    if (isMiddleSlot(slot, selectedSlots)) {
      newSelectedSlots = [];
    } else {
      newSelectedSlots = selectedSlots.filter(
        (s) => !(s.date === slot.date && s.time === slot.time)
      );
    }
  } else if (canAddSlot(slot, selectedSlots)) {
    newSelectedSlots = [...selectedSlots, slot];
  } else {
    newSelectedSlots = [slot];
  }

  console.log("➡️ Слоты после клика:", newSelectedSlots);

  setSelectedSlots(newSelectedSlots);

  if (!alreadySelected) {
    try {
      const response = await fetchPrice(slot.date, slot.time);
      console.log("💰 Цена с сервера:", response.price);
      setPriceInfo(response.price);
    } catch (error) {
      console.error("🚨 Ошибка загрузки цены:", error);
      setPriceInfo(null);
    }
  } else {
    if (newSelectedSlots.length === 0) {
      console.log("ℹ️ Все слоты сняты, очищаю цену");
      setPriceInfo(null);
    }
    setHoveredSlot(null);
  }
};


   return (
    <div className="calendar__wrapper">
      <div className="calendar__grid">
        <div className="calendar__header">
          <div className="empty"></div>
          {week.map(day => (
            <div
              key={day.date}
              className={`calendar-cell day-header ${isWeekend(day.day) ? 'weekend' : ''}`}>
              <div className="day-header--day">{day.day}</div>
              <div className="day-header--date">{+day.date.slice(8)}</div>
            </div>
          ))}
        </div>

        <div className="calendar__main">
          <div className="calendar__times">
              {timeSlots.map(time => (
                <div key={time} className="calendar-cell time-table">
                  <span className="desktop-time">{time}</span>
                  <span className="mobile-time">{renderTimeWithSup(time)}</span>
                </div>
              ))}
          </div>

          <div className="calendar__body">
            {timeSlots.map((time, rowIndex) => (
              <div key={time} className="calendar-row">
                {week.map((day, colIndex) => {
                  const slot = day.slots[rowIndex];
                  const isSelectedSlot = isSelected(day.date, slot.time);
                  const timeEnd = timeSlots[rowIndex + 1] || addOneHour(time);

                  return (
                    <div
                      key={`${day.date}-${slot.time}`}
                      className={`calendar-cell slot ${isSelectedSlot ? "selected" : slot.status}`}
                      onClick={() => handleSlotClick(colIndex, rowIndex)}
                      onMouseEnter={() => setHoveredSlot({ colIndex, rowIndex })}
                      onMouseLeave={() => setHoveredSlot(null)}
                    >
                          {isSelectedSlot
                            ? (
                              <>
                                <span className="desktop-time">
                                  {slot.time} - {timeEnd}
                                </span>
                                <span className="mobile-time">
                                  {renderTimeWithSup(slot.time)} - {renderTimeWithSup(timeEnd)}
                                </span>
                              </>
                            )
                            : (hoveredSlot &&
                                hoveredSlot.colIndex === colIndex &&
                                hoveredSlot.rowIndex === rowIndex)
                              ? (
                                <>
                                  <span className="desktop-time">
                                    {slot.time} - {timeEnd}
                                  </span>
                                  <span className="mobile-time">
                                    {renderTimeWithSup(slot.time)} - {renderTimeWithSup(timeEnd)}
                                  </span>
                                </>
                              )
                              : `${slot.price} ₽`
                          }
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="calendar__note">
        <img src={exclamation} alt="exclamation" />
        <span>При бронировании от 3х часов<span className="note-time"> (с 9 до 20)</span>, скидка на аренду студии 20%</span>
      </div>
    </div>
  );
}

export default CalendarTable