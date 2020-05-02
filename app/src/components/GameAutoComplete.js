import React from 'react';
import PropTypes from 'prop-types';
import DataHelper from '../DataHelper';
import { GENERAL_RULES_KEY } from '../constants';

class GameAutoComplete extends React.Component
{
    static propTypes = {
        games : PropTypes.object.isRequired,
        selectedGames : PropTypes.array.isRequired,
        defaultValue : PropTypes.array, //an array of games to autofill into the field
        onGameSelect : PropTypes.func.isRequired,
        placeholder : PropTypes.string,
        includeGeneralRules : PropTypes.bool
    };

    static defaultProps = {
       placeholder : 'Game Title',
       includeGeneralRules : false
    }

    static state = {
        suggestions : [],
        selectedGames : []
    }

    titleField = React.createRef();

    data = new DataHelper(this.props.games);

    onTitleFieldKeyPress = (e) => {

        if(e.which === 13)
        {
            e.preventDefault();
        }
        else
        {
            this.renderAutoComplete(e.target.value);
        }
    }

    isSelected = (game) => {

        let success = false;

        for(let g in this.props.selectedGames)
        {
            if(this.props.selectedGames[g].gameKey === game.gameKey)
            {
                success = true;
                break;
            }
        }

        return success;
    }

    renderAutoComplete = (q) => {

        let suggestions = [];

        q = q.toLowerCase();

        if(q !== '')
        {
            this.data.forEach((key) => {

                let game = this.props.games[key];
    
                if(game.title.toLowerCase().indexOf(q) > -1)
                {
                    game.gameKey = key;
                    suggestions.push(game);
                }
    
            },this.props.games);
        }
        

        this.setState({suggestions});
    }
    
    chooseGame = (game) => {

        this.titleField.current.value = game.title;

        this.props.onGameSelect(game);

        this.clearTitleField();
    }

    clearTitleField = () => {
        this.titleField.current.value = '';
        this.setState({suggestions : []});
    }

    renderSuggestions = () => {

        if(this.state && this.state.suggestions && this.state.suggestions.length > 0)
        {
            return (<ul className="GameAutoComplete__suggestions">
                {this.state.suggestions.map((game,i) => {

                    let shouldInclude = true;
                    
                    if(game.gameKey === GENERAL_RULES_KEY)
                    {
                        shouldInclude = this.props.includeGeneralRules;
                    }

                    return (shouldInclude ? <li className={`GameAutoComplete__suggestion${this.isSelected(game) ? ' GameAutoComplete__suggestion--selected' : ''}`} 
                                                key={`gac_${game.gameKey}`} 
                                                onClick={(e) => {this.chooseGame(game);}}>
                        {game.title}
                    </li> : null);
                })}
            </ul>);
        }
    }

    render()
    {
        //console.log(this.props.selectedGames);
        return (<div className="GameAutoComplete">
                    <input type="text" ref={this.titleField} placeholder={this.props.placeholder} onKeyUp={this.onTitleFieldKeyPress} />
                    {this.renderSuggestions()}
                </div>);
    }
}

export default GameAutoComplete;