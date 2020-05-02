import React from 'react';
import PropTypes from 'prop-types';

class EditButton extends React.Component
{
    static propTypes = {
        handler : PropTypes.func.isRequired
    };

    state = {
        currentMode : 'display'
    };

    setEditing = (editing) => {
        this.setState({editing : editing});
    }

    handleClick = (e) => {
    
        e.preventDefault();

        this.setState ({ currentMode : this.state.currentMode === 'display' ? 'confirm' : 'display'});
        
        this.props.handler(e);
    }

    render()
    {
        return (
            <button className={`EditButton EditButton--${this.state.currentMode}`} onClick={this.handleClick} title="Edit Game">
                <span className="sr-only">
                    {this.state.currentMode === 'display' ? 'Edit' : 'Confirm'}
                </span>
                <i className="EditButton__icon" role="presentation"></i>
            </button>);
    }
}

export default EditButton;