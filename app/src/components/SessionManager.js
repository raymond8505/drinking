import React from 'react';
import PropTypes from 'prop-types'

class SessionManager extends React.Component
{
    static propTypes = {};
    static defaultTypes = {}

    state = {
        currentSession : this.props.currentSession
    }

    keyField = React.createRef();

    handleCreateSession = (e) => {
        
        this.props.createSession()

    }

    leaveSession = () => {
        this.setState({currentSession : undefined});
        this.props.leaveSession();
    }

    handleJoinSession = (e) => {

        let key = this.keyField.current.value;
        this.props.joinSession(key);
    }

    renderSessionButtons = () => {

        if(this.state.currentSession === undefined)
        {
            return (<div>
                        <button className="SessionManager__create-session" onClick={this.handleCreateSession}>Create Session</button>
                        <input type="text" className="SessionManager__key-field" ref={this.keyField} placeholder="Session Code" />
                        <button className="SessionManager__join-session" onClick={this.handleJoinSession}>Join Session</button>
                    </div>);
        }
        else
        {
            return <div className="SessionManager__current-session">
                <a title="Copy this link address and send to people you want to join the session" href={`/join/${this.state.currentSession}`} className="SeassionManager__session-key">{this.state.currentSession}</a>
                <button className="SessionManager__leave-session-btn" onClick={this.leaveSession}>Leave Session</button>
            </div>;
        }
    }

    render()
    {
        this.state.currentSession = this.props.currentSession;

        return (
            <div className="SessionManager">
                {this.renderSessionButtons()}
            </div>);
    }
}

export default SessionManager;