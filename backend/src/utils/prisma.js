const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

// Test connection but DON'T crash the server if it fails
prisma.$connect()
  .then(() => console.log('✅ Database connected: ADMIN\\SQLEXPRESS -> SocietyERP'))
  .catch((err) => {
    console.error('⚠️  Database connection warning:', err.message);
    console.error('   → Make sure SQL Server (SQLEXPRESS) service is running');
    console.error('   → Run setup.sql in SSMS to create the SocietyERP database');
    console.error('   → Server will keep running — reconnect on next request\n');
  });

process.on('beforeExit', async () => { await prisma.$disconnect(); });

module.exports = prisma;
