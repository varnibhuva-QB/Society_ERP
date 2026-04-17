const express = require('express');
const router = express.Router();
const prisma = require('../utils/prisma');
const { authenticate } = require('../middleware/auth.middleware');

// Get visitors by member_id (query parameter)
router.get('/', authenticate, async (req, res) => {
  try {
    const member_id = parseInt(req.query.member_id);
    if (!member_id) {
      return res.status(400).json({ error: 'member_id query parameter is required' });
    }

    const visitors = await prisma.visitor.findMany({
      where: { member_id },
      include: {
        security_guard: { select: { member_id: true, name: true, contact_number: true } },
        member: { select: { member_id: true, name: true, flat_no: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json(visitors || []);
  } catch (error) {
    console.error('Error fetching visitors:', error);
    res.status(500).json({ error: 'Failed to fetch visitors' });
  }
});

// Create visitor entry request (Security Guard)
router.post('/', authenticate, async (req, res) => {
  try {
    const { visitor_name, visitor_mobile, visitor_photo, member_id } = req.body;
    const requested_by = req.user.member_id;

    if (!visitor_name || !visitor_mobile || !member_id) {
      return res.status(400).json({ error: 'Name, mobile, and member_id are required' });
    }

    // Validate member exists
    const memberExists = await prisma.member.findUnique({
      where: { member_id: parseInt(member_id) }
    });

    if (!memberExists) {
      return res.status(400).json({ error: 'Member does not exist' });
    }

    // Truncate photo if too large (keep first 50KB of base64)
    const photoToStore = visitor_photo && visitor_photo.length > 50000 ? visitor_photo.substring(0, 50000) : visitor_photo;

    const visitor = await prisma.visitor.create({
      data: {
        visitor_name,
        visitor_mobile,
        visitor_photo: photoToStore || null,
        member_id: parseInt(member_id),
        requested_by,
        status: 'pending'
      },
      include: {
        member: { select: { member_id: true, name: true, flat_no: true } },
        security_guard: { select: { member_id: true, name: true } }
      }
    });

    res.status(201).json({ message: 'Visitor request created successfully', visitor });
  } catch (error) {
    console.error('Visitor creation error:', error.message);
    res.status(500).json({ error: error.message || 'Failed to create visitor request' });
  }
});

// Get pending visitor approvals for a member
router.get('/pending/:member_id', authenticate, async (req, res) => {
  try {
    const member_id = parseInt(req.params.member_id);

    const visitors = await prisma.visitor.findMany({
      where: {
        member_id,
        status: 'pending'
      },
      include: {
        security_guard: { select: { member_id: true, name: true, contact_number: true } },
        member: { select: { member_id: true, name: true, flat_no: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json({ visitors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch pending approvals' });
  }
});

// Get all visitors for a member (approved/rejected history)
router.get('/history/:member_id', authenticate, async (req, res) => {
  try {
    const member_id = parseInt(req.params.member_id);

    const visitors = await prisma.visitor.findMany({
      where: {
        member_id,
        status: { in: ['approved', 'rejected'] }
      },
      include: {
        security_guard: { select: { name: true } }
      },
      orderBy: { created_at: 'desc' },
      take: 50
    });

    res.json({ visitors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch visitor history' });
  }
});

// Approve visitor
router.patch('/:id/approve', authenticate, async (req, res) => {
  try {
    const visitor_id = parseInt(req.params.id);

    const visitor = await prisma.visitor.findUnique({
      where: { visitor_id },
      include: { member: true }
    });

    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    if (visitor.member_id !== req.user.member_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.visitor.update({
      where: { visitor_id },
      data: {
        status: 'approved',
        approval_date: new Date()
      },
      include: {
        member: { select: { name: true } },
        security_guard: { select: { name: true } }
      }
    });

    res.json({ message: 'Visitor approved', visitor: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to approve visitor' });
  }
});

// Reject visitor
router.patch('/:id/reject', authenticate, async (req, res) => {
  try {
    const visitor_id = parseInt(req.params.id);
    const { reason } = req.body;

    const visitor = await prisma.visitor.findUnique({
      where: { visitor_id },
      include: { member: true }
    });

    if (!visitor) {
      return res.status(404).json({ error: 'Visitor not found' });
    }

    if (visitor.member_id !== req.user.member_id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.visitor.update({
      where: { visitor_id },
      data: {
        status: 'rejected',
        rejection_date: new Date(),
        reason: reason || null
      },
      include: {
        member: { select: { name: true } },
        security_guard: { select: { name: true } }
      }
    });

    res.json({ message: 'Visitor rejected', visitor: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to reject visitor' });
  }
});

// Get all pending requests for security guard dashboard
router.get('/all/pending', authenticate, async (req, res) => {
  try {
    const visitors = await prisma.visitor.findMany({
      where: { status: 'pending' },
      include: {
        member: { select: { member_id: true, name: true, flat_no: true, contact_number: true } },
        security_guard: { select: { name: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json({ visitors });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch pending requests' });
  }
});

module.exports = router;
