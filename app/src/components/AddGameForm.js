import React from 'react';
import PropTypes from 'prop-types'
import GameMultiSelect from './GameMultiSelect';
//import DataHelper from '../DataHelper';

//import {GENERAL_RULES_KEY} from '../constants';

class AddGameForm extends React.Component
{
    static propTypes = {
        games : PropTypes.object.isRequired,
        addGame : PropTypes.func.isRequired,
        parent : PropTypes.array,
        listenForShortcuts : PropTypes.bool
    };

    static defaultProps =  {
        parent : ['game0'],
        listenForShortcuts : false
    };

    titleField = React.createRef();
    gameSelect = React.createRef();

    resetForm = () => {
        this.clearForm();
        this.titleField.current.focus();
    }

    clearForm = () => {
        this.titleField.current.value = '';
        this.gameSelect.current.clearGames();
    }

    onKeyUp = (e) => {

        //console.log('key up');
        
        if(this.props.listenForShortcuts && e.which === 13) // Enter
        {
            this.onAddGameClick();
            e.preventDefault();
        }
    }

    onAddGameClick = (e) => {

       //console.log(this.gameSelect.current.innerSelect.current.value);

        let title = this.titleField.current.value;
        let parents = this.gameSelect.current.state.selectedGames;//.value;

        // if(title === '' || !parent || parent === '')
        // {
        //     //if the parent or title arent filled,  don't do anything. The alerts below were firing twice
        //     //when hitting enter on the Add Game button so this return prevents the alert when a game is successfully being added

        //     return; //todo: figure out WHY keyup fires on the button too
            
        //     // if(title === '')
        //     // {
        //     //     alert('Please enter a game title');
        //     // }
        //     // else if(!parent || parent === '')
        //     // {
        //     //     alert('Please choose a parent from the drop down.');
        //     // }
            
        //     // return;
        // }
        
        this.props.addGame(title,parents);
        this.resetForm();
    }

    //handle all error or info events from multiselect
    onMultiSelectError = (e) => {
        console.log(e);
    }

    render()
    {
        //console.log(this.props);
        //let data = new DataHelper(this.props.games);

        return (
            <div className="AddGameForm">
                {/* <label>Parent Game</label>  */}<GameMultiSelect
                    games={this.props.games}
                    includeToplevel={true}
                    defaultValue={this.props.parent}
                    ref={this.gameSelect}
                    placeholder="Add a Parent Game"
                    onError={this.onMultiSelectError}
                />
                <input type="text" placeholder="Game Title" ref={this.titleField} onKeyUp={this.onKeyUp} />
                <button type="text" onClick={this.onAddGameClick}>Add Game</button>
            </div>);
    }
}

export default AddGameForm;