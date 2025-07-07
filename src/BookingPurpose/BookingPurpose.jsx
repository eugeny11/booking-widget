import React from "react";
import "./BookingPurpose.css"

 const goals = [
    { id: "photo", label: "фотосъёмка",  },
    { id: "video", label: "видеосъёмка",  },
    { id: "event", label: "мероприятие",  }
  ];

const BookingPurpose = ({selectedGoal, setSelectedGoal, guestCount, setGuestCount}) => {

    const decrement = () => {
        if (guestCount > 1) setGuestCount(guestCount - 1);
    }

    const increment = () => {
        setGuestCount(guestCount + 1)
    }

    return(
        <div className="purpose__wrapper">
            <div className="purpose__block">
            <div className="goal__selector">
                <label>Цель:</label>
                <div className="goal__options">
                    {goals.map(goal => (
                        <button
                        key={goal.id}
                        className={`goal-btn goal-btn--purpose ${goal.id === selectedGoal.id ? "active" : ""}`}
                        onClick={() => setSelectedGoal({id: goal.id, label:goal.label})}
                        >
                            <span>{goal.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <div className="goal__line"></div>
            <div className="guest__count">
                <label>Количество человек:</label>
                <div className="counter">
                    <button onClick={decrement}>&#x2212;</button>
                    <span>{guestCount}</span>
                    <button onClick={increment}>+</button>
                </div>
            </div>        
        </div>
        </div>
        
    )
}

export default BookingPurpose