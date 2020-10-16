const mongoose = require('mongoose');

const guildSchema = mongoose.Schema({
    _id: String,
    prefix: String,
    handles: [Object],
    logChannel: String
});

module.exports = mongoose.model('Guild', guildSchema);

module.exports.saveGuild = function(guildDB){
    return new Promise((resolve, reject) => {
        guildDB.save().then(db => {
            resolve(db);
        }).catch(err => {
            console.log('There was an error while updating guild\'s DB. Please join Mikael test lab https://discord.gg/R4eMZ4N ', error);
            reject(err);
        });
    })
    
}