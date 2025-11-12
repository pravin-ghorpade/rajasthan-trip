import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

async function renameCities() {
  try {
    console.log('🔄 Renaming cities...');

    // Get all cities
    const cities = await sql`SELECT id, name FROM cities ORDER BY name`;
    
    console.log('\nCurrent cities:');
    cities.rows.forEach((city) => {
      console.log(`  - ${city.name} (ID: ${city.id})`);
    });

    // Update Jaipur to Jaipur Day 1 and Jaipur Day 2
    const jaipurCities = cities.rows.filter(c => c.name.toLowerCase().includes('jaipur'));
    if (jaipurCities.length >= 2) {
      await sql`UPDATE cities SET name = 'Jaipur Day 1' WHERE id = ${jaipurCities[0].id}`;
      await sql`UPDATE cities SET name = 'Jaipur Day 2' WHERE id = ${jaipurCities[1].id}`;
      console.log(`✅ Renamed ${jaipurCities[0].name} -> Jaipur Day 1`);
      console.log(`✅ Renamed ${jaipurCities[1].name} -> Jaipur Day 2`);
    } else if (jaipurCities.length === 1) {
      await sql`UPDATE cities SET name = 'Jaipur Day 1' WHERE id = ${jaipurCities[0].id}`;
      console.log(`✅ Renamed ${jaipurCities[0].name} -> Jaipur Day 1`);
    }

    // Update Jodhpur to Jodhpur Day 1 and Jodhpur Day 2
    const jodhpurCities = cities.rows.filter(c => c.name.toLowerCase().includes('jodhpur'));
    if (jodhpurCities.length >= 2) {
      await sql`UPDATE cities SET name = 'Jodhpur Day 1' WHERE id = ${jodhpurCities[0].id}`;
      await sql`UPDATE cities SET name = 'Jodhpur Day 2' WHERE id = ${jodhpurCities[1].id}`;
      console.log(`✅ Renamed ${jodhpurCities[0].name} -> Jodhpur Day 1`);
      console.log(`✅ Renamed ${jodhpurCities[1].name} -> Jodhpur Day 2`);
    } else if (jodhpurCities.length === 1) {
      await sql`UPDATE cities SET name = 'Jodhpur Day 1' WHERE id = ${jodhpurCities[0].id}`;
      console.log(`✅ Renamed ${jodhpurCities[0].name} -> Jodhpur Day 1`);
    }

    // Show updated cities
    const updatedCities = await sql`SELECT id, name FROM cities ORDER BY name`;
    console.log('\n✅ Updated cities:');
    updatedCities.rows.forEach((city) => {
      console.log(`  - ${city.name} (ID: ${city.id})`);
    });

    console.log('\n🎉 City renaming completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error renaming cities:', error);
    process.exit(1);
  }
}

renameCities();
