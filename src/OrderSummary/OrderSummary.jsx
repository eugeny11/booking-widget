import React from "react";
import './OrderSummary.css'

const OrderSummary = ({hall, selectedSlots, selectedServices, guestCount, getTimeEnd, baseTotal, total, goal}) => {

  const sortedSlots = [...selectedSlots].sort((a, b) => {
  if (a.date !== b.date) return a.date.localeCompare(b.date);
  return a.time.localeCompare(b.time);
});

const first = sortedSlots[0];
const last = sortedSlots[sortedSlots.length - 1];

const formatDate = (dateStr) => {
  const [year, month, day] = dateStr.split('-');
  return `${day}.${month}.${year}`;
};


   return(
    <div className="order__wrapper">
        
        <div className="order__summary">
            <div className="order__header">
                <h2 className="section__title">Детали заказа</h2>
            </div>
            
        <div className="order__flex">
            <div className="left">
                {hall && <img src={hall.image} alt={hall.name} />}
                <div className="left__aside">
                    {hall && <div className="order-hall-name">{hall.name}</div>}
                {selectedSlots.length > 0 ? (
                    
                    <div className="order-date-time">
                        <div>Дата: {formatDate(first.date)}</div>
                        <div>
                           Время: {first.time} – {getTimeEnd(last.time)}
                        </div>
                    </div>
                   
                ) : (
                    <div className="order-date-time">
                    <div>Дата: </div>
                    <div>Время: </div>
                    </div>
                    )}
                    <div className="order-guest">Человек: {guestCount}</div>
                </div>
                

                
            </div>
            <div className="right">
                <div><span className="goal-name">{goal.label}</span><span>{baseTotal} ₽</span></div>
                {selectedServices?.map(service => (
                    <div
                    key={service.id}
                    className="right-service"
                    >
                        <span> {service.title} </span>  
                        <span> {service.price} ₽ </span> 
                        
                        </div>
                ))}
                {guestCount > 7 && (
                    <div><span>Аренда, свыше 7 человек</span> <span>500 ₽</span></div>
                )}
                <div className="order-total">
                    <span>Общая сумма заказа</span>
                    <span className="order-total-number">
                        
                        {Number.isFinite(total) && total > 0 ? `${Math.round(total)} ₽` : "—"}
                        
                    </span>
</div>

            </div>
        </div>
        
        
    </div>
    </div>
    
   )
}

export default OrderSummary