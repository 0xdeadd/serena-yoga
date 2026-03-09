const { getDb, checkAdmin } = require('../_db');

module.exports = async function handler(req, res) {
  if (!(await checkAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

  const db = getDb();
  const date = req.query.date || new Date().toISOString().split('T')[0];

  const { data, error } = await db
    .from('checkins')
    .select('checked_in_at, students(name, email)')
    .eq('class_date', date)
    .order('checked_in_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  const checkins = (data || []).map(c => ({
    name: c.students?.name,
    email: c.students?.email,
    checked_in_at: c.checked_in_at
  }));

  res.json({ date, checkins, count: checkins.length });
};
