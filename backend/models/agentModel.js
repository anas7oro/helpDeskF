const mongoose = require('mongoose');

const agentModel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: String,


        enum: ['Agent 1', 'Agent 2', 'Agent 3'],
        required: true
    },
    status: {
        type: Boolean,
    },


    completedTickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }],
    activeTicketsCount: {
        type: Number,
        default: 0
    }


}, {
    timestamps: true,
});



const agent = mongoose.model("agent", agentModel);
module.exports = agent;