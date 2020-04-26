const {Command} = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const config = require("../../config.json");
const lib = require("../../customFunctions.js");
let tempEmbed = undefined;

module.exports = class findgroupCommand extends Command {
    constructor(client) {
        super(client, {
            name: "findgroup",
            group: "public",
            memberName: "findgroup",
            description: "",
            aliases: [],
            args: [
                {
                    key: "title",
                    prompt: "Zadejte název události",
                    type: "string"
                },
                {
                    key: "description",
                    prompt: "Zadejte popis událost",
                    type: "string"
                },
                {
                    key: "date",
                    prompt: "Zadejte datum a čas ukončení události ve tvaru DD-MM-YYYY-hh-mm",
                    type: "string"
                }
            ]
        });
    }

    async run(message, {title, description, date}) {
        const roleArray = ["627415865851248660", "627416187805892608", "627416099276849152", "627416269188235265"];
        const classArray = [
            "624575845423644682",
            "624575845436096512",
            "624575845473714176",
            "624575845486559272",
            "624575845511593994",
            "624575845461393416",
            "624575845092163595",
            "624575845482364928"];
        const roleFilter = (user, reaction) => {
            return roleArray.some(reaction.id)
        };
        const targetTextChannel = await this.client.channels.cache.get("627414495660081152");
        const embed = new MessageEmbed()
            .setTitle("Test")
            .setDescription("Test")
            .addField("Čas ukončení:", "Test")
            .addField("Zaregistrovaný", "-", true)
            .addField("Role", "-", true)
            .addField("Classa", "-", true)
            .addField("Ve frontě", "-", true)
            .addField("Role", "-", true)
            .addField("Classa", "-", true)
            .setFooter("Událost vytvořena uživatelem: " + message.author.username);
        const eventUsersReference = this.client.provider.db.modelManager.models[1];

        targetTextChannel.send({embed: embed}).then(embedMessage => {
            roleArray.forEach((element) => {
                embedMessage.react(targetTextChannel.guild.emojis.cache.get(element));
            });
            embedMessage.react("➡️");
            classArray.forEach((element) => {
                embedMessage.react(targetTextChannel.guild.emojis.cache.get(element));
            });
            const roleCollector = embedMessage.createReactionCollector(roleFilter);
            roleCollector.on("collect", async (reaction, user) =>{
                try{
                    await eventUsersReference.create({
                        userName: user.name,
                        userRole: reaction.name,
                        userClass: "-",
                        targetEmbed: embedMessage.id
                    }).then()
                }
                catch(e){console.log(e)}
            })
        });

        /*            args: [
                {
                    key: "title",
                    prompt: "Zadejte název události",
                    type: "string"
                },
                {
                    key: "description",
                    prompt: "Zadejte popis událost",
                    type: "string"
                },
                {
                    key: "date",
                    prompt: "Zadejte datum a čas ukončení události ve tvaru DD-MM-YYYY-hh-mm",
                    type: "string"
                }
            ]*/
    }
};