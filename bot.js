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
        ["admin", "Administrátoři"],
        ["public", "Veřejné"]
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
        unique: true
    },
    targetEmoji: {
        type: Sequelize.STRING,
        unique: true
    },
    targetMessage: {
        type: Sequelize.STRING,
    }
});
const eventUsers = sequelize.define("EventUsers", {
    userName: {
        type: Sequelize.STRING,
        unique: true
    },
    userRole: {
        type: Sequelize.STRING
    },
    userClass: {
        type: Sequelize.STRING
    },
    targetEmbed: {
        type: Sequelize.STRING
    }
});
client.setProvider(new SequelizeProvider(sequelize)).catch(console.error);

//Bot start event
client.once('ready', async () => {
    roleConnections.sync();
    eventUsers.sync();
    //Collector creation
    lib.createCollectors(client, roleConnections);

    console.log('For the horde!');
});

client.on('error', console.error);

client.login(config.token);