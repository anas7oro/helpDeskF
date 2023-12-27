const mongoose = require('mongoose');

const chatRequest = mongoose.Schema({
    userId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user"
    },
        status :{
        type: String,
        enum : ['pending','opened','closed'],
        default: 'pending'
    },
    ticketId :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "ticket"
    }
})
const chatRequestmodel = mongoose.model("chatRequest" , chatRequest);
module.exports = chatRequestmodel;