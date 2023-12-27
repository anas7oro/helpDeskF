const mongoose = require('mongoose');

const workflowSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['Network', 'Software', 'Hardware'],
        required: true
    },
    subCategory: {
        type: String,
        enum: ['desktops', 'laptops', 'printers', 'servers', 'networking equipment', 'operating system', 'application software', 'custom software', 'integration issues', 'email issues', 'internet connection problems', 'website errors'],
        required: true
    },
    steps: {
        type: [String],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    active: {
        type: Boolean,
        default: false
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
},
{   
   timestamps: true,
}

);

const Workflow = mongoose.model('Workflow', workflowSchema);

module.exports = Workflow;
