import React from 'react';
import PropTypes from 'prop-types';
import Game from './Game';
import Games from './Games';
import Alert from './Alert';

class Desktop extends React.Component
{
    static propTypes = {
        games : PropTypes.object.isRequired,
        editRule : PropTypes.func.isRequired,
        deleteRule : PropTypes.func.isRequired,
        deleteGame : PropTypes.func.isRequired,
        addRule : PropTypes.func.isRequired,
        editGame : PropTypes.func.isRequired,
        addGame : PropTypes.func.isRequired,
        userLoggedIn : PropTypes.func.isRequired,
        getUser : PropTypes.func.isRequired
    };

    static defaultProps =  {}

    render()
    {
        //console.log(this.props.games);
        //console.log(this.props.canDeleteGame);

        return (
            <main className="Desktop">
                <Games 
                    games={this.props.games} 
                    editGame={this.props.editGame} 
                    addGame={this.props.addGame} 
                    deleteGame={this.props.deleteGame}
                    canEditGame={this.props.canEditGame}
                    canEditRule={this.props.canEditRule}
                    canDeleteGame={this.props.canDeleteGame}
                    canDeleteRule={this.props.canEditRule}
                    copyGame={this.props.copyGame}
                    userLoggedIn={this.props.userLoggedIn}
                    getUser={this.props.getUser}
                     />

                {this.props.mode === 'game' ? <Game 
                            index={this.props.match.params.ID} 
                            games={this.props.games} 
                            editRule={this.props.editRule} 
                            deleteRule={this.props.deleteRule}
                            deleteGame={this.props.deleteGame}
                            addRule={this.props.addRule}
                            editGame={this.props.editGame}
                            addGame={this.props.addGame}
                            canEditGame={this.props.canEditGame}
                            canEditRule={this.props.canEditRule}
                            canDeleteGame={this.props.canDeleteGame}
                            canDeleteRule={this.props.canEditRule}
                            copyGame={this.props.copyGame}
                            userLoggedIn={this.props.userLoggedIn}
                            getUser={this.props.getUser}
                            setSessionCombo={this.props.setSessionCombo}
                            currentComboCount={this.props.currentComboCount}
                             /> 
                        : <div className="Desktop__alert-shell"><Alert tag="div" type="info">Choose a game from the left hand menu</Alert></div>}
            </main>);
    }
}

export default Desktop;