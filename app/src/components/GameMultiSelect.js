import React from 'react';
import PropTypes from 'prop-types';
import GameAutoComplete from './GameAutoComplete';
import GamePill from './GamePill';

class GameMultiSelect extends React.Component
{
    static propTypes = {
        games : PropTypes.object.isRequired,
        includeToplevel : PropTypes.bool,
        defaultValue : PropTypes.array,
        ref : PropTypes.object,
        placeholder : PropTypes.string,
        onError : PropTypes.func.isRequired
    };

    static defaultProps = {
        selectedGames : []
    }

    state = {
        selectedGames : this.props.selectedGames,
        includeToplevel : true
    }

    /*
        check the array of selected games for any collisions or unecessary data
        -no need to add a game's parent
    */
    sanitizeGames = (games) => {

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

        this.state.selectedGames.forEach((selectedGame,i) => {

            if(game.gameKey === selectedGame.gameKey)
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
                        placeholder={this.props.placeholder} />
                </li>
            </ul>);
    }
}

export default GameMultiSelect;