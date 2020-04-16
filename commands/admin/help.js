const config = require("../../config.json");
const { Command } = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            group: "admin",
            memberName: "help",
            description: "Vypisuje informace o jednotlivých příkazech \n",
            aliases: ["h"],
            usage: "!help [název příkazu]",
            guildOnly: true,
            args: [
                {
                    key: "commandName",
                    prompt: "",
                    type: "string",
                    default: "",
                },
            ]
        });
    }

    async run(message, {commandName}) {
        if (!message.member.roles.cache.has(config.adminRoleID) && message.author.id !== "279616229793071105") return console.log("Uživatel " + message.author.username + " se pokusil spustit příkaz help");
        const data = [];
        const commandGroups = this.client.registry.groups;
        if (commandName === "") {
            data.push("**Seznam všech příkazů na serveru:**\n");
            commandGroups.forEach(function (element) {
                data.push("**" + element.name + ":**");
                data.push(element.commands.map(command => command.name).join(', '));
            });
            return message.channel.send(data, {split: true})
        }

        const command = this.client.registry.findCommands(commandName, false, message);

        if (command.length === 0) {
            return message.channel.send("Neplatný příkaz");
        }

        const embed = new MessageEmbed()
            .setColor(0x851919)
            .setTitle("Help pro příkaz: " + command[0].name)
            .addField("Syntaxe příkazu:", command[0].usage())
            .addField("Informace:", command[0].description);

        if (command[0].aliases) {
            embed.setDescription("Aliasy: " + command[0].aliases.join(", "));
        }

        return message.channel.send({embed});
    }
};