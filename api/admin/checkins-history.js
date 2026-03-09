const { getSQL, ensureDb, checkAdmin } = require('../_db');

module.exports = async function handler(req, res) {
  await ensureDb();
  if (!(await checkAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

  const sql = getSQL();
  const result = await sql`
    SELECT class_date, COUNT(*) as count
    FROM checkins
    GROUP BY class_date
    ORDER BY class_date DESC
    LIMIT 20
  `;

  res.json(result);
};
