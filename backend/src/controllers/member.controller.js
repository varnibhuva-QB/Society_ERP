const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');

const getAllMembers = async (req, res, next) => {
  try {
    const { search, role, page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = { is_active: true };
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { flat_no: { contains: search } }
      ];
    }

    const [members, total] = await Promise.all([
      prisma.member.findMany({
        where, skip, take: parseInt(limit),
        select: {
          member_id: true, name: true, email: true, contact_number: true,
          flat_no: true, blood_group: true, role: true, is_security: true, photo_url: true, created_at: true,
          _count: { select: { family_members: true, vehicles: true } }
        },
        orderBy: { flat_no: 'asc' }
      }),
      prisma.member.count({ where })
    ]);

    res.json({ members, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) { next(err); }
};

const getMemberById = async (req, res, next) => {
  try {
    const member = await prisma.member.findUnique({
      where: { member_id: parseInt(req.params.id) },
      select: {
        member_id: true, name: true, email: true, contact_number: true,
        flat_no: true, blood_group: true, role: true, is_security: true, is_active: true, created_at: true,
        family_members: true, vehicles: true,
        bills: { orderBy: { created_at: 'desc' }, take: 5 }
      }
    });
    if (!member) return res.status(404).json({ error: 'Member not found' });
    res.json(member);
  } catch (err) { next(err); }
};

const createMember = async (req, res, next) => {
  try {
    const { name, email, contact_number, flat_no, blood_group, role, is_security, photo_url } = req.body;
    const existing = await prisma.member.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already exists' });

    // Use default password App@123 for all new members
    const password_hash = await bcrypt.hash('App@123', 12);
    
    // Truncate photo if too large (keep first 100KB of base64)
    const photoToStore = photo_url && photo_url.length > 100000 ? photo_url.substring(0, 100000) : photo_url;

    const member = await prisma.member.create({
      data: { 
        name, email, password_hash, contact_number, flat_no, blood_group, 
        role: role || 'member',
        is_security: is_security || false,
        photo_url: photoToStore || null,
        password_change_required: true
      },
      select: { member_id: true, name: true, email: true, flat_no: true, role: true, contact_number: true, is_security: true, photo_url: true }
    });
    res.status(201).json({ message: 'Member created successfully. Default password: App@123 (must change on first login).', member });
  } catch (err) { next(err); }
};

const updateMember = async (req, res, next) => {
  try {
    const { name, contact_number, flat_no, blood_group, role, is_active, is_security } = req.body;
    const member = await prisma.member.update({
      where: { member_id: parseInt(req.params.id) },
      data: { name, contact_number, flat_no, blood_group, role, is_active, is_security },
      select: { member_id: true, name: true, email: true, flat_no: true, role: true, is_active: true, is_security: true }
    });
    res.json({ message: 'Member updated successfully', member });
  } catch (err) { next(err); }
};

const deleteMember = async (req, res, next) => {
  try {
    await prisma.member.update({
      where: { member_id: parseInt(req.params.id) },
      data: { is_active: false }
    });
    res.json({ message: 'Member deactivated successfully' });
  } catch (err) { next(err); }
};

module.exports = { getAllMembers, getMemberById, createMember, updateMember, deleteMember };
