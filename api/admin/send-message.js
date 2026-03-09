const { getSQL, ensureDb, checkAdmin } = require('../_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await ensureDb();
  if (!(await checkAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

  const sql = getSQL();
  const { subject, body } = req.body;
  if (!subject || !body) return res.status(400).json({ error: 'Subject and body are required' });

  const subscribers = await sql`SELECT name, email FROM students WHERE subscribed = true`;
  await sql`INSERT INTO messages (subject, body) VALUES (${subject}, ${body})`;

  res.json({
    message: `Message saved! Would be sent to ${subscribers.length} subscriber(s).`,
    recipients: subscribers.length,
    note: 'Configure an email service to enable actual email delivery.'
  });
};
