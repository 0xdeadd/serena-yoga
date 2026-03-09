const { getDb } = require('./_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const db = getDb();
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  const { data: existing } = await db.from('students').select('id, subscribed').eq('email', email).maybeSingle();

  if (existing) {
    if (!existing.subscribed) {
      await db.from('students').update({ subscribed: true, name }).eq('email', email);
      return res.json({ message: 'Welcome back! You have been re-subscribed.' });
    }
    return res.json({ message: 'You are already subscribed!' });
  }

  const { error } = await db.from('students').insert({ name, email });
  if (error) return res.status(500).json({ error: 'Something went wrong' });

  res.json({ message: 'Welcome! You are now subscribed to updates.' });
};
