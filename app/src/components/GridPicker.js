import React, { useState, useEffect } from "react";

const GridPicker = ({ size: startingSize = [5, 5], onChange = () => {} }) => {
  const [gridSize, setGridSize] = useState(startingSize);

  const setGrid = (size) => {
    setGridSize(size);
  };

  useEffect(() => {
    onChange(gridSize);
  }, [gridSize]);

  const renderGrid = (size) => {
    const squares = [];

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        squares.push(
          <button
            key={`${r}-${c}`}
            className={`GridPicker__btn${
              r < gridSize[0] && c < gridSize[1]
                ? " GridPicker__btn--highlight"
                : ""
            }`}
            onClick={(e) => setGrid([r + 1, c + 1])}
          ></button>
        );
      }
    }

    return squares;
  };

  return <div className="GridPicker">{renderGrid(startingSize)}</div>;
};

export default GridPicker;
