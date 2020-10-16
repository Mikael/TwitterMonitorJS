const Discord = require('discord.js');
const { missingPerms, hasPerms } = require('../../Util/missingPerms.js');

module.exports.run = async(bot, message, prefix) => {

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();
    let command;

    if(bot.commands.has(commandName))
        command = bot.commands.get(commandName);
    else if(bot.aliases.has(commandName))
        command = bot.commands.get(bot.aliases.get(commandName));
    else 
        return;// console.log("Unknown command");
    
    const hasEmbedPerm = message.guild.me.permissionsIn(message.channel.id).has('EMBED_LINKS');
    const permArr = command.config.cmdPerms;
    const cmdName = command.config.command;

    if(!message.guild.me.hasPermission('SEND_MESSAGES')) 
        return console.log("No SEND_MESSAGES Permission - ", message.guild.name);

    if(permArr){
        //console.log(hasPerms(message, permArr, 'channel'), message.guild.me.hasPermission(permArr[0]))
        if(!hasPerms(message, permArr, 'role')) 
            return missingPerms(cmdName, message, permArr, 'role', hasEmbedPerm);
        if(!hasPerms(message, permArr, 'channel')) 
            return missingPerms(cmdName, message, permArr, 'channel', hasEmbedPerm)
    }
    
    if(bot.config.developers.includes(message.author.id)){
        try {
            command.run(bot, message, args, prefix); 
        } catch(err) { 
            console.log(err);
        }
        return;
    }

    if(command.config.args && !args.length) {
        let reply = `You didn\'t provide enough arguments for that command, ${message.author}`;
        if(command.config.usage)
            reply += `\nThe proper usage would be: \`\`\`\n${prefix}${command.config.command} ${command.config.usage}\`\`\``;

        return message.channel.send(reply);
    }
    //----------------------------------------------------------------------------------
    //-----------------------------------COOLDOWN---------------------------------------
    if(!bot.cooldowns.has(command.config.command))
        bot.cooldowns.set(command.config.command, new Discord.Collection());

    const now = Date.now();
    const timestamps = bot.cooldowns.get(command.config.command);
    const cooldownAmount = (command.config.cooldown || 0) * 1000;

    if(timestamps.has(message.author.id)) {
        const expDate = timestamps.get(message.author.id) + cooldownAmount;

        if(now < expDate){
            const timeLeft = (expDate - now) / 1000;
            const embed = new Discord.MessageEmbed()
                .setTitle("You're on cooldown")
                .setDescription(`You're too fast! You can use this command in ${timeLeft.toFixed(1)}`)
                .setColor('BLACK');

            return message.channel.send(embed);
        }
    }

    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    //======================================================================
    try { 
        command.run(bot, message, args, prefix); 
    } catch (err) { 
        console.log("Unknown error", command.config.command); 
        message.channel.send("Unknown error, Please join Mikaels test lab and report this issue. https://discord.gg/R4eMZ4N"); 
    }
    //======================================================================
};