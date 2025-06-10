import { fetchWeek } from './utils/fetchWeek';
import { halls } from './HallSlider/hallsData';
import HallSlider from './HallSlider/HallSlider';
import './App.css';
import CalendarTable from './CalendarTable/CalendarTable';
import { useEffect, useState } from 'react';
import WeekControls from './WeekControls/WeekControls';
import BookingPurpose from './BookingPurpose/BookingPurpose';
import ExtraServices from './ExtraServices/ExtraServices';
import OrderSummary from './OrderSummary/OrderSummary';
import OrderForm from './OrderForm/OrderForm';

function App() {

  const [weekData, setWeekData] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState('2025-04-21')

  useEffect(() => {
    fetchWeek(currentDate).then(data => {
      setWeekData(data)
    })
  })

  const shiftWeek = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate.toISOString().split("T")[0]);
  }

  const [selectedHall, setSelectedHall] = useState(halls[1]);

  const [selectedGoal, setSelectedGoal] = useState("фотосъёмка");
  const [guestCount, setGuestCount] = useState(8)

  const [selectedServices, setSelectedServices] = useState([])

  const getTimeEnd = (timeStart) => {
     if (!timeStart || typeof timeStart !== "string") return "--:--";
    const [hours, minutes] = timeStart.split(":").map(Number);
    const endHours = hours + 1;
    return `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };

  const slotPrice = 1600;
  const isDiscount = selectedSlots.length >= 3;
   const baseTotal = selectedSlots?.length * slotPrice;

   const extrasTotal = selectedServices?.reduce((sum,service) => sum + service.price, 0);


   const peopleSurcharge = guestCount > 7 ? 500 : 0;

   const total = baseTotal + extrasTotal + peopleSurcharge;

   const handleBooking = (formData) => {
    const orderPayload = {
      user: formData,
      slots: selectedSlots,
      hall: selectedHall,
      services: selectedServices,
      goal: selectedGoal,
      guests: guestCount,
      total: total,
      prepay: formData.prepayType
    }

    console.log('Заказ отправлен: ', orderPayload)
   }


  return (
    <div className='App'>
      <div className='container'>
                <h1>Бронирование зала</h1>
              <HallSlider 
              halls={halls}
              selectedHall={selectedHall}
              onSelect={setSelectedHall}
              />
              <WeekControls 
              week={weekData}
              onPrev={() => shiftWeek(-7)}
              onNext={() => shiftWeek(7)}
              />
              {weekData.length > 0 ? (
                <CalendarTable week={weekData} 
                selectedSlots={selectedSlots}
                setSelectedSlots={setSelectedSlots}
                getTimeEnd={getTimeEnd}
                />
              ) : (
          <div>Загрузка календаря...</div>
            )}
            <BookingPurpose 
              selectedGoal={selectedGoal}
              setSelectedGoal={setSelectedGoal}
              guestCount={guestCount}
              setGuestCount={setGuestCount}
              />
              <ExtraServices 
              selectedServices={selectedServices}
              setSelectedServices={setSelectedServices}
              />
              <OrderSummary 
              hall={selectedHall}
              selectedSlots={selectedSlots}
              selectedServices={selectedServices}
              guestCount={guestCount}
              getTimeEnd={getTimeEnd}
              baseTotal={baseTotal}
              isDiscount={isDiscount}
              total={total}
              />
              <OrderForm
              total={total}
              onSubmit={handleBooking}
              />
      </div>
     
    </div>
    );
  }

export default App;
