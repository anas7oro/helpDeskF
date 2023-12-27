const mongoose = require('mongoose');

const messageModel = mongoose.Schema({
    sender :{
        type: mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    reciever :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    text:{
        type: String
    },

    chat :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chat",
    },
     readReceipt: {
        type: Boolean,
        default: false

    },
    attachment: [{
        data: Buffer,
        contentType: String
    }],
    messageType: {
        type: String,
        enum: ['text', 'image', 'video'],
        default: 'text'

    }

  },{   
    timestamps: true,
 }

);

const Message = mongoose.model("Message" , messageModel);
module.exports = Message;
