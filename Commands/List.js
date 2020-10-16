const guildModel = require('../Schema/Guild.js');

module.exports.run = async (bot, message, args) => {

    //Code Start
    let guildDB = await guildModel.findById(message.guild.id).exec();
    message.channel.send(`Monitoring ${guildDB.handles.length} user(s).\n\n${guildDB.handles.map(u => `> ${u.name}`).join('\n')}`)
	//Code End

}

module.exports.config = {
    command: "list",
    cooldown: 0, //Cooldown in seconds
	args: false //If the command requires input aka if you need to write just the command name or command name with some more arguments/fields
}