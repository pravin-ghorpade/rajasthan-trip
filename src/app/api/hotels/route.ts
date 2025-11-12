import { NextRequest, NextResponse } from 'next/server';
import { sql, getAllData } from '@/db/client';
import DATA_RAW from '@/data/rajasthan_data_with_images_20251110_024141.json';

// GET - Fetch all hotels
export async function GET() {
  try {
    // Try database first
    const data = await getAllData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching hotels:', error);
    
    // Fallback to JSON file if database not available (dev mode)
    if (!process.env.POSTGRES_URL) {
      console.log('⚠️ No database connection - using JSON file fallback');
      return NextResponse.json({ success: true, data: DATA_RAW });
    }
    
    return NextResponse.json({ success: false, error: 'Failed to fetch hotels' }, { status: 500 });
  }
}

// POST - Add a new hotel
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cityId, hotel } = body;

    if (!cityId || !hotel || !hotel.name) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Check if city exists
    const cityCheck = await sql`SELECT id FROM cities WHERE id = ${cityId}`;
    if (cityCheck.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    }

    // Generate unique ID for hotel
    const newHotelId = `hotel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Insert new hotel
    await sql`
      INSERT INTO hotels (id, city_id, name, price2, price3, image, link, notes)
      VALUES (
        ${newHotelId},
        ${cityId},
        ${hotel.name},
        ${hotel.price2 || null},
        ${hotel.price3 || null},
        ${hotel.image || null},
        ${hotel.link || null},
        ${hotel.notes || null}
      )
    `;

    const newHotel = {
      id: newHotelId,
      name: hotel.name,
      price2: hotel.price2 || null,
      price3: hotel.price3 || null,
      image: hotel.image || '',
      link: hotel.link || '',
      notes: hotel.notes || '',
    };

    return NextResponse.json({ success: true, data: newHotel });
  } catch (error) {
    console.error('Error adding hotel:', error);
    return NextResponse.json({ success: false, error: 'Failed to add hotel' }, { status: 500 });
  }
}

// PUT - Update an existing hotel
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { cityId, hotelId, updates } = body;

    console.log('PUT request received:', { cityId, hotelId, updates });

    if (!cityId || !hotelId || !updates) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // Check if city exists
    const cityCheck = await sql`SELECT id FROM cities WHERE id = ${cityId}`;
    console.log('City check:', cityCheck.rows);
    if (cityCheck.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    }

    // Check if hotel exists
    const hotelCheck = await sql`SELECT id FROM hotels WHERE id = ${hotelId} AND city_id = ${cityId}`;
    console.log('Hotel check:', hotelCheck.rows);
    if (hotelCheck.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Hotel not found' }, { status: 404 });
    }

    // Update hotel
    await sql`
      UPDATE hotels
      SET 
        name = ${updates.name},
        price2 = ${updates.price2 || null},
        price3 = ${updates.price3 || null},
        image = ${updates.image || null},
        link = ${updates.link || null},
        notes = ${updates.notes || null},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${hotelId} AND city_id = ${cityId}
    `;

    // Fetch updated hotel
    const result = await sql`SELECT * FROM hotels WHERE id = ${hotelId}`;
    const updatedHotel = result.rows[0];

    console.log('Hotel updated successfully:', updatedHotel);

    return NextResponse.json({ 
      success: true, 
      data: {
        id: updatedHotel.id,
        name: updatedHotel.name,
        price2: updatedHotel.price2,
        price3: updatedHotel.price3,
        image: updatedHotel.image || '',
        link: updatedHotel.link || '',
        notes: updatedHotel.notes || '',
      }
    });
  } catch (error) {
    console.error('Error updating hotel:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update hotel', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

// DELETE - Remove a hotel
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get('cityId');
    const hotelId = searchParams.get('hotelId');

    if (!cityId || !hotelId) {
      return NextResponse.json({ success: false, error: 'Missing required parameters' }, { status: 400 });
    }

    // Check if city exists
    const cityCheck = await sql`SELECT id FROM cities WHERE id = ${cityId}`;
    if (cityCheck.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    }

    // Check if hotel exists and get it before deleting
    const hotelResult = await sql`SELECT * FROM hotels WHERE id = ${hotelId} AND city_id = ${cityId}`;
    if (hotelResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Hotel not found' }, { status: 404 });
    }

    const deletedHotel = hotelResult.rows[0];

    // Delete the hotel
    await sql`DELETE FROM hotels WHERE id = ${hotelId} AND city_id = ${cityId}`;

    return NextResponse.json({ 
      success: true, 
      data: {
        id: deletedHotel.id,
        name: deletedHotel.name,
        price2: deletedHotel.price2,
        price3: deletedHotel.price3,
        image: deletedHotel.image || '',
        link: deletedHotel.link || '',
        notes: deletedHotel.notes || '',
      }
    });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete hotel' }, { status: 500 });
  }
}
