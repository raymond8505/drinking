import React from 'react';
import PropTypes from 'prop-types';
import GameList from './GameList';
import EditButton from './EditButton';
import DeleteButton from './DeleteButton';
import { Link } from "react-router-dom";
import DataHelper from '../DataHelper';

class GameListItem extends React.Component
{
    titleField = React.createRef();

    state = {
        editing :false,
        game : {}
    }

    static propTypes = {
        index : PropTypes.string.isRequired,
        game : PropTypes.object.isRequired,
        games : PropTypes.object.isRequired,
        showChildren : PropTypes.bool,
        editGame : PropTypes.func.isRequired,
        deleteGame : PropTypes.func.isRequired,
        copyGame : PropTypes.func.isRequired,
        userLoggedIn : PropTypes.func.isRequired
    };

    static defaultProps =  {
        showChildren :  false
    }

    onAddEditClick = (e) => {

        let editing = !this.state.editing;

        if(!editing)
        {
            this.props.game.title = this.titleField.current.value;
            this.props.editGame(this.props.index,this.props.game);
        }

        this.setState({editing : editing});
    }

    onDeleteClick = (e) => {
        if(window.confirm(`Are you sure you want to delete "${this.game.title}"`))
        {
            this.props.deleteGame(this.props.index);
        }
        
    }

    componentWillMount()
    {
        this.setState({game : this.props.game});
        
    }

    //onClick={(e) => this.props.history.push(`/game/${this.props.index}`)} 
    onNameInputKeyPress = (e) => {
        
        if(e.which === 13) //enter
        {
            this.onAddEditClick();
        }
    }
    renderName = () => {
        let input = <input 
                        onClick={this.viewGame} 
                        name="GameListItem__title" 
                        ref={this.titleField} 
                        className="GameListItem__title editable" 
                        onKeyPress={this.onNameInputKeyPress}
        defaultValue={this.game.title} />;
        const link = <Link 
                        to={`/game/${this.props.index}`}
                        className="GameListItem__title" 
                        >
                        {this.game.title}
                        </Link>;

        return this.state.editing ? input : link;
    }

    handleDoubleClick = (e) => {
        
        if(!this.state.editing)
        {
            this.setState({editing : true});
        }
    }

    onCopyClick = (e) =>
    {
        this.props.copyGame(this.props.index);
    }

    componentDidUpdate()
    {
        if(this.titleField && this.titleField.current)
        {
            this.titleField.current.focus();
        }
    }
    
    render()
    {

        this.data = new DataHelper(this.props.games);

        this.game = this.data.getGameByKey(this.props.index);

        //console.log(this.game);

        //console.log(this.props.canDeleteGame);

        return (
            <li className="GameListItem" id={this.props.index} onDoubleClick={this.handleDoubleClick}>
                <header className="GameListItem__header">
                    {this.renderName()}

                    <span className="GameListItem__controls-shell">
                        {this.props.canEditGame(this.game) ? <EditButton handler={this.onAddEditClick} /> : null}
                        {this.props.canDeleteGame(this.props.index) ? <DeleteButton handler={this.onDeleteClick} /> : null}
                        {this.props.userLoggedIn() ? <button type="button" className="GameListItem__copy-btn" onClick={this.onCopyClick}>
                            <span className="sr-only">duplicate this game</span>
                            <i className="fa fa-copy"></i>
                        </button> : null}
                    </span>

                </header>
                {
                    this.props.showChildren ? <GameList 
                        game={this.game} 
                        games={this.props.games} 
                        parent={this.props.index}
                        canEditGame={this.props.canEditGame}
                        canEditRule={this.props.canEditRule}
                        canDeleteGame={this.props.canDeleteGame}
                        canDeleteRule={this.props.canEditRule}
                        copyGame={this.props.copyGame} /> : null
                }     
            </li>);
    }
}

export default GameListItem;