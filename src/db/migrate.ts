// Migration script to add device_id to votes table
import dotenv from 'dotenv';
import { sql } from '@vercel/postgres';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function migrate() {
  console.log('🔄 Running migration...');

  try {
    // Add device_id column
    await sql`
      ALTER TABLE votes ADD COLUMN IF NOT EXISTS device_id VARCHAR(255)
    `;
    console.log('✓ Added device_id column');

    // Create index
    await sql`
      CREATE INDEX IF NOT EXISTS idx_votes_voter_device ON votes(voter_name, device_id, hotel_id)
    `;
    console.log('✓ Created index for duplicate checks');

    console.log('✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

migrate();
