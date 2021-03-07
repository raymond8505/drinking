import React, { useState, useRef, useEffect } from "react";
import round from "lodash/round";

const Slider = ({
  title = "",
  min = 0,
  max = 10,
  valuePrecision = 0, //num decimal places to round to (0 = integer)
  onChange = (val) => {}, //the change handler when the handle is release, takes one param, the current calced val
  startingValue, //where to start the handle. Default is the min val
}) => {
  const [curVal, setCurVal] = useState(startingValue || min);
  const trackRef = useRef(null);
  const handleRef = useRef(null);
  const [handleX, setHandleX] = useState(0);

  //using ref here so we can change on mouse drag without triggering re-render
  const calculadedVal = useRef(startingValue || min);

  const calcValue = (offset, width) => {
    const val = (offset / width) * (max - min) + min;

    return round(val, valuePrecision);
  };

  const calcHandlePos = (val) => {
    return (
      trackRef.current.offsetWidth * ((val - min) / (max - min)) -
      handleRef.current.offsetWidth / 2
    );
  };

  useEffect(() => {
    setHandleX(calcHandlePos(curVal));
  }, []);

  useEffect(() => {
    onChange(curVal);
  }, [curVal]);

  const onTrackClick = (e) => {
    if (!e.path.includes(handleRef.current)) {
      const val = calcValue(e.offsetX, trackRef.current.offsetWidth);
      const newX = calcHandlePos(val);

      //console.log(val, newX, trackRef.current.offsetWidth);
      setHandleX(newX);
      setCurVal(val);
    }
  };

  useEffect(() => {
    trackRef.current.addEventListener("mousedown", onTrackClick);
  }, []);

  return (
    <div className="Slider">
      <h3 className="Slider__title">{title}</h3>
      <div className="Slider__controls">
        <span className="Slider__value Slider__value--min">{min}</span>
        <div className="Slider__track" ref={trackRef}>
          <div
            className="Slider__handle"
            style={{
              transform: `translateX(${handleX}px)`,
            }}
          >
            <div className="Slider__handle-bar" ref={handleRef}>
              <i className="fa fa-caret-down"></i>
            </div>
            <div className="Slider__current-value">{curVal}</div>
          </div>
        </div>
        <span className="Slider__value Slider__value--min">{max}</span>
      </div>
    </div>
  );
};

export default Slider;
