const config = require("./config.json");
let collectors = [];

exports.createCollectors = async function(client){
    //Zastaví všechny collectory
    if(!collectors.empty){
        collectors.forEach(function(element){
            element.stop();
        });
        collectors = [];
    }

    try{
        const roleConnections = client.provider.db.modelManager.models[0];
        const textChannelObj = await client.channels.cache.get(config.staticReactTextChannelID);

        const messageList = await roleConnections.aggregate("targetMessage", "DISTINCT", {plain: false});
        for(let i = 0; i < messageList.length; i++){
            const targetMessage = await textChannelObj.messages.fetch(messageList[i].DISTINCT);
            const emojiList = await roleConnections.findAll({where: {targetMessage: messageList[i].DISTINCT}});
            let tempArray = [];
            for(let i = 0; i < emojiList.length; i++){
                tempArray[i] = "reaction.emoji.id === '" + emojiList[i].targetEmoji + "'";
            }
            const filterString = "return (" + tempArray.join(' || ') + ") && user.id !== '685118157614088222'";
            const filter = new Function("reaction, user", filterString);
            collectors[i] = targetMessage.createReactionCollector(filter, {dispose: true});
            collectors[i].on('collect', async (reaction, user) => {
                const dbEntity = await roleConnections.findOne({where: {targetEmoji: reaction._emoji.id}});
                this.addRole(client, user.id, dbEntity.dataValues.targetRole);
                console.log("Added role " + reaction._emoji.name + " to " + user.username);
            });
            collectors[i].on('remove', async (reaction, user) => {
                const dbEntity = await roleConnections.findOne({where: {targetEmoji: reaction._emoji.id}});
                this.removeRole(client, user.id, dbEntity.dataValues.targetRole);
                console.log("Removed role " + reaction._emoji.name + " from " + user.username);
            });
        }
    }
    catch(e){
        console.log("CreateCollector error: " + e);
    }
};

exports.addRole = async function(client, userID, roleID){
    const targetGuild = await client.guilds.cache.get(config.staticGuildID);
    let targetRole = await targetGuild.roles.cache.get(roleID);
    targetGuild.member(userID).roles.add(targetRole).catch(console.error);
};

exports.removeRole = async function(client, userID, roleID){
    const targetGuild = await client.guilds.cache.get(config.staticGuildID);
    let targetRole = await targetGuild.roles.cache.get(roleID);
    const targetMember = targetGuild.member(userID);
    if(targetMember.roles.cache.find(function (element) {return element === targetRole;}) !== null){
        targetMember.roles.remove(targetRole).catch(console.error);
    }
};


exports.adminOnly = function(userObj){
};