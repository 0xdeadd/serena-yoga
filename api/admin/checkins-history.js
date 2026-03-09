const { getDb, checkAdmin } = require('../_db');

module.exports = async function handler(req, res) {
  if (!(await checkAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

  const db = getDb();
  // Supabase doesn't support GROUP BY via the client, so use RPC or a simpler approach
  const { data, error } = await db
    .from('checkins')
    .select('class_date')
    .order('class_date', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });

  // Group and count manually
  const counts = {};
  (data || []).forEach(r => {
    counts[r.class_date] = (counts[r.class_date] || 0) + 1;
  });

  const history = Object.entries(counts).slice(0, 20).map(([class_date, count]) => ({ class_date, count }));
  res.json(history);
};
