const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

key = "manga";
const auth = asyncHandler(async(req , res, next)=>{
    let token ;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];

            //decode the token
            const verify = jwt.verify(token , key);

            req.user = await User.findById(verify.id);

            next();
        }catch(error){
            res.status(401);
            throw new Error('not authorized');
        }
    }
   
    if(!token){
        res.status(401);
        throw new Error('not authorized, login please');
    }


});

module.exports = {auth};