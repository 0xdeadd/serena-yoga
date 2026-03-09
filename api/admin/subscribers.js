const { getSQL, ensureDb, checkAdmin } = require('../_db');

module.exports = async function handler(req, res) {
  await ensureDb();
  if (!(await checkAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

  const sql = getSQL();
  const result = await sql`SELECT id, name, email, subscribed, created_at FROM students ORDER BY created_at DESC`;
  res.json(result);
};
