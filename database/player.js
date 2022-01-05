const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const playerSchema = new Schema({    //All of these are objects 

    name:{              //name is also an object
        type : String, 
        
    },
    wins:{
        type : Number, 
        

    },
    losses: {
        type : Number, 
       
    },

} ,  {timestamps:true});    //timestamps is inside an options object. 

const Player = mongoose.model('Player', playerSchema);    //player is the (singular) collection. Should be players in db.

module.exports = Player;