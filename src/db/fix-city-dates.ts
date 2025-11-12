import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

async function fixCityDates() {
  try {
    console.log('🔄 Fixing city dates to be in chronological order...');

    // Update dates for each city in the correct order
    const updates = [
      { id: 'ranthambhore', dates: 'Dec 14–Dec 15' },
      { id: 'jaipur1', dates: 'Dec 15–Dec 16' },
      { id: 'jaipur2', dates: 'Dec 16–Dec 17' },
      { id: 'Jodhpur1', dates: 'Dec 17–Dec 18' },
      { id: 'Jodhpur2', dates: 'Dec 18–Dec 19' },
      { id: 'jaisalmer-camp', dates: 'Dec 19–Dec 20' },
      { id: 'jaisalmer-city', dates: 'Dec 20–Dec 21' },
    ];

    console.log('\nUpdating dates:');
    for (const update of updates) {
      await sql`
        UPDATE cities 
        SET dates = ${update.dates}
        WHERE id = ${update.id}
      `;
      const city = await sql`SELECT name FROM cities WHERE id = ${update.id}`;
      console.log(`  ✅ ${city.rows[0].name}: ${update.dates}`);
    }

    console.log('\n🎉 All dates updated successfully!');
    console.log('\nFinal order:');
    const cities = await sql`SELECT id, name, dates FROM cities ORDER BY dates`;
    cities.rows.forEach((city, index) => {
      console.log(`  ${index + 1}. ${city.name}: ${city.dates}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing dates:', error);
    process.exit(1);
  }
}

fixCityDates();
