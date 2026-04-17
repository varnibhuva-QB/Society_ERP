#!/usr/bin/env node
/**
 * SocietyPro ERP — Smart Startup Script
 * Run: node start.js
 * This script diagnoses your environment and starts the server correctly.
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

const ok = (msg) => console.log(`${GREEN}✅ ${msg}${RESET}`);
const err = (msg) => console.log(`${RED}❌ ${msg}${RESET}`);
const warn = (msg) => console.log(`${YELLOW}⚠️  ${msg}${RESET}`);
const info = (msg) => console.log(`${CYAN}ℹ️  ${msg}${RESET}`);

console.log('\n' + '='.repeat(60));
console.log('  SocietyPro ERP — Startup Diagnostics');
console.log('  Server: SERP | ADMIN\\SQLEXPRESS');
console.log('='.repeat(60) + '\n');

// Step 1: Check .env
if (!fs.existsSync('.env')) {
  err('.env file missing! Creating default...');
  fs.writeFileSync('.env', `DATABASE_URL="sqlserver://ADMIN\\\\SQLEXPRESS;database=SocietyERP;integratedSecurity=true;trustServerCertificate=true"\nJWT_SECRET=society_erp_jwt_2025\nJWT_EXPIRES_IN=7d\nPORT=5000\nNODE_ENV=development\nFRONTEND_URL=http://localhost:3000`);
}
ok('.env file found');

// Step 2: Check node_modules
if (!fs.existsSync('node_modules')) {
  warn('node_modules missing — running npm install...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    ok('Dependencies installed');
  } catch (e) {
    err('npm install failed. Please run: npm install');
    process.exit(1);
  }
} else {
  ok('node_modules present');
}

// Step 3: Check Prisma client
if (!fs.existsSync('node_modules/.prisma/client')) {
  warn('Prisma client not generated — running prisma generate...');
  try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    ok('Prisma client generated');
  } catch (e) {
    err('Prisma generate failed. Check your schema.prisma file.');
    process.exit(1);
  }
} else {
  ok('Prisma client ready');
}

// Step 4: Check PORT availability
const net = require('net');
const PORT = process.env.PORT || 5000;

const server = net.createServer();
server.listen(PORT, () => {
  server.close(() => {
    ok(`Port ${PORT} is available`);
    startServer();
  });
});
server.on('error', () => {
  warn(`Port ${PORT} is in use. Trying port ${parseInt(PORT) + 1}...`);
  process.env.PORT = String(parseInt(PORT) + 1);
  startServer();
});

function startServer() {
  info(`Starting SocietyPro ERP backend on port ${process.env.PORT || PORT}...\n`);

  // Load and start the actual server
  try {
    require('./src/index.js');
  } catch (e) {
    err('Server failed to start: ' + e.message);
    console.log('\nCommon fixes:');
    console.log('1. Make sure SQL Server is running (check Windows Services → SQL Server (SQLEXPRESS))');
    console.log('2. Run setup.sql in SSMS first to create the database');
    console.log('3. Try changing DATABASE_URL in .env to use SQL Auth instead of Windows Auth');
    console.log('4. Run: npm run seed   to populate the database\n');
    process.exit(1);
  }
}
