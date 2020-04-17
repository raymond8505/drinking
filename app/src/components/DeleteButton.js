import React from 'react';
import PropTypes from 'prop-types';

class DeleteButton extends React.Component
{
    static propTypes = {
        handler : PropTypes.func.isRequired
    };

    state = {
        currentMode : 'display'
    };

    handleClick = (e) => {
    
        e.preventDefault();

        this.setState ({ currentMode : this.state.currentMode === 'display' ? 'confirm' : 'display'});
        
        this.props.handler(e);
    }

    render()
    {
        return (
            <button className={`DeleteButton DeleteButton--${this.state.currentMode}`} onClick={this.handleClick}>
                <span className="sr-only">
                    {this.state.currentMode === 'display' ? 'Edit' : 'Confirm'}
                </span>
                <i className="DeleteButton__icon" role="presentation"></i>
            </button>);
    }
}

export default DeleteButton;