import React from 'react';
import PropTypes from 'prop-types'

class ComboCounter extends React.Component
{
    static propTypes = {};
    static defaultTypes = {}

    render()
    {
        return (
            <aside className="ComboCounter">
                <div class="ComboCounter__glass-wrap">
                    <div className="ComboCounter__shot-glass">
                        <div className="ComboCounter__shot-volume"></div>
                    </div>

                    <div className="ComboCounter__button-shell">
                        <button className="ComboCounter__remove-drink-btn">-</button>
                        <button className="ComboCounter__clear-drinks-btn">&times;</button>
                    </div>
                </div>
                
                <button className="ComboCounter__add-drink-btn">+</button>
            </aside>);
    }
}

export default ComboCounter;