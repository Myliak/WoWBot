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

    async run(message, {targetRole}){
        if(!message.member.roles.cache.has(config.adminRoleID) && message.author.id !== "279616229793071105") return console.log("Uživatel " + message.author.username + " se pokusil spustit příkaz test");
        const textChannelObj = await this.client.channels.cache.get(config.staticReactTextChannelID);
        console.log(textChannelObj);
    }
};

/*module.exports = {
    name: 'test',
    description: "",
    aliases: ["test"],
    usage: "!test [",
    guildOnly: true,
    async execute(message, args, client, roleConnections) {
        try{
            const textChannelObj = await client.channels.cache.get(config.staticReactTextChannelID);
            const targetMessageObj = await textChannelObj.messages.fetch(config.staticReactMessageID);
            const targetReactions = await targetMessageObj.reactions.cache.get("590888730227769344");
        }
        catch(e){
            console.log();
        }
    }
};

/*
Old addrole.js
const { prefix } = require('../config.json');
const { RichEmbed } = require('discord.js');

module.exports = {
    name: 'addrole',
    description: "Přidávání rolí na určitou zprávu pomocí emoji reakcí",
    usage: "!addrole [id zprávy] [název role/emoji]",
    guildOnly: true,
    execute(message, args) {
        message.guild.channels.cache.forEach(async function(element){
            if(element.type === "text"){
                let targetMessage = "Error";
                try{
                    targetMessage = await element.messages.fetch(args[0]);
                    const emoji = await message.guild.emojis.cache.find(emoji => emoji.name === args[1]);
                    await targetMessage.react(emoji);
                }
                catch(e){
                    console.log();
                }
            }
        });
    }
};*/