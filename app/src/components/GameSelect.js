import React from 'react';
import PropTypes from 'prop-types'
import DataHelper from '../DataHelper';

class GameSelect extends React.Component
{
    static propTypes = {
        games : PropTypes.object.isRequired,
        defaultValue : PropTypes.string,
        excludedGames : PropTypes.array //doesn't work... yet
    };

    static defaultProps =  {
        includeToplevel : false,
        defaultValue : 'game0',
        onChange : function(e){},
        excludedGames : []
    }

    innerSelect = React.createRef();

    test = () => this.innerSelect;

    outPutOptions = () => {
        
        let options = [];

        this.data = new DataHelper(this.props.games);

        this.data.forEach((key) => {
            let game = this.data.getGameByKey(key);

            options.push(<option key={'game-select_' + key} value={key}>
                {game.title}
            </option>)
        },this.data.sortGamesBy('title','asc',this.props.games));

        return options;
    }
    render()
    {
        console.log(this.props.defaultValue);
        return (
            <select className="GameSelect" ref={this.innerSelect} onChange={this.props.onChange} defaultValue={this.props.defaultValue}>
                {/* this.props.includeToplevel ? <option value="">Top Level</option> : null */}
                {this.outPutOptions()}
            </select>);
    }
}

export default GameSelect;