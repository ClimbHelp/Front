import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, message, response, conversation_uid } = body;

    if (!user_id || !message || !response) {
      return NextResponse.json(
        { error: 'user_id, message, and response are required' },
        { status: 400 }
      );
    }

    // URL du service BDD
    const bddServiceUrl = process.env.BDD_SERVICE_URL || 'http://localhost:3003';
    console.log('Tentative de connexion au service BDD:', bddServiceUrl);
    
    const bddResponse = await fetch(`${bddServiceUrl}/chat-conversations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id,
        message,
        response,
        conversation_uid
      }),
    });

    console.log('Réponse du service BDD:', bddResponse.status, bddResponse.statusText);

    if (!bddResponse.ok) {
      const errorText = await bddResponse.text();
      console.error('Erreur détaillée du service BDD:', errorText);
      throw new Error(`BDD service responded with status: ${bddResponse.status} - ${errorText}`);
    }

    const data = await bddResponse.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in chat-conversations API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 