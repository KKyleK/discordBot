const names = [];


require('dotenv').config();

const discord = require('discord.js');
const client = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })    //MUST list all intents. (https://discord.com/developers/docs/topics/gateway)

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});


client.on("messageCreate", msg => {
    if (msg.content == "ping") {
    msg.channel.send("Pong");
    }
});

client.on("messageCreate", msg => {

    if(msg.content == "!add") {
        names.push(msg.member.nickname);
    }
});

client.on("messageCreate", msg => {

    if(msg.content == "!show") {
        for (n of names){
            msg.channel.send(n);
        }
    }
});


client.login(process.env.BOT_TOKEN);