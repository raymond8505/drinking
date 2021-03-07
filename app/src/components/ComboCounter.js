import React from 'react';
import PropTypes from 'prop-types';

class ComboCounter extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            //count : 0,
            animating : false,
            open : false
        }
    }
    static propTypes = {
        setSessionCombo : PropTypes.func.isRequired,
        count : PropTypes.number
    };
    
    static defaultProps = {
        count : 0
    };

    

    maxCombo = 10;

    animateSpeed = 180;

    componentWillMount()
    {
        window.addEventListener('keyup', this.onGlobalKeyPress);
    }

    onGlobalKeyPress = (e) => {

        let targetTag = e.target.tagName.toLowerCase();

        if(targetTag === 'input' || 
            targetTag === 'textarea' || 
            targetTag === 'select') return;

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

        if(this.props.count < this.maxCombo)
        {
            let count = this.props.count + 1;

            this.props.setSessionCombo(count);
            
        }
    }

    removeDrink = () =>
    {
        if(this.props.count > 0)
        {
            this.props.setSessionCombo(this.props.count - 1);
        }
    }

    clearDrinks = () => {

        this.props.setSessionCombo(0);
        
    }

    handleRemoveDrinkClick = (e) => {

        if(this.props.count > 0)
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

        if(this.props.count < this.maxCombo)
        {
            this.addDrink();
    
            this.animateCount();
        }
        
    }

    calcShotHeight = () => {
        
        if(this.props.count === 0) return 0;

        return ((this.props.count / this.maxCombo) * 100) + '%';
    }

    handleToggleClick = (e) => {

        this.setState({
            open : !this.state.open
        })
    }


    render()
    {
        //console.log(this.state);

        return (
            <aside className={`ComboCounter${this.state.animating ? ' ComboCounter--animating' : ' ComboCounter--animated'}${this.props.count === this.maxCombo ? ' ComboCounter--full' : ''}${this.props.count === 0 ? ' ComboCounter--empty' : ''}${this.state.open ? ' ComboCounter--open' : ' ComboCounter--closed'}`}>
                
                <button className="ComboCounter__toggle-btn ComboCounter__toggle-btn--open" onClick={this.handleToggleClick}>
                    <i className="fa fa-chevron-left"></i>
                </button>
                
                <div className="ComboCounter__count">
                    {this.props.count}
                </div>

                <div className="ComboCounter__glass-wrap">

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