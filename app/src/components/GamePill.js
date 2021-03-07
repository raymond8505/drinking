import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import EyeButton from './EyeButton';
import {getHiddenGames} from '../localStorageManager';

class GamePill extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            visible : 
            !getHiddenGames(this.props.childKey).includes(this.props.game.gameKey)
        };
    }

    static propTypes = {
        game : PropTypes.object.isRequired,
        parentKey : PropTypes.string.isRequired,
        childKey : PropTypes.string.isRequired,
        tag : PropTypes.string,
        onClick : PropTypes.func,
        onClose : PropTypes.func,
        showCloseBtn : PropTypes.bool,
        showVisibilityBtn : PropTypes.bool,
        linkGame : PropTypes.bool,
        onVisibilityToggle : PropTypes.func
    };

    static defaultProps = {
        tag : 'li',
        showCloseBtn : true,
        linkGame : false,
        showVisibilityBtn : true
    }

    onClose = (e) => {

        this.props.onClose(e,this.props.game);
    }

    toggleGameVisibility = (show) => {
        
        const parentKey = this.props.game.gameKey;
        const childKey = this.props.childKey;

        this.props.onVisibilityToggle(show,parentKey,childKey);

        this.setState({
            visible : show
        })
    }

    render()
    {
        const Tag = `${this.props.tag}`;

        return (
            <Tag className={`GamePill GamePill--${this.props.game.gameKey} ${this.state.visible ? ' GamePill--visible' : ''}`}>
                {this.props.showVisibilityBtn ? 
                    <EyeButton 
                        onClick={this.toggleGameVisibility} 
                        open={this.state.visible} />
                : null}
                {this.props.linkGame ? <Link to={`/game/${this.props.game.gameKey}`}>{this.props.game.title}</Link> : this.props.game.title}
                {this.props.showCloseBtn ? <button className="GamePill__close-btn" onClick={this.onClose}>&times;</button> : null}
            </Tag>);
    }
}

export default GamePill;