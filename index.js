var Discord = require('discord.js');
var bot = new Discord.Client();
var fs = require('fs');
var token = fs.readFileSync('./token.txt').toString().trim();

var main = '355031003800010752';
var prefix = '!';

var PlayerList = JSON.parse(fs.readFileSync('./data/players.json').toString());
console.log('Player list loaded')

var StarMap = JSON.parse(fs.readFileSync('./data/starmap.json').toString());
console.log('StarMap loaded');

bot.on('ready', () => {
    bot.channels.get(main).send('[online]');
    console.log('Bot connected');
});

bot.on('message', (message) => {
    var msg = message.content.toLowerCase();
    if (msg[0] == prefix) {
        if (PlayerList[message.author.id] == "main menu") {
            switch (msg.substring(1)) {
                case 'close':
                    message.channel.send('Shutting down.').then(() => {
                        console.log('Disconnecting...');
                        bot.destroy().then(() => {
                            console.log('Closing...');
                            process.exit();
                        });
                    });
                    break;
                case 'register':
                    if (!PlayerList.hasOwnProperty(message.author.id)) {
                        registerUser(message);
                        message.channel.send('You successfully registered. Use `' + prefix + 'help` for all available commands.');
                    } else {
                        message.channel.send('You already registered.');
                    }
                    break;
                case 'help':
                    message.channel.send('```\nWrite prefix '+prefix+' to use commands:'
                    +'\n\'close\': Closes down the bot.'
                    +'\n\'join\': Joins the game'
                    +'\n\'register\': Registers you in the game.'
                    +'\n\'help\': Lists this.```');
                    break;
                case 'join':
                    PlayerList.setAndSave(message.author.id, 'in-game');
                    message.channel.send('You are now in game mode. Use `' + prefix + 'help` for all available player actions.');
                    break;
                default:
                    message.channel.send('Command not found. Use `' + prefix + 'help` for all available commands.');
            }
        }else if (PlayerList[message.author.id] == "in-game") {
            switch(msg.substring(1)){
                case 'leave':
                    PlayerList.setAndSave(message.author.id, 'main menu');
                    message.channel.send('You left the game.');
                    break;
                case 'help':
                    message.channel.send('```\nWrite prefix '+prefix+' to use commands:'
                    +'\n\'leave\': Leaves the game.'
                    +'\n\'help\': Lists this.```');
                    break;
                default:
                message.channel.send('Command not found. Use `' + prefix + 'help` for all available player actions.');
            }
        }
    }
});

function registerUser(message) {
    var profile = JSON.parse(fs.readFileSync('./data/players/default.json').toString());
    profile.name = message.author.username;
    profile.discordId = message.author.id;
    profile.location = randomStation();
    profile.ship = JSON.parse(fs.readFileSync('./data/ships/default.json').toString());
    //console.log(profile);
    fs.writeFileSync('./data/players/'+message.author.id+'.json', JSON.stringify(profile));
    PlayerList.setAndSave(message.author.id, 'main menu');
}

function randomStation() {
    // TODO: külön stations.json készítése a StarMap alapján, vagy
    //       valamilyen függvény ami gyorsan visszatér egy tömbbel
    var stations = StarMap.getEntries("type", "station");
    var station = stations[Math.floor(Math.random() * stations.length)];
    var system = StarMap.getEntries("id", station.id.split('-')[0])[0];
    //console.log(system);
    var location = {
        absolute: {
            x: system.coordinates.x,
            y: system.coordinates.y,
            z: system.coordinates.z
        },
        nearStar: {
            name: system.children[0].name,
            id: system.children[0].id
        }
    }
    return location;
}

StarMap.getEntries = (key, value) => {
    return getChildren(StarMap.stars, key, value);
}

function getChildren(entry, key, value) {
    var array = [];
    if (entry != null) {
        for (i in entry) {
            if (entry[i][key] == value) {
                array.push(entry[i])
                array = array.concat(getChildren(entry[i].children, key, value));
            } else {
                array = array.concat(getChildren(entry[i].children, key, value));
            }
        }
    }/* else {
        console.error('Entry with no children found');
    }*/
    return array;
}

PlayerList.setAndSave = (key, value) => {
    PlayerList[key] = value;
    fs.writeFileSync('./data/players.json', JSON.stringify(PlayerList));
}

bot.login(token);