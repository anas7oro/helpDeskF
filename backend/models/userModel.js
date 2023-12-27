const mongoose = require('mongoose');


const userModel = mongoose.Schema({
    name :{
      type: String,
      required: true,
    },
    email :{
      type: String,
      required: true,
      unique: true,
    },
    password :{
      type: String,
      required: true,
      minlength: 6
    },
    role :{
      type: String,
      enum : ['client','admin','agent','manager'] ,
      default: 'client'
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    MFA: {
      type: Boolean,
      default: false
    },
    OTP :{
      type: String,
      required: false,
    },

  },{   
    timestamps: true,
    }
);

const User = mongoose.model("User" ,userModel);
module.exports = User;
