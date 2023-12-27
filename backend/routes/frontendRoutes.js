const express = require('express');
const router = express.Router();
const { getActiveBranding ,getBranding,setBranding,updateBranding,deleteBranding} = require('../controllers/frontendController');
const {auth} = require('../middleware/auth');


router.get('/getBranding',auth, (req, res, next) => {
  console.log('GET /branding route was hit');
  getBranding(req, res, next);
});
router.get('/getActiveBranding', (req, res, next) => {
  console.log('GET /activeBranding route was hit');
  getActiveBranding(req, res, next);
});

router.post('/createBranding', auth, isAdmin, (req, res, next) => {
  console.log('POST /branding route was hit');
  setBranding(req, res, next);
});
router.delete('/deleteBranding/:id', auth, isAdmin, (req, res, next) => {
  console.log('DELETE /branding route was hit');
  deleteBranding(req, res, next);
});

router.put('/editBranding', auth, isAdmin, (req, res, next) => {
  console.log('PUT /branding route was hit');
  updateBranding(req, res, next);
});

module.exports = router;

function isAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    console.log('Unauthorized user must be an admin to access this endpoint', { userId: req.user?._id },req.user);
    res.status(401).json({ message: 'Unauthorized user must be an admin to access this endpoint' });
    return;
  }
  next();
}
