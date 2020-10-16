const Discord   = require('discord.js');
const fs = require('fs');
//Mikael#001 was here
module.exports.run = async (bot, message, args, prefix) => {

    //Variables
    let commandEmbed = new Discord.MessageEmbed();
    let allCommands = fs.readdirSync('./Commands').map(file => file.substring(file.lastIndexOf('/') + 1, file.length).slice(0, -3));
    
    //Code Start
    if(!args.length){
        commandEmbed
            .setAuthor(`Basic Info`, message.guild.iconURL())
            .setDescription(`My prefix is \`${prefix}\`\n\n**Commands**\n \`\`\`\n${allCommands.join(" ")} \`\`\` `)
            .setColor("BLACK")
            .setFooter(`Last used by | ${message.author.username}`, message.author.avatarURL());

        return message.channel.send(commandEmbed);
    }

    const commandName = args[0].toLowerCase();
    let command; 

    if(bot.commands.has(commandName))
        command = bot.commands.get(commandName);
    else if(bot.aliases.has(commandName))
        command = bot.commands.get(bot.aliases.get(commandName));

    if (!command) {
        return message.channel.send('that\'s not a valid command!');
    }
    const name = commandName[0].toUpperCase() + commandName.slice(1).toLowerCase();
    commandEmbed.setAuthor(`${name} Command`, message.guild.iconURL())

    if (command.config.desc) commandEmbed.addField(`**Description:**`, `${command.config.desc}`);
    if (command.config.aliases) commandEmbed.addField("**Aliases:**", ` \`\`\`\n${command.config.aliases.join(', ')}\`\`\` `);
    if (command.config.usage) commandEmbed.addField(`**Usage:**`, ` \`\`\`\n${prefix}${command.config.command} ${command.config.usage}\`\`\``);
    else commandEmbed.addField(`**Usage:**`, ` \`\`\`\n${prefix}${command.config.command}\`\`\``);
    if (command.config.cmdPerms) commandEmbed.addField(`**Permissions needed:**`, ` \`\`\`\n${command.config.cmdPerms}\`\`\``);

    commandEmbed.addField(`**Cooldown:**`, `${command.config.cooldown || 0} second(s)`)
    .setColor("BLACK")

    message.channel.send(commandEmbed);
	//Code End

}

module.exports.config = {
    cmdPerms: ["EMBED_LINKS"],
    usage: "[command]",
    command: "help",
    aliases: ["h"],
    args: false,
}