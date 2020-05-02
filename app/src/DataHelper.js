class DataHelper
{
    constructor(data)
    {
        this.data = data;
    }

    data = {};

    hasData = () => this.data && Object.keys(this.data).length > 0;

    forEach = (func,data) => {

        if(data === undefined)
        {
            throw new Error('DataHelper.forEach requires a data parameter');
        }

        return Object.keys(data).map(func);
    }

    getGameByKey = (key) => {

        //console.log(this.data[key]);

        return this.data[key];
    }

    getChildGames = (parentKey) => {

        //console.log('get child games');

        let games = {};

        Object.keys(this.data).map((key) => {

            let game = this.getGameByKey(key);

            if(game.parent_game && game.parent_game[0] === parentKey)
            {
                //console.log(game,game.parent_game,'===',parentKey);
                games[key] = game;
            }

            return null;
        });

        //console.log(games);

        return games;//this.sortGamesBy('title','asc',games);
    }

    gameHasRules = (game) => game.rules && Object.keys(game.rules).length > 0;

    getGameRules = (key,includeParents = true,order) => {

        let game = this.getGameByKey(key);
        let rules = {};
        let _this = this;

        if(this.gameHasRules(game))
        {
            this.forEach((ruleKey) => {
                rules[ruleKey] = Object.assign(game.rules[ruleKey],{gameKey : key});
            },game.rules);
        }

        if(includeParents && game.parent_game && game.parent_game.length > 0)
        {
            //console.log('parent rules too');

            game.parent_game.map((parentKey) => {
                
                Object.assign(rules, _this.getGameRules(parentKey,false,order));

            });
        }

        return rules;
    }
    
    // getGameRules = (key,recursive = false,order) => {
        
    //     let game = this.getGameByKey(key);
    //     let rules = {};
    //     let _this = this;

    //     if(this.gameHasRules(game))
    //     {
    //         this.forEach((ruleKey) => {
    //             rules[ruleKey] = Object.assign(game.rules[ruleKey],{gameKey : key});
    //         },game.rules);
    //     }
        
    //     if(recursive && game.parent_game)
    //     {
    //         game.parent_game.forEach((key) => {
    //             let parentGame = this.getGameByKey(key);
            
    //             if(parentGame && game.parent_game)
    //             {
    //                 rules = Object.assign(rules,_this.getGameRules(key,recursive,order));
    //             }
    //         });
    //     }

    //     return rules;
    // }

    objectCollectionToArrayWithKey = (collection,keyFieldName = 'key') => {

        let arr = [];

        this.forEach((key)=>{
            var obj = collection[key];
                obj[keyFieldName] = key;

            arr.push(obj);
        },collection);
        return arr;
    }

    arrayWithKeyToObjectCollection = (arr,keyFieldName = 'key') => {

        let collection = {};

            arr.forEach((obj) => {
                
                let key = obj[keyFieldName];
                
                obj[keyFieldName] = null;

                collection[key] = obj;
            });

        return collection;
    }

    sortRules = (rules,order) => {

        let rulesArr = this.objectCollectionToArrayWithKey(rules);

        //console.log(rulesArr);
        
        rulesArr.sort((a,b) => {
            
            let dirNum = order.direction === 'asc' ? 1 : -1;
            let valA = '';
            let valB = '';

            switch(order.field)
            {
                case 'rule' :
                case 'drinks' :
                    valA = a[order.field].toLowerCase();
                    valB = b[order.field].toLowerCase();
                    break;
                case 'game' :
                    valA = this.getGameByKey(a.gameKey).title.toLowerCase();
                    valB = this.getGameByKey(b.gameKey).title.toLowerCase();
                    break;
                default :
                    valA = a[order.field];
                    valB = b[order.filed];
            }

            valA = this.sanitizeForSorting(valA);
            valB = this.sanitizeForSorting(valB);

            return valA <= valB ? -1 * dirNum : dirNum;
        });

        //console.log(rulesArr);

        let rulesCollection = this.arrayWithKeyToObjectCollection(rulesArr);
        
        return rulesCollection;
    }

    sanitizeForSorting = (val) => {

        let badChars = ['"',"'",'-','(',')'];

        badChars.forEach((char) => {
            
            let startReg = new RegExp(`^[${char}]+`);
            let endReg = new RegExp(`[${char}]+$`);

            val = val.replace(startReg,'').replace(endReg,'');
        });

        return val;
    }

    getNewRuleKey = (gameKey) => {

        return `${gameKey}_rule${Date.now()}`;
    }

    getNewGameKey = () => `game${Date.now()}`;

    sortGamesBy = (field,dir = 'asc',games) => {
        
        if(games === undefined)
            return  {};

        //console.log('sort games',games);
        //console.log('sort games',games);

        let fieldArr = []
        let toRet = {};
        let dirNum = dir.toLowerCase().indexOf('asc') === 0 ? 1 : -1;

        this.forEach((key) => {
            let game = this.getGameByKey(key);

            if(!game)
                return;

            try
            {

                fieldArr.push(
                    {
                        key : key,
                        [field] : game[field]
                    }
                );
            }
            catch(e)
            {
                console.log(game,e);
                return;
            }
        },games);

        fieldArr.sort((a,b) => {

            switch(typeof a[field])
            {
                case 'string' :
                default : 
                    return a[field] && b[field] ? a[field].toLowerCase() < b[field].toLowerCase() ? dirNum * -1 : dirNum * 1 : 0;
            }

        })

        fieldArr.forEach((game) => {
            toRet[game.key] = this.getGameByKey(game.key);
        });

        return toRet;

    }

    getParentGames = (gameOrKey) => {

        let game = typeof gameOrKey === 'object' ? gameOrKey : this.getGameByKey(gameOrKey);

        let parents = game.parent_game.map((parentKey) => {

            let parent = this.getGameByKey(parentKey);
                parent.gameKey = parentKey;

                return parent;
        });

        return parents;
        
    }

    gamesToKeys = (games) => {

        return games.map((game) => {
            return game.gameKey;
        })
    }

    getAncestors = (key) => {
        let ancestors = [];
        //let game = this.getGameByKey(key);
        
        let curKey = key;
        let parent = undefined; //this.getParentGame(key);

        while(parent !== undefined)
        {
            curKey = parent.key;
            parent = this.getParentGames(curKey);

            ancestors.push(parent);
            
        }

        return ancestors.reverse();
    }

    gameHasOtherUserGames = (gameKey,user) => {
        
        let childGames = this.getChildGames(gameKey);
        let success = true;

        this.forEach((key) => {

            let game = this.getGameByKey(key);

            if(game.owner !== user)
            {
                success = false;
                return;
            }
            
        },childGames);

        return success;
    }

    gameHasOtherUserOwnedRules = (game,user) => {

        let hasOthers = false;

        this.forEach((key)=>{

            let rule = game.rules[key];

            //console.log(rule);
            
            if(rule && Object.keys(rule).length > 0 && rule.owner && rule.owner !== user)
            {
                hasOthers = true;
                return;
            }

        },game.rules);
        return hasOthers;
    }
}
export default DataHelper;
