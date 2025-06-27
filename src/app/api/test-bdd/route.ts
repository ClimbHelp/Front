import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const bddServiceUrl = process.env.BDD_SERVICE_URL || 'http://localhost:3003';
    console.log('Test de connexion au service BDD:', bddServiceUrl);
    
    // Test de la route de santé
    const healthResponse = await fetch(`${bddServiceUrl}/health`);
    console.log('Réponse health:', healthResponse.status);
    
    // Test de la route de test Supabase
    const testResponse = await fetch(`${bddServiceUrl}/api/test`);
    console.log('Réponse test:', testResponse.status);
    
    if (healthResponse.ok && testResponse.ok) {
      const healthData = await healthResponse.json();
      const testData = await testResponse.json();
      
      return NextResponse.json({
        status: 'success',
        bddServiceUrl,
        health: healthData,
        test: testData
      });
    } else {
      return NextResponse.json({
        status: 'error',
        bddServiceUrl,
        healthStatus: healthResponse.status,
        testStatus: testResponse.status
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Erreur lors du test de connexion BDD:', error);
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 