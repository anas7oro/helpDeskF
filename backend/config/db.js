const mongoose = require('mongoose')

const connectDB = async()=>{
    try{
      const connect = await mongoose.connect(process.env.MONGO_URI);
      console.log("Server connected to the db !!")
    }catch(err){
      console.log("Not connected to db" , err.message);
    } 
    
  };
module.exports = connectDB