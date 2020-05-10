import React from 'react';
import DataHelper from '../DataHelper';
import PropTypes from 'prop-types';
import Alert from './Alert';
import GameListItem from './GameListItem';

class GameList extends React.Component
{
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

    renderGameList = () => {

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

            return this.data.forEach((key) => <GameListItem 
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
                canDeleteRule={this.props.canEditRule} />,childGames);
                
        }
    }


    render()
    {
        this.data = new DataHelper(this.props.games);

        //console.log('game list render');
        

        return (
            <ul className="GameList">
                {this.renderGameList()}
            </ul>);
    }
}

export default GameList;