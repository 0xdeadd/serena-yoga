const { getDb } = require('./_db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const db = getDb();
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    // Find or create student
    let { data: student } = await db.from('students').select('id').eq('email', email).maybeSingle();
    if (!student) {
      const { data: newStudent } = await db.from('students').insert({ name, email }).select('id').single();
      student = newStudent;
    }

    const today = new Date().toISOString().split('T')[0];

    const { error } = await db.from('checkins').insert({ student_id: student.id, class_date: today });
    if (error) {
      if (error.code === '23505') {
        return res.json({ message: 'You are already checked in for today!' });
      }
      return res.status(500).json({ error: 'Something went wrong' });
    }

    res.json({ message: `Checked in! Welcome to class, ${name}!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
