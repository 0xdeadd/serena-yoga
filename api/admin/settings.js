const { getSQL, ensureDb, checkAdmin } = require('../_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });

  await ensureDb();
  if (!(await checkAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

  const sql = getSQL();
  const { class_time, class_duration, class_location } = req.body;

  if (class_time) await sql`UPDATE settings SET value = ${class_time} WHERE key = 'class_time'`;
  if (class_duration) await sql`UPDATE settings SET value = ${class_duration} WHERE key = 'class_duration'`;
  if (class_location) await sql`UPDATE settings SET value = ${class_location} WHERE key = 'class_location'`;

  res.json({ message: 'Settings updated!' });
};
