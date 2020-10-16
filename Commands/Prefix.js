const guildModel = require('../Schema/Guild.js');

module.exports.run = async (bot, message, args) => {

    //Code Start
    let guildDB = await guildModel.findById(message.guild.id).exec();
    guildDB.prefix = args[0];
    guildModel.saveGuild(guildDB)
    message.channel.send(`Prefix was changed to \`${args[0]}\``);
	//Code End

}

module.exports.config = {
    cmdPerms: ["EMBED_LINKS", "ADD_REACTIONS", "READ_MESSAGE_HISTORY"],
	permission: "MANAGE_GUILD",
    desc: "If you don't like my prefix you can change it using this command.",
	usage: "<new prefix>",
	command: "prefix",
    cooldown: 60,
    args: true
}