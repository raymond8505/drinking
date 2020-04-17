import React from 'react';
import Alert from './Alert';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

class Signup extends React.Component
{
    userField = React.createRef();
    passwordField = React.createRef();
    passwordField2 = React.createRef();

    state = {
        error : null
    }

    static propTypes = {
        error : PropTypes.string
    }

    static defaultProps =  {
        error : null
    }

    componentWillMount()
    {
        this.setState({error : this.props.error});
    }

    signup = (e) => {

        let user = this.userField.current.value;
        let pass1 = this.passwordField.current.value;
        let pass2 = this.passwordField2.current.value;

        if(pass1 !== pass2)
        {
            //console.log(pass1,pass2);
            this.setState({error : `Passwords don't match`});
        }
        else
        {
            this.props.signup(user,pass1);
        }
        
    }

    render()
    {
        //console.log('signup render');

        let error = this.props.error || this.state.error;

        return (
            <div className="Signup">
                <form className="Signup__form">
                    <h2>Signup</h2>
                    <p>Sign in to start drinking</p>

                    {error ? <Alert type="error">{error}</Alert> : null}

                    <input type="text" required ref={this.userField} placeholder="Email" />
                    <input type="password" required ref={this.passwordField} placeholder="Password" />
                    <input type="password" required ref={this.passwordField2} placeholder="Confirm Password" />

                    <button type="button" className="Signup__Signup" onClick={this.signup}>Turn Down For What</button>
                </form>
            </div>);
    }
}

export default Signup;