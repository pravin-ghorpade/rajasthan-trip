import { NextRequest, NextResponse } from 'next/server';

// This is a simple in-memory store for demo purposes
// In production, you'd use a database or Google Sheets API
let votesStore: any = {};

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ success: true, data: votesStore });
  } catch (error) {
    console.error('Error fetching votes:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch votes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, cityId, hotelId, rating, occupancy } = body;

    if (!cityId || !hotelId || !rating) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Initialize city and hotel if not exists
    if (!votesStore[cityId]) {
      votesStore[cityId] = {};
    }
    if (!votesStore[cityId][hotelId]) {
      votesStore[cityId][hotelId] = { votes: [], totalRating: 0, count: 0 };
    }

    // Add the vote
    const vote = {
      name: name || 'Anonymous',
      rating: Number(rating),
      occupancy: Number(occupancy),
      timestamp: new Date().toISOString(),
    };

    votesStore[cityId][hotelId].votes.push(vote);
    votesStore[cityId][hotelId].count += 1;
    votesStore[cityId][hotelId].totalRating += vote.rating;
    votesStore[cityId][hotelId].avgRating = 
      votesStore[cityId][hotelId].totalRating / votesStore[cityId][hotelId].count;

    return NextResponse.json({ success: true, data: vote });
  } catch (error) {
    console.error('Error submitting vote:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit vote' }, { status: 500 });
  }
}
