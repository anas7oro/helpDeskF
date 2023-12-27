const mongoose = require('mongoose');

const ticketQSchema = mongoose.Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ticket"
    },
    status: {
        type: String,
        enum: ['pending', 'assigned'],
        default: 'pending'
    },
    date: {
        type: Date,
        default: Date.now
    },
    assignedAgents: [
        {
            type: String,
            enum: ['Agent 1', 'Agent 2', 'Agent 3']
        }
    ]
});

const TicketQModel = mongoose.model("TicketQ", ticketQSchema);
module.exports = TicketQModel;