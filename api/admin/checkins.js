const { getSQL, ensureDb, checkAdmin } = require('../_db');

module.exports = async function handler(req, res) {
  await ensureDb();
  if (!(await checkAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

  const sql = getSQL();
  const date = req.query.date || new Date().toISOString().split('T')[0];

  const checkins = await sql`
    SELECT s.name, s.email, c.checked_in_at
    FROM checkins c
    JOIN students s ON s.id = c.student_id
    WHERE c.class_date = ${date}
    ORDER BY c.checked_in_at DESC
  `;

  res.json({ date, checkins, count: checkins.length });
};
