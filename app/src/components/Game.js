import React from 'react';
import DataHelper from '../DataHelper';
import PropTypes from 'prop-types';
import NotFound from './NotFound';
import RulesList from './RulesList';
import AddRulesForm from './AddRulesForm';
import GameList from './GameList';
import AddGameForm from './AddGameForm';
import {changePageTitle} from '../helpers';
import GameSelect from './GameSelect';
import EditButton from './EditButton';
import GameListItem from './GameListItem';
import DeleteButton from './DeleteButton';
import {Link} from 'react-router-dom';
import ComboCounter from './ComboCounter';

class Game extends React.Component
{
    state = {
        game : undefined,
        editing : false
    }

    static propTypes = {
        index : PropTypes.string.isRequired,
        games : PropTypes.object,
        editRule : PropTypes.func.isRequired,
        deleteRule : PropTypes.func.isRequired,
        editGame : PropTypes.func.isRequired,
        deleteGame : PropTypes.func.isRequired,
        canEditGame : PropTypes.func.isRequired,
        canDeleteGame : PropTypes.func.isRequired,
        getUser : PropTypes.func.isRequired
    }

    titleInput = React.createRef();
    editButton = React.createRef();
    shell = React.createRef();

    onParentChange = (e) => {
        
        let newParent = e.currentTarget.value;

        let thisGameKey = this.props.index;

        let game = {...this.data.getGameByKey(thisGameKey)};

        game.parent_game = newParent;

        console.log(game);

        this.props.editGame(thisGameKey,game);
    }

    handleTitleEditClick = (e) => {

        if(this.state.editing)
        {
            let game = this.data.getGameByKey(this.props.index);
            let newTitle = this.titleInput.current.value;//.replace(/(^[ ]+|[ ]+$)/,'');

            if(newTitle === '')
            {
                this.titleInput.current.value = game.title;
            }
            else if(this.titleInput.current.value !== game.title)
            {
                game.title = this.titleInput.current.value;
                this.props.editGame(this.props.index,game);
            }
            
        }
        else
        {
            this.titleInput.current.focus();
            
        }
        
        this.setState({editing : !this.state.editing});
    }

    componentDidUpdate()
    {
        if(this.state.editing)
        {
            this.titleInput.current.focus();
        }

        this.shell.current.scrollTo(0,0);
    }


    onDeleteClick = (e) => {
        this.data = new DataHelper(this.props.games);

        let game = this.data.getGameByKey(this.props.index);

        if(window.confirm(`Are you sure you want to delete "${game.title}"?`))
        {
            this.props.deleteGame(this.props.index);
        }
        
    }

    renderBreadCrumbs = () => {

        let ancestors = this.data.getAncestors(this.props.index);

        let html = [];

        ancestors.forEach((ancestor,i) => {

            html.push(<Link to={`/game/${ancestor.key}`}>
                {ancestor.game.title}
            </Link>);
    
            if(i < ancestors.length - 1)
            {
                html.push(<span class="Game__parent-delimiter">&gt;</span>);
            }
        });

        return html;
    }

    render()
    {
        this.data = new DataHelper(this.props.games);

        let game = this.data.getGameByKey(this.props.index);

        let parentGame = game.parent_game ? this.data.getGameByKey(game.parent_game) : null;

        if(!game) return NotFound;

        changePageTitle(game.title + ' | Drinking Games'); 
        
        return (
            <div className="Game" ref={this.shell}>
                <ComboCounter setSessionCombo={this.props.setSessionCombo} count={this.props.currentComboCount} />
                {this.renderBreadCrumbs()}
                <h1 className="Game__title">
                    <input 
                        name={this.props.index + Date.now()} 
                        key={this.props.index + Date.now()} 
                        type="text" 
                        defaultValue={game.title}
                        ref={this.titleInput}
                        disabled={!this.state.editing}
                        className="Game__title-value editable"
                        onKeyPress={(e) => {
                            if(e.which === 13)
                            {
                                this.handleTitleEditClick();
                            }
                        }} />
                    {this.props.canEditGame(this.props.index) ? <div className="Game__parent-change-select">
                    
                        <label>Parent:</label>  <GameSelect
                            onChange={this.onParentChange}
                            defaultValue={this.data.getGameByKey(this.props.index).parent_game}
                            games={this.props.games}
                            
                        />
                        <EditButton handler={this.handleTitleEditClick} ref={this.editButton} />
                        {this.props.canDeleteGame(this.props.index) ? <DeleteButton handler={this.onDeleteClick} /> : null}
                     </div> : null}
                     
                </h1>

                <section className="Game__rules">
                <h2>Rules</h2>

                <RulesList 
                    games={this.props.games} 
                    index={this.props.index} 
                    recursive={true} 
                    deleteRule={this.props.deleteRule} 
                    editRule={this.props.editRule}
                    canEditRule={this.props.canEditRule}
                    canDeleteRule={this.props.canEditRule}
                    getUser={this.props.getUser} />

                </section>

                {this.props.userLoggedIn() ? <section className="Game__add-rules">
                    

                    <h3>Add Rule</h3>    

                    <AddRulesForm 
                        games={this.props.games} 
                        gameIndex={this.props.index}
                        addRule={this.props.addRule} />
                </section> : null}

                <section className="Game__child-games">
                    <h2>Sub Games</h2>    

                    <GameList 
                        parent={this.props.index} 
                        editGame={this.props.editGame} 
                        games={this.props.games}
                        deleteGame={this.props.deleteGame}
                        canEditGame={this.props.canEditGame}
                        canEditRule={this.props.canEditRule}
                        canDeleteGame={this.props.canDeleteGame}
                        canDeleteRule={this.props.canEditRule}
                        userLoggedIn={this.props.userLoggedIn}
                        />
                    
                    <h3>Add A Sub Game</h3>

                    {this.props.userLoggedIn() ? <AddGameForm
                        games={this.props.games}
                        parent={this.props.index}
                        addGame={this.props.addGame} /> : null }
                </section>
            </div>);
    }
}

export default Game;