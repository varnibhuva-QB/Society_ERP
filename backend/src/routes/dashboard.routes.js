const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { dashboardController } = require('../controllers/index');
const router = express.Router();
router.use(authenticate);
router.get('/stats', dashboardController.getStats);
module.exports = router;
