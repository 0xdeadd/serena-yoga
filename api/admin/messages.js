const { getSQL, ensureDb, checkAdmin } = require('../_db');

module.exports = async function handler(req, res) {
  await ensureDb();
  if (!(await checkAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

  const sql = getSQL();
  const result = await sql`SELECT * FROM messages ORDER BY sent_at DESC LIMIT 50`;
  res.json(result);
};
