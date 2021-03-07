import React from "react";

const GameCardFreeSquare = ({ title, subtitle, onCogClick }) => {
  return (
    <div className="GameCardFreeSquare">
      <h1>{title}</h1>
      <h2>{subtitle}</h2>
      <div className={`rule-box__game-title`}>(Free Square)</div>
      <button className="GameCardFreeSquare__settings-btn" onClick={onCogClick}>
        <i className="fa fa-cog"></i>
      </button>
    </div>
  );
};

export default GameCardFreeSquare;
