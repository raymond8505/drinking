import React from 'react';
import PropTypes from 'prop-types';

class ComboCounter extends React.Component
{
    static propTypes = {};
    static defaultTypes = {};

    state = {
        count : 0,
        animating : false,
        open : true
    }

    maxCombo = 10;

    animateSpeed = 180;

    componentWillMount()
    {
        window.addEventListener('keyup', this.onGlobalKeyPress);
    }

    onGlobalKeyPress = (e) => {

        switch(e.which)
        {
            case 107 : //plus
                this.addDrink();
                break;
            case 109 : //minus
                this.removeDrink();
                break;
            case 106 : //multiply / asterisk (to clear)
                this.clearDrinks();
                break;

            default : break;
        }
    }

    addDrink = () => {

        if(this.state.count < this.maxCombo)
        {
            this.setState({
                count : this.state.count + 1,
            });
        }
    }

    removeDrink = () =>
    {
        if(this.state.count > 0)
        {
            this.setState({
                count : this.state.count - 1
            });
        }
    }

    clearDrinks = () => {

        this.setState({
            count : 0
        });
    }

    handleRemoveDrinkClick = (e) => {

        if(this.state.count > 0)
        {
            this.removeDrink();    
            this.animateCount();
        }
    }

    handleClearDrinksClick = (e) => {

        this.clearDrinks();
    }

    animateCount = () => {
        
        this.setState({
            animating : true
        });

        setTimeout(() => {
            this.setState({
                animating : false
            });
    
        }, this.animateSpeed);
    }

    handleAddDrinkClick = (e) => {

        if(this.state.count < this.maxCombo)
        {
            this.addDrink();
    
            this.animateCount();
        }
        
    }

    calcShotHeight = () => {
        
        if(this.state.count === 0) return 0;

        return ((this.state.count / this.maxCombo) * 100) + '%';
    }

    handleToggleClick = (e) => {

        this.setState({
            open : !this.state.open
        })
    }

    render()
    {
        return (
            <aside className={`ComboCounter${this.state.animating ? ' ComboCounter--animating' : ' ComboCounter--animated'}${this.state.count === this.maxCombo ? ' ComboCounter--full' : ''}${this.state.count === 0 ? ' ComboCounter--empty' : ''}${this.state.open ? ' ComboCounter--open' : ' ComboCounter--closed'}`}>
                
                <button className="ComboCounter__toggle-btn ComboCounter__toggle-btn--open" onClick={this.handleToggleClick}>
                    <i className="fa fa-chevron-left"></i>
                </button>
                
                <div className="ComboCounter__count">
                    {this.state.count}
                </div>

                <div class="ComboCounter__glass-wrap">

                    <div className="ComboCounter__shot-glass">
                        <div className="ComboCounter__shot-volume" style={{height : this.calcShotHeight()}}></div>
                    </div>

                    <div className="ComboCounter__button-shell">
                        <button className="ComboCounter__remove-drink-btn" onClick={this.handleRemoveDrinkClick}>-</button>
                        <button className="ComboCounter__clear-drinks-btn" onClick={this.handleClearDrinksClick}>&times;</button>
                    </div>
                </div>
                
                <button className="ComboCounter__add-drink-btn" onClick={this.handleAddDrinkClick}>+</button>

                <button className="ComboCounter__toggle-btn ComboCounter__toggle-btn--close" onClick={this.handleToggleClick}>
                    <i className="fa fa-chevron-right"></i>
                </button>

            </aside>);
    }
}

export default ComboCounter;