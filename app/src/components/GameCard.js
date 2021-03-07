import React, { useState, useEffect } from "react";
import DataHelper from "../DataHelper";
import { randoIndex, setTitle, rando } from "../helpers";
import shuffle from "lodash/shuffle";
import GameCardFreeSquare from "./GameCardFreeSquare";
import GameCardSettingsModal from "./GameCardSettingsModal";

const GameCard = ({ games, currentIndex }) => {
  const [cardRules, setCardRules] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const data = new DataHelper(games);

  const game = data.getGameByKey(currentIndex);

  const parents = data.getParentGames(game);

  const [settings, setSettings] = useState({
    parents: parents.map((parent) => {
      return {
        key: parent.gameKey,
        ratio: 1,
      };
    }),
    grid: [5, 5],
  });

  document.body.style.overflow = "auto";

  function pickparentGames(gRules, numToPick, picked = []) {
    if (gRules.length === 0) return picked;

    const gameIndex = randoIndex(gRules);

    const ruleIndex = randoIndex(gRules[gameIndex]);
    const rule = { ...gRules[gameIndex][ruleIndex] };

    picked.push(rule);

    const newRules = gRules
      .map((g, i) => {
        if (i !== gameIndex) return g;

        return [...g.slice(0, ruleIndex), ...g.slice(ruleIndex + 1)];
      })
      .filter((g) => g.length > 0);

    return picked.length === numToPick
      ? picked
      : pickparentGames(newRules, numToPick, picked);
  }

  useEffect(() => {
    setTitle(`${game.title} Drinking Bingo`);

    //shuffle the game rules and pick half
    let gameRules = shuffle(
      data.rulesObjectToArray(data.getGameRules(currentIndex, false))
    ).map((r) => {
      const { rule, drinks } = r;

      return {
        id: r.ruleKey,
        rule,
        drinks,
        game,
      };
    });
    gameRules = gameRules.slice(0, Math.ceil(gameRules.length / 2));

    //get the parent games' rules in an object
    const parentGames = {};
    parents.forEach((parent) => {
      parentGames[parent.gameKey] = data.rulesObjectToArray(parent.rules);
    });

    //make an array of parent game keys, weighted by the settings
    //the more the key appears in the array the higher the likelihood its questions
    //are on the board
    let ruleIndexes = [];

    settings.parents.forEach((p, i) => {
      for (let r = 0; r < p.ratio; r++) {
        ruleIndexes.push(p.key);
      }
    });

    //calc the number of parent rules to add (grid area - num game rules - 1 free space)
    const numparentGames =
      settings.grid.reduce((prev, cur) => prev * cur, 1) - gameRules.length - 1;

    let rules = [...gameRules];

    for (let r = 0; r < numparentGames; r++) {
      //get a random key from the indexes array
      const parentKey = rando(ruleIndexes);

      //get the rules for that key
      const parentRules = parentGames[parentKey];

      //pick a random rule
      const ruleIndex = randoIndex(parentRules);
      const rule = parentRules[ruleIndex];

      //remove that rule from the array so we dont pick it again
      parentGames[parentKey] = [
        ...parentGames[parentKey].slice(0, ruleIndex),
        ...parentGames[parentKey].slice(ruleIndex + 1),
      ];

      //if that was the last rule in that game, remove its key from contention
      if (parentGames[parentKey].length == 0) {
        ruleIndexes = ruleIndexes.filter((key) => key !== parentKey);
      }

      //add the rule to the rules array, including its game
      rules.push({
        ...rule,
        game: data.getGameByKey(parentKey),
      });
    }

    const { grid } = settings;
    const [rows, cols] = grid;

    const freeSquareRule = {
      id: "free",
      rule: (
        <GameCardFreeSquare
          title={game.title}
          subtitle="Drinking Bingo"
          onCogClick={(e) => {
            console.log("open settings");
            setSettingsOpen(true);
          }}
        />
      ),
      highlighted: true,
    };

    //if both row and column are odd, put the free square in the center
    if (rows % 2 !== 0 && cols % 2 !== 0) {
      const freeIndex = (rows * cols - 1) / 2;

      rules = [
        ...rules.slice(0, freeIndex),
        freeSquareRule,
        ...rules.slice(freeIndex),
      ];
    } else {
      //otherwise it floats free
      rules.push(freeSquareRule);
      rules = shuffle(rules);
    }
    setCardRules(rules);
    // const rules = shuffle(
    //   pickparentGames(
    //     parentGames,
    //     settings.grid.reduce((prev, cur) => cur * prev, 1) -
    //       gameRules.length -
    //       1
    //   )
    //     .concat(gameRules)
    //     .map((r) => {
    //       return { ...r, game: data.getGameByKey(r.gameKey) };
    //     })
    // );

    // rules.push({
    //   id: "free",
    //   rule: (
    //     <GameCardFreeSquare
    //       title={game.title}
    //       subtitle="Drinking Bingo"
    //       onCogClick={(e) => {
    //         console.log("open settings");
    //         setSettingsOpen(true);
    //       }}
    //     />
    //   ),
    //   highlighted: true,
    // });

    // setCardRules(shuffle(rules));
  }, [currentIndex, settings]);

  const highlightRule = (i) => {
    setCardRules([
      ...cardRules.slice(0, i),
      {
        ...cardRules[i],
        highlighted: !cardRules[i].highlighted,
      },
      ...cardRules.slice(i + 1),
    ]);
  };

  const onSettingsChange = (newSettings) => {
    setSettings({ ...newSettings });
  };

  const outputHeader = (num) => {
    return [
      <div key={`b`} className="header-box header-box--b">
        B
      </div>,
      <div key={`i`} className="header-box header-box--i">
        I
      </div>,
      <div key={`n`} className="header-box header-box--n">
        N
      </div>,
      <div key={`g`} className="header-box header-box--g">
        G
      </div>,
      <div key={`o`} className="header-box header-box--o">
        O
      </div>,
    ].filter((l, i) => i < num);
  };

  return (
    <>
      <div
        className="GameCard"
        style={{
          gridTemplateRows: `auto repeat(${settings.grid[0] - 1},1fr)`,
          gridTemplateColumns: `repeat(${settings.grid[1]},1fr)`,
        }}
      >
        {outputHeader(settings.grid[1])}

        {cardRules.map((rule, i) => {
          return (
            <div
              onClick={(e) => {
                if (rule.id !== "free") {
                  highlightRule(i);
                }
              }}
              key={i}
              className={`rule-box rule-box--${rule.id}${
                rule.highlighted ? " rule-box--highlighted" : ""
              }${
                rule.gameKey === currentIndex
                  ? " rule-box--game-rule"
                  : " rule-box--parent-rule"
              }`}
            >
              <div>
                <div className={`rule-box__rule`}>{rule.rule}</div>
                {rule.drinks && (
                  <div className={`rule-box__drinks`}>{rule.drinks}</div>
                )}
                {rule.game && (
                  <div className={`rule-box__game-title`}>
                    ({rule.game.title})
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <GameCardSettingsModal
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
        }}
        onApply={onSettingsChange}
        game={game}
        games={games}
        settings={settings}
      />
    </>
  );
};

export default GameCard;
