const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const prisma = require('../utils/prisma');

const generateToken = (member) => {
  return jwt.sign(
    { member_id: member.member_id, email: member.email, role: member.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, contact_number, flat_no, blood_group, role } = req.body;

    const existing = await prisma.member.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 12);

    const member = await prisma.member.create({
      data: { name, email, password_hash, contact_number, flat_no, blood_group, role: role || 'member' },
      select: { member_id: true, name: true, email: true, role: true, flat_no: true, contact_number: true }
    });

    const token = generateToken(member);
    res.status(201).json({ message: 'Member registered successfully', token, member });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    const member = await prisma.member.findUnique({ where: { email, is_active: true } });
    if (!member) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, member.password_hash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = generateToken(member);
    const { password_hash, ...memberData } = member;

    res.json({ message: 'Login successful', token, member: memberData });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const member = await prisma.member.findUnique({
      where: { member_id: req.user.member_id },
      select: {
        member_id: true, name: true, email: true, contact_number: true,
        flat_no: true, blood_group: true, role: true, created_at: true,
        family_members: true, vehicles: true
      }
    });
    res.json(member);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name, contact_number, blood_group } = req.body;
    const member = await prisma.member.update({
      where: { member_id: req.user.member_id },
      data: { name, contact_number, blood_group },
      select: { member_id: true, name: true, email: true, contact_number: true, flat_no: true, blood_group: true, role: true }
    });
    res.json({ message: 'Profile updated successfully', member });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const member = await prisma.member.findUnique({ where: { member_id: req.user.member_id } });

    const isMatch = await bcrypt.compare(currentPassword, member.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

    const password_hash = await bcrypt.hash(newPassword, 12);
    const updated = await prisma.member.update({ 
      where: { member_id: req.user.member_id }, 
      data: { password_hash, password_change_required: false },
      select: { member_id: true, name: true, email: true, contact_number: true, flat_no: true, blood_group: true, role: true, password_change_required: true }
    });

    res.json({ message: 'Password changed successfully', member: updated });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword };
