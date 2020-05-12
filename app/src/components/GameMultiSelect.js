import React from 'react';
import PropTypes from 'prop-types';
import GameAutoComplete from './GameAutoComplete';
import GamePill from './GamePill';
import { GENERAL_RULES_KEY } from '../constants';
import DataHelper from '../DataHelper';

class GameMultiSelect extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            selectedGames : this.props.selectedGames,
            includeToplevel : true
        }
    }

    static propTypes = {
        games : PropTypes.object.isRequired,
        includeToplevel : PropTypes.bool,
        defaultValue : PropTypes.array,
        placeholder : PropTypes.string,
        onError : PropTypes.func.isRequired,
        selectedGames : PropTypes.array,
        excludedGames : PropTypes.array
    };

    static defaultProps = {
        selectedGames : [],
        excludedGames : [],
        defaultValue : []
    }

    /*
        check the array of selected games for any collisions or unecessary data
        -no need to add a game's parent
    */
    sanitizeGames = (games) => {

        if(!this.gameSelected(GENERAL_RULES_KEY))
        {
            let data = new DataHelper(this.props.games);
            let gen = data.getGameByKey(GENERAL_RULES_KEY);
                gen.gameKey = GENERAL_RULES_KEY;
                games.push(gen);
        }

        return games;
    }

    clearGames = () => {
        this.setState({selectedGames : []});
    }

    newGameSelect = (game) => {
        
        if(!this.gameSelected(game))
        {
            let games = this.state.selectedGames;
                games.push(game);
            
            this.setState({
                selectedGames : games
            });
        }
    }

    gameSelected = (game) => {

        let selected = false;
        let gameKey = typeof game === 'object' ? game.gameKey : game;

        this.state.selectedGames.forEach((selectedGame,i) => {

            if(gameKey === selectedGame.gameKey)
            {
                selected = true;
                return;
            }
        });

        return selected;
    }

    onGameRemoved = (e,gameToRemove) => {

        let games = this.state.selectedGames;
            games = games.filter((game) => {
                return gameToRemove.gameKey !== game.gameKey;
            });
        
            this.setState({selectedGames : games});
    }

    renderGames =() => {
        
        return this.state.selectedGames.map((game) => {
            

            return (<GamePill 
                        key={`gms_${game.gameKey}`} 
                        game={game}
                        onClose={this.onGameRemoved} />);
        });
    }

    render()
    {

        return (
            <ul className="GameMultiSelect">
                {this.renderGames()}
                <li className="GameMultiSelect__add-game">
                    <GameAutoComplete 
                        games={this.props.games}
                        selectedGames={this.state.selectedGames} 
                        onGameSelect={this.newGameSelect} 
                        placeholder={this.props.placeholder}
                        excludedGames={this.props.excludedGames} />
                </li>
            </ul>);
    }
}

export default GameMultiSelect;