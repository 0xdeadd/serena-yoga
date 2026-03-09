const { getDb } = require('./_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const db = getDb();
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  await db.from('students').update({ subscribed: false }).eq('email', email);
  res.json({ message: 'You have been unsubscribed.' });
};
