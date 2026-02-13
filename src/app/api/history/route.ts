import { NextResponse } from 'next/server';
import { getHistory } from '@/lib/data';

export async function GET() {
  try {
    const history = await getHistory();
    return NextResponse.json(history);
  } catch (error) {
    console.error('[API/HISTORY GET] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch history.' }, { status: 500 });
  }
}
