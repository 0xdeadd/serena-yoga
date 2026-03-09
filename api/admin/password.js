const { getDb, checkAdmin } = require('../_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await checkAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

  const db = getDb();
  const { new_password } = req.body;
  if (!new_password || new_password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  await db.from('settings').update({ value: new_password }).eq('key', 'admin_password');
  res.json({ message: 'Password updated!' });
};
