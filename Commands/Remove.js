const guildModel = require('../Schema/Guild.js');

module.exports.run = async (bot, message, args) => {

    //Code Start
    let username = args.join(' ').toLowerCase();
    let guildDB = await guildModel.findById(message.guild.id).exec();
    let index = guildDB.handles.findIndex(h => h.name.toLowerCase() == username || h.username.toLowerCase() == username)
    if(index != -1){
        let name = guildDB.handles[index].name;
        guildDB.handles.splice(index, 1);
        let guilds = bot.handles.get(name)
        guilds.splice(guilds.indexOf(message.guild.id), 1);
        bot.handles.set(name, guilds);
    }
    message.channel.send(`Removed monitor for ${username}`);
    await guildModel.saveGuild(guildDB).catch(err => console.log(err));
    bot.monitorTweets(true)
	//Code End
}

module.exports.config = {
    usage: "[twitter username]", //if args is set to false you can remove this otherwise describe how to use the command
    command: "remove",
    cooldown: 5, //Cooldown in seconds
	args: true //If the command requires input aka if you need to write just the command name or command name with some more arguments/fields
}

