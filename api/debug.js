const { getDb } = require('./_db');

module.exports = async function handler(req, res) {
  try {
    const db = getDb();

    // Test basic query
    const { data: settings, error: settingsErr } = await db.from('settings').select('*');
    if (settingsErr) return res.json({ step: 'settings', error: settingsErr });

    // Test students query
    const { data: students, error: studentsErr } = await db.from('students').select('*');
    if (studentsErr) return res.json({ step: 'students', error: studentsErr });

    // Test checkins query
    const { data: checkins, error: checkinsErr } = await db.from('checkins').select('*, students(name, email)');
    if (checkinsErr) return res.json({ step: 'checkins', error: checkinsErr });

    res.json({
      ok: true,
      settings: settings.length,
      students: students.length,
      checkins: checkins.length,
      env: {
        hasUrl: !!process.env.SUPABASE_URL,
        hasKey: !!process.env.SUPABASE_SERVICE_KEY,
        urlPrefix: process.env.SUPABASE_URL?.substring(0, 30)
      }
    });
  } catch (err) {
    res.json({ error: err.message, stack: err.stack?.split('\n').slice(0, 3) });
  }
};
