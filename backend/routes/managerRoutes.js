const express = require('express');
const router = express.Router();
const {getAnalyticsCharts,updateReport,getReport,getTickets,getAgentsAnalytics, getAllReports,createReport,getAnalytics,createWorkflow,updateWorkflow,getWorkflow,deleteWorkflow,ActivateWorkflow } = require('../controllers/managerController');
//const { createReport } = require('../controllers/managerController');
const {auth} = require('../middleware/auth');
const {logger} = require('../middleware/logger');
const { log } = require('winston');

router.get('/manegeReports',auth,isManager, (req, res, next) => {
  logger.info('GET /reports route was hit');
  console.log('GET /reports route was hit');
  getAllReports(req, res, next);
});
router.get('/getReport/:id',auth,isManager,(req, res, next) => {
  logger.info('GET /reports route was hit');
  console.log('GET /reports route was hit');
  const id = req.params.id;
  req.body.id = id;
  getReport(req, res, next);
});
router.put('/updateReport/:id',auth,isManager, (req, res, next) => {
  console.log('PUT /updateReport route was hit');
  logger.info('PUT /updateReport route was hit');
  updateReport(req, res, next);
});
//manager can create a report
router.post('/createReport',auth,isManager, (req, res, next) => {
  console.log('POST /createReport route was hit');
  logger.info('POST /createReport route was hit');
    createReport(req, res, next);
});

// manager can see analytics for tickets to identify common issues and trends like chart 
router.get('/getAnalytics',auth,isManager, (req, res, next) => {
  console.log('GET /getAnalytics route was hit');
  logger.info('GET /getAnalytics route was hit');
  getAnalytics(req, res, next);
});
router.get('/getAgentsAnalytics',auth,isManager, (req, res, next) => {
  console.log('GET /getAgentsAnalytics route was hit');
  logger.info('GET /getAgentsAnalytics route was hit');
  getAgentsAnalytics(req, res, next);
});
router.get('/getAnalyticsCharts',auth,isManager, (req, res, next) => {
  console.log('GET /getAnalyticsCharts route was hit');
  logger.info('GET /getAnalyticsCharts route was hit');
  getAnalyticsCharts(req, res, next);
});

router.post('/createWorkflow',auth, (req, res, next) => {
  console.log('POST /createWorkflow route was hit');
  logger.info('POST /createWorkflow route was hit');
  createWorkflow(req, res, next);
});
router.put('/updateWorkflow/:id',auth, (req, res, next) => {
  console.log('PUT /updateWorkflow route was hit');
  logger.info('PUT /updateWorkflow route was hit');
  updateWorkflow(req, res, next);
});
router.get('/getWorkflow',auth,notClient, (req, res, next) => {
  console.log('GET /getWorkflow route was hit');
  logger.info('GET /getWorkflow route was hit');
  getWorkflow(req, res, next);
});

router.put('/ActivateWorkflow',auth,notClient, (req, res, next) => {
  console.log('PUT /ActivateWorkflow route was hit');
  logger.info('PUT /ActivateWorkflow route was hit');
  ActivateWorkflow(req, res, next);
});


module.exports = router;

router.get('/getTickets', auth, isManager, (req, res, next) => {
  logger.info('GET /tickets route was hit');
  getTickets(req, res, next);
});

function isManager(req, res, next) {
  console.log("checking privileges ",req.user.role);
  if (req.user.role !== 'manager') {
    logger.error('Unauthorized user must be a manager to access this endpoint', { userId: req.user?._id });
    res.status(401).json({ message: 'Unauthorized user must be a manager to access this endpoint' });
    return;
  }
  next();
}
function notClient(req,res,next){
  if (req.user.role === 'client') {
    logger.error('Unauthorized user must be a manager or agent to access this endpoint', { userId: req.user?._id });
    res.status(401).json({ message: 'Unauthorized user must be a manager or agent to access this endpoint' });
    return;
  }
  next();
}