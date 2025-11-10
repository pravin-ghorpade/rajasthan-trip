// Database client configuration
import { sql } from '@vercel/postgres';

export { sql };

// Helper types
export interface City {
  id: string;
  name: string;
  dates: string;
}

export interface Hotel {
  id: string;
  city_id: string;
  name: string;
  link: string | null;
  price2: number | null;
  price3: number | null;
  image: string | null;
  notes: string | null;
}

export interface Vote {
  id: number;
  hotel_id: string;
  city_id: string;
  voter_name: string;
  rating: number;
  occupancy: number;
  notes: string | null;
}

export interface AppConfig {
  tripTitle: string;
  ctaNote: string;
  currency: string;
  googleForm: {
    enabled: boolean;
    formAction: string;
    entries: {
      name: string;
      city: string;
      hotel: string;
      score: string;
      occupancy: string;
      notes: string;
    };
  };
}

// Helper function to get all data in the original JSON format
export async function getAllData() {
  const citiesResult = await sql`SELECT * FROM cities ORDER BY id`;
  const hotelsResult = await sql`SELECT * FROM hotels ORDER BY city_id, id`;
  const configResult = await sql`SELECT value FROM app_config WHERE key = 'config'`;

  const cities = citiesResult.rows.map((city: any) => ({
    id: city.id,
    name: city.name,
    dates: city.dates,
    hotels: hotelsResult.rows
      .filter((h: any) => h.city_id === city.id)
      .map((h: any) => ({
        id: h.id,
        name: h.name,
        link: h.link || '',
        price2: h.price2,
        price3: h.price3,
        image: h.image || '',
        notes: h.notes || '',
      })),
  }));

  const config = configResult.rows[0]?.value || {
    tripTitle: 'Rajasthan Trip — Dec 14–21, 2025',
    ctaNote: 'Rate or rank stays per city. Copy the link to share your picks with the group, or export CSV.',
    currency: '₹',
    googleForm: {
      enabled: true,
      formAction: 'https://docs.google.com/forms/d/e/REPLACE_WITH_YOUR_FORM_ID/formResponse',
      entries: {
        name: 'entry.REPLACE_NAME_ID',
        city: 'entry.REPLACE_CITY_ID',
        hotel: 'entry.REPLACE_HOTEL_ID',
        score: 'entry.REPLACE_SCORE_ID',
        occupancy: 'entry.REPLACE_OCCUPANCY_ID',
        notes: 'entry.REPLACE_NOTES_ID',
      },
    },
  };

  return {
    ...config,
    cities,
  };
}
