import { fetchWeek } from './utils/fetchWeek';
import { halls } from './HallSlider/hallsData';
import HallSlider from './HallSlider/HallSlider';
import './App.css';
import CalendarTable from './CalendarTable/CalendarTable';
import { useEffect, useState, useRef } from 'react';
import WeekControls from './WeekControls/WeekControls';
import BookingPurpose from './BookingPurpose/BookingPurpose';
import ExtraServices from './ExtraServices/ExtraServices';
import OrderSummary from './OrderSummary/OrderSummary';
import OrderForm from './OrderForm/OrderForm';

function App() {

  const [weekData, setWeekData] = useState([]);
  const [initialWeekStart, setInitialWeekStart] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [currentDate, setCurrentDate] = useState('2025-04-21')

  useEffect(() => {
  fetchWeek(currentDate).then((data) => {
    setWeekData(data);
    if (!initialWeekStart) {
      setInitialWeekStart(data[0].date);
    }
  });
}, [currentDate]);

useEffect(() => {
  document.body.classList.add('modal-open');
  return () => {
    document.body.classList.remove('modal-open');
  };
}, []);

const [selectedHall, setSelectedHall] = useState(halls[4]); // клики из слайдера

useEffect(() => {
  window.setSelectedHallFromWidget = (id) => {
    console.log('Пришёл hall с id', id);
    const hall = halls.find(h => h.id === id);
    if (hall) setSelectedHall(hall);
  };
  return () => (window.setSelectedHallFromWidget = null);
}, []);

  const shiftWeek = (days) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + days);
    setCurrentDate(newDate.toISOString().split("T")[0]);
  }

  const [selectedGoal, setSelectedGoal] = useState({
  id: "photo",
  label: "фотосъёмка",
});

  const [guestCount, setGuestCount] = useState(8)

  const [selectedServices, setSelectedServices] = useState([])

  const getTimeEnd = (timeStart) => {
     if (!timeStart || typeof timeStart !== "string") return "--:--";
    const [hours, minutes] = timeStart.split(":").map(Number);
    const endHours = hours + 1;
    return `${String(endHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };

  const slotPrice = 1600;
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
    <div className='modal-overlay hidden'
      onClick={(e) => {
      if (e.target.classList.contains("modal-overlay")) {
        document.querySelector(".modal-overlay").classList.add("hidden");
      }
    }}
    >
      <div className="modal-content">
        <button className="modal-close" 
       onClick={() => {
          document.querySelector(".modal-overlay").classList.add("hidden");
          window.startAuto?.();
        }}>×</button>
        <div className="modal-scroll-area">
          <div className='App'>
            <div className='container'>
                      <h1 className='section__title section__title--main'>Бронирование зала</h1>
                    <HallSlider 
                    halls={halls}
                    selectedHall={selectedHall}
                    onSelect={setSelectedHall}
                    />
                    <WeekControls 
                    week={weekData}
                    initialWeekStart={initialWeekStart}
                    onPrev={() => shiftWeek(-7)}
                    onNext={() => shiftWeek(7)}
                    />
                    {weekData.length > 0 ? (
                      <div key={weekData[0].date} className="calendar-transition">
                        <CalendarTable
                          week={weekData}
                          selectedSlots={selectedSlots}
                          setSelectedSlots={setSelectedSlots}
                          getTimeEnd={getTimeEnd}
                      />
                      </div>
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
                    goal={selectedGoal}
                    selectedSlots={selectedSlots}
                    selectedServices={selectedServices}
                    guestCount={guestCount}
                    getTimeEnd={getTimeEnd}
                    baseTotal={baseTotal}
                    total={total}
                    />
                    <OrderForm
                    total={total}
                    onSubmit={handleBooking}
                    />
            </div>
     
        </div>
        </div>
        
      </div>
    </div>
    
    );
  }

export default App;
