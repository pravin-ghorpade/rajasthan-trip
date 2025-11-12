import 'dotenv/config';
import { sql } from '@vercel/postgres';

async function resetDatabase() {
  try {
    console.log('🗑️  Clearing all data...');
    
    // Delete all votes
    await sql`DELETE FROM votes`;
    console.log('✓ Cleared votes');
    
    // Delete all hotels
    await sql`DELETE FROM hotels`;
    console.log('✓ Cleared hotels');
    
    // Delete all cities
    await sql`DELETE FROM cities`;
    console.log('✓ Cleared cities');
    
    // Reset app_config
    await sql`DELETE FROM app_config WHERE id = 1`;
    console.log('✓ Cleared config');
    
    console.log('✅ Database reset complete!\n');
    console.log('💡 Now you can either:');
    console.log('   1. Run "npm run db:seed" to import from JSON');
    console.log('   2. Add hotels manually via the Manage tab');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    throw error;
  }
}

resetDatabase();
