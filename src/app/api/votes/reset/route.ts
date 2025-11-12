import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/db/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, deviceId } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }

    // Delete all selections for this user (by name and device ID)
    let result;
    if (deviceId) {
      result = await sql`
        DELETE FROM votes 
        WHERE voter_name = ${name} 
          AND device_id = ${deviceId}
          AND is_selected = true
      `;
    } else {
      result = await sql`
        DELETE FROM votes 
        WHERE voter_name = ${name} 
          AND device_id IS NULL
          AND is_selected = true
      `;
    }

    return NextResponse.json({ 
      success: true, 
      message: `Cleared selections for ${name}`,
      deletedCount: result.rowCount 
    });
  } catch (error) {
    console.error('Error resetting selections:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to reset selections' 
    }, { status: 500 });
  }
}
