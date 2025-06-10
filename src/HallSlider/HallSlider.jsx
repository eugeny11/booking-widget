import React, { useEffect, useRef, useState } from "react";
import "./HallSlider.css";

const HallSlider = ({ halls, selectedHall, onSelect }) => {
  const CARD_WIDTH = 212;
  const duplicated = [...halls, ...halls, ...halls];
  const middleOffset = halls.length * CARD_WIDTH;

  const [xOffset, setXOffset] = useState(middleOffset);
  const [isResetting, setIsResetting] = useState(false);
  const autoScrollRef = useRef(null);

  const wrapOffset = (rawOffset) => {
    const totalWidth = halls.length * CARD_WIDTH;
    const maxOffset = totalWidth * 2;
    let offset = rawOffset;

    if (offset >= maxOffset) {
      offset = offset - totalWidth;
    }

    if (offset < totalWidth) {
      offset = offset + totalWidth;
    }

    return offset;
  };

  const getRealIndex = (offset) => {
    const virtualIndex = Math.round((offset - middleOffset) / CARD_WIDTH);
    const realIndex = ((virtualIndex % halls.length) + halls.length) % halls.length;
    return realIndex;
  };

  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollRef.current = setInterval(() => {
      setXOffset(prev => {
        const next = prev + 1;
        const offset = wrapOffset(next);

        if (offset !== next) {
          setIsResetting(true);
          requestAnimationFrame(() => {
            setXOffset(offset);
            requestAnimationFrame(() => setIsResetting(false));
          });
        }

        return offset;
      });
    }, 20);
  };

  const stopAutoScroll = () => {
    clearInterval(autoScrollRef.current);
  };

  const handleClick = (index) => {
    const realIndex = index % halls.length;
    onSelect(halls[realIndex]);
  };

  const goTo = (direction) => {
    stopAutoScroll();
    setXOffset(prev => {
      // Округляем к ближайшему индексу перед смещением
      const snapped = Math.round((prev - middleOffset) / CARD_WIDTH);
      const nextIndex = snapped + direction;
      const offset = wrapOffset(middleOffset + nextIndex * CARD_WIDTH);

      const realIndex = ((nextIndex % halls.length) + halls.length) % halls.length;
      onSelect(halls[realIndex]);

      return offset;
    });
};


  useEffect(() => {
    startAutoScroll();
    return stopAutoScroll;
  }, []);

  return (
    <div
      className="hall__slider__wrapper"
      onMouseEnter={stopAutoScroll}
      onMouseLeave={startAutoScroll}
    >
      <button className="scroll-btn left" onClick={() => goTo(-1)}>←</button>

      <div className="hall__slider__container">
        <div
          className="hall__slider"
          style={{
            transform: `translateX(-${xOffset}px)`,
            transition: isResetting ? "none" : "transform 0.2s ease",
          }}
        >
          {duplicated.map((hall, index) => (
            <div
              key={index}
              className={`hall-card ${hall.id === selectedHall.id ? "selected" : ""}`}
              onClick={() => handleClick(index)}
            >
              <img src={hall.image} alt={hall.name} />
              <div className="hall-name">
                {hall.name} {hall.id === selectedHall.id && <span>✔</span>}
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
