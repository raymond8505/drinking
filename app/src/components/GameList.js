import React from 'react';
import DataHelper from '../DataHelper';
import PropTypes from 'prop-types';
import Alert from './Alert';
import GameListItem from './GameListItem';

class GameList extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            filter : ''
        };
    }
    static propTypes = {
        editGame : PropTypes.func.isRequired,
        deleteGame : PropTypes.func.isRequired,
        userLoggedIn : PropTypes.func.isRequired,
        games : PropTypes.object.isRequired, //the object of all raw games data from App.state.games
        parent : PropTypes.string, //the key of the parent game, for which to show child games. Undefined = top level games
        currentIndex : PropTypes.string
    };

    static defaultProps =  {
        parent : undefined,
        currentIndex : undefined
    }

    componentWillMount()
    {
        this.data = new DataHelper(this.props.games);
    }

    gameMatchesFilter = (gameKey) => {

        if(this.state.filter === '') return true;

        let game = this.data.getGameByKey(gameKey);
        let title = game.title.toLowerCase();
        let q = this.state.filter.toLowerCase();

        return title.indexOf(q) > -1;
    }

    renderGameList = () => {

        let _this = this;

        if(!this.data || !this.data.hasData())
        {
            //console.log('te');
            return <Alert type="error" tag="li">No Games</Alert>
        }
        else
        {
            this.data = new DataHelper(this.props.games);

            //return null;

            //console.log(this.props.currentIndex);
            
            //this.prop
            let childGames = this.props.parent !== undefined ? 
                this.data.getChildGames(this.props.parent) : this.data.sortGamesBy('title','asc',this.props.games);

            childGames = this.data.sortGamesBy('title','asc',childGames);

            return this.data.forEach((key) => {
        
                return this.gameMatchesFilter(key) ? <GameListItem 
                    deleteGame={this.props.deleteGame} 
                    editGame={this.props.editGame}
                    copyGame={this.props.copyGame} 
                    key={key} 
                    index={key} 
                    games={childGames} 
                    game={this.data.getGameByKey(key)}
                    highlight={this.props.currentIndex === key}
                    canEditGame={this.props.canEditGame}
                    canEditRule={this.props.canEditRule}
                    canDeleteGame={this.props.canDeleteGame}
                    userLoggedIn={this.props.userLoggedIn}
                canDeleteRule={this.props.canEditRule} /> : null;
            },childGames);
                
        }
    }

    handleFilterKeyUp = (e) => {

        let q = e.currentTarget.value;

        if(e.which === 27)
        {
            q = e.currentTarget.value = '';
        }

        this.setState({filter : q});
    }

    render()
    {
        this.data = new DataHelper(this.props.games);

        //console.log('game list render');
        

        return (
            <div className="GameList">
                <input className="GameList__filter-field" placeholder="Find a Game" onKeyUp={this.handleFilterKeyUp} />
                <ul className="GameList__items">
                    {this.renderGameList()}
                </ul>
            </div>);
    }
}

export default GameList;