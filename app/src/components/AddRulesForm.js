import React from 'react';
import PropTypes from 'prop-types';
import GameSelect from './GameSelect';
import DataHelper from '../DataHelper';

class AddRulesForm extends React.Component
{
    static propTypes = {
        games : PropTypes.object.isRequired,
        gameIndex : PropTypes.string.isRequired,
        addRule : PropTypes.func.isRequired
    };

    static defaultProps =  {}

    gameSelect = React.createRef();
    ruleField = React.createRef();
    drinksField = React.createRef();
    
    componentWillMount()
    {
        this.data = new DataHelper(this.props.games);
        
        window.addEventListener('keypress',this.onWindowKeyPress);
    }

    onWindowKeyPress = (e) => {

        //console.log(e);

        if(e.which === 174 && e.altKey) //alt + r
        {
            this.ruleField.current.focus();
            e.preventDefault();
        }
    }

    resetForm = () => 
    {
        this.gameSelect.current.test().current.value = this.props.gameIndex;
        this.ruleField.current.focus();
    }

    clearForm = () =>
    {
        this.ruleField.current.value =
        this.drinksField.current.value = '';
    }

    handleAddClick = (e) => {
        let gameKey = this.gameSelect.current.innerSelect.current.value;

        let ruleTitle = this.ruleField.current.value;
        let drinks = this.drinksField.current.value;
        
        if(ruleTitle === '' || drinks === '' || !gameKey || gameKey === '')
        {
            alert('Please choose a game, enter a rule and a drink penalty.');

            return;
        }
        let rule = {
            rule : ruleTitle,
            drinks : drinks
        };

        this.props.addRule(gameKey,rule);     
        this.clearForm();
        this.resetForm();   
    }

    onKeyUp = (e) => {

        if(e.which === 13) // Enter
        {
            this.handleAddClick();
            e.preventDefault();
        }
    }
    render()
    {
        this.data = new DataHelper(this.props.games);
        
        let games = this.data.sortGamesBy('title','asc',this.props.games);
        
        return (
            <div className="AddRulesForm">
                <GameSelect 
                    games={games} 
                    name="game" 
                    defaultValue={this.props.gameIndex} 
                    ref={this.gameSelect} className="AddRulesForm__game-select" />
                <textarea placeholder="Rule" name="rule" ref={this.ruleField} className="AddRulesForm__rule-field"></textarea>
                <input 
                    type="text" 
                    name="drinks" 
                    ref={this.drinksField}
                    onKeyUp={this.onKeyUp} 
                    placeholder="Drinks" 
                    className="AddRulesForm__drinks-field" />
                <button type="button" onClick={this.handleAddClick}>Add Rule</button>
            </div>);
    }
}

export default AddRulesForm;