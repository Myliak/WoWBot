const lib = require("../../customFunctions.js");
const { Command } = require('discord.js-commando');
const config = require("../../config.json");

module.exports = class CreateConnectionCommand extends Command {
    constructor(client) {
        super(client, {
            name: "createconnection",
            aliases: ["cc", "createc"],
            group: "admin",
            memberName: "createconnection",
            description: "Vytvoří nové spojení na zprávě mezi rolí a reakcí",
            usage: "!createconnection [název role] [název emoji] [id zprávy]",
            guildOnly: "true",
            args:[
                {
                    key: "targetRole",
                    prompt: "Tagněte roli pro spojení",
                    type: "string"
                },
                {
                    key: "targetEmoji",
                    prompt: "Zadejte název emoji pro spojení",
                    type: "string"
                },
                {
                    key: "targetMessageId",
                    prompt: "Zadejte id zprávy pro spojení",
                    type: "string"
                }
            ]
        });
    }

    async run(message, { targetRole, targetEmoji, targetMessageId }){
        //Kontrola oprávnění uživatele
        if(!message.member.roles.cache.has(config.adminRoleID) && message.author.id !== "279616229793071105") return console.log("Uživatel " + message.author.username + " se pokusil spustit příkaz createconnection");

        const role = message.guild.roles.cache.get(targetRole.slice(3, -1));
        const emoji = message.guild.emojis.cache.find(emoji => emoji.name.toLowerCase() === targetEmoji.toLowerCase());
        const textChannelObj = await this.client.channels.cache.get(config.staticReactTextChannelID);
        let targetMessage = undefined;
        try{
            targetMessage = await textChannelObj.messages.fetch(targetMessageId.toString());
        }
        catch(e){
            console.log(e);
            return message.channel.send("Zpráva s ID " + targetMessageId + " nebyla nalezena");
        }

        //Error handler
        if(role === undefined || emoji === undefined){
            let errorMessage = "Nepodařilo se nalézt:";
            if(role === undefined) errorMessage += " role";
            if(emoji === undefined) errorMessage += " emoji";
            return message.channel.send(errorMessage);
        }

        try {
            await this.client.provider.db.modelManager.models[0].create({
                targetEmoji: emoji.id,
                targetRole: role.id,
                targetMessage: targetMessage.id
            });
            lib.createCollectors(this.client);

            await targetMessage.react(emoji);

            return message.channel.send("Nové spojení na zprávě " + targetMessage.id + " mezi " + role.name + " a " + emoji.name + " vytvořeno");
        }
        catch (e) {
            console.log(e);
            if (e.name === "SequelizeUniqueConstraintError") {
                return message.channel.send("Používáte roli nebo emoji, které už má spojení");
            }
            else {
                return message.channel.send("Neznámá chyba při vytváření spojení");
            }
        }
    }
};