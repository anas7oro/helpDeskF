const express = require('express');
const router = express.Router();
const {getUserData,getKnowledgeBase,createUser, login, getUser , forgotPassword , confirmReseting, updatePassword, updateData, createTicket, emailVerifing, verification, otpVerification, mfa
, getMyTickets,
requsetChat,
rateTicket,
getTicket} = require('../controllers/userController');

const {auth} = require('../middleware/auth');

router.post('/createUser' , createUser);

router.post('/login' , login);

router.get('/userData' , auth ,getUser);

router.post('/forgotPassword' , forgotPassword);

router.post('/resetPassword/:id/:token' , confirmReseting);

router.post('/updatePassword' , auth , updatePassword);

router.post('/updateData' , auth , updateData);

router.post('/createTicket' , auth , createTicket);

router.post('/emailVerifying', auth , emailVerifing);

router.get('/verification/:id/:token', verification);

router.post('/otpVerification/:id' ,otpVerification);

router.post('/mfa' ,auth , mfa);

router.get('/getMyTickets' , auth , getMyTickets);

router.post('/requsetChat' , auth , requsetChat);

router.post('/rateTicket' , auth , rateTicket);

router.get('/getTicket/:id' , auth , getTicket);

router.get('/getKnowledgeBase',auth, (req, res, next) => {
    console.log('GET /getKnowledgeBase route was hit');
    getKnowledgeBase(req, res, next);
  });
router.post('/getUserData', (req, res, next) => {
    console.log('GET /getUserData route was hit');
    getUserData(req, res, next);
  });
  
module.exports = router;