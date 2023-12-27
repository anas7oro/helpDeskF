const mongoose = require('mongoose');


const reportModel = mongoose.Schema({

    agentid:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Agent"
    },
    managerid:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    ticketid:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Ticket"
    },
    description:{
        type: String
    },
    title:{
        type: String
    },
},
{   
    timestamps: true,
 }

);

const Report = mongoose.model("Report" ,reportModel);
module.exports = Report;