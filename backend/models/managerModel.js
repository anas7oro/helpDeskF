const mongoose = require('mongoose');


const managerModel = mongoose.Schema({

    agentid:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Agent"
    },
    managerid:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    description:{
        type: String
    },
    title:{
        type: String,
        max: 50
    },
    department:{
        type: String
    },
   
},
{   
    timestamps: true,
 }

);

const manager = mongoose.model("manager" ,managerModel);
module.exports = manager;