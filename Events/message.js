const guildModel = require('../Schema/Guild.js');

module.exports = async (bot, message) => {

    if(message.author.bot) return;

    const guildDB = await guildModel.findById(message.guild.id).exec();

    let prefix = guildDB ? guildDB.prefix : bot.config.prefix;
    
    if (message.content.startsWith(prefix)){
        let cmd = require('./subEvents/command.js');
        cmd.run(bot, message, prefix);
    }else
        if(message.mentions.has(bot.user))
            require('../Commands/Help.js').run(bot, message, [], prefix);
}