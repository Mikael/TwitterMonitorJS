const fs = require('fs');

module.exports = function(bot) {
    
    let commands = fs.readdirSync('Commands');
    console.log(commands.length + ' commands found');
    
    commands.forEach(file => {      
        delete require.cache[require.resolve(`../Commands/${file}`)];  
        let cmd = require(`../Commands/${file}`)
        bot.commands.set(cmd.config.command, cmd);

        let space = "";
        for(let i = 0; i < 30 - cmd.config.command.length; i++)  space += " ";
        console.log(`Command ${cmd.config.command} ${space}loading...`);//file.substring(file.lastIndexOf('/') + 1, file.length) == cmd name from path

        if(cmd.config.aliases)
            cmd.config.aliases.forEach(alias => bot.aliases.set(alias, cmd.config.command));
        
    });

}