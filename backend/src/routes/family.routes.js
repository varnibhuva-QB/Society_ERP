// family.routes.js
const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const { familyController } = require('../controllers/index');
const router = express.Router();
router.use(authenticate);
router.get('/member/:memberId', familyController.getByMember);
router.get('/my', familyController.getByMember);
router.post('/', familyController.create);
router.delete('/:id', familyController.delete);
module.exports = router;
