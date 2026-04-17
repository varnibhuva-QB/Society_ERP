const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication token required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const member = await prisma.member.findUnique({
      where: { member_id: decoded.member_id, is_active: true },
      select: { member_id: true, name: true, email: true, role: true, flat_no: true }
    });

    if (!member) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = member;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired, please login again' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    next();
  };
};

const isAdminOrChairman = authorizeRoles('admin', 'chairman');

module.exports = { authenticate, authorizeRoles, isAdminOrChairman };
