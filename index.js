var Discord = require('discord.js');
var bot = new Discord.Client();
var fs = require('fs');
var token = fs.readFileSync('./token.txt').toString().trim();

var main = '355031003800010752';

console.log('Initializing...');

bot.on('ready', () => {
    bot.channels.get(main).send('[online]');
    console.log('Bot connected.');
});

bot.on('message', (message) => {
    var msg = message.content.toLowerCase();
    if (msg == '!close') {
        console.log('Disconnecting...');
        bot.destroy().then(() => {
            console.log('Closing...');
            process.exit();
        });
    }
});

bot.login(token);