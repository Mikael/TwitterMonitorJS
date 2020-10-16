const Discord = require('discord.js');

module.exports.run = async (bot, message, args) => {

    //Code Start
    
	//Code End

}

module.exports.config = {
    cmdPerms: ["CONNECT", "SPEAK"],
    usage: "", //if args is set to false you can remove this otherwise describe how to use the command
    command: "name",
    aliases: ["x", "y"],
    cooldown: 5, //Cooldown in seconds
	args: true //If the command requires input aka if you need to write just the command name or command name with some more arguments/fields
}