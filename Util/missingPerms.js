const Discord = require('discord.js');

function missingPerms(commandName, message, permArr, type, embedPerm) {
  
    let userVC = message.member.voice.channel;
    let aMissingPerms = permArr.map(perm => {
        console.log(perm)
        switch(type){
            case "role":
                if(message.guild.me.hasPermission(perm)) return undefined;
                break;

            case 'channel':
                if(message.guild.me.permissionsIn(message.channel.id).has(perm)) return undefined;
                break;

            case 'voice':
                if(userVC.permissionsFor(message.guild.me).has(perm)) return undefined;
                break;
        }
        console.log(perm)
        return perm.split("_").map(str => firstCap(str)).join(" ");
    });
    console.log(aMissingPerms)
    if(embedPerm){
        let embed = new Discord.MessageEmbed()
            .setTitle(`Missing Permissions`)
            .setDescription(`The following permissions are need to execute \`${commandName}\`:\n**${aMissingPerms.join("\n")}**`)
            .setFooter(`Missing permissions`)
            .setTimestamp();
        return message.channel.send(embed);
    } else {
        message.channel.send(`The following permissions are need to execute \`${commandName}\`:\n**${aMissingPerms.join("\n")}**`)
    }
}


function hasPerms(message, permArr, type){
    switch(type){
        case "role":
            let member = message.guild.me;
            return !permArr.some(perm => !member.hasPermission(perm));

        case 'channel':
            let chatPerms = message.guild.me.permissionsIn(message.channel.id)
            return !permArr.some(perm => !chatPerms.has(perm));

        case 'voice':
            let userVC = message.member.voice.channel;
            let VCPerms = userVC.permissionsFor(message.guild.me);
            return !permArr.some(perm => !VCPerms.has(perm));
    }
}

function firstCap(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}
module.exports = { missingPerms, hasPerms };