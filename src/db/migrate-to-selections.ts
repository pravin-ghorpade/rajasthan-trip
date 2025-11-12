import { readFileSync } from 'fs';
import { join } from 'path';
import postgres from 'postgres';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

async function migrateToSelections() {
  const connectionString = process.env.POSTGRES_URL;
  
  if (!connectionString) {
    throw new Error('POSTGRES_URL environment variable is not set');
  }

  const sql = postgres(connectionString);
  
  try {
    console.log('🔄 Migrating from ratings to selections...');
    
    const migrationSQL = readFileSync(
      join(process.cwd(), 'src/db/migration_change_to_selections.sql'),
      'utf-8'
    );
    
    await sql.unsafe(migrationSQL);
    
    console.log('✅ Migration completed successfully!');
    console.log('📝 Changes:');
    console.log('   - Removed rating column');
    console.log('   - Added is_selected boolean column');
    console.log('   - Created index for selections');
    
    await sql.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error running migration:', error);
    await sql.end();
    process.exit(1);
  }
}

migrateToSelections();
