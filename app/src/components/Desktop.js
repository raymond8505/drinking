import React from 'react';
import PropTypes from 'prop-types';
import Game from './Game';
import Games from './Games';
import Alert from './Alert';
import SessionManager from './SessionManager';
import {Link,withRouter} from 'react-router-dom';
import ShortcutsModal from './ShortCutsModal';

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

    shortcuts = React.createRef();

    showShortcuts = () => {
        this.shortcuts.current.show();
    }

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

                {this.props.mode === 'game' ? <div className="GameShell">
                <header className="App__header">
                    <span>
                        <Link to="/" className="App__home-link">Home</Link>
                        {this.props.renderAuthButton()}
                    </span>

                    <SessionManager
                        createSession={this.props.createSession}
                        leaveSession={this.props.leaveSession}
                        joinSession={this.props.joinSession}
                        currentSession={this.props.currentSession}
                    />
                    
                    <span className="App__current-user">
                        
                        {this.props.user.email}
                    </span>

                    <button className="App__shortcuts-ref" onClick={this.showShortcuts}>
                        <i className="fa fa-keyboard-o"></i>
                    </button>
                </header>
                <Game 
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
                             /></div> 
                        : <div className="Desktop__alert-shell"><Alert tag="div" type="info">Choose a game from the left hand menu</Alert></div>}
                <ShortcutsModal ref={this.shortcuts} />
            </main>);
    }
}

export default withRouter(Desktop);