const Twit = require('twit');
const config = require('../Config.json');
const Discord = require('discord.js');

let T = new Twit({
    consumer_key: config.twitterAPI,
    consumer_secret: config.twitterSecret,
    access_token: config.twitterAccessToken,
    access_token_secret: config.twitterTokenSecret,
})

module.exports.run = async (bot, message, args, prefix) => {

    //Code Start
    switch(args[0].toLowerCase()){
        case 'add':
            args.shift();
            if(bot.db.has('keywords')){
                let kw = bot.db.get('keywords');
                args = args.map(a => a.toLowerCase());
                kw.push(args)
                kw = kw.flat()
                bot.db.set('keywords', Array.from(new Set(kw)))
            }else{
                bot.db.set('keywords', args);
            }
            message.channel.send(`Added \`${args.join(', ')}\` keywords.`);
            bot.monitorTweets(true)
            break;

        case 'remove':
            args.shift();
            if(!bot.db.has('keywords'))
                return message.channel.send(`You aren\'t following any keywords. Add keywords using \`${prefix}keyword add keyword1 keyword2 ..\``)

            let kw2 = bot.db.get('keywords')
            args = args.map(a => a.toLowerCase());
            for(let kw3 of args)
                if(kw2.includes(kw3))   
                    kw2.splice(kw2.indexOf(kw3), 1);
            
            bot.db.set('keywords', kw2)
            message.channel.send(`Removed \`${args.join(', ')}\` keywords.`);
            bot.monitorTweets(true)
            break;

        case 'list':
            args.shift();
            if(bot.db.has('keywords') && bot.db.get('keywords').length){
                let kw3 = bot.db.get('keywords');
                message.channel.send(`Following \`${kw3.join(', ')}\` keywords.`);
            }else
                message.channel.send(`Not following any keywords. Add keywords using \`${prefix}keyword add keyword1 keyword2 ..\``)

    }
    
	//Code End

}

module.exports.config = {
    cmdPerms: ["EMBED_LINKS"],
    usage: "[keywords]", //if args is set to false you can remove this otherwise describe how to use the command
    command: "keyword",
    aliases: ["kw"],
    cooldown: 0, //Cooldown in seconds
	args: true //If the command requires input aka if you need to write just the command name or command name with some more arguments/fields
}