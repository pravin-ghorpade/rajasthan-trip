// Script to initialize database tables
import dotenv from 'dotenv';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function initDatabase() {
  console.log('🗄️  Initializing database...');

  try {
    // Read the schema SQL file
    const schemaPath = path.join(process.cwd(), 'src/db/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    // Split by semicolon and execute each statement
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...`);

    for (const statement of statements) {
      if (statement.trim()) {
        await sql.query(statement);
        console.log('✓ Executed statement');
      }
    }

    console.log('✅ Database initialized successfully!');
    console.log('');
    console.log('Next step: Run "npm run db:seed" to populate with data');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

initDatabase();
