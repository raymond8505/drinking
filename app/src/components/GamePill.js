import React from 'react';
import PropTypes from 'prop-types'

class GamePill extends React.Component
{
    static propTypes = {
        game : PropTypes.object.isRequired,
        tag : PropTypes.string,
        onClick : PropTypes.func,
        onClose : PropTypes.func,
        showCloseBtn : PropTypes.bool
    };

    static defaultProps = {
        tag : 'li',
        showCloseBtn : true
    }

    onClose = (e) => {

        this.props.onClose(e,this.props.game);
    }

    render()
    {
        const Tag = `${this.props.tag}`;

        return (
            <Tag className={`GamePill GamePill--${this.props.game.gameKey}`}>
                {this.props.game.title}
                {this.props.showCloseBtn ? <button className="GamePill__close-btn" onClick={this.onClose}>&times;</button> : null}
            </Tag>);
    }
}

export default GamePill;