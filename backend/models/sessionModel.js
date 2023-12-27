const mongoose = require('mongoose');


const sessionModel = mongoose.Schema({

    session: {
        type: String,
        default: null,
    },
    userid:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    expiresAt: {
        type: Date,
        default: Date.now,
        index: { expires: '15m' }  // Session will be removed after 15 minutes of inactivity
    },
   
},
{   
    timestamps: true,
 }

);

const session = mongoose.model("session" ,sessionModel);
module.exports = session;