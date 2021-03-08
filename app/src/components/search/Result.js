import React from "react";

const Result = ({ result }) => {
  const { title, rules, gameKey } = result;

  return (
    <li className="Result">
      <a href={`/game/${gameKey}/card`}>
        <div>
          <h2>{title}</h2>
          <h3>{rules}</h3>
        </div>
      </a>
    </li>
  );
};

export default Result;
