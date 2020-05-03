import React from 'react';
import PropTypes from 'prop-types';
import DataHelper from '../DataHelper';
import { GENERAL_RULES_KEY } from '../constants';

class GameAutoComplete extends React.Component
{
    static propTypes = {
        games : PropTypes.object.isRequired,
        selectedGames : PropTypes.array.isRequired,
        excludedGames : PropTypes.array,
        defaultValue : PropTypes.array, //an array of games to autofill into the field
        onGameSelect : PropTypes.func.isRequired,
        placeholder : PropTypes.string,
        includeGeneralRules : PropTypes.bool
    };

    static defaultProps = {
       placeholder : 'Game Title',
       excludedGames : [],
       includeGeneralRules : false
    }

    static state = {
        suggestions : [],
        selectedGames : [],
        currentSelection : 0,
        currentSuggestion : 0
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
            switch(e.which)
            {
                case 40: //down / next
                    this.nextSuggestion();
                    break;
            }

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
                let shouldInclude = true;

                if(game.title.toLowerCase().indexOf(q) > -1)
                {
                    if(game.gameKey === GENERAL_RULES_KEY)
                    {
                        shouldInclude = this.props.includeGeneralRules;
                    }

                    shouldInclude = !this.props.excludedGames.includes(game.gameKey);
                    
                    if(shouldInclude)
                    {
                        game.gameKey = key;

                        suggestions.push(game);
                    }
                    
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

    setCurrentSuggestion = (i) => {
        this.setState({currentSuggestion : i});
    }

    nextSuggestion = () => {

        let nextSuggestion = this.findNextSuggestion(this.state.currentSuggestion || 0);

        this.setState({currentSuggestion : nextSuggestion});
    }

    findNextSuggestion = (current) => {

        let nextIndex = current == this.state.suggestions.length - 1 ? 0 : current + 1;

        return this.isSelected(this.state.suggestions[nextIndex]) ? this.findNextSuggestion(nextIndex) : nextIndex;
    }

    allSuggestionsSelected = () => {

        let allSelected = true;

        for(let i in this.state.suggestions)
        {
            let game = this.state.suggestions[i];

            if(!this.isSelected(game))
            {
                allSelected = false;
                break;
            }
        }
        
        return allSelected;
    }

    renderSuggestions = () => {

        if(this.state && this.state.suggestions && this.state.suggestions.length > 0)
        {
            return (<ul className="GameAutoComplete__suggestions" style={{height : `${this.state.suggestions.length * 1.55}em`}}>
                {this.state.suggestions.map((game,i) => {

                    let shouldInclude = true;

                    let classes = ['GameAutoComplete__suggestion'];

                    if(this.isSelected(game))
                    {
                        classes.push('GameAutoComplete__suggestion--selected');    
                    }
                    
                    if(i === this.state.currentSuggestion || !this.state.currentSuggestion && i === 0)
                    {
                        classes.push('GameAutoComplete__suggestion--current')
                    }

                    return (shouldInclude ? <li className={classes.join(' ')} 
                                                key={`gac_${game.gameKey}`} 
                                                onClick={(e) => {this.chooseGame(game);}}
                                                onMouseEnter={(e) => {
                                                    if(!this.isSelected(game))
                                                    {
                                                        this.setCurrentSuggestion(i,game);
                                                    }
                                                    }}>
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