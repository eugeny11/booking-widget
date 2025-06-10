import React from "react";
import './OrderSummary.css'

const OrderSummary = ({hall, selectedSlots, selectedServices, guestCount, getTimeEnd, baseTotal, isDiscount, total}) => {

  const sortedSlots = [...selectedSlots].sort((a, b) => {
  if (a.date !== b.date) return a.date.localeCompare(b.date);
  return a.time.localeCompare(b.time);
});

const first = sortedSlots[0];
const last = sortedSlots[sortedSlots.length - 1];


   return(
    <div className="order__wrapper">
        
        <div className="order__summary">
            <h2 className="section__title">Детали заказа</h2>
        <div className="order__flex">
            <div className="left">
                {hall && <img src={hall.image} alt={hall.name} />}
                <div className="left__aside">
                    {hall && <div className="order-hall-name">{hall.name}</div>}
                {selectedSlots.length > 0 ? (
                    
                    <div className="order-date-time">
                        <div>Дата: {first.date}</div>
                        <div>
                           Время: {first.time} – {getTimeEnd(last.time)}
                        </div>
                    </div>
                   
                ) : (
                    <div>
                    <div>Дата: </div>
                    <div>Время: </div>
                    </div>
                    )}
                    <div className="order-guest">Человек: {guestCount}</div>
                </div>
                

                
            </div>
            <div className="right">
                <div><span>Фотосъёмка</span><span>{baseTotal}</span></div>
                {selectedServices?.map(service => (
                    <div
                    key={service.id}
                    className="right-service"
                    >
                        <span>{service.title}  </span> x 
                        <span> {service.count} </span>
                        <span> {service.price} </span> 
                        
                        </div>
                ))}
                {guestCount > 7 && (
                    <div><span>Аренда, свыше 7 человек</span> <span>500 ₽</span></div>
                )}
                <div className="order-total">
  <span>Общая сумма заказа</span>
  <span>
    {isDiscount
      ? (
        <>
          <div>{Math.round(total)} ₽</div>
          <div style={{ fontSize: "0.9em", color: "#888" }}>
            Скидка 20%
          </div>
        </>
      )
      : (
        Number.isFinite(total) && total > 0 ? `${Math.round(total)} ₽` : "—"
      )
    }
  </span>
</div>

            </div>
        </div>
        
        
    </div>
    </div>
    
   )
}

export default OrderSummary