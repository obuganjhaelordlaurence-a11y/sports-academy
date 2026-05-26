/* ─────────────────────────────────────────────
   ADMIN ROUTES — paste these into api/index.js
   before the last line (module.exports = app)
───────────────────────────────────────────── */

const ADMIN_EMAIL = 'admin@trij.com'; // must match frontend ADMIN_EMAIL

function requireAdmin(req, res, next) {
  const email = req.headers['x-admin-email'] || (req.body && req.body.admin_email);
  if (email !== ADMIN_EMAIL) return res.status(403).json({ error: 'Forbidden' });
  next();
}

// GET /api/admin/users
app.get('/api/admin/users', async (req, res) => {
  try {
    await initDB();
    const result = await pool.query('SELECT id, full_name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json({ users: result.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/admin/bookings
app.get('/api/admin/bookings', async (req, res) => {
  try {
    await initDB();
    const result = await pool.query('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json({ bookings: result.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET /api/admin/receipts
app.get('/api/admin/receipts', async (req, res) => {
  try {
    await initDB();
    const result = await pool.query('SELECT * FROM receipts ORDER BY created_at DESC');
    res.json({ receipts: result.rows });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/admin/users/:id
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    await initDB();
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE /api/admin/bookings/:id
app.delete('/api/admin/bookings/:id', async (req, res) => {
  try {
    await initDB();
    await pool.query('DELETE FROM bookings WHERE id = $1', [req.params.id]);
    res.json({ message: 'Booking deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});
