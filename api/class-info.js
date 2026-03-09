const { getSQL, ensureDb } = require('./_db');

module.exports = async function handler(req, res) {
  await ensureDb();
  const sql = getSQL();
  const result = await sql`SELECT key, value FROM settings`;
  const settings = {};
  result.forEach(r => settings[r.key] = r.value);
  delete settings.admin_password;
  res.json(settings);
};
