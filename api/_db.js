const { neon } = require('@neondatabase/serverless');

function getSQL() {
  return neon(process.env.DATABASE_URL);
}

let initialized = false;

async function ensureDb() {
  if (initialized) return;
  const sql = getSQL();

  await sql`
    CREATE TABLE IF NOT EXISTS students (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      subscribed BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS checkins (
      id SERIAL PRIMARY KEY,
      student_id INTEGER NOT NULL REFERENCES students(id),
      class_date DATE NOT NULL,
      checked_in_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(student_id, class_date)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      sent_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;

  await sql`INSERT INTO settings (key, value) VALUES ('class_time', '9:00 AM') ON CONFLICT (key) DO NOTHING`;
  await sql`INSERT INTO settings (key, value) VALUES ('class_duration', '60') ON CONFLICT (key) DO NOTHING`;
  await sql`INSERT INTO settings (key, value) VALUES ('class_location', 'Serena''s Yoga Studio') ON CONFLICT (key) DO NOTHING`;
  await sql`INSERT INTO settings (key, value) VALUES ('admin_password', 'serena123') ON CONFLICT (key) DO NOTHING`;

  initialized = true;
}

async function checkAdmin(req) {
  const sql = getSQL();
  const password = req.headers['x-admin-password'];
  const result = await sql`SELECT value FROM settings WHERE key = 'admin_password'`;
  return password === result[0]?.value;
}

module.exports = { getSQL, ensureDb, checkAdmin };
