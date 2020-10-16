const Discord = require("discord.js");
const util = require('util');

module.exports.run = async (bot, message, args) => {
    
    const EvalEmbed = new Discord.MessageEmbed().setTitle("Mikael's Evaulation");
    try{
        if(args.join(' ').length == 0) return message.channel.send('Need something to evaluate');
        let str = args.join(' ');
        let evaled = util.inspect((await eval(str)))
        EvalEmbed.addField("Input", ` \`\`\`js\n ${args.join(" ")} \`\`\``).addField("Output", ` \`\`\`js\n ${await evaled} \`\`\` `).addField("Type of", ` \`\`\`js\n ${await typeof(evaled)} \`\`\` `)
        await message.channel.send(EvalEmbed)
        // await message.channe.send(`\`\`\`js\n${evaled}\`\`\``);
    } catch(e){
        return message.channel.send(`\`\`\`coffee\n${e.message}\`\`\``);
    }
};

module.exports.config = {
    category: "developer",
    args: true  ,
    command: "eval"
}