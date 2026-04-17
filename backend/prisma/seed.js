const { PrismaClient } = require('@prisma/client');
const bcryptjs = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed Members with test accounts
  console.log('📍 Creating test members...');
  const members = [
    { 
      name: 'Admin User', 
      email: 'admin@societyerp.com', 
      contact_number: '9876543210', 
      flat_no: 'A-101', 
      blood_group: 'O+', 
      role: 'admin',
      password: 'App@123'
    },
    { 
      name: 'Chairman User', 
      email: 'chairman@societyerp.com', 
      contact_number: '9876543211', 
      flat_no: 'B-101', 
      blood_group: 'B+', 
      role: 'chairman',
      password: 'App@123'
    },
    { 
      name: 'Arun Security', 
      email: 'security@societyerp.com', 
      contact_number: '9876543213', 
      flat_no: 'Security-01', 
      blood_group: 'A-', 
      role: 'security',
      password: 'App@123'
    },
    { 
      name: 'Amit Kumar', 
      email: 'amit@test.com', 
      contact_number: '9876543212', 
      flat_no: 'C-101', 
      blood_group: 'A+', 
      role: 'member',
      password: 'App@123'
    },
    { 
      name: 'Varni Singh', 
      email: 'varni@test.com', 
      contact_number: '9876543214', 
      flat_no: 'C-102', 
      blood_group: 'B-', 
      role: 'member',
      password: 'App@123'
    }
  ];

  for (const member of members) {
    const { password, ...memberData } = member;
    const password_hash = await bcryptjs.hash(password, 10);
    await prisma.member.upsert({
      where: { email: memberData.email },
      update: {},
      create: {
        ...memberData,
        password_hash,
        password_change_required: true
      }
    });
  }
  console.log('✅ Members seeded');

  // Seed Amenities
  console.log('📍 Creating amenities...');
  const amenities = [
    { name: 'Community Garden', type: 'garden', rent_amount: 50, description: 'Beautiful garden space with seating area' },
    { name: 'Rooftop Terrace', type: 'terrace', rent_amount: 100, description: 'Open terrace with city view' },
    { name: 'Parking Hall', type: 'parking', rent_amount: 75, description: 'Multi-purpose parking area' },
    { name: 'Fitness Center', type: 'gym', rent_amount: 60, description: 'Fully equipped gym with equipment' },
    { name: 'Swimming Pool', type: 'pool', rent_amount: 80, description: 'Indoor heated swimming pool' }
  ];

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: {},
      create: amenity
    });
  }
  console.log('✅ Amenities seeded');

  console.log('✅ Database seeded successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
