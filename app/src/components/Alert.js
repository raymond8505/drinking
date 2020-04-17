import React from 'react';
import PropTypes from 'prop-types';

class Alert extends React.Component
{
    static propTypes = {
        tag : PropTypes.string,
        type : PropTypes.string
    };
    
    static defaultProps = {
        tag : 'span',
        type : 'info'
    };

    render()
    {
        const Tag = `${this.props.tag}`;

        return (
            <Tag className={`Alert Alert--${this.props.type}`}>
                {this.props.children}
            </Tag>);
    }
}

export default Alert;