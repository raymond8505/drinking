import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import App from './App';
import NotFound from './NotFound';

class Router extends React.Component
{
    render()
    {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path="/game/:ID" render={(props) => <App {...props} mode="game" />} />
                    <Route exact path="/signup" render={(props) => <App {...props} mode="signup" />} />
                    <Route exact path="/" render={(props) => <App {...props} mode="games" />} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        );
    }
}

export default Router;