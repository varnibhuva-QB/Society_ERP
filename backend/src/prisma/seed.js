const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin
  const adminHash = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.member.upsert({
    where: { email: 'admin@societyerp.com' },
    update: {},
    create: {
      name: 'Rajesh Kumar', email: 'admin@societyerp.com',
      password_hash: adminHash, contact_number: '9876543210',
      flat_no: 'A-101', blood_group: 'O+', role: 'admin'
    }
  });

  // Create chairman
  const chairHash = await bcrypt.hash('Chair@123', 12);
  const chairman = await prisma.member.upsert({
    where: { email: 'chairman@societyerp.com' },
    update: {},
    create: {
      name: 'Suresh Patel', email: 'chairman@societyerp.com',
      password_hash: chairHash, contact_number: '9876543211',
      flat_no: 'B-201', blood_group: 'A+', role: 'chairman'
    }
  });

  // Create members
  const members = [
    { name: 'Amit Shah', email: 'amit@test.com', flat_no: 'C-301', blood_group: 'B+', contact_number: '9876543212' },
    { name: 'Priya Mehta', email: 'priya@test.com', flat_no: 'D-401', blood_group: 'AB+', contact_number: '9876543213' },
    { name: 'Varni Admin', email: 'varni@test.com', flat_no: 'A-102', blood_group: 'O-', contact_number: '9876543214' },
  ];
  const memberHash = await bcrypt.hash('Member@123', 12);
  const createdMembers = [];
  for (const m of members) {
    const member = await prisma.member.upsert({
      where: { email: m.email }, update: {},
      create: { ...m, password_hash: memberHash, role: 'member' }
    });
    createdMembers.push(member);
  }

  // Notices
  await prisma.notice.createMany({
    data: [
      { title: 'Annual General Meeting', description: 'AGM scheduled for 25th April 2025 at 6 PM in the community hall. All members are requested to attend.', created_by: chairman.member_id, priority: 'high' },
      { title: 'Water Supply Interruption', description: 'Water supply will be interrupted on 20th April from 10 AM to 2 PM due to maintenance work.', created_by: admin.member_id, priority: 'high' },
      { title: 'Garden Renovation', description: 'The society garden will be renovated starting next week. Inconvenience is regretted.', created_by: admin.member_id, priority: 'normal' },
      { title: 'Festival Celebration', description: 'Society is organizing a Navratri celebration on 28th April. Volunteers needed!', created_by: chairman.member_id, priority: 'normal' },
    ]
  });

  // Bills for each member
  const allMembers = [admin, chairman, ...createdMembers];
  const billData = [];
  for (const m of createdMembers) {
    billData.push({
      member_id: m.member_id, amount: 2500, month_year: 'April-2025',
      due_date: new Date('2025-04-30'), status: 'unpaid',
      description: 'Monthly Maintenance - April 2025'
    });
    billData.push({
      member_id: m.member_id, amount: 2500, month_year: 'March-2025',
      due_date: new Date('2025-03-31'), status: 'paid',
      payment_date: new Date('2025-03-20'), description: 'Monthly Maintenance - March 2025'
    });
  }
  await prisma.maintenanceBill.createMany({ data: billData });

  // Important contacts
  await prisma.importantContact.createMany({
    data: [
      { name: 'Ramu Milkman', service_type: 'milkman', phone_number: '9876001234', description: 'Fresh cow milk delivery', available_time: '5:00 AM - 8:00 AM', added_by: admin.member_id },
      { name: 'Shyam Laundry', service_type: 'laundry', phone_number: '9876005678', description: 'Clothes washing and ironing', available_time: '8:00 AM - 6:00 PM', added_by: admin.member_id },
      { name: 'Ganesh Plumber', service_type: 'plumber', phone_number: '9876009012', description: 'All plumbing works', available_time: '9:00 AM - 8:00 PM', added_by: admin.member_id },
      { name: 'Mohan Electrician', service_type: 'electrician', phone_number: '9876003456', description: 'Electrical repairs and installation', available_time: '9:00 AM - 7:00 PM', added_by: admin.member_id },
      { name: 'Quick Cab', service_type: 'cab', phone_number: '9876007890', description: 'Local cab service', available_time: '24x7', added_by: chairman.member_id },
      { name: 'Apollo Pharmacy', service_type: 'pharmacy', phone_number: '9876002345', description: 'Medicines and health products', available_time: '8:00 AM - 10:00 PM', added_by: admin.member_id },
    ]
  });

  // Bookings
  await prisma.amenityBooking.createMany({
    data: [
      { member_id: createdMembers[0].member_id, amenity_type: 'garden', booking_date: new Date('2025-04-20'), time_slot: '06:00-08:00', status: 'confirmed', payment_status: 'paid', amount: 100 },
      { member_id: createdMembers[1].member_id, amenity_type: 'terrace', booking_date: new Date('2025-04-22'), time_slot: '18:00-20:00', status: 'confirmed', payment_status: 'pending', amount: 200 },
    ]
  });

  // Family members
  await prisma.familyMember.createMany({
    data: [
      { member_id: createdMembers[0].member_id, name: 'Kavita Shah', relation: 'Wife', contact_number: '9876543220' },
      { member_id: createdMembers[0].member_id, name: 'Rohan Shah', relation: 'Son', contact_number: '' },
      { member_id: createdMembers[1].member_id, name: 'Deepak Mehta', relation: 'Husband', contact_number: '9876543221' },
    ]
  });

  // Vehicles
  await prisma.vehicle.createMany({
    data: [
      { member_id: createdMembers[0].member_id, vehicle_type: 'Car', vehicle_number: 'GJ01AB1234' },
      { member_id: createdMembers[0].member_id, vehicle_type: 'Bike', vehicle_number: 'GJ01CD5678' },
      { member_id: createdMembers[1].member_id, vehicle_type: 'Car', vehicle_number: 'GJ01EF9012' },
    ]
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n📋 Login Credentials:');
  console.log('   Admin:    admin@societyerp.com / Admin@123');
  console.log('   Chairman: chairman@societyerp.com / Chair@123');
  console.log('   Member:   amit@test.com / Member@123');
  console.log('   Member:   varni@test.com / Member@123\n');
}

main().catch(console.error).finally(() => prisma.$disconnect());
