import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'src/data/rajasthan_data_with_images_20251110_024141.json');

// Helper to read data
function readData() {
  const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
  return JSON.parse(fileContent);
}

// Helper to write data
function writeData(data: any) {
  fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// GET - Fetch all hotels
export async function GET() {
  try {
    const data = readData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
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

    const data = readData();
    const city = data.cities.find((c: any) => c.id === cityId);

    if (!city) {
      return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    }

    // Generate unique ID for hotel
    const newHotel = {
      id: `hotel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: hotel.name,
      price2: hotel.price2 || null,
      price3: hotel.price3 || null,
      image: hotel.image || '',
      link: hotel.link || '',
      notes: hotel.notes || '',
    };

    city.hotels.push(newHotel);
    writeData(data);

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

    if (!cityId || !hotelId || !updates) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const data = readData();
    const city = data.cities.find((c: any) => c.id === cityId);

    if (!city) {
      return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    }

    const hotelIndex = city.hotels.findIndex((h: any) => h.id === hotelId);

    if (hotelIndex === -1) {
      return NextResponse.json({ success: false, error: 'Hotel not found' }, { status: 404 });
    }

    // Update hotel fields
    city.hotels[hotelIndex] = {
      ...city.hotels[hotelIndex],
      ...updates,
      id: hotelId, // Ensure ID doesn't change
    };

    writeData(data);

    return NextResponse.json({ success: true, data: city.hotels[hotelIndex] });
  } catch (error) {
    console.error('Error updating hotel:', error);
    return NextResponse.json({ success: false, error: 'Failed to update hotel' }, { status: 500 });
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

    const data = readData();
    const city = data.cities.find((c: any) => c.id === cityId);

    if (!city) {
      return NextResponse.json({ success: false, error: 'City not found' }, { status: 404 });
    }

    const hotelIndex = city.hotels.findIndex((h: any) => h.id === hotelId);

    if (hotelIndex === -1) {
      return NextResponse.json({ success: false, error: 'Hotel not found' }, { status: 404 });
    }

    const deletedHotel = city.hotels.splice(hotelIndex, 1)[0];
    writeData(data);

    return NextResponse.json({ success: true, data: deletedHotel });
  } catch (error) {
    console.error('Error deleting hotel:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete hotel' }, { status: 500 });
  }
}
