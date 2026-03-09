const { getSQL, ensureDb } = require('./_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  await ensureDb();
  const sql = getSQL();
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

  let student = await sql`SELECT id FROM students WHERE email = ${email}`;
  if (student.length === 0) {
    student = await sql`INSERT INTO students (name, email) VALUES (${name}, ${email}) RETURNING id`;
  }
  const studentId = student[0].id;

  const today = new Date().toISOString().split('T')[0];

  try {
    await sql`INSERT INTO checkins (student_id, class_date) VALUES (${studentId}, ${today})`;
    res.json({ message: `Checked in! Welcome to class, ${name}!` });
  } catch (err) {
    if (err.message?.includes('unique') || err.message?.includes('duplicate')) {
      return res.json({ message: 'You are already checked in for today!' });
    }
    res.status(500).json({ error: 'Something went wrong' });
  }
};
