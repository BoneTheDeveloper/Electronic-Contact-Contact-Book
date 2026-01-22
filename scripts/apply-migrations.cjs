// Apply Supabase migrations directly
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const client = new Client({
    host: 'db.lshmmoenfeodsrthsevf.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: '3cGt%6rWD%@peH4',
    connectionTimeoutMillis: 60000,
    // Force IPv4
    family: 4
  });

  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  const seedFile = path.join(__dirname, '../supabase/seed.sql');

  try {
    console.log('Connecting to Supabase...');
    await client.connect();
    console.log('Connected!');

    // Get migration files
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(f => f.endsWith('.sql'))
      .sort();

    console.log(`Found ${migrationFiles.length} migration files`);

    // Apply each migration
    for (const file of migrationFiles) {
      console.log(`\nApplying: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      try {
        await client.query(sql);
        console.log(`✓ ${file} applied successfully`);
      } catch (err) {
        console.error(`✗ ${file} failed:`, err.message);
        // Continue with other migrations
      }
    }

    // Apply seed data
    console.log('\nApplying seed data...');
    const seedSql = fs.readFileSync(seedFile, 'utf8');
    await client.query(seedSql);
    console.log('✓ Seed data applied successfully');

    console.log('\n✅ All migrations applied!');

  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
