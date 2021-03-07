const Client = require('ftp');
const fs = require('fs');
let package = require('./deployConfig.json');
const chalk = require('chalk');
const { black } = require('chalk');

const client = new Client();

const localPaths = package.localPaths;
const blacklist = package.blacklist;

let filesToSend = [];
let queue = [];

if(package.lastUpdate === undefined)
{
    package.lastUpdate = -1;
}

const shouldQueue = file => {
    
    const modTime = fs.lstatSync(file).mtimeMs;

    //console.log(file,modTime,lastUpdate.getTime());

    return modTime >= lastUpdate.getTime();
}

let lastUpdate = new Date(package.lastUpdate);

const user = package.credentials.user;
const pass = package.credentials.pass;
const host = package.credentials.host;

console.log(`Connecting to ${host} as ${user}`);

const forceDeploy = process.argv.includes('f');

const setLastUpdate = date => {

    lastUpdate = date;
    package.lastUpdate = date.getTime();

    fs.writeFile('./deployConfig.json',JSON.stringify(package,null,4),()=>{
        console.log(`Last deploy date updated to ${chalk.green(date)}`);
    });
}

client.on('error',(err)=>{

    console.error(err.message);

    client.end();
});

const isBlacklisted = path => {

    for(let i = 0; i < blacklist.length; i++)
    {
        if(path.indexOf(blacklist[i]) !== -1) return true;
    }

    return false;
}

const getDirFilesToSend = dir => {

    let filesToCheck = fs.readdirSync(dir.local);
    let files = [];

    filesToCheck.forEach(path => {

        if(isBlacklisted(path))
        {
            console.log(chalk.bgRed(`Skipping`),chalk.red(`${path} matches blacklist`));
            return;
        }

        const localPath = dir.local + '\\' + path;
        const remote = dir.remote + '/' + path;
        const obj = {
            local : localPath,
            remote : remote
        } 

        if(fs.lstatSync(localPath).isDirectory())
        {
            //console.log(localPath,'is dir');
            files = [...files,...getDirFilesToSend(obj)];
        }
        else if(forceDeploy || shouldQueue(localPath))
        {
            //console.log(path.local,'is file');
            files.push(obj);
        }
    });

    return files;
}



/**
 * Parses an array of files or directories to build 
 * an array of files to send to the remote server
 * @param {Object} localPaths 
 */
const getFilesToSend = paths => {

    let pathsToSend = [];

    paths.forEach(path => {

        if(fs.lstatSync(path.local).isDirectory())
        {
            pathsToSend = [...pathsToSend,...getDirFilesToSend(path)]; 
        }
        else if(forceDeploy || shouldQueue(path))
        {
            //console.log(path.local,'is file');
            pathsToSend.push(path);
        }
    });

    return pathsToSend;
}

let curSend = 0;

client.on('ready',()=>{
    
    console.log('ftp ready');

    curSend = 0;

    filesToSend = getFilesToSend(localPaths);

    if(filesToSend.length > 0)
    {
        //console.log(filesToSend);

        sendFile(curSend);
    }
    else
    {
        console.log(chalk.red(`No files modified since last deploy, use -f param to force a whole deploy.`));
        client.end();
    }
});

const sendFile = index => {

    
    if(index < filesToSend.length)
    {
        const file = filesToSend[index];

        client.put(file.local,file.remote,false,(err,stream)=>{

            if(err)
            {
                console.error(chalk.bgRed(` ERROR `),`couldn't send ${file.local} => ${file.remote}`);
                console.log(err);
                curSend++;
                sendFile(curSend);
            }
            else
            {
                console.log(chalk.bgGreen(` SUCCESS `), `${file.local} => ${file.remote}`);
                curSend++;
                sendFile(curSend);
            }
            
        })
    }
    else
    {
        console.log(chalk.green(`Finished uploading all files`));
        setLastUpdate(new Date());

        client.end();
    }
}

client.connect({
    host : host,
    user : user,
    password : pass
});