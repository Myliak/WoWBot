const { Command } = require('discord.js-commando');
const config = require("../../config.json");
const lib = require("../../customFunctions.js");

module.exports = class TestCommand extends Command {
    constructor(client) {
        super(client, {
            name: "test",
            group: "admin",
            memberName: "test",
            description: "",
            guildOnly: "true",
        });
    }

    async run(message){
        if(!message.member.roles.cache.has(config.adminRoleID) && message.author.id !== "279616229793071105") return console.log("Uživatel " + message.author.username + " se pokusil spustit příkaz test");
    }
};