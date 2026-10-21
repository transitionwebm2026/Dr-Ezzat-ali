/**
 * Creates (or updates the password of) the CMS admin account and adds it to `public.admin_users`.
 *
 *   ADMIN_EMAIL     defaults to Dr.ezzatali.web@hotmail.com
 *   ADMIN_PASSWORD  required — pass it inline for this one run, never save it in a file:
 *
 *   PowerShell:  $env:ADMIN_PASSWORD='…'; npm run cms:create-admin; Remove-Item Env:ADMIN_PASSWORD
 *   bash:        ADMIN_PASSWORD='…' npm run cms:create-admin
 *
 * Needs SUPABASE_SERVICE_ROLE_KEY in .env.local (see scripts/lib/supabase-admin.mjs).
 */
import { createSupabaseAdmin } from './lib/supabase-admin.mjs';

const email = (process.env.ADMIN_EMAIL || 'Dr.ezzatali.web@hotmail.com').trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;

if (!password || password.length < 12) {
  console.error('✗ Set ADMIN_PASSWORD (12+ characters) for this run.');
  process.exit(1);
}

const supabase = createSupabaseAdmin();

async function findUser() {
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((user) => user.email?.toLowerCase() === email);
    if (match || data.users.length < 200) return match;
  }
}

try {
  let user = await findUser();
  if (user) {
    const { error } = await supabase.auth.admin.updateUserById(user.id, { password, email_confirm: true });
    if (error) throw error;
    console.log(`✓ Updated the password of ${email}`);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
    if (error) throw error;
    user = data.user;
    console.log(`✓ Created ${email}`);
  }

  const { error } = await supabase.from('admin_users').upsert({ user_id: user.id }, { onConflict: 'user_id' });
  if (error?.code === 'PGRST205' || error?.code === '42P01') {
    // Schema not applied yet: the migration's last statement grants admin rights to this email.
    console.warn('• public.admin_users does not exist yet — run the migration; it grants admin rights to this account automatically.');
  } else if (error) {
    throw error;
  } else {
    console.log('✓ Granted CMS admin rights (public.admin_users)');
  }
} catch (error) {
  console.error(`✗ ${error.message ?? error}`);
  process.exit(1);
}
