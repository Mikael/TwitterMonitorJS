const Discord = require('discord.js');
const bot = new Discord.Client();
const Twit = require('twit');

const guildModel = require('./Schema/Guild.js');
bot.config = require('./Config.json');
bot.commands = new Discord.Collection();
bot.aliases = new Discord.Collection();
bot.cooldowns = new Discord.Collection();
bot.handles = new Discord.Collection();
bot.logChannels = {};

require('./Handlers/Commands.js')(bot);
require('./Handlers/Events.js')(bot);

bot.login(bot.config.token);

bot.T = new Twit({
    consumer_key: bot.config.twitterAPI,
    consumer_secret: bot.config.twitterSecret,
    access_token: bot.config.twitterAccessToken,
    access_token_secret: bot.config.twitterTokenSecret,
})

let stream;
bot.monitorTweets = async (update) => {
    let IDs = await guildModel.find({});
    IDs = IDs.reduce((acc, g) => acc.concat(g.handles), [])
    IDs = Array.from(new Set(IDs)).map(h => h.id);

    if(!stream && !IDs.length)
        return

    if(update || !IDs.length)
        stream.stop();

    stream = bot.T.stream("statuses/filter", { follow: IDs })
    stream.on("connect", (req) => {
        console.log(`${new Date().toLocaleString()} Attempting to connect to twitter`);
    })
    
    stream.on("connected", (res) => {
        console.log(`${new Date().toLocaleString()} Successfully connected to twitter stream API`);
    })
    
    stream.on("tweet", async (tweet) => {
        let text = tweet.text.replace(/(http(s)?:\/\/)?t.co\/[a-zA-Z0-9]{10}/g, "")
        let media = tweet.extended_entities && tweet.extended_entities.media ? tweet.extended_entities.media : [];
        if(text && tweet.quoted_status)
            text += "\n\n";
        if(tweet.quoted_status){
            text += `Retweeted ${tweet.quoted_status.user.name}' post:\n${tweet.quoted_status.text}`
            media.push(tweet.quoted_status.extended_entities.media)
            media = media.flat()
        }

        const tweetEmbed = new Discord.MessageEmbed()
            .setAuthor(`${tweet.user.name} (@${tweet.user.name})`,  tweet.user.profile_image_url)
            .setURL(`https://twitter.com/${tweet.user.screen_name}`)
            .setDescription(`[**Tweet link**](https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str})\n\n${text}`)
            .setColor('RANDOM')
            .setFooter('Twitter', 'https://help.twitter.com/content/dam/help-twitter/brand/logo.png')
            
        if(media.length){
            tweetEmbed.setImage(media[0].media_url)
            if(media.length > 1){
                tweetEmbed.addField('Images', media.map(m => m.media_url))
                tweetEmbed.setFooter(`Bot made by Mikael#0001`)
            }
        }
        let guilds = bot.handles.get(tweet.user.screen_name);
        for(let id of guilds)
            if(bot.logChannels[id])
                 bot.channels.resolve(bot.logChannels[id]).send(`@ ${tweet.user.name} tweeted: https://twitter.com/i/status/${tweet.id_str}`);
                bot.channels.resolve(bot.logChannels[id]).send(tweetEmbed);
    })
}