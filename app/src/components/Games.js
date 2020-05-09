import React from 'react';
import DataHelper from '../DataHelper';
import GameList from './GameList';
import AddGameForm from './AddGameForm';
import PropTypes from 'prop-types';

class Games extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            visible : true
        };

        setTimeout(() => {
            this.setState({visible : false});
        }, 1500);
    }
    static propTypes = {
        editGame : PropTypes.func.isRequired,
        games : PropTypes.object.isRequired,
        addGame : PropTypes.func.isRequired,
        userLoggedIn : PropTypes.func.isRequired
    }

    static defaultProps =  {
        parent : 'game0'
    };

    data = null;

    onToggleClick = (e) => {
        this.setState({
            visible : !this.state.visible
        });
    }

    render()
    {
        this.data = new DataHelper(this.props.games);

        let games = this.props.games;//this.data.sortGamesBy('title','asc');
        
        //console.log(this.props.canDeleteGame);
        
        return (
            <div className={`Games ${this.state.visible ? 'Games--visible' : ''}`}>
                <button 
                    type="button" 
                    className="Games__toggle-btn"
                    onClick={this.onToggleClick}
                >
                    {this.state.visible ? <i className="fa fa-chevron-left"></i> : <i class="fa fa-bars"></i>}
                </button>
                <h1>Drinking Games</h1>

                <GameList 
                    games={games} 
                    deleteGame={this.props.deleteGame} 
                    editGame={this.props.editGame}
                    canEditGame={this.props.canEditGame}
                    canEditRules={this.props.canEditRules}
                    canDeleteGame={this.props.canDeleteGame}
                    canDeleteRules={this.props.canEditRules}
                    copyGame={this.props.copyGame}
                    userLoggedIn={this.props.userLoggedIn}
                     />

                {this.props.userLoggedIn() ? 
                    <section className="Games__add-a-game">
                        <h2>Add a Game</h2>
                        <AddGameForm
                                games={this.props.games}
                                listenForShortcuts={true}
                                addGame={this.props.addGame} />
                    </section> 
                : null}
            </div>);
    }
}

export default Games;