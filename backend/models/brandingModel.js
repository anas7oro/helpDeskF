const mongoose = require('mongoose');

const brandingModel = mongoose.Schema({
    active: {
        type: Boolean,
        default: false,
    },
    name: {
        type: String,
        required: true,
    },
    logo: {
        type: Buffer,
        contentType: String,
    },
    color_ballet: {
        type: [String],
        validate: [
            {
                validator: arrayLimit,
                message: '{PATH} exceeds the limit of 3'
            },
            {
                validator: validateHex,
                message: '{PATH} should contain valid hexadecimal colors'
            }
        ]
    },
    banner:{
        type: Buffer,
        contentType: String,
    },

},{   
    timestamps: true,
});

function arrayLimit(val) {
  return val.length <= 3;
}

function validateHex(val) {
  return val.every(color => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color));
}

const Branding = mongoose.model("Branding" , brandingModel);
module.exports = Branding;