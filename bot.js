require('./database/player.js')        //database model (player)
require('dotenv').config();            //Our token for discord bot
const mongoose = require("mongoose");

//const Player_import = require("./database/player.js");
const Player = require('./database/player.js')


const discord = require('discord.js');
const client = new discord.Client({ intents: ["GUILDS", "GUILD_MESSAGES"] })    //MUST list all intents. (https://discord.com/developers/docs/topics/gateway)



mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true })    //The extra object after the url avoids deprication warnings. 
    .then((result) => client.login(process.env.BOT_TOKEN));



client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});




//Ping pong test
client.on("messageCreate", msg => {
    if (msg.content == "i") {
        msg.channel.send("Games:" + games.length);

    }
});



let current_game = -1;  //Increments as we get new games.
const games = [];
let picking = false;

//The Tournament portion: an array of game objects, each with a random id.
function game(id) {

    this.queue = [];    //All players.
    this.team_1 = [];   //An array of names.
    this.team_2 = [];
    this.id = id;
}


client.on("messageCreate", msg => {
    if (msg.content == "=j") {

        if (current_game == -1) {  //on start up - make a game.
            current_game = 0;
            games[current_game] = new game(getRandomInt(1000));   //Id between 1k
        }
        //Concurrent games, make a new game.
        else if (games[current_game].queue.length == 0 &&
            (games[current_game].team_1.length == 5 ||
                games[current_game].team_2.length == 5)) {
            //current_game++; Currently just over writes the game when a new one is to be made.
            games[current_game] = new game(getRandomInt(1000));
        }

        if (picking) {
            msg.channel.send("Players currently being picked, wait.");
        }

        else {     //Add player to game.

            if (!games[current_game].queue.includes(msg.member.displayName)) {  //no duplicates
                games[current_game].queue.push(msg.member.displayName);
                msg.channel.send(msg.member.displayName);
            }
            else {
                msg.channel.send(msg.member.displayName + " Is already in the queue.")
            }
        }

        if (games[current_game].queue.length == 10) {   //queue pop

            msg.channel.send("queue popped!");
            const captain1_num = getRandomInt(10);
            let captain2_num = getRandomInt(10);

            while (captain1_num == captain2_num) {    //Ensure the captains are different.
                captain2_num = getRandomInt(10);
            }
            captain1 = games[current_game].queue[captain1_num];
            captain2 = games[current_game].queue[captain2_num];        //These are global too.

            msg.channel.send("Captain 1: " + captain1 + " Captain 2: " + captain2);

            for (let p of games[current_game].queue) {  //Initially print all the players.
                msg.channel.send(p);
            }
            current_captain = captain1;  //global
            next_captain = captain2;
            picking = true;              //Also global
        }
        //END OF =j
    }

    picking = true; //TEST.
    if (picking == true) {

        const message = msg.content.split(" ");
        for (let i of message) {
            msg.channel.send(i);
        }

        //Message is: @!id
        if (message[0] == "=p" && message.length == 2 && msg.displayName == current_captain) {

            current_captain = next_captain;
            if (next_captain == captain1) { //Get next captain.
                next_captain = captain2;
            }
            else {
                next_captain = captain1;
                current_captain = captain2;

                games[current_game].queue = games[current_game].queue.filter(p => p != message[1]);

            }
            for (let p of games[current_game].queue) {  //print remaining players.
                msg.channel.send(p);
            }

        }
    }
});













//Database.
client.on("messageCreate", msg => {

    const player = new Player({

        name: msg.member.nickname,
    });


    if (msg.content == "!register") {
        fill++;
        msg.channel.send("currently " + fill + " players in the lobby");
        names.push(msg.member.nickname);   //breaks if player does not have a nickname. (Fix later)

        player.save(msg.member.nickname);
    }

    if (msg.content == "!leave") {
        fill--;
        msg.channel.send("currently " + fill + " players in the lobby");
        names.push(msg.member.nickname);   //breaks if player does not have a nickname. (Fix later)
    }

    if (msg.content == "!find") {

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

    if (msg.content == "!show") {
        for (let n = 0; n < fill; n++) {                 //Make this based on fill instead
            msg.channel.send('`' + names[n] + '`');
        }
    }
});


client.on("messageCreate", msg => {

    if (msg.content == "!flip") {
        let random = getRandomInt(2);
        let send_test;
        if (random == 1) {

            send_test = "heads";
        }
        else {
            send_test = "tails";
        }
        msg.channel.send('`' + send_test + '`');
    }

});


function getRandomInt(max) {
    return Math.floor(Math.random() * max);
} 