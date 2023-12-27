const mongoose = require('mongoose');

const logsSchema = new mongoose.Schema({
    userId: {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"     
    },errorMessage: {
        type: String,
        required: true,
    },
},
{   
   timestamps: true,
}
);

const logs = mongoose.model('logsBase', logsSchema);

module.exports = logs;
