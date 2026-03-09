const { getDb, checkAdmin } = require('../_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  if (!(await checkAdmin(req))) return res.status(401).json({ error: 'Unauthorized' });

  const db = getDb();
  const { subject, body } = req.body;
  if (!subject || !body) return res.status(400).json({ error: 'Subject and body are required' });

  const { data: subscribers } = await db.from('students').select('name, email').eq('subscribed', true);
  const { error } = await db.from('messages').insert({ subject, body });
  if (error) return res.status(500).json({ error: error.message });

  res.json({
    message: `Message saved! Would be sent to ${(subscribers || []).length} subscriber(s).`,
    recipients: (subscribers || []).length,
    note: 'Configure an email service to enable actual email delivery.'
  });
};
