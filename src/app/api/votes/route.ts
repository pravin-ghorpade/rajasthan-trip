import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/db/client';

export async function GET(request: NextRequest) {
  try {
    // Fetch all votes from database
    const result = await sql`
      SELECT 
        v.id,
        v.hotel_id,
        v.city_id,
        v.voter_name as name,
        v.rating,
        v.occupancy,
        v.notes,
        v.created_at as timestamp
      FROM votes v
      ORDER BY v.created_at DESC
    `;

    // Transform to the format expected by the frontend
    const votesStore: any = {};
    
    for (const vote of result.rows) {
      const cityId = vote.city_id;
      const hotelId = vote.hotel_id;

      if (!votesStore[cityId]) {
        votesStore[cityId] = {};
      }
      if (!votesStore[cityId][hotelId]) {
        votesStore[cityId][hotelId] = { 
          votes: [], 
          totalRating: 0, 
          count: 0,
          avgRating: 0
        };
      }

      votesStore[cityId][hotelId].votes.push({
        name: vote.name,
        rating: vote.rating,
        occupancy: vote.occupancy,
        timestamp: vote.timestamp,
        notes: vote.notes,
      });
      votesStore[cityId][hotelId].totalRating += vote.rating;
      votesStore[cityId][hotelId].count += 1;
    }

    // Calculate averages
    for (const cityId in votesStore) {
      for (const hotelId in votesStore[cityId]) {
        const hotel = votesStore[cityId][hotelId];
        hotel.avgRating = hotel.totalRating / hotel.count;
      }
    }

    return NextResponse.json({ success: true, data: votesStore });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch votes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, cityId, hotelId, rating, occupancy, notes } = body;

    if (!cityId || !hotelId || !rating) {
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

    // Insert the vote
    const result = await sql`
      INSERT INTO votes (hotel_id, city_id, voter_name, rating, occupancy, notes)
      VALUES (
        ${hotelId},
        ${cityId},
        ${name || 'Anonymous'},
        ${Number(rating)},
        ${Number(occupancy)},
        ${notes || null}
      )
      RETURNING *
    `;

    const vote = result.rows[0];

    return NextResponse.json({ 
      success: true, 
      data: {
        name: vote.voter_name,
        rating: vote.rating,
        occupancy: vote.occupancy,
        timestamp: vote.created_at,
        notes: vote.notes,
      }
    });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit vote' }, { status: 500 });
  }
}
