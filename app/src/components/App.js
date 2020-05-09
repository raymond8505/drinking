import React from 'react';
//import Games from './Games';
//import Game from './Game';
//import NotFound from './NotFound';
import fakeGames from '../fakeGames.js';
import DataHelper from '../DataHelper';
import Loader from './Loader';
import Desktop from './Desktop';
import Login from './Login';
import firebase from 'firebase';
import base from '../base';
import Signup from './Signup';
import {GENERAL_RULES_KEY,RAYMOND_UID} from '../constants';
import {Link,withRouter} from 'react-router-dom';
import ShortCutsModal from './ShortCutsModal';

class App extends React.Component
{
    state = {
        games : {},
        mobile : false,
        user : {uid : ''},
        users : {},
        loading : true,
        signupError : null,
        loginError : null,
        loggingIn : false,
        currentSession : undefined,
        sessions : {},
        gamesInited : false
    }

    

    sessionKeyLength = 4;

    sessionLife = 1000 * 60 * 60 * 24;//24 hours

    shortCutsModal = React.createRef();
    
    editGame = (key,game) => {
        
        const games = {...this.state.games};

        games[key] = game;

        this.setState({games});
    }

    getCurrentSessionComboCount = () => {
        return this.inASession() ? this.state.sessions[this.state.currentSession].currentComboCount : 0;
    }

    setSession = (key) => {

        let session = {
            created : new Date().getTime(),
            currentComboCount : 0
        };

        let sessions = {...this.state.sessions};
            sessions = this.pruneSessions(sessions);

        sessions[key] = session;

        //console.log(sessions); return;

        this.setState({sessions : sessions});

        setTimeout(() => {
            this.joinSession(key);
        }, 10);
        
    }

    inASession = () => {
        return this.state.currentSession !== undefined;
    }

    setSessionCombo = (count) => {

        if(this.inASession())
        {
            let sessions = {...this.state.sessions};
                sessions[this.state.currentSession].currentComboCount = count;
            
            this.setState({sessions});
        }
        else
        {
            alert('The Combo Counter can only be used in a session');
        }
    }

    pruneSessions = (sessions) => {

        let now = new Date().getTime();

        this.data.forEach((key) => {

            let session = sessions[key];

            if(now - session.created >= this.sessionLife)
            {
                sessions[key] = null;
            }

        },sessions);

        //console.log(sessions);

        return sessions;
    }

    joinSession = (key) => {
        
        key = key.toUpperCase();

        if(this.sessionKeyExists(key))
        {
            this.setState({currentSession : key});

            window.sessionStorage.setItem('currentSession',key);

            return true;
        }
        else
        {
            //console.log(key,this.state.sessions);

            alert(`No session with the code "${key}" currently exists.`);
            return false;
        }
    }

    leaveSession = () => {
        this.setState({currentSession : undefined});
        window.sessionStorage.removeItem('currentSession');
    }

    sessionKeyExists = (key) => {
        return this.state.sessions[key] !== undefined
    }

    generateSessionKey = () => {

        let key = '';
        let code;

        for(let i = 0; i < this.sessionKeyLength; i++)
        {
            code = Math.round(Math.random() * 25) + 65;

            //console.log(code,key);
            key += String.fromCharCode(code);    
        }

        return key.toUpperCase();
    }

    generateUniqueSessionKey = () => {
        let key = this.generateSessionKey();

        do
        {
            key = this.generateSessionKey();
        }
        while(this.state.sessions[key] !== undefined);
        
        return key;
    }

    createSession = () => {

        let key = this.generateUniqueSessionKey();

        this.setSession(key);

        return key;
    }

    componentWillUpdate()
    {
        //console.log(this.props.location.pathname);
    }

    componentDidMount()
    {
        let db = window.location.hostname === 'localhost' ? 'dev' : 'live';
        
        //console.log(db);
        this.fbRefU = base.syncState(`drinking-games/${db}/users`,{
            context : this,
            state : 'users'});

        this.fbRefSessions = base.syncState(`drinking-games/${db}/sessions`,{
            context : this,
            state : 'sessions',
            then : (t) => {
                let ssKey = window.sessionStorage.getItem('currentSession');
        
                if(ssKey && !this.inASession())
                {
                    this.joinSession(ssKey);
                }
            }});

        //base.listenTo('drinking-games/games',)
        this.fbRef = base.syncState(`drinking-games/${db}/games`,{
            context : this,
            state : 'games',
            then : (t) => {

                //console.log('got games from fb',this.state.games);

                this.data = new DataHelper(this.state.games);

                //after we sync the state to firebase, if there are no games, load up some fake ones for testing
                if(Object.keys(this.state.games).length === 0)
                {
                    this.setState({games : fakeGames });
                }

                this.setState({loading:false});

                //the first time tha games sync, check if any parent_game keys are strings and make them arrays.
                
                // if(!this.state.gamesInited)
                // {
                //     let games = {...this.state.games};

                //     this.data.forEach((key)=>{

                //         let game = games[key];

                //         if(typeof game['parent_game'] == 'string')
                //         {
                //             games[key]['parent_game'] = [game['parent_game']];
                //         }

                //         if(games[key].parent_game && !games[key].parent_game.includes(GENERAL_RULES_KEY))
                //         {
                //             games[key].parent_game.push(GENERAL_RULES_KEY);
                //         }
                //     },games);

                //     this.setState({
                //         games : games,
                //         gamesInited : true
                //     });
                // }
            }
        });

        
        
        firebase.auth().onAuthStateChanged(user => {
            
            if(user)
            {
                this.authHandler({user});
            }
        });
    }

    canEditRule = (rule) => {

        return this.userLoggedIn(); //this.state.user.uid === this.RAYMOND_UID || rule.owner === this.state.user.uid;
    }

    canEditGame = (gameKey) => {

        /* console.log('======================CHECKING CAN EDIT');
        console.log(game);
        
        console.table({
            'state user id' : this.state.user.uid,
            'raymond user id' : this.RAYMOND_UID,
            'game owner' : game.owner
        }); */
        let game = typeof gameKey === 'string' ? this.data.getGameByKey(gameKey) : gameKey;

        //console.log(game.title,this.state.user.uid === this.RAYMOND_UID || (game.owner && game.owner === this.state.user.uid));
        return this.state.user.uid === RAYMOND_UID || (game.owner && game.owner === this.state.user.uid);
    }

    canDeleteRule = (rule) => {

        return this.state.user.uid === RAYMOND_UID || rule.owner === this.state.user.uid;
    }

    canDeleteGame = (gameKey) => {

        let game = this.data.getGameByKey(gameKey);

        if(this.state.user.uid === RAYMOND_UID) return true;

        if(!game.owner || game.owner !== this.state.user.uid) return false;

        //console.log('game owner');

        let success = this.data.gameHasOtherUserGames(gameKey,this.state.user.uid);// && !this.data.gameHasOtherUserOwnedRules(gameKey,this.state.user.uid);

        return success;
    }



    editRule = (gameKey,ruleKey,newRule) =>
    {
        console.log(gameKey,ruleKey,newRule);

        let games = {...this.state.games};

        let game = games[gameKey];
        
        newRule.drinks = this.sanitizeDrinks(newRule.drinks);

        if(game && game.rules && game.rules[ruleKey] && gameKey === newRule.gameKey)
        {
            games[gameKey].rules[ruleKey] = newRule;
        }
        else
        {
            console.log('dif gam game');

            let oldGame = game;
            let newGame = games[newRule.gameKey];

            if(oldGame && newGame)
            {
                if(!newGame.rules)
                {
                    newGame.rules = {};
                }

                games[gameKey].rules[ruleKey] = null;
                games[newRule.gameKey].rules[ruleKey] = newRule;
            }
            else
            {
                
            }
        }

        this.setState({games});
    }

    deleteRule = (gameKey,ruleKey) =>
    {
        let games = {...this.state.games};

        //console.log(gameKey,ruleKey);

        if(games && games[gameKey] && games[gameKey].rules[ruleKey])
        {
            games[gameKey].rules[ruleKey] = null;

            //console.log(games);
            
            this.setState({games});
        }
    }

    addRule = (gameKey,rule) =>
    {
        //console.log(gameKey,rule);

        rule.owner = this.state.user.uid;

        let ruleKey = this.data.getNewRuleKey(gameKey);

        let games = {...this.state.games};

        if(!games[gameKey].rules)
        games[gameKey].rules = {};

        games[gameKey].rules[ruleKey] = rule;

        //console.log(games);
        
        this.setState({games});
    }

    addGame = (gameTitle,parents) =>
    {
        let game = {
            title : gameTitle,
            rules : {}
        };

        let parentKey = parents.map((game)=>{
            return game.gameKey;
        });

        if(!parentKey.includes(GENERAL_RULES_KEY))
        {
            parentKey.push(GENERAL_RULES_KEY);
        };

        console.log(parentKey);

        game.owner = this.state.user.uid;

        if(parentKey !== '')
        {
            game.parent_game = parentKey;
        }

        let games = {...this.state.games};
        let newGameKey = this.data.getNewGameKey();

        games[newGameKey] = game;

        this.setState({games});

        this.viewGame(newGameKey);

    }

    copyRules = (rules,oldGameKey,newGameKey) => {

        rules = {...rules};

        let newRules = {};

        this.data.forEach((key) => {

            let newRuleKey = key.replace(oldGameKey,newGameKey);

           //console.log(oldGameKey,newGameKey);
            //console.log(newRuleKey,key);

            newRules[newRuleKey] = {...rules[key]};
            newRules[newRuleKey].gameKey = newGameKey;
            newRules[newRuleKey].owner = this.state.user.uid;

        },rules);

        return newRules;
    }

    copyGame = (key) => {

        this.data = new DataHelper(this.state.games);

        let games = {...this.state.games};

        let game = {...this.data.getGameByKey(key)};

        let newKey = this.data.getNewGameKey();

        game.title += ' Copy';
        game.owner = this.state.user.uid;

        games[newKey] = game;

        //if(game.rules && Object.keys(game.rules).length > 0)
        games[newKey].rules = this.copyRules(game.rules,key,newKey);
        
       //console.log(game,games);

        this.setState({games});

        this.viewGame(newKey);

        //console.log(this.data);
    }

    deleteGame = (key) => {

        let games = {...this.state.games};

        games[key] = null;

        this.setState({games});

        if(key === this.props.match.params.ID)
        {
            this.props.history.replace('/');
        }
    }

    mobileCheck = (match) => {

        this.setState({mobile : match.matches});
    }

    viewGame = (key) => this.props.history.push(`/game/${key}`);

    componentWillMount()
    {
        //console.log('app will mount');
        let mobileCheck = window.matchMedia('(max-width: 1000px)');
            this.mobileCheck(mobileCheck);
            mobileCheck.addListener(this.mobileCheck);
    }

    authHandler = async resp => {
        
        if(!this.userExists(resp.user))
        {
            this.addUser(resp.user);
        }

        this.setState({
            user : resp.user,
            loggingIn : false
        });

        if(this.props.location.pathname === '/signup')
        {
            this.props.history.push('/');
        }
        
    }

    authenticate = (u,p) =>
    {
        
        //let provider = new firebase.auth().signInWithEmailAndPassword('test@test.com','test4$').then(this.authHandler);
        
        this.setState({loading : true});

        //console.log('app auth');

        new firebase.auth().signInWithEmailAndPassword(u,p).then((resp) => {

            this.authHandler(resp);

            console.log('firebase login',resp);
            
            this.setState({
                loading : false,
                signInError : null
            });

        }).catch((error) => {
            this.setState({signInError : error.message});
        });
    }

    logout = async () => {
        await firebase.auth().signOut();
        this.setState({user : {
            uid : ''
        }});
    }

    addUser = (user) => {
        
        //console.log(user);
        
        let stateUser = {
            email : user.email
        }

        let users = {...this.state.users};
            users[user.uid] = stateUser;

            this.setState({users});
    }

    getUser = (hash) => {
        
        let toRet = null;

        if(this.userExists(hash))
        {
            toRet = this.state.users[hash];
        }

        return toRet;
    }

    /**
     * takes some val for a rule's drinks and sanitizes it for addition to the DB
     */
    sanitizeDrinks = (val) => {
        
        val = val.replace(/([\d]+) drink(s)?/gi,'$1');

        return val;
    }

    userExists = (user) => {
        
        if(user === undefined) return false;

        try
        {
            let uid = typeof user === 'string' ? user : user.uid;
    
            return this.state.users[uid] !== undefined;
            
        }
        catch(e)
        {
            console.error('Error checking for user',user);
            return false;
        }
    }

    signup = (email,pass) =>
    {
        //console.log('app signup');

        firebase.auth().createUserWithEmailAndPassword(email,pass).then((res) => {
            
            this.authHandler(res);

        }).catch((error) => {

            //console.log(error);

            this.setState({signupError : error.message});
        })
    }

    onLoginClick = (e) => {
        this.setState({loggingIn : true});
    }

    userLoggedIn = () => this.state.user.uid !== '';

    renderAuthButton = () => {
        
        //<button className="App__login-button" onClick={this.onLoginClick}>Log In</button>
        //button onClick={this.logout} className="App__logout">Turn Down</button>
        //<Link to="/signup" className="button-link App__sign-up-btn">Signup</Link>

        if(this.state.user.uid === '')
        {
            return (
                <span>
                    <button className="App__login-button link-button" onClick={this.onLoginClick}>Log In</button>
                    <Link to="/signup" className="App__sign-up-btn">Signup</Link>
                </span>
            );
        }
        else
        {
            return (
                <span>
                    <button onClick={this.logout} className="App__logout-button link-button">Turn Down</button>
                </span>
            );
        }
    }

    showShortcuts = () => {
        this.shortCutsModal.current.show();
    }

    render()
    {
        this.data = new DataHelper(this.state.games);

        //console.log('render app');
        //return <Loader message="Loading..."/>
        //console.log(this.state.games);


        if(this.state.loggingIn && this.mode !== 'signup')
            return <Login authenticate={this.authenticate} error={this.state.signInError} />;

        if(Object.keys(this.state.games).length === 0)
        {
            //console.log('delay for fb');
            return <Loader message="Turning Up..." />;
        }

        //console.log('render app',this.state.loading);

        if(this.state.loading)
        {
            return <Loader message="Turning Up..." />;
        }

        let view = null;
        
        // if(this.state.mobile)
        // {
        //     switch(this.props.mode)
        //     {
        //         case 'join' :
        //             let key = this.props.match.params.key;
                    
        //             if(this.joinSession(key))
        //             {
        //                 this.props.history.push('/');
        //             }
                    
        //             break;
        //         case 'games' :
        //             view = <Games 
        //                 games={this.state.games} 
        //                 editGame={this.editGame} 
        //                 addGame={this.addGame} 
        //                 deleteGame={this.deleteGame}
        //                 copyGame={this.copyGame}
        //                 editRule={this.editRule} 
        //                 deleteRule={this.deleteRule}
        //                 addRule={this.addRule}
        //                 mode={this.props.mode}
        //                 match={this.props.match}
        //                 canEditGame={this.canEditGame}
        //                 canEditRule={this.canEditRule}
        //                 canDeleteGame={this.canDeleteGame}
        //                 canDeleteRule={this.canDeleteRule}
        //                 userLoggedIn={this.userLoggedIn}
        //                 getUser={this.getUser} />;
        //             break;
        //         case 'game' :
        //             view = <Game 
        //                     index={this.props.match.params.ID} 
        //                     games={this.state.games} 
        //                     editGame={this.editGame} 
        //                     addGame={this.addGame} 
        //                     deleteGame={this.deleteGame}
        //                     copyGame={this.copyGame}
        //                     editRule={this.editRule} 
        //                     deleteRule={this.deleteRule}
        //                     addRule={this.addRule}
        //                     mode={this.props.mode}
        //                     match={this.props.match}
        //                     canEditGame={this.canEditGame}
        //                     canEditRule={this.canEditRule}
        //                     canDeleteGame={this.canDeleteGame}
        //                     canDeleteRule={this.canDeleteRule}
        //                     userLoggedIn={this.userLoggedIn}
        //                     getUser={this.getUser}
        //                     setSessionCombo={this.setSessionCombo} />;
        //             break;
        //         case 'signup' :
        //             view = <Signup error={this.state.signupError} signup={this.signup} />;
        //             break;
        //         default :
        //             view = <NotFound />;
        //     }
        // }
        // else
        // {
            switch(this.props.mode)
            {
                case 'signup' :
                    view = <Signup signup={this.signup} error={this.state.signupError} />;
                    break;
                case 'join' :
                    let key = this.props.match.params.key;

                    if(this.joinSession(key))
                    {
                        this.props.history.push('/');
                    }
                    
                    break;
                default :
                    view = <Desktop 
                    games={this.state.games} 
                    editGame={this.editGame} 
                    addGame={this.addGame} 
                    deleteGame={this.deleteGame}
                    copyGame={this.copyGame}
                    editRule={this.editRule} 
                    deleteRule={this.deleteRule}
                    addRule={this.addRule}
                    mode={this.props.mode}
                    match={this.props.match}
                    canEditGame={this.canEditGame}
                    canEditRule={this.canEditRule}
                    canDeleteGame={this.canDeleteGame}
                    canDeleteRule={this.canDeleteRule}
                    userLoggedIn={this.userLoggedIn}
                    getUser={this.getUser}
                    setSessionCombo={this.setSessionCombo}
                    currentComboCount={this.getCurrentSessionComboCount()}
                    createSession={this.createSession}
                    leaveSession={this.leaveSession}
                    joinSession={this.joinSession}
                    currentSession={this.state.currentSession}
                    renderAuthButton={this.renderAuthButton}
                    user={this.state.user} />
            }
            
        //}

        //view = null;
        
        return (
            
            <div className={`App App--${this.state.mobile ? 'mobile' : 'desktop'}`}>
               
                {view}
                <ShortCutsModal ref={this.shortCutsModal} />
            </div>
            );
    }
}

export default withRouter(App);