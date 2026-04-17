const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

(async () => {
  try {
    const members = await prisma.member.findMany();
    const amenities = await prisma.amenity.findMany();
    const bookings = await prisma.amenityBooking.findMany();
    
    console.log('=== DATABASE CONTENTS ===');
    console.log(`✅ Members: ${members.length}`);
    console.log(`✅ Amenities: ${amenities.length}`);
    console.log(`✅ Bookings: ${bookings.length}`);
    
    if (members.length > 0) {
      console.log('\nMembers:');
      members.forEach(m => console.log(`  - ${m.name} (${m.email})`));
    }
    
    if (amenities.length > 0) {
      console.log('\nAmenities:');
      amenities.forEach(a => console.log(`  - ${a.name} (₹${a.rent_amount}/hr)`));
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await prisma.$disconnect();
  }
})();
