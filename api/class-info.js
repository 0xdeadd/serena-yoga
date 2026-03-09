const { getDb } = require('./_db');

module.exports = async function handler(req, res) {
  const db = getDb();
  const { data, error } = await db.from('settings').select('key, value');
  if (error) return res.status(500).json({ error: error.message });

  const settings = {};
  data.forEach(r => settings[r.key] = r.value);
  delete settings.admin_password;
  res.json(settings);
};
