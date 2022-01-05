require('./database/player.js')        //database model (player)
require('dotenv').config();            //Our token for discord bot
const mongoose = require("mongoose"); 

//const Player_import = require("./database/player.js");
const Player = require('./database/player.js')


const discord = require('discord.js');
const client = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })    //MUST list all intents. (https://discord.com/developers/docs/topics/gateway)



mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser:true, useUnifiedTopology: true})    //The extra object after the url avoids deprication warnings. 
    .then((result) => client.login(process.env.BOT_TOKEN));



client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});




//Ping pong test
client.on("messageCreate", msg => {
    if (msg.content == "ping") {
    msg.channel.send("`Pong`");
    }
});


const names = [];
let fill = 0;
//Add player to a list
client.on("messageCreate", msg => {

    const player = new Player({  

        name: msg.member.nickname,
    });


    if(msg.content == "!register") {
        fill++;
        msg.channel.send("currently " + fill + " players in the lobby");
        names.push(msg.member.nickname);   //breaks if player does not have a nickname. (Fix later)

        player.save(msg.member.nickname);
    }

    if(msg.content == "!leave") {
        fill--;
        msg.channel.send("currently " + fill + " players in the lobby");
        names.push(msg.member.nickname);   //breaks if player does not have a nickname. (Fix later)
    }

    if(msg.content == "!find") {

        Player.find()    //Not capital since we are retrieving from the collection.
            .then((result) => {

                let my_name = result.find(p => p.name == msg.member.nickname);

               // console.log(result);
                console.log(my_name);
                //console.log(JSON.parse(result));
              //  msg.channel.send(result);
            })


    }


});






//Print the list
client.on("messageCreate", msg => {

    if(msg.content == "!show") {
        for (let n =0; n <fill; n++){                 //Make this based on fill instead
            msg.channel.send('`' + names[n] + '`');
        }
    }
});


client.on("messageCreate", msg => {

    if(msg.content == "!flip") {
        let random = getRandomInt(2);
        let send_test;
        if (random ==1){

            send_test = "heads";
        }
        else{
            send_test = "tails";
        }
            msg.channel.send('`' + send_test + '`');
        }
    
});


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  } 