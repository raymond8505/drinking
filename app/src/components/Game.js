import React from "react";
import DataHelper from "../DataHelper";
import PropTypes from "prop-types";
import NotFound from "./NotFound";
import RulesList from "./RulesList";
import AddRulesForm from "./AddRulesForm";
import GameList from "./GameList";
import AddGameForm from "./AddGameForm";
//import {changePageTitle} from '../helpers';
//import GameSelect from './GameSelect';
import EditButton from "./EditButton";
//import GameListItem from './GameListItem';
import DeleteButton from "./DeleteButton";
import { Link } from "react-router-dom";
import ComboCounter from "./ComboCounter";
//import {GENERAL_RULES_KEY} from '../constants';
import GamePill from "./GamePill";
import GameMultiSelect from "./GameMultiSelect";
import { Helmet } from "react-helmet";
import { showParent, hideParent, getHiddenGames } from "../localStorageManager";

class Game extends React.Component {
  state = {
    game: undefined,
    editing: false,
    hiddenGames: getHiddenGames(this.props.index),
  };

  static propTypes = {
    index: PropTypes.string.isRequired,
    games: PropTypes.object,
    editRule: PropTypes.func.isRequired,
    deleteRule: PropTypes.func.isRequired,
    editGame: PropTypes.func.isRequired,
    deleteGame: PropTypes.func.isRequired,
    canEditGame: PropTypes.func.isRequired,
    canDeleteGame: PropTypes.func.isRequired,
    getUser: PropTypes.func.isRequired,
  };

  titleInput = React.createRef();
  editButton = React.createRef();
  shell = React.createRef();
  parentsMS = React.createRef();

  gameScrollPostBeforeUpdate = 0;

  onParentChange = (e) => {
    let newParent = e.currentTarget.value;

    let thisGameKey = this.props.index;

    let game = { ...this.data.getGameByKey(thisGameKey) };

    game.parent_game = newParent;

    console.log(game);

    this.props.editGame(thisGameKey, game);
  };

  handleTitleEditClick = (e) => {
    if (this.state.editing) {
      let game = this.data.getGameByKey(this.props.index);
      let newTitle = this.titleInput.current.value; //.replace(/(^[ ]+|[ ]+$)/,'');

      if (newTitle === "") {
        this.titleInput.current.value = game.title;
      } //if(this.titleInput.current.value !== game.title)
      else {
        this.data = new DataHelper(this.props.games);

        game.title = this.titleInput.current.value;

        game.parent_game = this.data.gamesToKeys(
          this.parentsMS.current.state.selectedGames
        );

        this.props.editGame(this.props.index, game);
      }
    } else {
      this.titleInput.current.focus();
    }

    this.setState({ editing: !this.state.editing });
  };

  onDeleteClick = (e) => {
    this.data = new DataHelper(this.props.games);

    let game = this.data.getGameByKey(this.props.index);

    if (this.state.editing) {
      this.setState({ editing: false });
    } else if (
      window.confirm(`Are you sure you want to delete "${game.title}"?`)
    ) {
      this.props.deleteGame(this.props.index);
    }
  };

  handleParentPillVisibility = (show, parent, child) => {
    if (show) {
      showParent(child, parent);
    } else {
      hideParent(child, parent);
    }

    const childHiddenGames = getHiddenGames(child);

    this.setState({
      hiddenGames: childHiddenGames,
    });
  };

  renderParentPills = () => {
    let game = this.data.getGameByKey(this.props.index);
    let parents = this.data.getParentGames(game);

    if (this.state.editing) {
      return (
        <div className="Game__parents">
          <GameMultiSelect
            ref={this.parentsMS}
            selectedGames={parents}
            excludedGames={[this.props.index]}
            games={this.props.games}
          />
        </div>
      );
    } else {
      return parents && parents.length > 0 ? (
        <ul className="Game__parents">
          {parents.map((parent) => {
            return (
              <GamePill
                linkGame={true}
                key={`pill_${parent.gameKey}`}
                game={parent}
                childKey={this.props.index}
                showCloseBtn={false}
                onVisibilityToggle={this.handleParentPillVisibility}
              />
            );
          })}
        </ul>
      ) : null;
    }
  };

  renderBreadCrumbs = () => {
    let ancestors = this.data.getAncestors(this.props.index);

    let html = [];

    ancestors.forEach((ancestor, i) => {
      html.push(
        <Link to={`/game/${ancestor.key}`}>{ancestor.game.title}</Link>
      );

      if (i < ancestors.length - 1) {
        html.push(<span class="Game__parent-delimiter">&gt;</span>);
      }
    });

    return html;
  };

  getSnapshotBeforeUpdate(prevProps, prevState) {
    this.gameScrollPostBeforeUpdate = this.shell.current
      ? this.shell.current.scrollTop
      : 0;
    this.currentGameKey = this.props.index;

    return null;
  }

  componentDidUpdate(prevProps) {
    setTimeout(() => {
      if (this.shell.current)
        this.shell.current.scrollTo(0, this.gameScrollPostBeforeUpdate);
    }, 1);

    if (this.state.editing) {
      this.titleInput.current.focus();
    }

    if (this.shell.current) this.shell.current.scrollTo(0, 0);
  }

  render() {
    this.data = new DataHelper(this.props.games);

    let game = this.data.getGameByKey(this.props.index);

    //let parentGame = game.parent_game ? this.data.getGameByKey(game.parent_game) : null;

    if (!game) return NotFound;

    //changePageTitle(game.title + ' | Drinking Games');

    return (
      <div
        className={`Game ${this.state.editing ? " Game--editing" : ""}`}
        ref={this.shell}
      >
        <Helmet>
          <title>{game.title + " | Drinking Games"}</title>
        </Helmet>
        <ComboCounter
          setSessionCombo={this.props.setSessionCombo}
          count={this.props.currentComboCount}
        />

        {this.renderParentPills()}

        <h1
          className="Game__title"
          onDoubleClick={(e) => {
            this.handleTitleEditClick();
          }}
        >
          <input
            name={this.props.index + Date.now()}
            key={this.props.index + Date.now()}
            type="text"
            style={{ width: `${game.title.length}ch` }}
            defaultValue={game.title}
            ref={this.titleInput}
            disabled={!this.state.editing}
            className="Game__title-value editable"
            onKeyUp={(e) => {
              switch (e.which) {
                case 13:
                  this.handleTitleEditClick();
                  break;
                case 27:
                  this.setState({ editing: false });
                  break;
                default:
                  break;
              }
            }}
          />
          {this.props.canEditGame(this.props.index) ? (
            <div className="Game__parent-change-select">
              <EditButton
                handler={this.handleTitleEditClick}
                ref={this.editButton}
              />
              {this.props.canDeleteGame(this.props.index) ? (
                <DeleteButton handler={this.onDeleteClick} />
              ) : null}
            </div>
          ) : null}
        </h1>

        <a
          href={`/game/${this.props.index}/card`}
          className="Game__card-link"
          target="_blank"
        >
          Play {game.title} BINGO
        </a>

        <section className="Game__rules">
          <h2>Rules</h2>

          <RulesList
            games={this.props.games}
            hiddenGames={this.state.hiddenGames}
            index={this.props.index}
            recursive={true}
            deleteRule={this.props.deleteRule}
            editRule={this.props.editRule}
            canEditRule={this.props.canEditRule}
            canDeleteRule={this.props.canEditRule}
            getUser={this.props.getUser}
          />
        </section>

        {this.props.userLoggedIn() ? (
          <section className="Game__add-rules">
            <h3>Add Rule</h3>

            <AddRulesForm
              games={this.props.games}
              gameIndex={this.props.index}
              addRule={this.props.addRule}
            />
          </section>
        ) : null}

        <section className="Game__child-games">
          <h2>Sub Games</h2>

          <GameList
            parent={this.props.index}
            editGame={this.props.editGame}
            games={this.props.games}
            deleteGame={this.props.deleteGame}
            copyGame={this.props.copyGame}
            canEditGame={this.props.canEditGame}
            canEditRule={this.props.canEditRule}
            canDeleteGame={this.props.canDeleteGame}
            canDeleteRule={this.props.canEditRule}
            userLoggedIn={this.props.userLoggedIn}
          />

          <h3>Add A Sub Game</h3>

          {this.props.userLoggedIn() ? (
            <AddGameForm
              games={this.props.games}
              parent={[this.data.getGameByKey(this.props.index)]}
              addGame={this.props.addGame}
            />
          ) : null}
        </section>
      </div>
    );
  }
}

export default Game;
