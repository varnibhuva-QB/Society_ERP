const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/auth.middleware');

// Get all complaints (filter by member if regular user, show all if admin)
router.get('/', authenticate, async (req, res, next) => {
  try {
    const where = req.user.role === 'member' ? { member_id: req.user.member_id } : {};
    const complaints = await prisma.complaint.findMany({
      where,
      include: { member: { select: { name: true, flat_no: true, contact_number: true } } },
      orderBy: { created_at: 'desc' }
    });
    res.json(complaints);
  } catch (err) { next(err); }
});

// Get single complaint
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { complaint_id: parseInt(req.params.id) },
      include: { member: { select: { name: true, flat_no: true } } }
    });
    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    if (complaint.member_id !== req.user.member_id && req.user.role === 'member') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    res.json(complaint);
  } catch (err) { next(err); }
});

// Create complaint
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    const complaint = await prisma.complaint.create({
      data: {
        member_id: req.user.member_id,
        title,
        description,
        priority: priority || 'normal',
        status: 'pending'
      },
      include: { member: { select: { name: true, flat_no: true } } }
    });
    res.status(201).json({ message: 'Complaint created successfully', complaint });
  } catch (err) { next(err); }
});

// Update complaint status (only by member or admin)
router.patch('/:id/status', authenticate, async (req, res, next) => {
  try {
    const { status } = req.body;
    const complaint = await prisma.complaint.findUnique({
      where: { complaint_id: parseInt(req.params.id) }
    });

    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    if (complaint.member_id !== req.user.member_id && !['admin', 'chairman'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.complaint.update({
      where: { complaint_id: parseInt(req.params.id) },
      data: { status },
      include: { member: { select: { name: true } } }
    });
    res.json({ message: 'Complaint status updated', complaint: updated });
  } catch (err) { next(err); }
});

// Delete complaint
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const complaint = await prisma.complaint.findUnique({
      where: { complaint_id: parseInt(req.params.id) }
    });

    if (!complaint) return res.status(404).json({ error: 'Complaint not found' });
    if (complaint.member_id !== req.user.member_id && !['admin', 'chairman'].includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await prisma.complaint.delete({
      where: { complaint_id: parseInt(req.params.id) }
    });
    res.json({ message: 'Complaint deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
