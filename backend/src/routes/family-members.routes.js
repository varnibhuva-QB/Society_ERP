const express = require('express');
const { authenticate } = require('../middleware/auth.middleware');
const prisma = require('../utils/prisma');
const router = express.Router();

router.use(authenticate);

// Get family members by member_id (query parameter or current user)
router.get('/', authenticate, async (req, res) => {
  try {
    const member_id = req.query.member_id ? parseInt(req.query.member_id) : req.user.member_id;
    
    const familyMembers = await prisma.familyMember.findMany({
      where: { member_id },
      orderBy: { created_at: 'desc' }
    });

    res.json(familyMembers || []);
  } catch (error) {
    console.error('Error fetching family members:', error);
    res.status(500).json({ error: 'Failed to fetch family members' });
  }
});

// Create family member
router.post('/', async (req, res) => {
  try {
    const { name, age, relationship, contact_number, member_id } = req.body;
    
    if (!name || !age || !relationship || !member_id) {
      return res.status(400).json({ error: 'Name, age, relationship, and member_id are required' });
    }

    const familyMember = await prisma.familyMember.create({
      data: {
        member_id: parseInt(member_id),
        name,
        age: parseInt(age),
        relationship,
        contact_number: contact_number || null
      }
    });

    res.status(201).json(familyMember);
  } catch (error) {
    console.error('Error creating family member:', error);
    res.status(500).json({ error: error.message || 'Failed to create family member' });
  }
});

// Delete family member
router.delete('/:id', async (req, res) => {
  try {
    const family_id = parseInt(req.params.id);

    const familyMember = await prisma.familyMember.findUnique({
      where: { family_id }
    });

    if (!familyMember) {
      return res.status(404).json({ error: 'Family member not found' });
    }

    await prisma.familyMember.delete({
      where: { family_id }
    });

    res.json({ message: 'Family member deleted successfully' });
  } catch (error) {
    console.error('Error deleting family member:', error);
    res.status(500).json({ error: 'Failed to delete family member' });
  }
});

module.exports = router;
