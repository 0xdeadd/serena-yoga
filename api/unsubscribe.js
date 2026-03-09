const { sql, ensureDb } = require('./_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await ensureDb();
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  await sql`UPDATE students SET subscribed = false WHERE email = ${email}`;
  res.json({ message: 'You have been unsubscribed.' });
};
