const path = require('path');
const sqlite = require('sqlite');
const config = require("./config.json");
const { CommandoClient } = require('discord.js-commando');
const lib = require('./customFunctions.js');
const SequelizeProvider = require("./Sequelize.js");
const Sequelize = require('sequelize');

const client = new CommandoClient({
    commandPrefix: '!',
    owner: '279616229793071105',
});

client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['admin', 'Administrátoři serveru'],
        ["util", "Nástroje"]
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({help: false, unknownCommand: false})
    .registerCommandsIn(path.join(__dirname, "commands"));

//Database creation
const sequelize = new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});
const roleConnections = sequelize.define('RoleConnections', {
    targetRole: {
        type: Sequelize.STRING,
        unique: true,
    },
    targetEmoji: {
        type: Sequelize.STRING,
        unique: true,
    },
    targetMessage: {
        type: Sequelize.STRING,
    }
});
client.setProvider(new SequelizeProvider(sequelize)).catch(console.error);


//Bot start event
client.once('ready', async () => {
    //client.user.setActivity(config.statusText, {type: config.statusType});
    roleConnections.sync();
    //Collector creation
    lib.createCollectors(client, roleConnections);

    console.log('For the horde!');
});


//Bot on message event
/*client.on('message', message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName)
        || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if (command.guildOnly && message.channel.type !== 'text') {
        return message.reply('Příkaz nejde použít v soukromých zprávách');
    }

    /*if (command.args && !args.length) {
        let reply = `You didn't provide any arguments, ${message.author}!`;

        if (command.usage) {
            reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
        }

        return message.channel.send(reply);
    }

    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (!timestamps.has(message.author.id)) {
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }
    else {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
        command.execute(message, args, client, roleConnections);
    }
    catch (error) {
        console.error(error);
        message.reply('Neznámá chyba při spouštění příkazu, napište Myliakovi, on to někdy opraví');
    }
});*/
client.on('error', console.error);

client.login(config.token);