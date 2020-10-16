const guildModel = require('../Schema/Guild.js');

module.exports.run = async (bot, message, args) => {

    //Code Start
    let channel = message.mentions.channels.first() || message.channel
    let guildDB = await guildModel.findById(message.guild.id).exec();

    guildDB.logChannel = channel.id;
    bot.logChannels[message.guild.id] = channel.id;

    message.channel.send(`From now on, I'll be sending tweets into ${channel} channel.`);
    guildModel.saveGuild(guildDB)
	//Code End

}

module.exports.config = {
    command: "setlogchannel",
    usage: "<#channel>",
    aliases: ["logchannel", "log"],
    cooldown: 0, //Cooldown in seconds
	args: false //If the command requires input aka if you need to write just the command name or command name with some more arguments/fields
}