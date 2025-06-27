import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ conversationUid: string }> }
) {
  try {
    const { conversationUid } = await params;

    if (!conversationUid) {
      return NextResponse.json(
        { error: 'conversationUid is required' },
        { status: 400 }
      );
    }

    // URL du service BDD
    const bddServiceUrl = process.env.BDD_SERVICE_URL || 'http://localhost:3003';
    
    const bddResponse = await fetch(`${bddServiceUrl}/chat-conversations/session/${conversationUid}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!bddResponse.ok) {
      if (bddResponse.status === 404) {
        return NextResponse.json([], { status: 200 });
      }
      throw new Error(`BDD service responded with status: ${bddResponse.status}`);
    }

    const data = await bddResponse.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in chat-conversations session API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 