import React, { useRef, useState } from "react";
import "./HallSlider.css";
import checkmark from '../images/checkmark.png'

const HallSlider = ({ halls, selectedHall, onSelect }) => {

  const [isJumping, setIsJumping] = useState(false);
  
  const CARD_WIDTH = 205;
  const duplicated = [...halls, ...halls, ...halls];
  const middleOffset = halls.length * CARD_WIDTH;

  const [xOffset, setXOffset] = useState(middleOffset);

  const wrapOffset = (rawOffset) => {
    const totalWidth = halls.length * CARD_WIDTH;
    const maxOffset = totalWidth * 2;
    let offset = rawOffset;

    if (offset >= maxOffset) offset -= totalWidth;
    if (offset < totalWidth) offset += totalWidth;

    return offset;
  };

  const getRealIndex = (offset) => {
    const virtualIndex = Math.round((offset - middleOffset) / CARD_WIDTH);
    return ((virtualIndex % halls.length) + halls.length) % halls.length;
  };

  const goTo = (direction) => {
    setXOffset(prev => {
      const snapped = Math.round((prev - middleOffset) / CARD_WIDTH);
      const nextIndex = snapped + direction;
      const offset = wrapOffset(middleOffset + nextIndex * CARD_WIDTH);
      const realIndex = ((nextIndex % halls.length) + halls.length) % halls.length;

      onSelect(halls[realIndex]);
      return offset;
    });
  };

  const handleClick = (index) => {
    const targetIndex = index % halls.length;

    setXOffset(() => {
      const offset = wrapOffset(middleOffset + targetIndex * CARD_WIDTH);
      onSelect(halls[targetIndex]);
      return offset;
    });
  };

  const handleTransitionEnd = () => {
  const totalWidth = halls.length * CARD_WIDTH;
  const maxOffset = totalWidth * 2;

  if (xOffset >= maxOffset - CARD_WIDTH || xOffset <= totalWidth) {
    const realIndex = getRealIndex(xOffset);
    const newOffset = middleOffset + (realIndex * CARD_WIDTH);
    setIsJumping(true); 
    setXOffset(newOffset);

    setTimeout(() => setIsJumping(false), 20); 
  }
};

  const touchStartX = useRef(null);

const handleTouchStart = (e) => {
  touchStartX.current = e.touches[0].clientX;
};

const handleTouchEnd = (e) => {
  if (touchStartX.current === null) return;

  const deltaX = e.changedTouches[0].clientX - touchStartX.current;

  if (Math.abs(deltaX) > 50) { 
    if (deltaX > 0) {
      goTo(-1); 
    } else {
      goTo(1); 
    }
  }

  touchStartX.current = null;
};


  return (
    <div className="hall__slider__wrapper">
      <button className="scroll-btn left" onClick={() => goTo(-1)}>←</button>

      <div className="hall__slider__container"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
      >
        <div
          className="hall__slider"
          style={{
            transform: `translateX(-${xOffset}px)`,
            transition: "transform 0.3s ease",
          }}
           onTransitionEnd={handleTransitionEnd}
        >
          {duplicated.map((hall, index) => (
            <div
              key={index}
              className={`hall-card ${hall.id === selectedHall.id ? "selected" : ""}`}
              onClick={() => handleClick(index)}
            >
             <div className="hall-image">
                <img className="hall-card-img" src={hall.image} alt={hall.name} />
            </div>
              <div className="hall-name">
               <span>{hall.name}</span>  {hall.id === selectedHall.id && <img src={checkmark} alt="checkmark"/>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button className="scroll-btn right" onClick={() => goTo(1)}>→</button>
    </div>
  );
};

export default HallSlider;
