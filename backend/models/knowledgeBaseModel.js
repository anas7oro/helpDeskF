const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        unique: true
    },
    answer: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    active: {
        type: Boolean,
        default: true
    },
},
{   
   timestamps: true,
}
);

const knowledgeBase = mongoose.model('knowledgeBase', knowledgeBaseSchema);

module.exports = knowledgeBase;
