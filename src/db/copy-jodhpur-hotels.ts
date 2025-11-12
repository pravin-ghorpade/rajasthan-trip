import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: join(process.cwd(), '.env.local') });

async function copyJodhpurHotels() {
  try {
    console.log('🔄 Copying hotels from Jodhpur Day 1 to Jodhpur Day 2...');

    // Get Jodhpur Day 1 and Day 2 city IDs
    const cities = await sql`
      SELECT id, name FROM cities 
      WHERE name LIKE 'Jodhpur Day%'
      ORDER BY name
    `;

    if (cities.rows.length < 2) {
      console.error('❌ Could not find both Jodhpur Day 1 and Jodhpur Day 2 cities');
      process.exit(1);
    }

    const jodhpurDay1 = cities.rows.find(c => c.name === 'Jodhpur Day 1');
    const jodhpurDay2 = cities.rows.find(c => c.name === 'Jodhpur Day 2');

    if (!jodhpurDay1 || !jodhpurDay2) {
      console.error('❌ Could not find Jodhpur Day 1 or Jodhpur Day 2');
      process.exit(1);
    }

    console.log(`\n📍 Source: ${jodhpurDay1.name} (${jodhpurDay1.id})`);
    console.log(`📍 Target: ${jodhpurDay2.name} (${jodhpurDay2.id})`);

    // Get all hotels from Jodhpur Day 1
    const hotelsDay1 = await sql`
      SELECT name, price2, price3, image, link, notes
      FROM hotels
      WHERE city_id = ${jodhpurDay1.id}
      ORDER BY name
    `;

    console.log(`\n🏨 Found ${hotelsDay1.rows.length} hotels in Jodhpur Day 1`);

    if (hotelsDay1.rows.length === 0) {
      console.log('⚠️  No hotels to copy!');
      process.exit(0);
    }

    // Check if Jodhpur Day 2 already has hotels
    const existingHotelsDay2 = await sql`
      SELECT COUNT(*) as count FROM hotels WHERE city_id = ${jodhpurDay2.id}
    `;

    if (existingHotelsDay2.rows[0].count > 0) {
      console.log(`\n⚠️  Warning: Jodhpur Day 2 already has ${existingHotelsDay2.rows[0].count} hotel(s)`);
      console.log('This script will add the hotels from Day 1 to Day 2 (duplicates possible)');
    }

    // Copy each hotel to Jodhpur Day 2
    let copiedCount = 0;
    for (const hotel of hotelsDay1.rows) {
      // Generate a unique ID for the new hotel
      const newId = `${jodhpurDay2.id}-${hotel.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}-${copiedCount}`;
      
      await sql`
        INSERT INTO hotels (id, city_id, name, price2, price3, image, link, notes)
        VALUES (
          ${newId},
          ${jodhpurDay2.id},
          ${hotel.name},
          ${hotel.price2},
          ${hotel.price3},
          ${hotel.image},
          ${hotel.link},
          ${hotel.notes}
        )
      `;
      console.log(`  ✅ Copied: ${hotel.name}`);
      copiedCount++;
    }

    console.log(`\n🎉 Successfully copied ${copiedCount} hotels to Jodhpur Day 2!`);

    // Show summary
    const finalCount = await sql`
      SELECT COUNT(*) as count FROM hotels WHERE city_id = ${jodhpurDay2.id}
    `;
    console.log(`📊 Jodhpur Day 2 now has ${finalCount.rows[0].count} total hotel(s)`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error copying hotels:', error);
    process.exit(1);
  }
}

copyJodhpurHotels();
