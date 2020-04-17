import React from 'react';
import Alert from './Alert';
import {Link} from 'react-router-dom';

class Login extends React.Component
{
    userField = React.createRef();
    passwordField = React.createRef();

    authenticate = (e) => {
        
        console.log('loader auth');

        let user = this.userField.current.value;
        let pass = this.passwordField.current.value;

        this.props.authenticate(user,pass);
    }

    render()
    {
        return (
            <div className="Login">
                <form className="Login__form">
                    <h2>Login</h2>
                    <p>Sign in to start drinking</p>

                    {this.props.error ? <Alert type="error">{this.props.error}</Alert> : null}

                    <input type="text" required ref={this.userField} placeholder="Email" />
                    <input type="password" required ref={this.passwordField} placeholder="Password" />

                    <button type="button" className="Login__login" onClick={this.authenticate}>Turn Down For What</button>
                    <Link className="Login__signup " to="/signup">Get Started Turnin' Up</Link>
                </form>
            </div>);
    }
}

export default Login;