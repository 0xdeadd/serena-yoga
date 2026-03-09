const { getDb, checkAdmin } = require('../_db');

module.exports = async function handler(req, res) {
  if (!(await checkAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

  const db = getDb();
  const { data, error } = await db.from('students').select('id, name, email, subscribed, created_at').order('created_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
