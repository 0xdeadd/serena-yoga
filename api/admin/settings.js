const { getDb, checkAdmin } = require('../_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await checkAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

  const db = getDb();
  const { class_time, class_duration, class_location } = req.body;

  if (class_time) await db.from('settings').update({ value: class_time }).eq('key', 'class_time');
  if (class_duration) await db.from('settings').update({ value: class_duration }).eq('key', 'class_duration');
  if (class_location) await db.from('settings').update({ value: class_location }).eq('key', 'class_location');

  res.json({ message: 'Settings updated!' });
};
