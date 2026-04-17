const express = require('express');
const { authenticate, isAdminOrChairman } = require('../middleware/auth.middleware');
const { getAllMembers, getMemberById, createMember, updateMember, deleteMember } = require('../controllers/member.controller');

const router = express.Router();

router.use(authenticate);
router.get('/', getAllMembers);
router.get('/:id', getMemberById);
router.post('/', isAdminOrChairman, createMember);
router.put('/:id', isAdminOrChairman, updateMember);
router.delete('/:id', isAdminOrChairman, deleteMember);

module.exports = router;
