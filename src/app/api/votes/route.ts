import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/db/client';

export async function GET(request: NextRequest) {
  try {
    // Fetch all selections from database
    const result = await sql`
      SELECT 
        v.id,
        v.hotel_id,
        v.city_id,
        v.voter_name as name,
        v.occupancy,
        v.is_selected,
        v.notes,
        v.created_at as timestamp
      FROM votes v
      WHERE v.is_selected = true
      ORDER BY v.created_at DESC
    `;

    // Transform to the format expected by the frontend
    const selectionsStore: any = {};
    
    for (const selection of result.rows) {
      const cityId = selection.city_id;
      const hotelId = selection.hotel_id;

      if (!selectionsStore[cityId]) {
        selectionsStore[cityId] = {};
      }
      if (!selectionsStore[cityId][hotelId]) {
        selectionsStore[cityId][hotelId] = { 
          selections: [], 
          count: 0
        };
      }

      selectionsStore[cityId][hotelId].selections.push({
        name: selection.name,
        occupancy: selection.occupancy,
        timestamp: selection.timestamp,
        notes: selection.notes,
      });
      selectionsStore[cityId][hotelId].count += 1;
    }

    return NextResponse.json({ success: true, data: selectionsStore });
  } catch (error) {
    console.error('Error fetching selections:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch selections' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, cityId, hotelId, occupancy, notes, deviceId } = body;

    if (!cityId || !hotelId || !name || !occupancy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify hotel exists
    const hotelCheck = await sql`
      SELECT id FROM hotels WHERE id = ${hotelId} AND city_id = ${cityId}
    `;
    
    if (hotelCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Hotel not found' },
        { status: 404 }
      );
    }

    // Check if user already has a selection for this city (only one hotel per city allowed)
    const existingSelection = await sql`
      SELECT id, hotel_id FROM votes 
      WHERE voter_name = ${name} 
        AND device_id = ${deviceId || null}
        AND city_id = ${cityId}
        AND is_selected = true
    `;

    if (existingSelection.rows.length > 0) {
      // Update existing selection to the new hotel
      const result = await sql`
        UPDATE votes
        SET hotel_id = ${hotelId},
            occupancy = ${Number(occupancy)},
            notes = ${notes || null},
            created_at = NOW()
        WHERE voter_name = ${name}
          AND device_id = ${deviceId || null}
          AND city_id = ${cityId}
          AND is_selected = true
        RETURNING *
      `;

      const selection = result.rows[0];

      return NextResponse.json({ 
        success: true, 
        data: {
          name: selection.voter_name,
          occupancy: selection.occupancy,
          timestamp: selection.created_at,
          notes: selection.notes,
        }
      });
    } else {
      // Insert new selection
      const result = await sql`
        INSERT INTO votes (hotel_id, city_id, voter_name, is_selected, occupancy, notes, device_id)
        VALUES (
          ${hotelId},
          ${cityId},
          ${name},
          true,
          ${Number(occupancy)},
          ${notes || null},
          ${deviceId || null}
        )
        RETURNING *
      `;

      const selection = result.rows[0];

      return NextResponse.json({ 
        success: true, 
        data: {
          name: selection.voter_name,
          occupancy: selection.occupancy,
          timestamp: selection.created_at,
          notes: selection.notes,
        }
      });
    }
  } catch (error) {
    console.error('Error submitting selection:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit selection' }, { status: 500 });
  }
}
