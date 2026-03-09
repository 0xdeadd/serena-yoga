const { createClient } = require('@supabase/supabase-js');

let supabase;

function getDb() {
  if (!supabase) {
    supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    );
  }
  return supabase;
}

async function checkAdmin(req) {
  const password = req.headers['x-admin-password'];
  const db = getDb();
  const { data } = await db.from('settings').select('value').eq('key', 'admin_password').single();
  return password === data?.value;
}

module.exports = { getDb, checkAdmin };
