import React, { useState, useEffect } from "react";
import DataHelper from "../DataHelper";
import Alert from "./Alert";
import FieldSet from "./FieldSet";
import Modal from "./Modal";
import Slider from "./Slider";
import GridPicker from "./GridPicker";

const GameCardSettingsModal = ({
  games,
  game,
  open = false,
  onClose = () => {},
  onApply = (settings) => {},
  settings: settingsIn,
}) => {
  const data = new DataHelper(games);
  const parents = data
    .getParentGames(game)
    .sort((a, b) => (a.title <= b.title ? -1 : 1));
  const [settings, setSettings] = useState(settingsIn);

  const onModalClose = () => {
    //totally not prop drilling
    onClose();
  };

  const onApplyClick = (e) => {
    onApply(settings);
  };

  const findParentSettingsIndex = (key) =>
    settings.parents.findIndex((p) => p.key === key);

  const updateParentRatio = (key, ratio) => {
    const index = findParentSettingsIndex(key);

    setSettings((prevSettings) => {
      const { parents: prevParents } = prevSettings;

      return {
        ...prevSettings,
        parents: [
          ...prevParents.slice(0, index),
          {
            key,
            ratio,
          },
          ...prevParents.slice(index + 1),
        ],
      };
    });
  };
  return (
    <div className="GameCardSettingsModal">
      <Modal
        open={open}
        title="Bingo Settings"
        showButton={false}
        onClose={onModalClose}
      >
        <FieldSet legend="Parent Rules Settings">
          Adjust these sliders to control the likelihood of each parent game's
          rules being on the board. The higher the slider, the more rules from
          that game will be on the board
          <ul className="GameCardSettingsModal__parent-rules-sliders">
            {parents.map((parent, i) => {
              return (
                <li key={i}>
                  <Slider
                    title={parent.title}
                    startingValue={
                      settings.parents.find((p) => p.key === parent.gameKey)
                        .ratio
                    }
                    max={5}
                    onChange={(val) => {
                      updateParentRatio(parent.gameKey, val);
                    }}
                  />
                </li>
              );
            })}
          </ul>
        </FieldSet>
        <FieldSet
          legend="Board Size"
          className="GameCardSettingsModal__grid-size"
        >
          Choose the size of the bingo
          <br /> grid you want to play with
          <GridPicker
            size={settings.grid}
            onChange={(grid) => {
              setSettings((oldSettings) => {
                return {
                  ...oldSettings,
                  grid,
                };
              });
            }}
          />
        </FieldSet>
        <footer className="GameCardSettingsModal__footer">
          <Alert type="info">Clicking Apply will refresh the board</Alert>
          <button
            className="cta GameCardSettingsModal__apply"
            onClick={onApplyClick}
          >
            Apply
          </button>
        </footer>
      </Modal>
    </div>
  );
};

export default GameCardSettingsModal;
