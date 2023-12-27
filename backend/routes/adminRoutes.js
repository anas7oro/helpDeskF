const express = require('express');
const router = express.Router();
const {logger} = require('../middleware/logger');
const {restoreBackup,getBackups,restoreLatestBackup,createBackup, assignRole, createUser,getErrorLogs,getCombinedLogs } = require('../controllers/adminController');
const {auth} = require('../middleware/auth');


router.post('/assignRole' ,auth,isAdmin, assignRole);

router.post('/createUser' ,auth,isAdmin, createUser);

router.get('/getErrorLogs' ,auth, isAdmin,getErrorLogs);

router.get('/getCombinedLogs' ,auth, isAdmin,getCombinedLogs);

router.post('/createBackup' ,auth, isAdmin,createBackup);

router.post('/restoreLatestBackup' ,auth, isAdmin,restoreLatestBackup);

router.post('/restoreBackup' ,auth, isAdmin,restoreBackup);

router.get('/getBackups' ,auth, isAdmin,getBackups);


module.exports = router;
function isAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
      logger.error('Unauthorized user must be an admin to access this endpoint', { userId: req.user?._id });
      res.status(401).json({ message: 'Unauthorized user must be an admin to access this endpoint' });
      return;
    }
    next();
  }