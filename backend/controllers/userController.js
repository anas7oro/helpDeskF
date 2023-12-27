const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const user = require('../models/userModel');
const User = require('../models/userModel');
const Ticket = require('../models/ticketModel');
const { use } = require('../routes/userRoutes');
const { json } = require('body-parser');
const nodemailer = require('nodemailer');
const {google} = require('googleapis');
const Joi = require('joi');
const {logger} = require('../middleware/logger');
const csrf = require('csurf');
const csrfProtection = csrf();
const KnowledgeBase= require('../models/knowledgeBaseModel');
require('dotenv').config();
const sendMail = require("../utils/emailService");
const ChatRequest = require("../models/chatRequest");
const getPrediction = require("../utils/modelPredction");
const AgentModel = require("../models/agentModel");
const TicketQModel = require("../models/TicketQ");

CLIENT_ID = process.env.CLIENT_ID;
CLIENT_SECRET = process.env.CLIENT_SECRET;
REDIRECT_URI = process.env.REDIRECT_URI;
REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const key = process.env.SECRET; 

const tokenGenerator = (id) =>{
    return jwt.sign({id} , key ,{expiresIn: '5d'});
}


 
const createUser = asyncHandler(async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(200).required(), 
        email: Joi.string().min(3).max(200).required(),
        password: Joi.string().min(3).max(200).required(),
        dateOfBirth: Joi.date().required(),
        address: Joi.string().min(3).max(200).required(),
        phoneNumber: Joi.string().min(3).max(200).required(),
    });
    const {error} = schema.validate(req.body);
    if(error)
        return res.send(error.details[0].message);

    const { name, email, password, dateOfBirth, address, phoneNumber } = req.body;

    const exist = await User.findOne({email});
    
    if(exist)
        return res.status(200).json("user exists");
    
    const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(8));

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        dateOfBirth,
        address,
        phoneNumber
    });

    if(user)
        return res.status(200).json("user registered successfully");
    
    res.status(400).json("Unable to register user");
    logger.error(err.message, { userId: req.user?._id });
});

  
const login = asyncHandler(async (req ,res) =>{
    console.log("login was hit");
    console.log("req.body : ",req.body);
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(3).max(200).required(),
    });
    const {error} = schema.validate(req.body);
    if(error)
        return res.send(error.details[0].message);

    const { email, password} = req.body;

    const user = await User.findOne({email});

    if(user && (await bcrypt.compare(password, user.password))){
        if(user.MFA){
            const otp = Math.floor(1000 + Math.random()*9000);
            console.log(otp);
            await User.updateOne({_id: user._id} , {OTP: otp});

            sendMail(email, "OTP verification", `your OTP :${otp}`, `<h1>use this OTP to continue your login process</h1><p>OTP : ${otp} </p>`);


            return res.status(200).json({
                message: "The OTP has been sent to your email",
                email: email
            });

        }
        return res.status(200).json({
            token: tokenGenerator(user.id),
            role:user.role,
            name:user.name,
            email:user.email,
        });
    }
       
    res.status(400).json("invalid email/password");

});

const getUserData = asyncHandler(async (req ,res) =>{
    console.log("getUserData was hit");

        const schema = Joi.object({
            email: Joi.string().email().required()
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
            console.log(error)
            logger.error('Invalid input data');
            return res.status(400).json(error.details[0].message);
        }

        const { email } = value;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, dateOfBirth, address, phoneNumber, MFA } = user;
        console.log("user name : ",name,"dateOfBirth : ",dateOfBirth,"address : ",address,"phoneNumber : ",phoneNumber,"MFA : ",MFA,)

        res.json({
            name,
            email,
            dateOfBirth,
            address,
            phoneNumber,
            MFA,

        });
});

const otpVerification = asyncHandler(async(req , res)=>{
    const schema = Joi.object({
        OTP: Joi.string().required(),
        email: Joi.string().email().required()
      });
  
      const { error, value } = schema.validate(req.body);
      if (error) {
        logger.error('Invalid input data');
        return res.status(400).json(error.details[0].message);
      }
      const {OTP , email} = req.body;
      const user = await User.findOne({email});
     
      if(OTP === user.OTP){
          await User.updateOne({_id: user._id} , {OTP: null});
          return res.status(200).json({
            token: tokenGenerator(user.id),
            role:user.role,
            name:user.name,
            email:user.email,
        });
      }
      
      return res.status(200).json("wrong OTP");
});


const getUser = asyncHandler(async (req ,res) =>{
    try {
        const user = await User.findById(req.user.id);
        if(user)
            return res.json(user);
        else
            return res.json("user not found");
    } catch (error) {
        return res.json(error.message);
    }
});

const mfa = asyncHandler(async(req , res)=>{
    const user = await User.findById(req.user.id);
    if(user.MFA){
        await User.updateOne({_id: user._id} , {MFA: false});
        return res.json("MFA disabled");
    }
    else {  
        await User.updateOne({_id: user._id} , {MFA: true});
        return res.json("MFA enabled");
    }

});

const forgotPassword = asyncHandler(async(req,res)=>{
    const schema = Joi.object({
        email: Joi.string().email().required()
      });
  
      const { error, value } = schema.validate(req.body);
      if (error) {
        logger.error('Invalid input data');
        return res.status(400).json(error.details[0].message);
      }
    const {email} = req.body;
    const user = await User.findOne({email});

    if(!user)
        return res.json("password reset link has been sent to your email");

    const resetToken = key + user.password;

    const tokenGeneratorRP = (id , email) =>{
        return jwt.sign({id, email} , resetToken ,{expiresIn: '1d'});
    }

    if(user){
        const token = tokenGeneratorRP(user.id , email);
        const link = `http://localhost:3000/resetPassword/${user._id}/${token}`
        console.log(link)
        sendMail(email, "Reset password", `your reset Link :${link}`, `<h1>use this link to reset your password</h1><p>link : ${link} </p>`);
   
    }
    logger.info('password reset link has been sent to users email');
    res.json("password reset link has been sent to your email");

});


const confirmReseting = asyncHandler(async(req,res)=>{
    const schema = Joi.object({
        password: Joi.string().min(3).max(200).required(),
        confirmPassword: Joi.string().min(3).max(200).required(),
    });
    const {error} = schema.validate(req.body);
    if(error)
        return res.send(error.details[0].message);

    const {id , token} = req.params;
    const {password , confirmPassword} = req.body;
    const user = await User.findById(id);
    const resetToken = key + user.password;

    if(!password || !confirmPassword){
        logger.error("inputs missing", { userId: req.user?._id });
         return res.json("fill all fields");
    }
       

    try {
        const verify = jwt.verify(token , resetToken);
        if(password != confirmPassword)
            return res.send("please enter the same password");

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(8));
        await User.updateOne({_id: id} , {password: hashedPassword});
        logger.info('password reseted successfully');
        res.status(200).json("password reseted successfully");
    } catch (error) {
        res.send(error.message);
    }
});

const updatePassword = asyncHandler(async(req,res)=>{
    const schema = Joi.object({
        password: Joi.string().min(3).max(200).required(),
        newPassword: Joi.string().min(3).max(200).required(),
        confirmNew: Joi.string().min(3).max(200).required(),
    });
    const {error} = schema.validate(req.body);
    if(error)
        return res.send(error.details[0].message);

    const{password , newPassword , confirmNew} = req.body;
    const user = await User.findById(req.user.id);

    if(!newPassword || ! confirmNew)
        return res.send("please fill all the required fields")
    if(!await bcrypt.compare(password, user.password))
        return res.send("wrong old password");
    if(newPassword != confirmNew)
        return res.send("please enter the same password");
    const hashedPassword = await bcrypt.hash(confirmNew, await bcrypt.genSalt(8));
    await User.updateOne({_id: user._id} , {password: hashedPassword});
    logger.info('password updated successfully');
    res.json("password updated successfully");
});

const updateData = asyncHandler(async(req , res)=>{
    console.log("updateData was hit : ",req.body);
    const schema = Joi.object({
        name: Joi.string().min(3).max(200), 
        email: Joi.string().min(3).max(200),
        dateOfBirth: Joi.date(),
        address: Joi.string().min(3).max(200),
        phoneNumber: Joi.string().min(3).max(200),
    });
    const {error} = schema.validate(req.body);
    if(error)
        return res.send(error.details[0].message);

    const { email, dateOfBirth, address, phoneNumber , name} = req.body;
    const user = await User.findById(req.user.id);

    let update = {};
    if(dateOfBirth) update.dateOfBirth = dateOfBirth;
    if(address) update.address = address;
    if(phoneNumber) update.phoneNumber = phoneNumber;
    if(email) {
        update.email = email;
        update.isEmailVerified = false;
    }
    if(name) update.name = name;

    await User.updateOne({_id: user._id}, update);
    
    logger.info('data updated successfully');
    return res.json("data updated successfully");
});

const emailVerifing = asyncHandler(async(req , res)=>{
    const user = await User.findById(req.user.id);
    const verifyingToken = key + user.email;

    const tokenGeneratorRP = (id) =>{
        return jwt.sign({id} , verifyingToken ,{expiresIn: '1d'});
    }

    const token = tokenGeneratorRP(user.id);
    const link = `http://localhost:5000/verification/${user._id}/${token}`

    console.log(link);

    const oAuth2Client = new google.auth.OAuth2(CLIENT_ID , CLIENT_SECRET , REDIRECT_URI);
        oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});

        async function sendMail(){

        try {
            const accessToken = await oAuth2Client.getAccessToken();
            const transport = nodemailer.createTransport({
                service: 'gmail',
                auth:{
                type: 'oAuth2',
                user: 'anas.horo88@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
                }
            })

            const mailOptions = {
            from: 'anas horo <anas.horo88@gmail.com>',
            to: 'anas.horo22@gmail.com',
            subject:'reset password',
            text:`to reset your password click on this link :${link} `,
            html: `<h1>email verification</h1><p>Click the following link to verify your email:</p><a href="${link}">${link}</a>`
            }

            const result = await transport.sendMail(mailOptions);
            return result
            
        } catch (error) {
            return error;
        }
        }
        sendMail().then(result=> console.log('email is sent...', result))
        .catch(error => console.log(error.message)); 
    

    logger.info('confirmation link has been sent to users email');
    res.json("confirmation link has been sent to your email");

});
const rateTicket = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { rate } = req.body;
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.json("ticket not found");
    await Ticket.updateOne({ _id: id }, { rate: rate });
    res.json("ticket rated successfully");
}
);

const verification = asyncHandler(async(req , res)=>{
    const {id} = req.params;
    const user = await User.findById(id);

    await User.updateOne({_id: user._id} , {isEmailVerified: true});
    logger.info('email verified successfully');
    return res.json("email verified successfully");
});

const createTicket = asyncHandler(async (req, res) => {
    const schema = Joi.object({
        category: Joi.string().required(),
        subCategory: Joi.string().required(),
        title: Joi.string().required(),
        description: Joi.string().required(),
        priority: Joi.string().required(),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.send(error.details[0].message);

    const { category, subCategory, title, description, priority } = req.body;
    const user = await User.findById(req.user.id);

    if (!category || !subCategory || !title || !description || !priority)
        return res.json("please fill all the fields");

    console.log("USER ID:   " + user._id);

    const createdTicket = await Ticket.create({
        userid: user._id,
        category,
        subCategory,
        title,
        description,
        priority,
    });

    getPrediction(category, priority).then(async (result) => {
        const agentScores = Object.entries(result.prediction).map(
            ([agent, score]) => ({ agent, score })
        );

        agentScores.sort((a, b) => b.score - a.score);

        const firstAgent = await AgentModel.findOne({
            category: agentScores[0].agent,
        });

        const secondAgent = await AgentModel.findOne({
            category: agentScores[1].agent,
        });

        if (agentScores[0].score === 1) {
            if (firstAgent.activeTicketsCount < 3) {
                await Ticket.updateOne(
                    { _id: createdTicket._id },
                    { agentid: firstAgent.userId }
                );
                await AgentModel.updateOne(
                    { _id: firstAgent._id },
                    { activeTicketsCount: firstAgent.activeTicketsCount + 1 }
                );
            } else {
                const TicketQ = await TicketQModel.create({
                    ticketId: createdTicket._id,
                    assignedAgents: [agentScores[0].agent],
                });
            }
        } else {
            if (firstAgent.activeTicketsCount < 3) {
                await Ticket.updateOne(
                    { _id: createdTicket._id },
                    { agentid: firstAgent.userId }
                );
                await AgentModel.updateOne(
                    { _id: firstAgent._id },
                    { activeTicketsCount: firstAgent.activeTicketsCount + 1 }
                );
            } else if (secondAgent.activeTicketsCount < 3) {
                await Ticket.updateOne(
                    { _id: createdTicket._id },
                    { agentid: secondAgent.userId }
                );
                await AgentModel.updateOne(
                    { _id: secondAgent._id },
                    { activeTicketsCount: secondAgent.activeTicketsCount + 1 }
                );
            } else {
                const TicketQ = await TicketQModel.create({
                    ticketId: createdTicket._id,
                    assignedAgents: [agentScores[0].agent, agentScores[1].agent],
                });
            }
        }
    });

    req.body.ticketId = createdTicket._id;
    console.log("ticketId:   " + req.body.ticketId);

    if (subCategory === "other") {
        await requsetChat(req, res);
    } else {
        sendMail(req.user.email, "Creating Ticket", "Your ticket has been created successfully", "<h1>Your ticket has been created successfully</h1><p>Our agents will contact you soon</p>");
        logger.info("ticket created successfully");
        res.json("ticket created successfully");
    }
});
const requsetChat = asyncHandler(async (req, res) => {
    try {
        const { ticketId } = req.body;

        const existingChatRequest = await ChatRequest.findOne({ ticketId });

        if (existingChatRequest) {
            return res.json("Chat request already exists");
        }
        const ticket = await Ticket.findById(ticketId);
        if (ticket.status === "closed") {
            return res.json("Chat request created successfully");
        }

        const newChatRequest = await ChatRequest.create({
            userId: req.user.id,
            status: "pending",
            ticketId,
        });
        res.json("Chat request created successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal Server Error");
    }
});
const getMyTickets = asyncHandler(async (req, res) => {
    const tickets = await Ticket.find({ userid: req.user.id });
    res.json(tickets);
});
const getTicket = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.json("ticket not found");
    res.json(ticket);
}
);

const getKnowledgeBase = async (req, res, next) => {
    console.log('GET /getKnowledgeBase route was hit');
    logger.info('GET /getKnowledgeBase route was hit');
   try{

    const base = await KnowledgeBase.find({});
    if(!base)
        return res.json("no knowledge base");
    else
        console.log("knowledge base",base);

    res.status(200).json(base);
   }catch(error){
    console.error('Error:', err);
    logger.error(err.message, { userId: req.user?._id });
    res.status(500).json({ message: err.message });
   }
};

module.exports ={
    createUser,
    login,
    getUser,
    forgotPassword,
    confirmReseting,
    updatePassword,
    updateData,
    createTicket,
    emailVerifing,
    verification,
    otpVerification,
    mfa,
    getKnowledgeBase,
    getUserData,
    getMyTickets,
    requsetChat,
    rateTicket,
    getTicket
}

