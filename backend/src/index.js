require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

// CORS - allow React dev server
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', process.env.FRONTEND_URL].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check - no auth
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', server: 'SERP', db: 'ADMIN\\SQLEXPRESS', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth',           require('./routes/auth.routes'));
app.use('/api/members',        require('./routes/member.routes'));
app.use('/api/family',         require('./routes/family.routes'));
app.use('/api/family-members', require('./routes/family-members.routes'));
app.use('/api/vehicles',       require('./routes/vehicle.routes'));
app.use('/api/notices',        require('./routes/notice.routes'));
app.use('/api/billing',        require('./routes/billing.routes'));
app.use('/api/bookings',       require('./routes/booking.routes'));
app.use('/api/payments',       require('./routes/payment.routes'));
app.use('/api/contacts',       require('./routes/contact.routes'));
app.use('/api/amenities',      require('./routes/amenities.routes'));
app.use('/api/complaints',     require('./routes/complaint.routes'));
app.use('/api/visitors',       require('./routes/visitor.routes'));
app.use('/api/dashboard',      require('./routes/dashboard.routes'));

app.use((req, res) => res.status(404).json({ error: 'Route not found: ' + req.method + ' ' + req.path }));

app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  if (err.code === 'P2002') return res.status(400).json({ error: 'Duplicate entry' });
  if (err.code === 'P2025') return res.status(404).json({ error: 'Record not found' });
  if (err.code === 'P1001') return res.status(503).json({ error: 'Database unreachable — is SQL Server running?' });
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = parseInt(process.env.PORT) || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(52));
  console.log('  SocietyPro ERP Backend RUNNING');
  console.log('='.repeat(52));
  console.log('  API:     http://localhost:' + PORT + '/api');
  console.log('  Health:  http://localhost:' + PORT + '/api/health');
  console.log('  DB:      SERP -> ADMIN\\SQLEXPRESS -> SocietyERP');
  console.log('='.repeat(52) + '\n');
});

module.exports = app;
