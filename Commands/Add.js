const guildModel = require('../Schema/Guild.js');

module.exports.run = async (bot, message, args) => {

    //Code Start
    let guildDB = await guildModel.findById(message.guild.id).exec();
    bot.T.get('users/show', {screen_name: args[0]}, findUser)   ;

    async function findUser(err, userData, response){
        if(err)
            return message.channel.send('User not found')
            
        if(!guildDB.handles.find(h => h.name == userData.screen_name)){
            guildDB.handles.push({name: userData.screen_name, username: userData.name, id: userData.id_str});
            let guilds = bot.handles.get(userData.screen_name) || []
            guilds.push(message.guild.id);
            bot.handles.set(userData.screen_name, guilds);
        }
        message.channel.send(`Monitoring ${userData.name}`);
        await guildModel.saveGuild(guildDB).catch(err => console.log(err));
        bot.monitorTweets(true);
    }
	//Code End
}

module.exports.config = {
    permission: "MANAGE_GUILD",
    cmdPerms: ["EMBED_LINKS"],
    usage: "[twitter username]", //if args is set to false you can remove this otherwise describe how to use the command
    command: "add",
    cooldown: 5, //Cooldown in seconds
	args: true //If the command requires input aka if you need to write just the command name or command name with some more arguments/fields
}

