import React from 'react';
import PropTypes from 'prop-types';
import DataHelper from '../DataHelper';
import RuleRow from './RuleRow';

class RulesList extends React.Component
{
    state = {
        rules : undefined,
        currentFilter : '',
        order : null
    };

    static propTypes = {
        recursive : PropTypes.bool,
        index : PropTypes.string.isRequired,
        games : PropTypes.object.isRequired,
        editRule : PropTypes.func.isRequired,
        deleteRule : PropTypes.func.isRequired,
        getUser : PropTypes.func.isRequired,
        hiddenGames : PropTypes.array 
    };

    static defaultProps =  {
        recursive : false,
        hiddenGames : []
    }

    filterField = React.createRef();

    componentDidMount()
    {
        window.addEventListener('keydown',(e) => {
            
            if(this.filterField && this.filterField.current)//ctrl/cmd + shift + f
            {
                if((e.shiftKey && (e.metaKey || e.ctrlKey) && e.which === 70))
                {
                    this.filterField.current.focus();
                }
                else if(e.which === 27)
                {
                    this.filterField.current.value = '';
                    this.filterField.current.blur();
                    this.setState({currentFilter : ''});
                }
            }
        })
    }

    ruleMatchesFilter = (ruleText) => {

        //console.log(this.state.currentFilter,ruleText);

        if(this.state.currentFilter === '') return true;

        return this.state.currentFilter.toLowerCase().indexOf(ruleText.toLowerCase()) > -1 ||
            ruleText.toLowerCase().indexOf(this.state.currentFilter.toLowerCase()) > -1;
    }

    renderRuleRows = () =>
    {
        return <tbody>{this.data.forEach((key)=>{

            let rule = this.rules[key];

            

            if(this.ruleMatchesFilter(rule.rule) && !this.props.hiddenGames.includes(rule.gameKey))
            {
                return <RuleRow 
                    games={this.props.games}
                    key={key} 
                    rule={rule} 
                    ruleIndex={key}
                    gameIndex={this.props.index} 
                    deleteRule={this.deleteRule} 
                    editRule={this.props.editRule}
                    canEditRule={this.props.canEditRule}
                    canDeleteRule={this.props.canEditRule}
                    getUser={this.props.getUser}
                />
            }
            
        },this.rules)}</tbody>
    }

    onFilterKeyUp = (e) => {
    
        //e.preventDefault();
        let target = e.currentTarget;
        let val = target.value;

        this.setState({currentFilter : val});
        
    }

    deleteRule = (gameIndex,ruleIndex) => {

        let rules = {...this.rules};

        if(rules[ruleIndex])
        {
            delete rules[ruleIndex];
            this.setState({rules});

            //console.log(gameIndex,ruleIndex);
            this.props.deleteRule(gameIndex,ruleIndex);
        }
    }

    onHeaderCellClick = (e) => {
        let target = e.target;

        if(target)
        {
            let field = target.getAttribute('data-field');

            let order = this.state.order ? {...this.state.order} : {field : '',direction : ''};

            if(order.field === field)
            {
                order.direction = order.direction === 'asc' ? 'desc' : 'asc';
            }
            else
            {
                order.direction = 'asc';
                order.field = field;
            }

            this.setState({order});
        }
    }

    renderSortLabel = (field) => {

        if(!this.state.order) return null;

        return field === this.state.order.field ?
            this.state.order.direction === 'asc' ? <span className="RulesList__sort-direction fa fa-chevron-up"></span> : <span className="RulesList__sort-direction fa fa-chevron-down"></span>
            : null
    }

    getSnapshotBeforeUpdate(prevProps,prevState)
    {
        this.currentGameKey = this.props.index;

        return null;
    }

    getSnapshotAfterUpdate()
    {
        this.currentGameKey = this.props.index;
    }
    
    render()
    {
        if(this.currentGameKey !== this.props.index && this.currentGameKey)
        {
            setTimeout(() => {
                this.filterField.current.value = '';
                this.onFilterKeyUp({currentTarget : this.filterField.current});
            }, 1);
        }

        this.data = new DataHelper(this.props.games);

        this.rules = this.data.getGameRules(this.props.index,true);

        if(this.state.order)
        {
            this.rules = this.data.sortRules(this.rules,this.state.order);
            //console.log(this.rules);
        }

        return (
            <div className="RulesList">
                <header className="RulesList__header">
                    <input 
                        ref={this.filterField}
                        type="search" 
                        className="RulesList__filter-field" 
                        placeholder="Find A Rule" 
                        onKeyUp={this.onFilterKeyUp} />
                </header>
                
                <table cellPadding="0" cellSpacing="0">
                    <thead className="RulesList__header">
                        <tr>
                            <th className="RulesList__rule-cell" 
                                data-field="rule"
                                onClick={this.onHeaderCellClick}>Rule{this.renderSortLabel('rule')}</th>
                            <th className="RulesList__drinks-cell" 
                                data-field="drinks"
                                onClick={this.onHeaderCellClick}>Drinks{this.renderSortLabel('drinks')}</th>
                            <th className="RulesList__game-cell" 
                                data-field="game"
                                onClick={this.onHeaderCellClick}>Game{this.renderSortLabel('game')}</th>
                            {/* <th className="RulesList__owner-cell" 
                                data-field="owner">Owner</th> */}
                            <th className="RulesList__controls-cell">&nbsp;</th>
                        </tr>
                    </thead>
                    
                    {this.renderRuleRows()}
                </table>
            </div>);
    }
}

export default RulesList;