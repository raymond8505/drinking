const lsKey = 'drinking-games';

let lsGames = localStorage.getItem(lsKey);

const setGames = (games = lsGames) => {
    localStorage.setItem(lsKey,JSON.stringify(games));
}

if(lsGames === null || lsGames === '')
{
    localStorage.setItem(lsKey,'{}');
    lsGames = {};
}
else
{
    lsGames = JSON.parse(lsGames);
}


export const showParent = (child,parent) => {

    let games = getHiddenGames(child);

    if(games.includes(parent))
    {
        games.splice(games.indexOf(parent),1);

        console.log(child,parent,games,games.indexOf(parent));

        lsGames[child] = games;
        setGames();
    }
}

export const hideParent = (child,parent) => {

    let games = getHiddenGames(child);

    if(!games.includes(parent))
    {
        games.push(parent);
        lsGames[child] = games;
        setGames();
    }
}   

export const getHiddenGames = (child) => {

    if(lsGames[child] === undefined)
    {
        lsGames[child] = [];
        setGames();
        return [];
    }
    else
    {
        return lsGames[child];
    }
}