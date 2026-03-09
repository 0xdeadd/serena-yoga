const { getSQL, ensureDb } = require('./_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await ensureDb();
  const sql = getSQL();
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  const existing = await sql`SELECT id, subscribed FROM students WHERE email = ${email}`;

  if (existing.length > 0) {
    if (!existing[0].subscribed) {
      await sql`UPDATE students SET subscribed = true, name = ${name} WHERE email = ${email}`;
      return res.json({ message: 'Welcome back! You have been re-subscribed.' });
    }
    return res.json({ message: 'You are already subscribed!' });
  }

  await sql`INSERT INTO students (name, email) VALUES (${name}, ${email})`;
  res.json({ message: 'Welcome! You are now subscribed to updates.' });
};
