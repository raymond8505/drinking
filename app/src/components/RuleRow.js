import React from 'react';
import PropTypes from 'prop-types';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import DataHelper from '../DataHelper';
import {Link} from 'react-router-dom';
import GameSelect from './GameSelect';

class RuleRow extends React.Component
{
    state = {
        editing : false,
        rule : null
    }

    ruleField = React.createRef();
    drinksField = React.createRef();
    gameSelect = React.createRef();

    static propTypes = {
        ruleIndex : PropTypes.string.isRequired,
        gameIndex : PropTypes.string.isRequired, //this is for the game showing the rule, not the game owning the rule
                                                //using getGameRules() will return a struct of rules each with a new gameKey field for
                                                //the key of the game that owns that rule
        rule : PropTypes.object.isRequired,
        editRule : PropTypes.func.isRequired,
        deleteRule : PropTypes.func.isRequired,
        games : PropTypes.object.isRequired
    };
    
    static defaultProps =  {
        
    }

    componentDidUpdate()
    {
        if(this.ruleField && this.ruleField.current)
        {
            this.ruleField.current.focus();
        }
    }

    handleRuleEdit = (e) => {

        let editing = this.state.editing;
        

        //let drinksField = this.state.drinksField.current;
        //let ruleField = this.state.ruleField.current;

        if(this.drinksField 
            && this.ruleField
            && this.drinksField.current
            && this.ruleField.current)
        {
            let drinks = this.drinksField.current.value;
            let rule = this.ruleField.current.value;

            if(drinks === '')
            {
                drinks = this.state.rule.drinks;
            }

            if(rule === '')
            {
                rule = this.state.rule.rule;
            }

            let ruleObj = {...this.state.rule};
                ruleObj.rule = rule;
                ruleObj.drinks = drinks;
            
                ruleObj.gameKey = this.gameSelect.current.innerSelect.current.value;//.innerSelect.value;

            this.props.editRule(this.props.rule.gameKey,this.props.ruleIndex,ruleObj);

            this.setState({
                rule : ruleObj,
                editing : !editing
            });
        }
        /* this.setState({
            editing : !editing});

        if(editing)
        {
            let rule = {
            rule : this.ruleField.current ? this.ruleField.current.value : this.state.rule.rule,
            drinks : this.drinksField.current.value
        };
            this.props.editRule(this.props.rule.gameKey,this.props.ruleIndex,rule);
        }
        else
        {
            console.log(this.rule);
            //this.ruleField.current.focus();
        }

        this.setState({
            rule : rule
        }); */

    }

    handleRuleDelete = (e) => { 
        
        if(window.confirm(`Are you sure you want to Delete the rule ${this.state.rule.rule} (${this.state.rule.drinks})?`))
        {
            this.props.deleteRule(this.props.rule.gameKey,this.props.ruleIndex);

            this.setState({editing : false});
        }
    }

    renderRule = () =>
    {
        let input = <input className="RuleRow__title-field editable" onKeyUp={(e) => {

            this.closeOnEscape(e);

            if(e.which === 13)
            {
                this.handleRuleEdit();
            }
        }} type="text" ref={this.ruleField} defaultValue={this.state.rule.rule} />;
        let span = <span className="RuleRow__title-field">{this.state.rule.rule}</span>;

        return this.state.editing ? input : span;
    }

    componentWillMount()
    {
        this.setState({rule : this.props.rule});
        this.data = new DataHelper(this.props.games);
    }
    renderOwner = (ownerhash) => {
        
        let user = this.props.getUser(ownerhash);

        return <span className="RuleRow__owner">{user ? user.email : 'Unknown User'}</span>

    }
    renderDrinks = () => {
        let input = <input 
            className="RuleRow__drinks-field editable" 
            type="text" 
            disabled={!this.state.editing} 
            ref={this.drinksField} 
            defaultValue={this.props.rule.drinks}
            onKeyUp={(e) => {

                console.log(e.which);

                this.closeOnEscape(e);

                if(e.which === 13)
                {
                    this.handleRuleEdit();
                }
            }} />
        let span = <span className="RuleRow__drinks-field">{this.props.rule.drinks}</span>;

        return this.state.editing ? input : span;
    }

    handleDoubleClick = (e) => {
        
        if(!this.state.editing)
        {
            this.setState({editing : true});
        }
    }

    renderGame = (game) => {
        
        return this.state.editing ? 
                <GameSelect
                    games={this.props.games}
                    defaultValue={this.props.rule.gameKey}
                    ref={this.gameSelect} />
                : <Link to={`/game/${this.props.rule.gameKey}`} className="RuleRow__game-link">{game.title}</Link>;
    }

    closeOnEscape = (e) => {

        if(e.which === 27)
        {
            this.setState({editing : false});
        }
    }

    render()
    {
        let game = this.data.getGameByKey(this.props.rule.gameKey);

        return (
            <tr className="RuleRow" onDoubleClick={this.handleDoubleClick}>
                
                <td className="RuleRow__rule-cell">
                    {this.renderRule()}
                </td>
                <td className="RuleRow__drinks-cell">
                    {this.renderDrinks()}
                </td>
                <td className="RuleRow__game-cell">
                    {this.renderGame(game)}
                </td>
                <td className="RuleRow__owner-cell">
                    {this.renderOwner(this.props.rule.owner)}
                </td>
                <td className="RuleRow__controls-cell">
                    {this.props.canEditRule(this.props.rule) ? <EditButton handler={this.handleRuleEdit} /> : null}
                    {this.props.canDeleteRule(this.props.rule) ? <DeleteButton handler={this.handleRuleDelete} /> : null}
                </td>
            </tr>);
    }
}

export default RuleRow;