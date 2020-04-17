import React from 'react';
import PropTypes from 'prop-types'
import DataHelper from '../DataHelper';

class GameSelect extends React.Component
{
    static propTypes = {
        games : PropTypes.object.isRequired,
        defaultValue : PropTypes.string
    };

    static defaultProps =  {
        includeToplevel : false,
        defaultValue : 'game0',
        onChange : function(e){}
    }

    innerSelect = React.createRef();

    test = () => this.innerSelect;

    outPutOptions = () => {
        
        let options = [];

        this.data = new DataHelper(this.props.games);

        this.data.forEach((key) => {
            let game = this.data.getGameByKey(key);

            options.push(<option key={'game-select_' + key} value={key} selected={key === this.props.defaultValue ? 'selected' : ''}>
                {game.title}
            </option>)
        },this.data.sortGamesBy('title','asc',this.props.games));

        return options;
    }
    render()
    {
        return (
            <select className="GameSelect" ref={this.innerSelect} onChange={this.props.onChange}>
                {/* this.props.includeToplevel ? <option value="">Top Level</option> : null */}
                {this.outPutOptions()}
            </select>);
    }
}

export default GameSelect;