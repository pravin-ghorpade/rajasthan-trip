// Seed script to populate database with existing JSON data
import dotenv from 'dotenv';
import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Read the JSON data
    const dataPath = path.join(process.cwd(), 'src/data/rajasthan_data_with_images_20251110_024141.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const data = JSON.parse(rawData);

    // Insert app config
    console.log('📝 Inserting app configuration...');
    await sql`
      INSERT INTO app_config (key, value)
      VALUES (
        'config',
        ${JSON.stringify({
          tripTitle: data.tripTitle,
          ctaNote: data.ctaNote,
          currency: data.currency,
          googleForm: data.googleForm,
        })}
      )
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = CURRENT_TIMESTAMP
    `;

    // Insert cities
    console.log('🏙️  Inserting cities...');
    for (const city of data.cities) {
      await sql`
        INSERT INTO cities (id, name, dates)
        VALUES (${city.id}, ${city.name}, ${city.dates})
        ON CONFLICT (id) DO UPDATE
        SET name = EXCLUDED.name, dates = EXCLUDED.dates, updated_at = CURRENT_TIMESTAMP
      `;
      console.log(`   ✓ ${city.name}`);
    }

    // Insert hotels
    console.log('🏨 Inserting hotels...');
    for (const city of data.cities) {
      for (const hotel of city.hotels) {
        await sql`
          INSERT INTO hotels (id, city_id, name, link, price2, price3, image, notes)
          VALUES (
            ${hotel.id},
            ${city.id},
            ${hotel.name},
            ${hotel.link || null},
            ${hotel.price2 || null},
            ${hotel.price3 || null},
            ${hotel.image || null},
            ${hotel.notes || null}
          )
          ON CONFLICT (id) DO UPDATE
          SET 
            name = EXCLUDED.name,
            link = EXCLUDED.link,
            price2 = EXCLUDED.price2,
            price3 = EXCLUDED.price3,
            image = EXCLUDED.image,
            notes = EXCLUDED.notes,
            updated_at = CURRENT_TIMESTAMP
        `;
        console.log(`   ✓ ${hotel.name} (${city.name})`);
      }
    }

    console.log('✅ Database seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

seed()
  .then(() => {
    console.log('🎉 Seed completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to seed:', error);
    process.exit(1);
  });
