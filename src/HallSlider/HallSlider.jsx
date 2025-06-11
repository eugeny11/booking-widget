import React, { useRef, useState } from "react";
import "./HallSlider.css";

const HallSlider = ({ halls, selectedHall, onSelect }) => {
  const CARD_WIDTH = 212;
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

  return (
    <div className="hall__slider__wrapper">
      <button className="scroll-btn left" onClick={() => goTo(-1)}>←</button>

      <div className="hall__slider__container">
        <div
          className="hall__slider"
          style={{
            transform: `translateX(-${xOffset}px)`,
            transition: "transform 0.3s ease",
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
