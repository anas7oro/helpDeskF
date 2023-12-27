const express = require('express');
const router = express.Router();
const { createQandA,getAllTickets} = require('../controllers/agentController');
const {auth} = require('../middleware/auth');


router.get('/manegeTickets',auth, (req, res, next) => {
  console.log('GET /Agents route was hit');
  getAllTickets(req, res, next);
});

router.post('/createKnowledge',auth,isAgent, (req, res, next) => {
  console.log('POST /createQandA route was hit');
  createQandA(req, res, next);
});


module.exports = router;

function isAgent(req, res, next) {
  console.log("checking privileges ",req.user.role);
  if (req.user.role !== 'agent') {
    logger.error('Unauthorized user must be an Agent to access this endpoint', { userId: req.user?._id });
    res.status(401).json({ message: 'Unauthorized user must be a Agent to access this endpoint' });
    return;
  }
  next();
}