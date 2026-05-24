const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'sports_academy_secret_2024';

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

let initialized = false;
async function initDB() {
  if (initialized) return;
  initialized = true;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'athlete',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS coaches (
      id SERIAL PRIMARY KEY,
      full_name TEXT NOT NULL,
      sport TEXT NOT NULL,
      country TEXT,
      experience_years INTEGER,
      bio TEXT,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS athletes (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      full_name TEXT NOT NULL,
      age INTEGER,
      sport TEXT,
      level TEXT,
      contact TEXT,
      coach_id INTEGER,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS training_sessions (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      sport TEXT,
      coach_id INTEGER,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      location TEXT,
      max_slots INTEGER DEFAULT 20,
      enrolled INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      athlete_id INTEGER,
      session_id INTEGER,
      status TEXT DEFAULT 'pending',
      applied_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY,
      athlete_id INTEGER,
      amount NUMERIC NOT NULL,
      type TEXT NOT NULL,
      status TEXT DEFAULT 'paid',
      receipt_no TEXT UNIQUE,
      paid_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS performance (
      id SERIAL PRIMARY KEY,
      athlete_id INTEGER,
      session_id INTEGER,
      score NUMERIC,
      notes TEXT,
      attendance TEXT DEFAULT 'present',
      recorded_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id SERIAL PRIMARY KEY,
      athlete_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT,
      image_url TEXT
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      user_email TEXT NOT NULL,
      sport TEXT,
      coach TEXT,
      date TEXT,
      time TEXT,
      package_name TEXT,
      package_price NUMERIC,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS receipts (
      id SERIAL PRIMARY KEY,
      user_email TEXT NOT NULL,
      booking_id INTEGER,
      sport TEXT,
      coach TEXT,
      package_name TEXT,
      amount NUMERIC,
      card_last4 TEXT,
      date TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  // Seed coaches if empty
  const { rows } = await pool.query('SELECT COUNT(*) as count FROM coaches');
  if (parseInt(rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO coaches (full_name, sport, country, experience_years, bio) VALUES
        ('Carlos Moya',   'Tennis',     'Spain',       25, 'Former world No.1 and Grand Slam champion turned elite coach.'),
        ('Jürgen Klopp',  'Football',   'Germany',     20, 'High-intensity pressing and motivational coaching style.'),
        ('Maria Santos',  'Gymnastics', 'Philippines', 18, 'World-renowned gymnastics performance specialist.'),
        ('Kenji Tanaka',  'Athletics',  'Japan',       15, 'Mental conditioning and technical precision expert.');
    `);
    await pool.query(`
      INSERT INTO training_sessions (title, sport, coach_id, date, time, location, max_slots) VALUES
        ('Advanced Tennis Techniques',  'Tennis',     1, '2025-06-10', '08:00', 'Court A – PLV Sports Complex', 15),
        ('Football Conditioning Camp',  'Football',   2, '2025-06-12', '14:00', 'Main Field – PLV',             30),
        ('Gymnastics Foundations',      'Gymnastics', 3, '2025-06-14', '09:00', 'Gymnasium Hall',               20),
        ('Speed & Agility Boot Camp',   'Athletics',  4, '2025-06-18', '07:00', 'Track Oval',                   25);
    `);
  }
}

// Run initDB before every request
app.use(async (req, res, next) => {
  try {
    await initDB();
    next();
  } catch (err) {
    console.error('DB init error:', err);
    res.status(500).json({ error: 'Database initialization failed' });
  }
});

// Auth middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ─── AUTH ─────────────────────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  const { full_name, name, email, password, role, country } = req.body;
  const displayName = full_name || name;
  if (!displayName || !email || !password)
    return res.status(400).json({ error: 'All fields required' });
  try {
    const hash = bcrypt.hashSync(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users (full_name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id',
      [displayName, email, hash, role || 'athlete']
    );
    const id = rows[0].id;
    const token = jwt.sign({ id, email, role: role || 'athlete' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id, name: displayName, full_name: displayName, email, role: role || 'athlete' } });
  } catch (e) {
    res.status(400).json({ error: 'Email already registered' });
  }
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
  const user = rows[0];
  if (!user || !bcrypt.compareSync(password, user.password))
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.full_name, full_name: user.full_name, email: user.email, role: user.role } });
});

// ─── BOOKINGS ─────────────────────────────────────────────────────────────────
app.post('/api/bookings', async (req, res) => {
  const { user_email, sport, coach, date, time, package_name, package_price } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO bookings (user_email, sport, coach, date, time, package_name, package_price) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
      [user_email, sport, coach, date, time, package_name, package_price]
    );
    res.json({ booking_id: rows[0].id });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save booking' });
  }
});

app.get('/api/bookings/:email', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM bookings WHERE user_email=$1 ORDER BY created_at DESC',
      [decodeURIComponent(req.params.email)]
    );
    res.json({ bookings: rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// ─── RECEIPTS ─────────────────────────────────────────────────────────────────
app.post('/api/receipts', async (req, res) => {
  const { user_email, booking_id, sport, coach, package_name, amount, card_last4, date } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO receipts (user_email, booking_id, sport, coach, package_name, amount, card_last4, date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id',
      [user_email, booking_id, sport, coach, package_name, amount, card_last4, date]
    );
    res.json({ receipt_id: rows[0].id });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save receipt' });
  }
});

app.get('/api/receipts/:email', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM receipts WHERE user_email=$1 ORDER BY created_at DESC',
      [decodeURIComponent(req.params.email)]
    );
    res.json({ receipts: rows });
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch receipts' });
  }
});

// ─── ATHLETES ────────────────────────────────────────────────────────────────
app.get('/api/athletes', authenticate, async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM athletes ORDER BY created_at DESC');
  res.json(rows);
});
app.post('/api/athletes', authenticate, async (req, res) => {
  const { full_name, age, sport, level, contact } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO athletes (user_id, full_name, age, sport, level, contact) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
    [req.user.id, full_name, age, sport, level, contact]
  );
  res.json({ id: rows[0].id, ...req.body });
});
app.put('/api/athletes/:id', authenticate, async (req, res) => {
  const { full_name, age, sport, level, contact } = req.body;
  await pool.query(
    'UPDATE athletes SET full_name=$1, age=$2, sport=$3, level=$4, contact=$5 WHERE id=$6',
    [full_name, age, sport, level, contact, req.params.id]
  );
  res.json({ success: true });
});
app.delete('/api/athletes/:id', authenticate, async (req, res) => {
  await pool.query('DELETE FROM athletes WHERE id=$1', [req.params.id]);
  res.json({ success: true });
});

// ─── SESSIONS ────────────────────────────────────────────────────────────────
app.get('/api/sessions', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT ts.*, c.full_name as coach_name FROM training_sessions ts LEFT JOIN coaches c ON ts.coach_id=c.id ORDER BY date ASC'
  );
  res.json(rows);
});
app.post('/api/sessions', authenticate, async (req, res) => {
  const { title, sport, coach_id, date, time, location, max_slots } = req.body;
  const { rows } = await pool.query(
    'INSERT INTO training_sessions (title, sport, coach_id, date, time, location, max_slots) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id',
    [title, sport, coach_id, date, time, location, max_slots]
  );
  res.json({ id: rows[0].id });
});

// ─── COACHES ─────────────────────────────────────────────────────────────────
app.get('/api/coaches', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM coaches');
  res.json(rows);
});

// ─── ACHIEVEMENTS ────────────────────────────────────────────────────────────
app.get('/api/achievements', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT ach.*, a.full_name as athlete_name FROM achievements ach LEFT JOIN athletes a ON ach.athlete_id=a.id ORDER BY date DESC'
  );
  res.json(rows);
});

// ─── STATS ───────────────────────────────────────────────────────────────────
app.get('/api/stats', authenticate, async (req, res) => {
  const [a, s, p, ap] = await Promise.all([
    pool.query('SELECT COUNT(*) as count FROM athletes'),
    pool.query('SELECT COUNT(*) as count FROM training_sessions'),
    pool.query('SELECT COALESCE(SUM(amount),0) as total FROM payments'),
    pool.query('SELECT COUNT(*) as count FROM applications'),
  ]);
  res.json({
    athletes:     parseInt(a.rows[0].count),
    sessions:     parseInt(s.rows[0].count),
    payments:     parseFloat(p.rows[0].total),
    applications: parseInt(ap.rows[0].count),
  });
});

module.exports = app;
