import React, { useRef, useState, useEffect } from "react";
import "./HallSlider.css";
import checkmark from '../images/checkmark_grey__new.png';

const HallSlider = ({ halls, selectedHall, onSelect }) => {
  const containerRef = useRef(null);
  const skipNextEffect = useRef(false);

  const [containerWidth, setContainerWidth] = useState(0);
  const [isReady, setIsReady] = useState(false);

// следим за размерами обёртки
useEffect(() => {
  const el = containerRef.current;
  if (!el) return;

  const ro = new ResizeObserver(([entry]) => {
    const width = entry.contentRect.width;
    if (width) {
      setContainerWidth(width);   
      setIsReady(true);           
    }
  });

  ro.observe(el);
  return () => ro.disconnect();
}, []);

  const useCardWidth = () => {
    const getWidth = () => (window.innerWidth <= 520 ? 200 : 195);
    const [cardWidth, setCardWidth] = useState(getWidth);
    useEffect(() => {
      const handleResize = () => setCardWidth(getWidth());
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);
    return cardWidth;
  };

  const CARD_WIDTH = useCardWidth() + 12;
 const [renderedHalls, setRenderedHalls] = useState(() => [
  ...halls, ...halls, ...halls
]);

const initialIndexInSingle = halls.findIndex(h => h.id === selectedHall?.id);
const [currentIndex, setCurrentIndex] = useState(() =>
  halls.length + (initialIndexInSingle !== -1 ? initialIndexInSingle : 0)
);

  const extendForward = () => {
   
    setRenderedHalls((prev) => [...prev, ...halls]);
  };

/*  const extendBackward = () => {
 
  setRenderedHalls(prev => [...halls, ...prev]);
};
 */
  const scrollToIndex = (index) => index * CARD_WIDTH;

  useEffect(() => {
  const realIndex = currentIndex % halls.length;
  onSelect(halls[realIndex]);
}, []);

 const handleClick = (index) => {

  if (index >= renderedHalls.length - 2) {
  
    extendForward();
  } else if (index <= 1) {
    
    return;
  }
  
  setCurrentIndex(index);

  const realIndex = index % halls.length;
  skipNextEffect.current = true;
  onSelect(halls[realIndex]);
};

/*   const goTo = (direction) => {
  let newIndex = currentIndex + direction;

  if (newIndex >= renderedHalls.length - 2) {
    // дошли до конца – подливаем справа
    extendForward();
    newIndex -= halls.length;       // «переносим» индекс назад
  } else if (newIndex < 0)  {
  
    // не даём уйти дальше влево — просто остаёмся на месте
    return;
  }

  newIndex = Math.max(0, newIndex);
  setCurrentIndex(newIndex);

  const realIndex = newIndex % halls.length;
  skipNextEffect.current = true;
  onSelect(halls[realIndex]);
}; */

  const touchStartX = useRef(null);
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleSwipe = (direction) => {
  let newIndex = currentIndex + direction;

  if (direction > 0) {
    if (newIndex >= renderedHalls.length - halls.length) {
      console.log("extendForward before right edge");
      extendForward();
      // НЕ переносим newIndex назад — даём подлиться и спокойно свайпнуть
    }
  }

  if (direction < 0) {
    if (newIndex < halls.length) {
      console.log("blocked at left edge");
      return;  // блокируем движение влево за край
    }
  }

  setCurrentIndex(newIndex);

  const realIndex = newIndex % halls.length;
  skipNextEffect.current = true;
  onSelect(halls[realIndex]);
};


const handleTouchEnd = (e) => {
  if (touchStartX.current === null) return;
  const deltaX = e.changedTouches[0].clientX - touchStartX.current;
  if (Math.abs(deltaX) > 50) {
    handleSwipe(deltaX > 0 ? -1 : 1);
  }
  touchStartX.current = null;
};


useEffect(() => {
  if (!selectedHall) return;

  if (skipNextEffect.current) {
  skipNextEffect.current = false;
  
  return;
}

  // все позиции нужного id в текущем renderedHalls
  const positions = [];
  renderedHalls.forEach((h, i) => {
    if (h.id === selectedHall.id) positions.push(i);
  });

  

  /* 1. карточки ещё нет – доращиваем вперёд и ждём нового рендера */
  if (!positions.length) {
    
    setRenderedHalls(prev => [...prev, ...halls]);
    
    return;
  }

  /* 2. выбираем ближайший индекс к текущему положению каретки */
  let nearest = positions.reduce((a, b) =>
    Math.abs(b - currentIndex) < Math.abs(a - currentIndex) ? b : a
  , positions[0]);
  
  if (nearest < halls.length) {
   
    //  одна вставка слева + сдвиг индекса на ту же длину
    setRenderedHalls(prev => [...halls, ...prev]);
    nearest += halls.length;
  }


  /* 4. если слишком близко к правому краю – добавляем партию справа */
  if (nearest > renderedHalls.length - halls.length - 1) {
 
    setRenderedHalls(prev => [...prev, ...halls]);
  }

  /* 5. наконец, мягко переводим каретку к найденному индексу */
  if (nearest !== currentIndex) {
   
    requestAnimationFrame(() => setCurrentIndex(nearest));
  }

}, [selectedHall, renderedHalls, currentIndex, halls]);





  return (
    <div className="hall__slider__wrapper">
      <div
        className="hall__slider__container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        ref={containerRef}
      >
        <div
          className="hall__slider"
          style={{
            transform: `translateX(-${scrollToIndex(currentIndex)}px)`,
             transition: isReady ? "transform 0.3s ease" : "none"
          }}
        >
          {renderedHalls.map((hall, index) => (
            <div
              key={index}
              className={`hall-card ${hall.id === selectedHall.id ? "selected" : ""}`}
              onClick={() => handleClick(index)}
            >
              <div className="hall-image">
                <img className="hall-card-img" src={hall.image} alt={hall.name} />
              </div>
              <div className="hall-name">
                <span>{hall.name}</span>
                {hall.id === selectedHall.id && (
                  <img src={checkmark} alt="checkmark" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HallSlider;
