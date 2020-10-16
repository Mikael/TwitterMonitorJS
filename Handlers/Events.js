const fs = require('fs'); 

module.exports = bot => {
    let events = fs.readdirSync('Events');

    events = events.filter(file => file.endsWith('.js'));
    console.log(`${events.length} events found`);

    events.forEach(file => {
        let space = "";
        for(let i = 0; i < 32 - file.length; i++)
            space += " ";

        console.log(`Event ${file} ${space}loading...`);
        let eventModule = require(`../Events/${file}`);
        let eventName = file.split('.')[0];
        bot.on(eventName, eventModule.bind(null, bot));
    })
}