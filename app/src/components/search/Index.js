import React, { useState, useEffect } from "react";
import Result from "./Result";
import DataHelper from "../../DataHelper";

const Index = ({ games: gamesObj }) => {
  document.body.classList.add("Index--body");
  const data = new DataHelper(gamesObj);

  const games = data
    .objectCollectionToArrayWithKey(gamesObj, "gameKey")
    .filter((game) => game.title !== "");

  const [q, setQ] = useState("");

  const uniqueGame = (item, pos, arr) => {
    return arr.findIndex((game) => game.gameKey === item.gameKey) === pos;
  };

  const byTitleDesc = (a, b) =>
    a.title.toLowerCase() <= b.title.toLowerCase() ? -1 : 1;

  const makeResult = (game) => {
    const parents = data.getParentGames(game);
    const parentRules = parents.reduce((tot, parent) => {
      if (!parent || !parent.rules) return tot;

      return Object.keys(parent.rules).length;
    }, 0);
    const gameRules =
      game.rules !== undefined ? Object.keys(game.rules).length : 0;
    return {
      title: game.title,
      rules: gameRules + parentRules,
      gameKey: game.gameKey,
    };
  };

  const [results, setResults] = useState(
    games.map(makeResult).sort(byTitleDesc)
  );

  const onSearchChange = (e) => {
    const q = e.target.value;
    const qLCase = q.toLowerCase();

    const matches = games.filter(
      (game, i) => game.title.toLowerCase().indexOf(qLCase) > -1
    );

    const matchChildren = [];

    matches.forEach((match, m) => {
      data
        .objectCollectionToArrayWithKey(
          data.getChildGames(match.gameKey),
          "gameKey"
        )
        .forEach((matchChild, mc) => {
          matchChildren.push(matchChild);
        });
    });

    const results = matches
      .concat(matchChildren)
      .filter((r) => r.title !== "")
      .filter(uniqueGame)
      .map(makeResult)
      .sort(byTitleDesc);

    //console.log(results);

    setQ(q);
    setResults(results);
  };

  return (
    <div className="Index">
      <header className="Index__header">
        <h1>Drinko</h1>
        <input
          type="search"
          className="Index__search"
          placeholder="Search Games"
          onChange={onSearchChange}
          value={q}
        />
      </header>
      <ul className="Index__results">
        {results.map((result, i) => (
          <Result result={result} key={i} />
        ))}
      </ul>
    </div>
  );
};

export default Index;
