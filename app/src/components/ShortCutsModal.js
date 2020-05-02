import React from 'react';
//import PropTypes from 'prop-types'

class ShortcutsModal extends React.Component
{
    //static propTypes = {};
    
    //static defaultTypes = {}

    state = {
        open : false
    }

    shortcuts = [
        {
            combo : '+ (plus)',
            desc : 'Adds a drink to the Combo Counter'
        },
        {
            combo : '- (minus)',
            desc : 'Removes a drink from the Combo Counter'
        },
        {
            combo : '* (asterisk)',
            desc : 'Resets the Combo Count to 0'
        },
        {
            combo : 'cmd / ctrl + shift + F',
            desc : 'Focuses the rule filter field in a Game to filter the rules'
        },
        {
            combo : 'option / alt + R',
            desc : 'Focus Add a Rule form'
        }

    ]

    show = () => {
        //this.dialog.current.showModal();
        this.setState({open : true});
    }

    close = () => {
        this.setState({open : false});
    }

    renderShortcuts = () => {

        return this.shortcuts.map((shortcut,i) => {
            return (<li key={`shortcut_${i}`} className="ShortcutsModal__shortcut">
                <div className="ShortcutsModal__shortcut-keys">
                    {shortcut.combo}
                </div>
                <div className="ShortcutsModal__shortcut-description">
                    {shortcut.desc}
                </div>
            </li>);
        });
    }

    componentWillMount()
    {

        window.addEventListener('keyup',(e) => {

            if(e.which === 27)
            {
                this.close();
            }
        })
    }

    render()
    {
        return (
            <div className={`ShortcutsModal${this.state.open ? ' ShortcutsModal--open' : ''}`}>
                <div className="ShortcutsModal__dialog">
                    <header className="ShortcutsModal__dialog-header">
                        <h2 className="ShortcutsModal__title">Keyboard Shortcuts</h2>
                        <button className="ShortcutsModal__close-btn" onClick={this.close}>&times;</button>
                    </header>
                    <div className="ShortcutsModal__body">
                        <ul className="ShortcutsModal__shortcuts">
                            {this.renderShortcuts()}
                        </ul>
                    </div>
                </div>
            </div>);
    }
}

export default ShortcutsModal;