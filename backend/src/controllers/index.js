const prisma = require('../utils/prisma');

// =================== NOTICE CONTROLLER ===================
const noticeController = {
  getAll: async (req, res, next) => {
    try {
      const notices = await prisma.notice.findMany({
        where: { is_active: true },
        include: { author: { select: { name: true, flat_no: true, role: true } } },
        orderBy: { created_at: 'desc' }
      });
      res.json(notices);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const notice = await prisma.notice.findUnique({
        where: { notice_id: parseInt(req.params.id) },
        include: { author: { select: { name: true, flat_no: true } } }
      });
      if (!notice) return res.status(404).json({ error: 'Notice not found' });
      res.json(notice);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const { title, description, priority } = req.body;
      const notice = await prisma.notice.create({
        data: { title, description, priority: priority || 'normal', created_by: req.user.member_id },
        include: { author: { select: { name: true } } }
      });
      res.status(201).json({ message: 'Notice created successfully', notice });
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const { title, description, priority } = req.body;
      const notice = await prisma.notice.update({
        where: { notice_id: parseInt(req.params.id) },
        data: { title, description, priority }
      });
      res.json({ message: 'Notice updated', notice });
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await prisma.notice.update({
        where: { notice_id: parseInt(req.params.id) },
        data: { is_active: false }
      });
      res.json({ message: 'Notice deleted' });
    } catch (err) { next(err); }
  }
};

// =================== BILLING CONTROLLER ===================
const billingController = {
  getAll: async (req, res, next) => {
    try {
      const { status, member_id } = req.query;
      const where = {};
      if (status) where.status = status;
      if (member_id) where.member_id = parseInt(member_id);
      if (req.user.role === 'member') where.member_id = req.user.member_id;

      const bills = await prisma.maintenanceBill.findMany({
        where,
        include: { member: { select: { name: true, flat_no: true, email: true } } },
        orderBy: { created_at: 'desc' }
      });
      res.json(bills);
    } catch (err) { next(err); }
  },

  getById: async (req, res, next) => {
    try {
      const bill = await prisma.maintenanceBill.findUnique({
        where: { bill_id: parseInt(req.params.id) },
        include: { member: { select: { name: true, flat_no: true, email: true } }, payment: true }
      });
      if (!bill) return res.status(404).json({ error: 'Bill not found' });
      res.json(bill);
    } catch (err) { next(err); }
  },

  generateBills: async (req, res, next) => {
    try {
      const { amount, due_date, description, month_year } = req.body;
      const members = await prisma.member.findMany({ where: { is_active: true, role: 'member' } });

      const bills = await prisma.maintenanceBill.createMany({
        data: members.map(m => ({
          member_id: m.member_id, amount: parseFloat(amount),
          due_date: new Date(due_date), description, month_year, status: 'unpaid'
        }))
      });
      res.status(201).json({ message: `${bills.count} bills generated successfully` });
    } catch (err) { next(err); }
  },

  createBill: async (req, res, next) => {
    try {
      const { member_id, amount, due_date, description, month_year } = req.body;
      const bill = await prisma.maintenanceBill.create({
        data: { member_id: parseInt(member_id), amount: parseFloat(amount), due_date: new Date(due_date), description, month_year, status: 'unpaid' }
      });
      res.status(201).json({ message: 'Bill created', bill });
    } catch (err) { next(err); }
  },

  markPaid: async (req, res, next) => {
    try {
      const { payment_method, transaction_id, remarks } = req.body;
      const bill = await prisma.maintenanceBill.update({
        where: { bill_id: parseInt(req.params.id) },
        data: { status: 'paid', payment_date: new Date() }
      });

      await prisma.payment.create({
        data: {
          member_id: bill.member_id, bill_id: bill.bill_id, amount: bill.amount,
          payment_method: payment_method || 'cash', transaction_id, status: 'completed', remarks
        }
      });
      res.json({ message: 'Bill marked as paid' });
    } catch (err) { next(err); }
  },

  getStats: async (req, res, next) => {
    try {
      const [total, paid, unpaid] = await Promise.all([
        prisma.maintenanceBill.aggregate({ _sum: { amount: true } }),
        prisma.maintenanceBill.aggregate({ where: { status: 'paid' }, _sum: { amount: true } }),
        prisma.maintenanceBill.aggregate({ where: { status: 'unpaid' }, _sum: { amount: true } })
      ]);
      res.json({ total: total._sum.amount || 0, paid: paid._sum.amount || 0, unpaid: unpaid._sum.amount || 0 });
    } catch (err) { next(err); }
  }
};

// =================== BOOKING CONTROLLER ===================
const bookingController = {
  getAll: async (req, res, next) => {
    try {
      const where = req.user.role === 'member' ? { member_id: req.user.member_id } : {};
      const bookings = await prisma.amenityBooking.findMany({
        where,
        include: { member: { select: { name: true, flat_no: true } } },
        orderBy: { booking_date: 'desc' }
      });
      res.json(bookings);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const { amenity_type, booking_date, start_time, end_time, amount } = req.body;

      // Calculate hours from start and end time
      const [startH, startM] = start_time.split(':').map(Number);
      const [endH, endM] = end_time.split(':').map(Number);
      const startMins = startH * 60 + startM;
      const endMins = endH * 60 + endM;
      const durationMins = endMins > startMins ? endMins - startMins : (24 * 60 - startMins) + endMins;
      const hours = Math.ceil(durationMins / 60);

      // Check for overlapping bookings
      const existing = await prisma.amenityBooking.findFirst({
        where: { 
          amenity_type, 
          booking_date: new Date(booking_date),
          status: { not: 'cancelled' }
        }
      });

      if (existing) {
        const [exStartH, exStartM] = existing.start_time.split(':').map(Number);
        const [exEndH, exEndM] = existing.end_time.split(':').map(Number);
        const exStartMins = exStartH * 60 + exStartM;
        const exEndMins = exEndH * 60 + exEndM;

        // Check if times overlap
        if (!((endMins <= exStartMins) || (startMins >= exEndMins))) {
          return res.status(409).json({ error: 'This time slot overlaps with existing booking' });
        }
      }

      const booking = await prisma.amenityBooking.create({
        data: {
          member_id: req.user.member_id, 
          amenity_type, 
          booking_date: new Date(booking_date),
          start_time, 
          end_time,
          amount: parseFloat(amount) || 0, 
          status: 'confirmed', 
          payment_status: 'pending'
        },
        include: { member: { select: { name: true, flat_no: true } } }
      });
      
      res.status(201).json({ message: 'Amenity booked successfully', booking });
    } catch (err) { next(err); }
  },

  cancel: async (req, res, next) => {
    try {
      const booking = await prisma.amenityBooking.findUnique({ where: { booking_id: parseInt(req.params.id) } });
      if (!booking) return res.status(404).json({ error: 'Booking not found' });
      if (booking.member_id !== req.user.member_id && !['admin', 'chairman'].includes(req.user.role)) {
        return res.status(403).json({ error: 'Not authorized' });
      }
      await prisma.amenityBooking.update({ where: { booking_id: parseInt(req.params.id) }, data: { status: 'cancelled' } });
      res.json({ message: 'Booking cancelled' });
    } catch (err) { next(err); }
  },

  getAvailability: async (req, res, next) => {
    try {
      const { amenity_type, date } = req.query;
      const booked = await prisma.amenityBooking.findMany({
        where: { amenity_type, booking_date: new Date(date), status: { not: 'cancelled' } },
        select: { time_slot: true }
      });
      const allSlots = ['06:00-08:00', '08:00-10:00', '10:00-12:00', '14:00-16:00', '16:00-18:00', '18:00-20:00'];
      const bookedSlots = booked.map(b => b.time_slot);
      const available = allSlots.filter(s => !bookedSlots.includes(s));
      res.json({ available, booked: bookedSlots });
    } catch (err) { next(err); }
  }
};

// =================== PAYMENT CONTROLLER ===================
const paymentController = {
  getAll: async (req, res, next) => {
    try {
      const where = req.user.role === 'member' ? { member_id: req.user.member_id } : {};
      const payments = await prisma.payment.findMany({
        where,
        include: {
          member: { select: { name: true, flat_no: true } },
          bill: { select: { bill_id: true, month_year: true, amount: true, description: true } }
        },
        orderBy: { created_at: 'desc' }
      });
      res.json(payments);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const { amount, payment_method, transaction_id, remarks, bill_id } = req.body;
      const payment = await prisma.payment.create({
        data: {
          member_id: req.user.member_id, amount: parseFloat(amount),
          payment_method, transaction_id, remarks, status: 'completed',
          bill_id: bill_id ? parseInt(bill_id) : null
        }
      });
      res.status(201).json({ message: 'Payment recorded', payment });
    } catch (err) { next(err); }
  }
};

// =================== CONTACT CONTROLLER ===================
const contactController = {
  getAll: async (req, res, next) => {
    try {
      const { service_type, search } = req.query;
      const where = { is_active: true };
      if (service_type) where.service_type = service_type;
      if (search) {
        where.OR = [
          { name: { contains: search } },
          { description: { contains: search } }
        ];
      }
      const contacts = await prisma.importantContact.findMany({
        where,
        include: { member: { select: { name: true } } },
        orderBy: { service_type: 'asc' }
      });
      res.json(contacts);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const { name, service_type, phone_number, description, available_time } = req.body;
      const contact = await prisma.importantContact.create({
        data: { name, service_type, phone_number, description, available_time, added_by: req.user.member_id }
      });
      res.status(201).json({ message: 'Contact added', contact });
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const { name, service_type, phone_number, description, available_time } = req.body;
      const contact = await prisma.importantContact.update({
        where: { contact_id: parseInt(req.params.id) },
        data: { name, service_type, phone_number, description, available_time }
      });
      res.json({ message: 'Contact updated', contact });
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await prisma.importantContact.update({
        where: { contact_id: parseInt(req.params.id) },
        data: { is_active: false }
      });
      res.json({ message: 'Contact removed' });
    } catch (err) { next(err); }
  }
};

// =================== FAMILY & VEHICLE ===================
const familyController = {
  getByMember: async (req, res, next) => {
    try {
      const id = req.params.memberId ? parseInt(req.params.memberId) : req.user.member_id;
      const family = await prisma.familyMember.findMany({ where: { member_id: id } });
      res.json(family);
    } catch (err) { next(err); }
  },
  create: async (req, res, next) => {
    try {
      const { member_id, name, relation, contact_number } = req.body;
      const mid = member_id ? parseInt(member_id) : req.user.member_id;
      const fm = await prisma.familyMember.create({ data: { member_id: mid, name, relation, contact_number } });
      res.status(201).json({ message: 'Family member added', fm });
    } catch (err) { next(err); }
  },
  delete: async (req, res, next) => {
    try {
      await prisma.familyMember.delete({ where: { family_id: parseInt(req.params.id) } });
      res.json({ message: 'Family member removed' });
    } catch (err) { next(err); }
  }
};

const vehicleController = {
  getByMember: async (req, res, next) => {
    try {
      const id = req.params.memberId ? parseInt(req.params.memberId) : req.user.member_id;
      const vehicles = await prisma.vehicle.findMany({ where: { member_id: id }, include: { member: { select: { name: true, flat_no: true } } } });
      res.json(vehicles);
    } catch (err) { next(err); }
  },
  getAll: async (req, res, next) => {
    try {
      const vehicles = await prisma.vehicle.findMany({
        include: { member: { select: { name: true, flat_no: true, email: true } } },
        orderBy: { created_at: 'desc' }
      });
      res.json(vehicles);
    } catch (err) { next(err); }
  },
  create: async (req, res, next) => {
    try {
      const { member_id, vehicle_type, vehicle_number } = req.body;
      const mid = member_id ? parseInt(member_id) : req.user.member_id;
      const vehicle = await prisma.vehicle.create({ data: { member_id: mid, vehicle_type, vehicle_number } });
      res.status(201).json({ message: 'Vehicle added', vehicle });
    } catch (err) { next(err); }
  },
  delete: async (req, res, next) => {
    try {
      await prisma.vehicle.delete({ where: { vehicle_id: parseInt(req.params.id) } });
      res.json({ message: 'Vehicle removed' });
    } catch (err) { next(err); }
  }
};

// =================== DASHBOARD CONTROLLER ===================
const dashboardController = {
  getStats: async (req, res, next) => {
    try {
      const [
        totalMembers, totalNotices, pendingBills, totalBillAmount,
        paidBillAmount, recentNotices, upcomingBookings
      ] = await Promise.all([
        prisma.member.count({ where: { is_active: true } }),
        prisma.notice.count({ where: { is_active: true } }),
        prisma.maintenanceBill.count({ where: { status: 'unpaid' } }),
        prisma.maintenanceBill.aggregate({ where: { status: 'unpaid' }, _sum: { amount: true } }),
        prisma.maintenanceBill.aggregate({ where: { status: 'paid' }, _sum: { amount: true } }),
        prisma.notice.findMany({
          where: { is_active: true }, take: 5, orderBy: { created_at: 'desc' },
          include: { author: { select: { name: true } } }
        }),
        prisma.amenityBooking.findMany({
          where: { status: 'confirmed', booking_date: { gte: new Date() } },
          take: 5, orderBy: { booking_date: 'asc' },
          include: { member: { select: { name: true, flat_no: true } } }
        })
      ]);

      res.json({
        totalMembers, totalNotices, pendingBills,
        pendingAmount: totalBillAmount._sum.amount || 0,
        collectedAmount: paidBillAmount._sum.amount || 0,
        recentNotices, upcomingBookings
      });
    } catch (err) { next(err); }
  }
};

// =================== AMENITY CONTROLLER ===================
const amenityController = {
  getAll: async (req, res, next) => {
    try {
      const amenities = await prisma.amenity.findMany({
        where: { is_active: true },
        orderBy: { name: 'asc' }
      });
      res.json(amenities);
    } catch (err) { next(err); }
  },

  create: async (req, res, next) => {
    try {
      const { name, type, rent_amount, description } = req.body;
      const amenity = await prisma.amenity.create({
        data: {
          name, type, rent_amount: parseFloat(rent_amount), description
        }
      });
      res.status(201).json({ message: 'Amenity created successfully', amenity });
    } catch (err) { next(err); }
  },

  update: async (req, res, next) => {
    try {
      const { name, type, rent_amount, description } = req.body;
      const amenity = await prisma.amenity.update({
        where: { amenity_id: parseInt(req.params.id) },
        data: {
          name, type, rent_amount: parseFloat(rent_amount), description
        }
      });
      res.json({ message: 'Amenity updated successfully', amenity });
    } catch (err) { next(err); }
  },

  delete: async (req, res, next) => {
    try {
      await prisma.amenity.update({
        where: { amenity_id: parseInt(req.params.id) },
        data: { is_active: false }
      });
      res.json({ message: 'Amenity deleted successfully' });
    } catch (err) { next(err); }
  }
};

module.exports = {
  noticeController, billingController, bookingController,
  paymentController, contactController, familyController,
  vehicleController, dashboardController, amenityController
};
