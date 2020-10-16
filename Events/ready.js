const mongoose = require('mongoose')
const guildModel = require('../Schema/Guild.js');

module.exports = async (bot) => {
    bot.user.setActivity(bot.config.activity,{ type: 'PLAYING'}).catch(console.error);

    bot.monitorTweets(false);

    mongoose.connect(bot.config.mongoDB, {
        useNewUrlParser: true,
        useUnifiedTopology: true 
    })
    
    mongoose.connection.on('connected', () => {
        console.log('Connected to mongodb');
    })
    
    mongoose.connection.on('error', error => {
        console.log('error in connecting to mongodb ', error);
    })

    let allGuilds = bot.guilds.cache.array()
    for(let guild of allGuilds){
        const guildDB = await guildModel.findById(guild.id);
        if(!guildDB){
            const defaultGuild = { 
                _id: guild.id,
                prefix: bot.config.prefix, 
                handles: [],
                logChannel: 'none'
            }
            const newGuild = new guildModel(defaultGuild)
            guildModel.saveGuild(newGuild);
        }else{
            guildDB.handles.forEach(h => {
                if(bot.handles.has(h.name)){
                    let guildIDs = bot.handles.get(h.name);
                    guildIDs.push(guild.id);
                    bot.handles.set(h.name, guildIDs);
                }else{
                    bot.handles.set(h.name, [guild.id]);
                }
            });
            if(guildDB.logChannel != 'none')
                bot.logChannels[guild.id] = guildDB.logChannel;
        }
    }

    console.log('TweetBot is online!');
};

